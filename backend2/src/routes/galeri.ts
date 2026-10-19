import { Hono } from 'hono';
import { db } from '../db';
import { galleries, beritaGalleries, Category } from '../db/schema';
import { and, eq, count, gte, lt } from 'drizzle-orm';
import { authentication } from '../middleware/authentication';
import { join } from 'node:path';
import { deleteUploadedImage, saveOptimizedWebp } from '../lib/image';
import { createAdminLog } from '../utils/logger';
import { getPublicUploadUrl } from '../lib/public-url';

const uploadDir = join(process.cwd(), 'uploads', 'galeri');

const galeri = new Hono();

// Helper untuk mengambil IP Address
const getIp = (c: any) =>
    c.req.header('x-forwarded-for')?.split(',')[0].trim() ||
    c.req.header('x-real-ip') ||
    '127.0.0.1';

// Helper Eksportable untuk menyimpan gambar galeri baru secara internal
export const processAndSaveGalleryFile = async (
    file: File,
    reqUrl: string,
    description?: string,
    category?: Category
) => {
    const fileName = await saveOptimizedWebp(file, uploadDir);
    const generatedUrl = getPublicUploadUrl(reqUrl, 'galeri', fileName);

    const [newItem] = await db.insert(galleries).values({
        url: generatedUrl,
        description: description || null,
        category: category || null,
    }).returning();

    return newItem;
};

// 1. Ambil Semua Data Galeri
galeri.get('/', async (c) => {
    const page = Number(c.req.query('page')) || 1;
    const limit = Number(c.req.query('limit')) || 10;
    const offset = (page - 1) * limit;

    const categoryFilter = c.req.query('category');
    const monthFilter = c.req.query('month');
    const isValidMonth = monthFilter && /^\d{4}-(0[1-9]|1[0-2])$/.test(monthFilter);
    const monthStart = isValidMonth ? new Date(`${monthFilter}-01T00:00:00.000Z`) : undefined;
    const monthEnd = monthStart
        ? new Date(Date.UTC(monthStart.getUTCFullYear(), monthStart.getUTCMonth() + 1, 1))
        : undefined;

    const whereCondition = and(
        categoryFilter ? eq(galleries.category, categoryFilter as Category) : undefined,
        monthStart && monthEnd
            ? and(gte(galleries.createdAt, monthStart), lt(galleries.createdAt, monthEnd))
            : undefined
    );

    const galleryList = await db.select().from(galleries).where(whereCondition).limit(limit).offset(offset).all();
    const [{ total }] = await db.select({ total: count() }).from(galleries).where(whereCondition);
    const totalPages = Math.ceil(total / limit);

    const urlObj = new URL(c.req.url);
    const protocol = urlObj.protocol.replace(':', '');

    return c.json({
        data: galleryList.map((gallery) => ({
            id: gallery.id,
            url: gallery.url.replace(/^https?:\/\//, `${protocol}://`),
            description: gallery.description,
            category: gallery.category,
            createdAt: gallery.createdAt,
            updatedAt: gallery.createdAt,
        })),
        meta: {
            totalItems: total,
            totalPages: totalPages,
            currentPage: page,
            itemsPerPage: limit,
        },
    }, 200);
});

// 2. Ambil Galeri Berdasarkan ID
galeri.get('/:id', async (c) => {
    const id = Number(c.req.param('id'));
    const [item] = await db.select().from(galleries).where(eq(galleries.id, id)).all();

    if (!item) return c.json({ message: 'Data tidak ditemukan' }, 404);
    return c.json(item);
});

// 3. Create / Upload Gallery (POST)
galeri.post('/upload', authentication, async (c) => {
    const body = await c.req.parseBody();
    
    // Menerima file unggahan dari berbagai kemungkinan key field ('file', 'gallery', 'img', dll)
    const file = (body.file || body.gallery || body.img || body.image) as File;

    if (!file || !(file instanceof File)) {
        return c.json({ message: "File gambar tidak ditemukan atau tidak valid" }, 400);
    }

    const description = (body.description || body.title) as string;
    const category = body.category as Category;

    const beritaId = body.beritaId ? Number(body.beritaId) : null;

    let newItem;
    try {
        newItem = await processAndSaveGalleryFile(
            file,
            c.req.url,
            description,
            category
        );

        if (beritaId && !isNaN(beritaId) && beritaId > 0) {
            await db.insert(beritaGalleries).values({
                beritaId: beritaId,
                galleryId: newItem.id,
            });
        }
    } catch (error) {
        return c.json({ message: error instanceof Error ? error.message : 'Gagal memproses gambar' }, 400);
    }

    // Ambil user dari konteks autentikasi
    const user = c.get('user');

    // Catat Admin Log
    await createAdminLog({
        userId: user?.id,
        username: user?.username,
        action: 'CREATE_GALLERY',
        targetEntity: 'galleries',
        targetId: String(newItem.id),
        details: { category: newItem.category, description: newItem.description },
        ipAddress: getIp(c)
    });

    return c.json({ data: newItem }, 201);
});

// 4. Update Gallery (PUT)
galeri.put('/:id', authentication, async (c) => {
    const id = Number(c.req.param('id'));
    if (isNaN(id)) return c.json({ message: 'ID tidak valid' }, 400);

    const body = await c.req.parseBody();
    const file = (body.file || body.gallery || body.img || body.image) as File;
    const [existingItem] = await db.select().from(galleries).where(eq(galleries.id, id)).all();

    if (!existingItem) return c.json({ message: 'Data tidak ditemukan' }, 404);

    let imageUrl = existingItem.url;
    if (file instanceof File) {
        let fileName: string;
        try {
            fileName = await saveOptimizedWebp(file, uploadDir);
        } catch (error) {
            return c.json({ message: error instanceof Error ? error.message : 'Gagal memproses gambar' }, 400);
        }

        imageUrl = getPublicUploadUrl(c.req.url, 'galeri', fileName);
    }

    const updatedItem = await db.update(galleries)
        .set({
            url: imageUrl,
            description: (body.description || body.title) as string,
            category: body.category as Category,
        })
        .where(eq(galleries.id, id))
        .returning();

    if (updatedItem.length === 0) return c.json({ message: 'Gagal update' }, 404);

    const user = c.get('user');

    await createAdminLog({
        userId: user?.id,
        username: user?.username,
        action: 'UPDATE_GALLERY',
        targetEntity: 'galleries',
        targetId: String(updatedItem[0].id),
        details: {
            old: { description: existingItem.description, category: existingItem.category },
            new: { description: updatedItem[0].description, category: updatedItem[0].category }
        },
        ipAddress: getIp(c)
    });

    return c.json({ data: updatedItem[0] });
});

// 5. Delete Gallery
galeri.delete('/:id', authentication, async (c) => {
    const id = Number(c.req.param('id'));

    const deleted = await db.delete(galleries)
        .where(eq(galleries.id, id))
        .returning();

    if (deleted.length === 0) return c.json({ message: 'Data tidak ditemukan' }, 404);

    try {
        await deleteUploadedImage(deleted[0].url, uploadDir);
    } catch (error) {
        console.error('Gagal menghapus file galeri:', error);
    }

    const user = c.get('user');

    await createAdminLog({
        userId: user?.id,
        username: user?.username,
        action: 'DELETE_GALLERY',
        targetEntity: 'galleries',
        targetId: String(deleted[0].id),
        details: { category: deleted[0].category, description: deleted[0].description },
        ipAddress: getIp(c)
    });

    return c.json({ message: 'Terhapus' });
});

export default galeri;