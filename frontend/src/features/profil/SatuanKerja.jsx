import { useState } from "react";
import { MapPin, Phone, Mail, Building2, Droplets, Wheat, Waves, LayoutGrid, ChevronRight } from "lucide-react";

const satkerData = [
  {
    id: 1,
    cat: "op",
    label: "Operasi & Pemeliharaan",
    name: "Satker OP Wilayah Sungai Musi",
    address: "Jl. Kapten Anwar Sastro No. 3, Palembang 30113",
    phone: "(0711) 123456",
    email: "op-musi@bbwssumatera8.go.id",
    icon: Building2,
  },
  {
    id: 2,
    cat: "jaringan",
    label: "Pelaksanaan Jaringan SDA",
    name: "Satker Pelaksanaan Jaringan SDA Sumatera VIII",
    address: "Jl. Kol. H. Burlian KM 7, Palembang, Sumatera Selatan",
    phone: "(0711) 234567",
    email: "jaringan@bbwssumatera8.go.id",
    icon: Droplets,
  },
  {
    id: 3,
    cat: "irigasi",
    label: "Irigasi & Rawa",
    name: "Satker Irigasi & Rawa Wilayah I Sumatera Selatan",
    address: "Jl. Sriwijaya No. 12, Palembang, Sumatera Selatan",
    phone: "(0711) 345678",
    email: "irigasi1@bbwssumatera8.go.id",
    icon: Wheat,
  },
  {
    id: 4,
    cat: "irigasi",
    label: "Irigasi & Rawa",
    name: "Satker Irigasi & Rawa Wilayah II Bengkulu",
    address: "Jl. Jend. Sudirman No. 8, Bengkulu 38223",
    phone: "(0736) 456789",
    email: "irigasi2@bbwssumatera8.go.id",
    icon: Wheat,
  },
  {
    id: 5,
    cat: "sungai",
    label: "Sungai & Pantai",
    name: "Satker Sungai & Pantai Wilayah Sungai Musi",
    address: "Jl. Kapten Anwar Sastro No. 3, Palembang 30113",
    phone: "(0711) 567890",
    email: "sungai@bbwssumatera8.go.id",
    icon: Waves,
  },
];

const categories = [
  { key: "semua", label: "Satuan Kerja", icon: LayoutGrid },
  { key: "op", label: "Satker OP Wilayah Sungai Musi", icon: Building2 },
  { key: "jaringan", label: "Satker Pelaksanaan Jaringan SDA", icon: Droplets },
  { key: "irigasi", label: "Satker Irigasi dan Rawa Wil 1 Sumsel", icon: Wheat },
  { key: "sungai", label: "Satker Irigasi dan Rawa Wil 2 Sumsel", icon: Waves },
];

const categoryLabels = {
  semua: "DASHBOARD UTAMA",
  op: "OPERASI & PEMELIHARAAN",
  jaringan: "PELAKSANAAN JARINGAN SDA",
  irigasi: "IRIGASI & RAWA",
  sungai: "SUNGAI & PANTAI",
};

const categoryTitles = {
  semua: "SATUAN KERJA",
  op: "OPERASI & PEMELIHARAAN",
  jaringan: "PELAKSANAAN JARINGAN SDA",
  irigasi: "IRIGASI & RAWA",
  sungai: "SUNGAI & PANTAI",
};

export default function SatuanKerja() {
  const [activeCategory, setActiveCategory] = useState("semua");

  const filtered = satkerData.filter(
    (s) => activeCategory === "semua" || s.cat === activeCategory
  );

return (
  <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 font-sans">
    
    {/* Sidebar — horizontal scroll di mobile, vertikal di desktop */}
    <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-gray-100 flex-shrink-0 md:sticky md:top-0 md:h-screen md:overflow-y-auto">
      <div className="px-4 py-3 md:py-6 flex flex-row md:flex-col overflow-x-auto gap-1">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`flex-shrink-0 md:w-full flex items-center gap-2 px-3 py-2 md:py-3 rounded-xl text-left transition-all duration-200 group
                ${isActive
                  ? "bg-blue-50 text-[#0d2b45] font-semibold"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                }`}
            >
              <span className={`w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors
                ${isActive ? "bg-[#f5a800] text-white" : "bg-gray-100 text-gray-400 group-hover:bg-gray-200"}`}>
                <Icon size={14} />
              </span>
              <span className="text-xs md:text-sm leading-tight whitespace-nowrap">{cat.label}</span>
            </button>
          );
        })}
      </div>
    </aside>

    {/* Main Content */}
    <main className="flex-1 px-4 md:px-8 py-6 md:py-8 min-w-0">
      <div className="mb-8">
        <p className="text-xs font-semibold text-[#f5a800] tracking-widest uppercase mb-1">
          {categoryLabels[activeCategory]}
        </p>
        <h1 className="text-2xl md:text-3xl font-black text-[#0d2b45] tracking-tight uppercase">
          {categoryTitles[activeCategory]}
        </h1>
        <div className="mt-2 w-12 h-1 bg-[#f5a800] rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((satker) => {
          const Icon = satker.icon;
          return (
            <div
              key={satker.id}
              className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer group"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 text-gray-400 group-hover:bg-[#f5a800] group-hover:text-white transition-colors">
                  <Icon size={18} />
                </div>
                <h3 className="text-sm md:text-base font-bold text-[#0d2b45] leading-snug pt-1">
                  {satker.name}
                </h3>
              </div>

              <div className="space-y-2 mb-5">
                <div className="flex items-start gap-2 text-gray-400 text-sm">
                  <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                  <span>{satker.address}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Phone size={14} className="flex-shrink-0" />
                  <span>{satker.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Mail size={14} className="flex-shrink-0" />
                  <span>{satker.email}</span>
                </div>
              </div>

              <button className="flex items-center gap-1 text-xs font-bold text-[#f5a800] uppercase tracking-wider hover:gap-2 transition-all">
                Lihat Detail <ChevronRight size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </main>
  </div>
);
}