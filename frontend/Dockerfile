# STAGE 1: Build Stage
FROM node:20-alpine AS build-stage

# Set working directory
WORKDIR /app

# Salin package.json dan package-lock.json terlebih dahulu (optimasi cache)
COPY package*.json ./

# Install dependencies
RUN npm install

# Salin seluruh kode sumber
COPY . .

# Jalankan proses build (Pastikan outputnya mengarah ke folder yang benar)
RUN npm run build

# STAGE 2: Production Stage
FROM nginx:stable-alpine AS production-stage

# Hapus file default Nginx
RUN rm -rf /usr/share/nginx/html/*

# Buat folder tujuan (sesuaikan dengan path aplikasi Anda)
RUN mkdir -p /usr/share/nginx/html/balai/bbwssumatera8

# Salin hasil build dari stage pertama (build-stage)
# Sesuaikan path '/app/dist' jika SvelteKit Anda mengeluarkan output di tempat lain
COPY --from=build-stage /app/dist /usr/share/nginx/html/balai/bbwssumatera8

# Salin konfigurasi Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]