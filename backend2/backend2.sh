#!/bin/bash

# Konfigurasi Default
COMPOSE_CMD="docker compose"
PROJECT_NAME=$(basename "$PWD")

# Fungsi untuk menampilkan bantuan
show_help() {
    echo "Penggunaan: ./backend2.sh [opsi]"
    echo ""
    echo "Opsi:"
    echo "  up      : Menjalankan container di background (detached)"
    echo "  down    : Menghentikan dan menghapus container"
    echo "  build   : Build ulang image (tanpa menjalankan)"
    echo "  rebuild : Build ulang dan jalankan (up)"
    echo "  start   : Menjalankan container yang sudah ada"
    echo "  stop    : Menghentikan container tanpa menghapus"
    echo "  logs    : Melihat log secara real-time"
    echo "  status  : Mengecek status container"
}

case "$1" in
    up)
        $COMPOSE_CMD up -d
        ;;
    down)
        $COMPOSE_CMD down
        ;;
    build)
        $COMPOSE_CMD build
        ;;
    rebuild)
        $COMPOSE_CMD build && $COMPOSE_CMD up -d
        ;;
    start)
        $COMPOSE_CMD start
        ;;
    stop)
        $COMPOSE_CMD stop
        ;;
    logs)
        $COMPOSE_CMD logs -f
        ;;
    status)
        $COMPOSE_CMD ps
        ;;
    *)
        show_help
        ;;
esac
