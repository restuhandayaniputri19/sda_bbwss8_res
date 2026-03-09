import React from "react";
import { ChevronDown, BookOpen, Newspaper, Info, Scale, Phone, FileSearch } from "lucide-react";
import { Link } from "react-router-dom";

const InformasiPublikMenu: React.FC<{ label: string }> = ({ label }) => {
  return (
    <div className="group flex items-center h-full relative">
      <button className="font-bold flex items-center text-sm text-black p-3 group-hover:bg-slate-50 rounded-t-lg transition-all hover:text-indigo">
        {label}
        <ChevronDown className="ml-1 w-4 h-4 group-hover:rotate-180 transition-transform" />
      </button>

      {/* Panel Mega Menu */}
      <div className="absolute top-[80px] right-0 w-[700px] bg-white shadow-2xl rounded-bl-3xl rounded-br-lg border border-gray-100 hidden group-hover:block z-[70] animate-in fade-in zoom-in-95 slide-in-from-right-10 duration-300 overflow-hidden">
        <div className="grid grid-cols-3 divide-x divide-gray-100">

          {/* Kolom 1: Media & Berita */}
          <div className="p-5 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-2 mb-6 text-gray-400">
              <Newspaper size={18} />
              <h4 className="font-bold text-xs uppercase tracking-widest">
                Media & Berita
              </h4>
            </div>
            <ul className="space-y-3">
              <li>
                <MenuLink
                  to="/majalah"
                  label="Majalah"
                  desc="Majalah Digital BBWS"
                />
              </li>
              <li>
                <MenuLink
                  to="/berita"
                  label="Berita"
                  desc="Berita & Kegiatan Terkini"
                />
              </li>
              <li>
                <MenuLink
                  to="/kontak-kami"
                  label="Kontak Kami"
                  desc="Hubungi BBWS Sumatera VIII"
                />
              </li>
            </ul>
          </div>

          {/* Kolom 2: Informasi */}
          <div className="p-5 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-2 mb-6 text-gray-400">
              <Info size={18} />
              <h4 className="font-bold text-xs uppercase tracking-widest">
                Informasi
              </h4>
            </div>
            <ul className="space-y-3">
              <li>
                <MenuLink
                  to="/informasi-berkala"
                  label="Informasi Berkala"
                  desc="Laporan & Data Berkala"
                />
              </li>
              <li>
                <MenuLink
                  to="/informasi-serta-merta"
                  label="Informasi Serta Merta"
                  desc="Informasi Darurat & Mendesak"
                />
              </li>
              <li>
                <MenuLink
                  to="/informasi-tersedia"
                  label="Informasi Tersedia"
                  desc="Dokumen Tersedia Setiap Saat"
                />
              </li>
            </ul>
          </div>

          {/* Kolom 3: Dokumen & Hukum */}
          <div className="p-5 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-2 mb-6 text-gray-400">
              <Scale size={18} />
              <h4 className="font-bold text-xs uppercase tracking-widest">
                Dokumen & Hukum
              </h4>
            </div>
            <ul className="space-y-3">
              <li>
                <MenuLink
                  to="/peraturan"
                  label="Peraturan"
                  desc="Regulasi & Peraturan Terkait"
                />
              </li>
              <li>
                <MenuLink
                  to="/informasi"
                  label="Informasi"
                  desc="Dokumen Informasi Publik"
                />
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
};

const MenuLink = ({
  to,
  label,
  desc,
}: {
  to: string;
  label: string;
  desc?: string;
}) => (
  <Link to={to} className="group/link block">
    <div className="text-sm font-semibold text-gray-800 group-hover/link:text-indigo transition-colors">
      {label}
    </div>
    {desc && (
      <div className="text-[12px] text-gray-400 leading-tight group-hover/link:text-gray-500">
        {desc}
      </div>
    )}
  </Link>
);

export default InformasiPublikMenu;
