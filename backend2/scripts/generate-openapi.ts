import fs from 'fs';
import path from 'path';
import app from '../src/index'; // Import instance Hono utama Anda

/**
 * Membaca otomatis seluruh routes dari app.routes milik Hono
 */
function buildOpenApiFromRoutes() {
  const paths: Record<string, any> = {};

  // Daftar rute internal/bawaan yang ingin diabaikan dari OpenAPI doc
  const ignoredPaths = ['/docs', '/docs.json', '/debug-routes'];

  app.routes.forEach((route) => {
    // Abaikan jika rute ada di daftar ignore atau handler internal
    if (ignoredPaths.includes(route.path)) return;

    const method = route.method.toLowerCase();

    // Hono menyimpan parameter path seperti :id, ubah menjadi {id} sesuai standar OpenAPI
    const openApiPath = route.path.replace(/:([a-zA-Z0-9_]+)/g, '{$1}');

    if (!paths[openApiPath]) {
      paths[openApiPath] = {};
    }

    // Ekstraksi path parameters jika ada
    const pathParams = [...route.path.matchAll(/:([a-zA-Z0-9_]+)/g)].map((m) => ({
      name: m[1],
      in: 'path',
      required: true,
      schema: { type: 'string' },
    }));

    // Tentukan tag kategori berdasarkan base path pertama (misal /berita -> Berita)
    const segments = openApiPath.split('/').filter(Boolean);
    const tag = segments.length > 3 ? segments[3] : 'Default';
    const formattedTag = tag.charAt(0).toUpperCase() + tag.slice(1);

    paths[openApiPath][method] = {
      tags: [formattedTag],
      summary: `${route.method} ${openApiPath}`,
      parameters: pathParams.length > 0 ? pathParams : undefined,
      responses: {
        '200': {
          description: 'Respons Berhasil',
          content: {
            'application/json': {
              schema: {
                type: 'object',
              },
            },
          },
        },
        '401': { description: 'Tidak terautentikasi (Unauthorized)' },
        '404': { description: 'Resource Tidak Ditemukan' },
        '500': { description: 'Kesalahan Server Internal' },
      },
    };

    // Tambahkan deskripsi Security / Bearer Token untuk metode mutasi
    if (['post', 'put', 'delete'].includes(method)) {
      paths[openApiPath][method].security = [{ BearerAuth: [] }];
    }
  });

  return {
    openapi: '3.0.0',
    info: {
      title: 'BBWS Sumatera VIII API Reference',
      version: '1.0.0',
      description: 'Dokumentasi REST API BBWS Sumatera VIII Hono Engine (Auto-generated)',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Server Lokal',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    paths,
  };
}

// Jalankan dan simpan hasilnya ke src/openapi.json
const spec = buildOpenApiFromRoutes();
const outputPath = path.join(process.cwd(), 'src', 'openapi.json');

fs.writeFileSync(outputPath, JSON.stringify(spec, null, 2), 'utf-8');
console.log(`✅ File src/openapi.json berhasil diperbarui otomatis dari app.routes (${Object.keys(spec.paths).length} endpoint terdaftar).`);