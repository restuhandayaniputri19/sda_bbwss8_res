import React, { useRef } from 'react';
import {
  ChevronRight, Home, MapPin, Target, Cog, Layers,
  Building2, Wrench, Waves, Landmark, Droplets, Phone, Mail
} from "lucide-react";

// ============================================================
// TIPE DATA
// ============================================================
interface SatkerItem {
  id: number;
  label: string;
  singkatan: string;
  icon: React.ReactElement;
  lokasi: string;
  phone: string;
  wilayahKerja: string;
  fokusKegiatan: string[];
  fungsiUtama: string[];
}

// ============================================================
// DATA 5 SATKER BBWS SUMATERA VIII
// ============================================================
const SIDEBAR_ITEMS: SatkerItem[] = [
  {
    id: 1,
    label: "Satuan Kerja",
    singkatan: "Dashboard",
    icon: <Home size={16} />,
    lokasi: "",
    phone: "",
    wilayahKerja: "",
    fokusKegiatan: [],
    fungsiUtama: [],
  },
  {
    id: 2,
    label: "Satker Balai BWS Sumatera VIII",
    singkatan: "BALAI BESAR WILAYAH SUNGAI SUMATERA VIII",
    icon: <Building2 size={16} />,
    lokasi: "Jl. Soekarno-Hatta N0.869, Talang Kelapa, Kec. Alang-Alang Lebar, Kota Palembang, Sumatera Selatan, 30153.",
    phone: "balaisumatra8@gmail.com",
    wilayahKerja:
      "Wilayah Sungai Musi, Sugihan, Banyuasin, Lemau.",
    fokusKegiatan: [
      "Perencanaan dan penyusunan program pengelolaan SDA",
      "Pengelolaan administrasi, keuangan, dan kepegawaian balai",
      "Koordinasi antar satker dan instansi terkait",
      "Pengelolaan data dan sistem informasi SDA (SISDA)",
    ],
    fungsiUtama: [
      "Menyelenggarakan pengelolaan sumber daya air secara menyeluruh di WS Musi-Sugihan-Banyuasin-Lemau",
      "Menyusun pola dan rencana pengelolaan SDA wilayah sungai",
      "Melaksanakan studi kelayakan dan perencanaan teknis pengembangan SDA",
      "Mengkoordinasikan seluruh kegiatan satker di lingkungan BBWS Sumatera VIII",
    ],
  },
  {
    id: 3,
    label: "Satker OP Wilayah Sungai Musi BBWS Sumatera VIII",
    singkatan: "OP SDA",
    icon: <Wrench size={16} />,
    lokasi: "Jl. Soekarno Hatta No. 869, Kel. Talang Kelapa, Kec. Alang-Alang Lebar, Kota Palembang, Sumatera Selatan 30153.",
    phone: "balaisumatra8@gmail.com",
    wilayahKerja:
      "Wilayah Sungai Musi, Sugihan, Banyuasin, Lemau.",
    fokusKegiatan: [
      "Operasi dan pemeliharaan infrastruktur sungai, waduk, dan danau",
      "Pemeliharaan jaringan irigasi dan rawa kewenangan pusat",
      "Pengelolaan sistem hidrologi dan peringatan dini banjir",
      "Penanggulangan kerusakan infrastruktur akibat bencana",
    ],
    fungsiUtama: [
      "Melaksanakan operasi dan pemeliharaan sarana prasarana SDA secara rutin",
      "Mengelola sistem monitoring hidrologi dan kualitas air WS Musi",
      "Memberikan rekomendasi teknis terkait pengelolaan OP infrastruktur SDA",
      "Mengkoordinasikan kegiatan OP dengan pemerintah daerah dan TKPSDA",
    ],
  },
  {
    id: 4,
    label: "Satker NVT PJSA",
    singkatan: "PJSA",
    icon: <Waves size={16} />,
    lokasi: "Jl. Soekarno Hatta No. 869, Kel. Talang Kelapa, Kec. Alang-Alang Lebar, Kota Palembang, Sumatera Selatan 30153.",
    phone: "balaisumatra8@gmail.com",
    wilayahKerja:
      "Wilayah Sungai Musi, Sugihan, Banyuasin, Lemau.",
    fokusKegiatan: [
      "Konservasi sumber daya air dan pengendalian sedimen",
      "Pengendalian banjir dan pengamanan pantai",
      "Pembangunan dan peningkatan embung, situ, dan waduk kecil",
      "Perkuatan tebing sungai dan normalisasi alur sungai",
    ],
    fungsiUtama: [
      "Melaksanakan konstruksi sarana prasarana jaringan sumber air",
      "Mengendalikan daya rusak air melalui pembangunan infrastruktur pengendali banjir",
      "Menyiapkan rencana persiapan operasi dan pemeliharaan infrastruktur sumber air",
      "Memberdayakan masyarakat dalam penyelenggaraan konstruksi SDA",
    ],
  },
  {
    id: 5,
    label: "Satker NVT Pembangunan Bendungan",
    singkatan: "BEND",
    icon: <Landmark size={16} />,
    lokasi: "Jl. Soekarno Hatta No. 869, Kel. Talang Kelapa, Kec. Alang-Alang Lebar, Kota Palembang, Sumatera Selatan 30153.",
    phone: "balaisumatra8@gmail.com",
    wilayahKerja:
      "Wilayah Sungai Musi, Sugihan, Banyuasin, Lemau.",
    fokusKegiatan: [
      "Pembangunan bendungan strategis nasional",
      "Perencanaan teknis dan desain bendungan",
      "Pengadaan tanah untuk keperluan pembangunan bendungan",
      "Pengawasan konstruksi dan quality control bendungan",
    ],
    fungsiUtama: [
      "Melaksanakan pembangunan bendungan skala besar sebagai tampungan air strategis",
      "Mengelola proses perencanaan, konstruksi hingga serah terima operasional bendungan",
      "Memastikan keamanan bendungan sesuai standar teknis nasional",
      "Mengkoordinasikan pembebasan lahan dan ganti rugi kepada masyarakat terdampak",
    ],
  },
  {
    id: 6,
    label: "Satker NVT PJPA",
    singkatan: "PJPA",
    icon: <Droplets size={16} />,
    lokasi: "Jl. Soekarno Hatta No. 869, Kel. Talang Kelapa, Kec. Alang-Alang Lebar, Kota Palembang, Sumatera Selatan 30153.",
    phone: "balaisumatra8@gmail.com",
    wilayahKerja:
      "Wilayah Sungai Musi, Sugihan, Banyuasin, Lemau.",
    fokusKegiatan: [
      "Pembangunan dan rehabilitasi jaringan irigasi permukaan",
      "Pengembangan dan pengelolaan jaringan rawa",
      "Penyediaan dan pengelolaan air tanah dan air baku",
      "Pembangunan intake dan jaringan transmisi air baku",
    ],
    fungsiUtama: [
      "Melaksanakan pendayagunaan SDA melalui pembangunan jaringan pemanfaatan air",
      "Mengelola konstruksi irigasi kewenangan pusat dan daerah",
      "Menyediakan air baku untuk kebutuhan domestik, perkotaan, dan industri",
      "Mendukung ketahanan pangan nasional melalui perluasan dan rehabilitasi irigasi",
    ],
  },
];

