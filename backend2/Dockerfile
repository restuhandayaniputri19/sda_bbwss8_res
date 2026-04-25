FROM node:20-alpine
WORKDIR /app

# Buat folder untuk database dan berikan izin akses
RUN mkdir -p /app/data

# Ambil hasil build (sesuaikan dengan folder build Anda)
COPY dist/index.js ./

# Pastikan aplikasi tahu db ada di /app/data/S8_web_sda.db
# Anda bisa mengatur ini lewat environment variable
ENV DATABASE_URL=/app/data/S8_web_sda.db

EXPOSE 3000

CMD ["node", "index.js"]