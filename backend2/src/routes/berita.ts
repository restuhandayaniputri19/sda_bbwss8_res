import { Hono } from 'hono';
import { db } from '../db';
import { berita, beritaGalleries, galleries } from '../db/schema';
import { eq, like, or, desc, asc, count, and, inArray } from 'drizzle-orm';
import path from 'path';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import { authentication } from '../middleware/authentication';
import { getPublicUploadUrl } from '../lib/public-url';
import { processAndSaveGalleryFile } from './galeri';

const app = new Hono();

// Helper penentuan protokol
const getProtocol = (c: any) =>
  process.env.NODE_ENV === 'production' ? 'https' : 'http';

// Helper Penyimpanan File Upload Utama Berita
const saveUploadedFile = async (file: File, folderName: string): Promise<string> => {
  const uploadDir = path.join(process.cwd(), 'uploads', folderName);
  if (!existsSync(uploadDir)) {
    await fs.mkdir(uploadDir, { recursive: true });
  }

  const fileExt = path.extname(file.name) || '.jpg';
  const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${fileExt}`;
  const filePath = path.join(uploadDir, fileName);

  const arrayBuffer = await file.arrayBuffer();
  await fs.writeFile(filePath, Buffer.from(arrayBuffer));

  return fileName;
};

// Helper Penghapusan File
const deleteFile = async (folderName: string, fileName: string) => {
  try {
    const filePath = path.join(process.cwd(), 'uploads', folderName, fileName);
    if (existsSync(filePath)) {
      await fs.unlink(filePath);
    }
  } catch (error) {
    console.error('Gagal menghapus file:', error);
  }
};

// Helper Parsing ID Galeri dari FormData/JSON
const parseGalleryIds = (raw: any): number[] => {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw.map((item) => Number(item)).filter((id) => !isNaN(id) && id > 0);
  }
  if (typeof raw === 'string' || typeof raw === 'number') {
    const strRaw = String(raw);
    try {
      const parsed = JSON.parse(strRaw);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => Number(item)).filter((id) => !isNaN(id) && id > 0);
      }
    } catch {
      return strRaw
        .split(',')
        .map((item) => Number(item.trim()))
        .filter((id) => !isNaN(id) && id > 0);
    }
  }
  return [];
};

// Helper untuk melampirkan daftar galeri terkait ke berita
const attachGalleriesToBerita = async (beritaList: any[], protocol: string) => {
  if (beritaList.length === 0) return [];

  const beritaIds = beritaList.map((b) => b.id);

  // Ambil data relasi dari beritaGalleries yang digabung dengan galleries
  const relationRows = await db
    .select({
      beritaId: beritaGalleries.beritaId,
      gallery: galleries,
    })
    .from(beritaGalleries)
    .innerJoin(galleries, eq(beritaGalleries.galleryId, galleries.id))
    .where(inArray(beritaGalleries.beritaId, beritaIds));

  // Kelompokkan galeri berdasarkan beritaId
  const galleryMap = new Map<number, any[]>();
  for (const row of relationRows) {
    const list = galleryMap.get(row.beritaId) || [];
    const formattedGallery = {
      ...row.gallery,
      url: row.gallery.url ? row.gallery.url.replace(/^https?:\/\//, `${protocol}://`) : null,
    };
    list.push(formattedGallery);
    galleryMap.set(row.beritaId, list);
  }

  return beritaList.map((item) => ({
    ...item,
    img: item.img ? item.img.replace(/^https?:\/\//, `${protocol}://`) : null,
    galleries: galleryMap.get(item.id) || [],
  }));
};

