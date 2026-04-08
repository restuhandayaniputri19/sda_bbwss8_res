# Tahap 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Copy manifest dan install dependensi
COPY package*.json ./
RUN npm install

# Copy kode sumber dan build ke JS
COPY . .
RUN npm run build

# Tahap 2: Production
FROM node:20-alpine

RUN apk update && apk upgrade --no-cache

WORKDIR /app

# Hanya ambil file yang dibutuhkan untuk jalan
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# Expose port sesuai .env (default Hono biasanya 3000)
EXPOSE 3000

CMD ["node", "dist/index.js"]