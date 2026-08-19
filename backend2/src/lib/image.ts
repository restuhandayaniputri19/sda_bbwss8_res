import { existsSync, mkdirSync, promises as fs } from 'node:fs';
import { basename, join } from 'node:path';
import { randomUUID } from 'node:crypto';
import sharp from 'sharp';

const MAX_IMAGE_DIMENSION = 1080;

export const saveOptimizedWebp = async (file: File, directory: string) => {
  if (!file.type.startsWith('image/')) {
    throw new Error('File harus berupa gambar');
  }

  if (!existsSync(directory)) {
    mkdirSync(directory, { recursive: true });
  }

  const fileName = `${new Date().toISOString().slice(0, 10).replaceAll('-', '')}-${randomUUID()}.webp`;
  const filePath = join(directory, fileName);
  const input = Buffer.from(await file.arrayBuffer());

  await sharp(input)
    .rotate()
    .resize({
      width: MAX_IMAGE_DIMENSION,
      height: MAX_IMAGE_DIMENSION,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: 82 })
    .toFile(filePath);

  return fileName;
};

export const deleteUploadedImage = async (imageUrl: string, directory: string) => {
  const uploadPath = `/uploads/${basename(directory)}/`;
  const pathname = new URL(imageUrl).pathname;

  if (!pathname.includes(uploadPath)) return;

  const filePath = join(directory, basename(pathname));
  try {
    await fs.unlink(filePath);
  } catch (error) {
    if (!(error instanceof Error && 'code' in error && error.code === 'ENOENT')) {
      throw error;
    }
  }
};