// ============================================================
// INFO CARD COMPONENT
// ============================================================
const InfoCard = ({
  icon,
  title,
  children,
}: {
  icon: React.ReactElement;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 h-full">
    <div className="flex items-center gap-2 mb-3">
      <span className="text-indigo">{icon}</span>
      <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">{title}</p>
    </div>
    {children}
  </div>
);

// ============================================================
// KOMPONEN UTAMA
// ============================================================
export default function SatkerPage() {
  const sectionRefs = useRef<any>({});
  const [showPeta, setShowPeta] = React.useState(false);

  const scrollToSection = (id: number) => {
    const element = sectionRefs.current[id];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-slate-50 font-sans">
      <div className="flex flex-1 overflow-hidden">

        {/* ── SIDEBAR KIRI ── */}
        <aside className="w-[240px] bg-white border-r border-slate-200 flex flex-col shrink-0">
          <div className="p-4 overflow-y-auto">
            <nav className="space-y-1">
              {SIDEBAR_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="w-full flex text-start items-start gap-3 p-3 text-sm font-medium text-slate-600 rounded-xl hover:bg-indigo-50 hover:text-indigo transition-all group"
                >
                  <span className="text-slate-400 group-hover:text-indigo mt-1">{item.icon}</span>
                  <span className="flex-1 leading-tight">{item.label}</span>
                  <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 mt-1" />
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main className="flex-1 overflow-y-auto scroll-smooth snap-y snap-mandatory">
          {SIDEBAR_ITEMS.map((section) => (
            <section
              key={section.id}
              ref={(el) => (sectionRefs.current[section.id] = el)}
              className="w-full snap-start flex flex-col p-10 outline-none"
              style={{ minHeight: '100vh' }}
            >
              <div className="max-w-5xl w-full mx-auto flex-1 flex flex-col">

                {/* Header */}
                <div className="mb-8">
                  <span className="text-mango font-bold uppercase tracking-[0.3em] text-[10px] block mb-2">
                    {section.id === 1 ? "Dashboard Utama" : "Detail Satker"}
                  </span>
                  <h2 className="text-3xl font-black text-indigo leading-tight uppercase tracking-tighter">
                    {section.label}
                  </h2>
                  <div className="h-1.5 w-24 bg-mango rounded-full mt-4" />
                </div>

                {/* ── DASHBOARD (id=1): Grid Card ── */}
                {section.id === 1 ? (
                  <div className="grid grid-cols-2 gap-6 mb-10">
                    {SIDEBAR_ITEMS.filter((item) => item.id !== 1).map((satker) => (
                      <div
                        key={satker.id}
                        onClick={() => scrollToSection(satker.id)}
                        className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-4 mb-4">
                          <div className="p-3 bg-indigo-50 text-indigo rounded-2xl group-hover:bg-indigo group-hover:text-white transition-colors">
                            {satker.icon}
                          </div>
                          <div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-mango block">
                              {satker.singkatan}
                            </span>
                            <h4 className="font-bold text-slate-800 leading-tight group-hover:text-indigo text-sm">
                              {satker.label}
                            </h4>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-2 mb-4 italic">
                          {satker.lokasi || "Alamat belum tersedia."}
                        </p>
                        <div className="flex items-center text-[10px] font-bold text-indigo uppercase tracking-wider">
                          Lihat Detail <ChevronRight size={12} className="ml-1" />
                        </div>
                      </div>
                    ))}
                  </div>

                ) : (
                  /* ── DETAIL PAGE: 4 Info Cards ── */
                  <div className="flex-1 mb-10 space-y-5">

                    {/* Baris 1: Wilayah Kerja + Lokasi Kantor */}
                    <div className="grid grid-cols-2 gap-5">

                      {/* 1. Wilayah Kerja */}
                      <InfoCard icon={<Layers size={16} />} title="Wilayah Kerja">
                        <p className="text-sm text-slate-700 leading-relaxed">
                          {section.wilayahKerja}
                        </p>
                      </InfoCard>

                      {/* 4. Lokasi Kantor */}
                      <InfoCard icon={<MapPin size={16} />} title="Lokasi Kantor">
                        <p className="text-sm text-slate-700 leading-relaxed mb-2">
                          {section.lokasi}
                        </p>
                        <div className="flex items-center gap-2 text-indigo font-bold text-sm mt-3">
                          <Mail size={14} />
                          <span>{section.phone || "-"}</span>
                        </div>
                      </InfoCard>
                    </div>

                    {/* Baris 2: Fokus Kegiatan + Fungsi Utama */}
                    <div className="grid grid-cols-2 gap-5">

                      {/* 2. Fokus Kegiatan */}
                      <InfoCard icon={<Target size={16} />} title="Fokus Kegiatan">
                        <ul className="space-y-2">
                          {section.fokusKegiatan.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-mango shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </InfoCard>

                      {/* 3. Fungsi Utama */}
                      <InfoCard icon={<Cog size={16} />} title="Fungsi Utama">
                        <ul className="space-y-2">
                          {section.fungsiUtama.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </InfoCard>
                    </div>

                    {/* CTA */}
                    <div className="pt-2">
                      <button
  onClick={() => setShowPeta(true)}
  className="bg-indigo text-white px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
>
  Lihat Struktur PPK
</button>
                    </div>

                  </div>
                )}
              </div>
            </section>
          ))}
        </main>

        {showPeta && (
  <div
    className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
    onClick={() => setShowPeta(false)}
  >
    <div className="bg-white rounded-3xl p-4 max-w-3xl w-full mx-4 shadow-2xl">
      <img
        src="/images/struktur-bagan-ppk.png"
        alt="Struktur Bagan PPK"
        className="w-full rounded-2xl object-contain"
      />
      <button
        onClick={() => setShowPeta(false)}
        className="mt-4 w-full text-center text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-indigo"
      >
        Tutup
      </button>
    </div>
  </div>
)}
      </div>
    </div>
  );
}
