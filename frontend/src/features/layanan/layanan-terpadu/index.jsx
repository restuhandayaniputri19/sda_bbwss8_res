import alurImage from "../../../assets/alur_permintaan_data.jpg";
import { Link } from "react-router-dom";
import {
  FileText,
  AlertTriangle,
  Database,
  MessageSquare,
  ShieldAlert,
} from "lucide-react";

const layananItems = [
  {
    to: "/layanan/rekomtek",
    label: "Rekomtek",
    desc: "Rekomendasi Teknis SDA",
    icon: FileText,
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    to: "/layanan/posko-banjir",
    label: "Posko Banjir",
    desc: "Informasi & Laporan Banjir",
    icon: AlertTriangle,
    color: "text-amber-500",
    bg: "bg-amber-50",
  },
  {
    to: "/layanan/permintaan-data",
    label: "Permintaan Data",
    desc: "Ajukan Permintaan Data SDA",
    icon: Database,
    color: "text-green-500",
    bg: "bg-green-50",
  },
  {
    to: "/layanan/pengaduan-masyarakat",
    label: "Pengaduan Masyarakat",
    desc: "Sampaikan Pengaduan Anda",
    icon: MessageSquare,
    color: "text-purple-500",
    bg: "bg-purple-50",
  },
  {
    to: "/whistleblowing",
    label: "Whistleblowing",
    desc: "Laporkan Pelanggaran Secara Aman",
    icon: ShieldAlert,
    color: "text-red-500",
    bg: "bg-red-50",
  },
];

const LayananTerpaduPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 bg-white">

      {/* Infografis Alur */}
<div className="mb-12">
  <div className="text-center mb-6">
    <p className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-2">
      Infografis
    </p>
    <h2 className="text-2xl font-extrabold text-gray-900">
      Alur Prosedur Layanan
    </h2>
    <p className="text-gray-500 mt-2">
      Panduan langkah-langkah pengajuan layanan publik BBWS Sumatera VIII
    </p>
    <div className="h-1 w-16 bg-indigo mx-auto mt-4"></div>
  </div>
  <img
    src={alurImage}
    alt="Prosedur Permintaan Informasi Publik"
    className="w-full rounded-xl shadow-md"
  />
</div>

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
          Pelayanan publik BBWS Sumatera VIII
        </p>
      </div>

      {/* Grid Layanan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {layananItems.map((item, i) => {
          const Icon = item.icon;
          return (
            <Link
              key={i}
              to={item.to}
              className="flex flex-col items-center text-center p-8 border border-gray-100 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group"
            >
              <div className={`w-16 h-16 rounded-full ${item.bg} flex items-center justify-center mb-4`}>
                <Icon className={`w-7 h-7 ${item.color}`} />
              </div>
              <h2 className="text-lg font-bold text-gray-800 group-hover:text-indigo transition-colors">
                {item.label}
              </h2>
              <p className="text-sm text-gray-400 mt-1">{item.desc}</p>
            </Link>
          );
        })}
      </div>

    </div>
  );
};

export default LayananTerpaduPage;