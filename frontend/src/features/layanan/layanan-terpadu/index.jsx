import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  AlertTriangle,
  Database,
  MessageSquare,
  ShieldAlert,
  Globe,
  ExternalLink,
} from "lucide-react";
import { useLayananTerpaduData } from "../../home/hooks/useLayananTerpaduData";

// 1. Daftar Layanan Fixed/Statis Internal Aplikasi
const fixedLayananItems = [
  {
    id: "fixed-rekomtek",
    to: "/layanan/rekomtek",
    label: "Rekomtek",
    desc: "Rekomendasi Teknis SDA",
    icon: FileText,
    color: "text-blue-500",
    bg: "bg-blue-50",
    isExternal: false,
  },
  {
    id: "fixed-posko-banjir",
    to: "/layanan/posko-banjir",
    label: "Posko Banjir",
    desc: "Informasi Posko Banjir",
    icon: AlertTriangle,
    color: "text-amber-500",
    bg: "bg-amber-50",
    isExternal: false,
  },
  {
    id: "fixed-permintaan-data",
    to: "/layanan/permintaan-data",
    label: "Permintaan Data",
    desc: "Ajukan Permintaan Data SDA",
    icon: Database,
    color: "text-green-500",
    bg: "bg-green-50",
    isExternal: false,
  },
  {
    id: "fixed-pengaduan",
    to: "/layanan/pengaduan-masyarakat",
    label: "Pengaduan Masyarakat",
    desc: "Sampaikan Pengaduan Anda",
    icon: MessageSquare,
    color: "text-purple-500",
    bg: "bg-purple-50",
    isExternal: false,
  },
  {
    id: "fixed-whistleblowing",
    to: "/whistleblowing",
    label: "Whistleblowing",
    desc: "Laporkan Pelanggaran Secara Aman",
    icon: ShieldAlert,
    color: "text-red-500",
    bg: "bg-red-50",
    isExternal: false,
  },
];

const LayananTerpaduPage = () => {
  // Ambil data dinamis dari database backend via Hook
  const { layananTerpaduData, loading } = useLayananTerpaduData();

  // Gabungkan items fixed dengan item dari database
  const combinedLayananItems = useMemo(() => {
    if (!Array.isArray(layananTerpaduData)) return fixedLayananItems;

    // Mapping item database agar memiliki format/struktur objek yang sama
    const dynamicItems = layananTerpaduData.map((dbItem) => ({
      id: dbItem.id,
      to: dbItem.url || "#",
      label: dbItem.title,
      desc: dbItem.description,
      platform: dbItem.platform,
      img: dbItem.img, // Menggunakan gambar dari upload jika ada
      icon: Globe, // Default icon lucide jika tidak ada gambar
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      isExternal: true, // Item dari database umumnya mengarah ke URL eksternal/portal
    }));

    return [...fixedLayananItems, ...dynamicItems];
  }, [layananTerpaduData]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 bg-white min-h-screen">
      {/* Header */}
      <div className="text-center mb-16">
        <p className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-2">
          Daftar
        </p>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
          Layanan Terpadu
        </h1>
        <div className="h-1 w-20 bg-indigo mx-auto mb-4"></div>
        <p className="text-gray-500 text-lg">
          Pelayanan publik & portal sistem informasi BBWS Sumatera VIII
        </p>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[...Array(3)].map((_, idx) => (
            <div
              key={idx}
              className="p-8 border border-gray-100 rounded-xl bg-gray-50 animate-pulse flex flex-col items-center h-48 justify-center"
            >
              <div className="w-16 h-16 rounded-full bg-gray-200 mb-4"></div>
              <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      )}

      {/* Grid Layanan (Fixed + Database) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {combinedLayananItems.map((item, i) => {
          const Icon = item.icon;

          // Render tautan eksternal (Database) vs internal (React Router)
          const isExternal = item.isExternal;

          const cardContent = (
            <div className="flex flex-col items-center text-center p-8 border border-gray-100 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group relative h-full justify-between bg-white">
              {/* Badge Eksternal / Platform */}
              {item.platform && (
                <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full">
                  {item.platform}
                </span>
              )}

              <div className="flex flex-col items-center">
                {/* Visual Icon / Custom Image */}
                <div
                  className={`w-16 h-16 rounded-full ${
                    item.bg || "bg-indigo-50"
                  } flex items-center justify-center mb-4 overflow-hidden shadow-inner`}
                >
                  {item.img ? (
                    <img
                      src={item.img}
                      alt={item.label}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Icon className={`w-7 h-7 ${item.color || "text-indigo-600"}`} />
                  )}
                </div>

                <h2 className="text-lg font-bold text-gray-800 group-hover:text-indigo transition-colors flex items-center gap-1">
                  {item.label}
                  {isExternal && (
                    <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-indigo" />
                  )}
                </h2>

                <p className="text-sm text-gray-500 mt-2 leading-relaxed line-clamp-3">
                  {item.desc}
                </p>
              </div>
            </div>
          );

          if (isExternal) {
            return (
              <a
                key={item.id || i}
                href={item.to}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full"
              >
                {cardContent}
              </a>
            );
          }

          return (
            <Link key={item.id || i} to={item.to} className="block h-full">
              {cardContent}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default LayananTerpaduPage;