// Helper Pembantu Pemasukan Relasi Galeri (Eksis + Baru)
const handleGalleryRelations = async (
  beritaId: number,
  formData: Record<string, any>,
  reqUrl: string,
  isUpdate = false
) => {
  // 1. Tangkap ID galeri eksis yang dikirimkan dari form
  const rawGalleryIds = formData['galleryIds'] || formData['galleries'];
  const selectedExistingIds = parseGalleryIds(rawGalleryIds);

  // 2. Olah unggahan file galeri baru
  const newGalleryInputs = formData['newGalleryFiles'] || formData['newGalleries'];
  const galleryDescriptions = formData['galleryDescriptions'];
  let newFiles: File[] = [];

  if (Array.isArray(newGalleryInputs)) {
    newFiles = newGalleryInputs.filter((f): f is File => f instanceof File);
  } else if (newGalleryInputs instanceof File) {
    newFiles = [newGalleryInputs];
  }

  const createdGalleryIds: number[] = [];

  // Simpan tiap file galeri baru ke database (tabel `galleries`) dan disk
  for (let i = 0; i < newFiles.length; i++) {
    const file = newFiles[i];
    let desc = 'Galeri Berita';

    if (Array.isArray(galleryDescriptions)) {
      desc = (galleryDescriptions[i] as string) || desc;
    } else if (typeof galleryDescriptions === 'string' && galleryDescriptions) {
      desc = galleryDescriptions;
    }

    try {
      const savedGallery = await processAndSaveGalleryFile(file, reqUrl, desc);
      if (savedGallery && savedGallery.id) {
        createdGalleryIds.push(savedGallery.id);
      }
    } catch (err) {
      console.error('Gagal memproses file galeri baru:', err);
    }
  }

  // 3. Update / Insert Relasi Pivot ke tabel `beritaGalleries`
  if (isUpdate) {
    // Jika ada list ID eksis dikirim ATAU ada file baru diunggah
    if (rawGalleryIds !== undefined || createdGalleryIds.length > 0) {
      // Gabungkan ID galeri eksis yang dipertahankan + ID galeri baru yang baru di-upload
      const finalIdsToAttach = Array.from(
        new Set([...selectedExistingIds, ...createdGalleryIds])
      );

      // Hapus relasi pivot lama khusus untuk beritaId ini
      await db.delete(beritaGalleries).where(eq(beritaGalleries.beritaId, beritaId));

      // Re-insert relasi pivot yang baru dan lengkap
      if (finalIdsToAttach.length > 0) {
        await db.insert(beritaGalleries).values(
          finalIdsToAttach.map((galleryId) => ({
            beritaId,
            galleryId,
          }))
        );
      }
    }
  } else {
    // Proses POST / Create Baru
    const finalIdsToAttach = Array.from(
      new Set([...selectedExistingIds, ...createdGalleryIds])
    );
    if (finalIdsToAttach.length > 0) {
      await db.insert(beritaGalleries).values(
        finalIdsToAttach.map((galleryId) => ({
          beritaId,
          galleryId,
        }))
      );
    }
  }
};

// ==========================================
// RUTE PUBLIK (READ / GET)
// ==========================================

// 1. Read All Berita
app.get('/', async (c) => {
  try {
    const rawPage = parseInt(c.req.query('page') || '1', 10);
    const page = Number.isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;

    const rawLimit = parseInt(c.req.query('limit') || '10', 10);
    const limit = Number.isNaN(rawLimit) || rawLimit < 1 ? 10 : rawLimit;

    const offset = (page - 1) * limit;

    const sortParam = c.req.query('sort') === 'oldest' ? asc(berita.createdAt) : desc(berita.createdAt);
    const highlightedParam = c.req.query('highlighted');
    const searchQuery = c.req.query('search') || '';

    const conditions = [];

    if (highlightedParam === 'true') {
      conditions.push(eq(berita.highlighted, true));
    } else if (highlightedParam === 'false') {
      conditions.push(eq(berita.highlighted, false));
    }

    if (searchQuery) {
      conditions.push(
        or(
          like(berita.title, `%${searchQuery}%`),
          like(berita.description, `%${searchQuery}%`),
          like(berita.location, `%${searchQuery}%`)
        )
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [{ totalItems }] = await db
      .select({ totalItems: count() })
      .from(berita)
      .where(whereClause);

    const beritaList = await db
      .select()
      .from(berita)
      .where(whereClause)
      .orderBy(sortParam)
      .limit(limit)
      .offset(offset);

    const protocol = getProtocol(c);
    const totalPages = Math.ceil(totalItems / limit);

    const formattedData = await attachGalleriesToBerita(beritaList, protocol);

    return c.json({
      data: formattedData,
      meta: {
        totalItems,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
      },
    });
  } catch (error: any) {
    console.error('Error GET /berita:', error);
    return c.json({ error: error.message }, 500);
  }
});

// 2. Read Highlighted Berita
app.get('/highlighted', async (c) => {
  try {
    const highlightedList = await db
      .select()
      .from(berita)
      .where(eq(berita.highlighted, true))
      .orderBy(desc(berita.createdAt));

    if (highlightedList.length === 0) {
      return c.json({ message: 'No highlighted berita found' }, 404);
    }

    const protocol = getProtocol(c);
    const formattedData = await attachGalleriesToBerita(highlightedList, protocol);

    return c.json({ data: formattedData });
  } catch (error: any) {
    console.error('Error GET /berita/highlighted:', error);
    return c.json({ error: error.message }, 500);
  }
});

// 3. Read Berita By ID (Dengan Galeri Terkait)
app.get('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'), 10);
    if (Number.isNaN(id)) {
      return c.json({ message: 'Invalid ID format' }, 400);
    }

    const [item] = await db.select().from(berita).where(eq(berita.id, id));

    if (!item) {
      return c.json({ message: 'Berita not found' }, 404);
    }

    const protocol = getProtocol(c);
    const [formattedItem] = await attachGalleriesToBerita([item], protocol);

    return c.json({ data: formattedItem });
  } catch (error: any) {
    console.error(`Error GET /berita/${c.req.param('id')}:`, error);
    return c.json({ error: error.message }, 500);
  }
});

