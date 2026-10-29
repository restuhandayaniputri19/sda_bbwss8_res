import { useState, useEffect } from "react";
import Card from "../../../components/card";
import { Hash } from "../../../constants";
import bendungan from "../../../assets/bendungan-DpmE5Nca.jpeg";
import { truncateText } from "../../../utils/truncate-text";
import { useBeritaData } from "../../home/hooks/useBeritaData";
import { useBeritaDetail } from "../hooks/useBeritaDetail";
import { useNavigate } from "react-router-dom";
import { useQuery } from "../../../hooks/useQuery";

const DetailBerita = () => {
  const navigate = useNavigate();
  const query = useQuery();
  const id = query.get("id");
  const { beritaData } = useBeritaData();
  const beritaDetail = useBeritaDetail(id);

  // State untuk Modal Lightbox/Carousel Galeri
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);

  const galleries = beritaDetail?.galleries || [];

  const handleOpenLightbox = (index) => {
    setSelectedPhotoIndex(index);
  };

  const handleCloseLightbox = () => {
    setSelectedPhotoIndex(null);
  };

  const handlePrevPhoto = (e) => {
    e?.stopPropagation();
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex((prev) =>
        prev === 0 ? galleries.length - 1 : prev - 1
      );
    }
  };

  const handleNextPhoto = (e) => {
    e?.stopPropagation();
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex((prev) =>
        prev === galleries.length - 1 ? 0 : prev + 1
      );
    }
  };

  // Navigasi Keyboard (Left, Right, Escape) saat modal terbuka
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedPhotoIndex === null) return;
      if (e.key === "Escape") handleCloseLightbox();
      if (e.key === "ArrowLeft") handlePrevPhoto();
      if (e.key === "ArrowRight") handleNextPhoto();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPhotoIndex, galleries.length]);

  return (
    <div className="flex min-h-screen flex-col">
      <img
        className="w-full h-[400px] object-cover"
        src={bendungan}
        alt="Bendungan"
      />

      <section className="flex flex-col lg:flex-row p-10 gap-6">
        {beritaDetail && (
          <div className="flex flex-col w-full px-6 py-8 lg:px-12 bg-gray-50 rounded-lg">
            <div className="w-full">
              {/* Title */}
              <h1 className="text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
                {beritaDetail.title}
              </h1>

              {/* Article Meta */}
              <div className="flex justify-between items-center text-gray-600 text-sm mb-6">
                <span>{beritaDetail.location}</span>
                <span>
                  {new Date(beritaDetail.createdAt).toLocaleDateString(
                    "id-ID",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </span>
              </div>

              {/* Main Image */}
              <div className="mb-10">
                <img
                  src={beritaDetail.img}
                  alt="article visual"
                  className="w-full object-cover rounded-md max-h-[500px]"
                />
              </div>

              {/* Article Content */}
              <article className="leading-relaxed text-gray-800">
                <div
                  dangerouslySetInnerHTML={{
                    __html: beritaDetail.description,
                  }}
                />
              </article>

              {/* ========================================================= */}
              {/* GALERI FOTO TERKAIT BERITA (Klik untuk Carousel Popup)   */}
              {/* ========================================================= */}
              {galleries.length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <span>Galeri Foto</span>
                    <span className="text-sm font-normal text-gray-500">
                      ({galleries.length} Foto)
                    </span>
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {galleries.map((galleryItem, idx) => (
                      <div
                        key={galleryItem.id || idx}
                        onClick={() => handleOpenLightbox(idx)}
                        className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all cursor-pointer"
                      >
                        <div className="relative overflow-hidden h-48 w-full">
                          <img
                            src={galleryItem.url || galleryItem.img}
                            alt={galleryItem.description || `Galeri Foto ${idx + 1}`}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="bg-black/60 text-white text-xs px-3 py-1.5 rounded-full font-medium">
                              🔍 Perbesar
                            </span>
                          </div>
                        </div>
                        {galleryItem.description && (
                          <div className="p-3 text-xs text-gray-600 bg-white border-t border-gray-100 truncate">
                            {galleryItem.description}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Sidebar Berita Terkini */}
        <div className="flex flex-col space-y-5 border border-indigo rounded-sm mx-auto lg:w-1/3 w-full h-fit">
          <h1 className="text-2xl border-b border-b-indigo p-2 bg-indigo text-white">
            Berita Terkini
          </h1>
          <div className="flex flex-col">
            {beritaData.map((item, index) => (
              <Card
                key={index}
                shadow={true}
                rounded={true}
                className="transition-transform transform hover:scale-95 hover:shadow-lg cursor-pointer"
                onClick={() => navigate(`/berita?id=${item.id}${Hash.DETAIL}`)}
              >
                <div className="flex p-2">
                  <img
                    src={item.img}
                    alt={"photo"}
                    className="h-36 w-36 object-cover"
                  />
                  <div className="p-4 space-y-2">
                    <h1 className="text-md text-indigo">
                      {truncateText(item.title, 100)}
                    </h1>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* POPUP CAROUSEL / LIGHTBOX MODAL                           */}
      {/* ========================================================= */}
      {selectedPhotoIndex !== null && galleries[selectedPhotoIndex] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 transition-opacity"
          onClick={handleCloseLightbox}
        >
          {/* Tombol Close */}
          <button
            type="button"
            onClick={handleCloseLightbox}
            className="absolute top-4 right-4 z-50 text-white hover:text-gray-300 text-3xl font-bold bg-black/40 hover:bg-black/60 w-10 h-10 rounded-full flex items-center justify-center"
            title="Tutup (Esc)"
          >
            ✕
          </button>

          {/* Indikator Posisi Foto */}
          <div className="absolute top-5 left-6 text-white text-sm font-semibold bg-black/50 px-3 py-1 rounded-full z-50">
            {selectedPhotoIndex + 1} / {galleries.length}
          </div>

          {/* Tombol Previous */}
          {galleries.length > 1 && (
            <button
              type="button"
              onClick={handlePrevPhoto}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white bg-black/50 hover:bg-black/80 w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold transition-transform hover:scale-110"
              title="Foto Sebelumnya (←)"
            >
              ❮
            </button>
          )}

          {/* Container Konten Gambar + Deskripsi */}
          <div
            className="relative max-w-4xl max-h-[85vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={
                galleries[selectedPhotoIndex].url ||
                galleries[selectedPhotoIndex].img
              }
              alt={
                galleries[selectedPhotoIndex].description ||
                `Galeri Foto ${selectedPhotoIndex + 1}`
              }
              className="max-h-[75vh] max-w-full object-contain rounded-lg shadow-2xl"
            />

            {/* Deskripsi Foto */}
            {galleries[selectedPhotoIndex].description && (
              <div className="mt-3 text-center text-white text-sm bg-black/60 px-4 py-2 rounded-md max-w-2xl">
                {galleries[selectedPhotoIndex].description}
              </div>
            )}
          </div>

          {/* Tombol Next */}
          {galleries.length > 1 && (
            <button
              type="button"
              onClick={handleNextPhoto}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white bg-black/50 hover:bg-black/80 w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold transition-transform hover:scale-110"
              title="Foto Selanjutnya (→)"
            >
              ❯
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DetailBerita;