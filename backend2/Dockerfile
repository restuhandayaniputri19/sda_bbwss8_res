# Tahap 1: Build
FROM node:20-slim AS builder
WORKDIR /app

# Copy file package untuk install dependencies
COPY package*.json ./
RUN npm install

# Copy semua source code dan lakukan build
COPY . .
RUN npm run build

RUN npm prune --production

# Tahap 2: Produksi
FROM node:20-slim
WORKDIR /app

# Salin hanya hasil build dan dependencies produksi
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# Jika Anda menggunakan SQLite, pastikan folder database tersedia
ENV DATABASE_URL=/app/data/S8_web_sda.db

# RUN mkdir -p data

EXPOSE 3000

# Jalankan aplikasi
CMD ["node", "dist/index.js"]