// ==========================================
// RUTE MUTASI TERPROTEKSI (POST, PUT, DELETE)
// ==========================================

// 4. Create Berita
app.post('/', authentication, async (c) => {
  try {
    const formData = await c.req.parseBody({ all: true });

    const title = (formData['title'] as string) || '';
    const description = (formData['description'] as string) || '';
    const location = (formData['location'] as string) || '';
    const highlighted = formData['highlighted'] === 'true' || formData['highlighted'] === '1';

    const file = (formData['img'] || formData['file'] || formData['image']) as File;

    if (!file || typeof file === 'string' || typeof file.arrayBuffer !== 'function') {
      return c.json({ message: 'Image file is required and must be a valid file' }, 400);
    }

    const filename = await saveUploadedFile(file, 'berita');
    const imgUrl = getPublicUploadUrl(c.req.url, 'berita', filename);

    const [inserted] = await db
      .insert(berita)
      .values({
        title,
        description,
        location,
        img: imgUrl,
        highlighted,
      })
      .returning();

    await handleGalleryRelations(inserted.id, formData, c.req.url, false);

    const protocol = getProtocol(c);
    const [result] = await attachGalleriesToBerita([inserted], protocol);

    return c.json({ data: result }, 201);
  } catch (error: any) {
    console.error('Error POST /berita:', error);
    return c.json({ error: error.message }, 500);
  }
});

// 5. Update Berita
app.put('/:id', authentication, async (c) => {
  try {
    const id = parseInt(c.req.param('id'), 10);
    if (Number.isNaN(id)) {
      return c.json({ message: 'Invalid ID format' }, 400);
    }

    const [existing] = await db.select().from(berita).where(eq(berita.id, id));

    if (!existing) {
      return c.json({ message: 'Berita not found' }, 404);
    }

    const formData = await c.req.parseBody({ all: true });
    const title = (formData['title'] as string) || existing.title;
    const description = (formData['description'] as string) || existing.description;
    const location = (formData['location'] as string) || existing.location;
    const highlighted =
      formData['highlighted'] !== undefined
        ? formData['highlighted'] === 'true' || formData['highlighted'] === '1'
        : existing.highlighted;

    const file = (formData['img'] || formData['file'] || formData['image']) as File;

    let imgUrl = existing.img;

    if (file && typeof file !== 'string' && typeof file.arrayBuffer === 'function') {
      if (existing.img) {
        const oldFileName = path.basename(existing.img);
        await deleteFile('berita', oldFileName);
      }
      const filename = await saveUploadedFile(file, 'berita');
      imgUrl = getPublicUploadUrl(c.req.url, 'berita', filename);
    }

    const [updated] = await db
      .update(berita)
      .set({
        title,
        description,
        location,
        highlighted,
        img: imgUrl,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(berita.id, id))
      .returning();

    // Proses dan pertahankan relasi galeri lama + galeri baru
    await handleGalleryRelations(updated.id, formData, c.req.url, true);

    const protocol = getProtocol(c);
    const [result] = await attachGalleriesToBerita([updated], protocol);

    return c.json({ data: result });
  } catch (error: any) {
    console.error(`Error PUT /berita/${c.req.param('id')}:`, error);
    return c.json({ error: error.message }, 500);
  }
});

// 6. Delete Berita
app.delete('/:id', authentication, async (c) => {
  try {
    const id = parseInt(c.req.param('id'), 10);
    if (Number.isNaN(id)) {
      return c.json({ message: 'Invalid ID format' }, 400);
    }

    const [existing] = await db.select().from(berita).where(eq(berita.id, id));

    if (!existing) {
      return c.json({ message: 'Berita not found' }, 404);
    }

    if (existing.img) {
      const imgFileName = path.basename(existing.img);
      await deleteFile('berita', imgFileName);
    }

    await db.delete(beritaGalleries).where(eq(beritaGalleries.beritaId, id));
    await db.delete(berita).where(eq(berita.id, id));

    return c.json({ message: 'Berita deleted successfully' });
  } catch (error: any) {
    console.error(`Error DELETE /berita/${c.req.param('id')}:`, error);
    return c.json({ error: error.message }, 500);
  }
});

export default app;