import React from "react";
import { ChevronDown, Boxes, FileText, Info, Phone, MessageCircle } from "lucide-react";
import { Instagram, Youtube, Facebook, Mail, Map } from "lucide-react";
import { Link } from "react-router-dom";
/**
 * MEGA Dropdown MENU STATIS - 4 KOLOM
 */
const ProfilMenu: React.FC<{ label: string }> = ({ label }) => {
  return (
    <div className="group flex items-center h-full relative">
      <button className="font-bold flex items-center text-sm text-black p-3 group-hover:bg-slate-50 rounded-t-lg transition-all hover:text-indigo">
        {label}
          <ChevronDown className="ml-1 w-4 h-4 group-hover:rotate-180 transition-transform" />
      </button>

      {/* Panel Mega Menu */}
      <div className="absolute top-[80px] right-0 w-[900px] bg-white shadow-2xl rounded-bl-3xl rounded-br-lg border border-gray-100 hidden group-hover:block z-[70] animate-in fade-in zoom-in-95 slide-in-from-right-10 duration-300 overflow-hidden">
        <div className="grid grid-cols-4 divide-x divide-gray-100">
          {/* Kolom 1: Data Hidrologi */}
          <div className="p-5 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-2 mb-6 text-gray-400">
              <Boxes size={18} />
              <h4 className="font-bold text-xs uppercase tracking-widest">
                Struktur &amp; Info
              </h4>
            </div>
            <ul className="space-y-3">
              <li>
                <MenuLink
                  to="/struktur-organisasi"
                  label="Struktur Organisasi"
                  desc="Bagan Organisasi Balai"
                />
              </li>
              <li>
                <MenuLink
                  to="/tugas-fungsi"
                  label="Informasi Organisasi"
                  desc="Tugas Pokok dan Fungsi"
                />
              </li>
              <li>
                <MenuLink
                  to="/profil-pejabat"
                  label="Informasi Pejabat"
                  desc="Nama dan Foto Pejabat"
                />
              </li>
            </ul>
          </div>

          {/* Kolom 2: Infrastruktur */}
          <div className="p-5 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-2 mb-6 text-gray-400">
              <FileText size={18} />
              <h4 className="font-bold text-xs uppercase tracking-widest">
                Satker &amp; Dokumen
              </h4>
            </div>
            <ul className="space-y-3">
              <li>
                <MenuLink
                  to="/satker"
                  label="Informasi Satker"
                  desc="Alamat dan Kontak Satker"
                />
              </li>
              <li>
                <MenuLink
                  to="/pola-rencana"
                  label="Pola dan RPSDA"
                  desc="Dokumen Rencana Strategi Pengelolaan Sumber Daya Air"
                />
              </li>
            </ul>
          </div>

          {/* Kolom 3: Layanan Publik */}
          <div className="p-5 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-2 mb-6  text-gray-400">
              <Info size={18} />
              <h4 className="font-bold text-xs uppercase tracking-widest">
                Tentang Kami
              </h4>
            </div>
            <ul className="space-y-3">
              <li>
                <MenuLink to="/profil" label="Visi - Misi" desc="Visi - Misi" />
              </li>
              <li>
                <MenuLink to="/sejarah" label="Sejarah" />
              </li>
            </ul>
          </div>

          {/* Kolom 4: Dokumentasi / Portal */}
          <div className="p-5 bg-indigo text-white">
            <div className="flex items-center gap-2 mb-4">
              <Phone size={18} className="text-mango" />
              <Link
  to="/kontak-lokasi"
  className="font-bold text-xs uppercase tracking-widest text-mango hover:underline"
>
  Kontak &amp; Lokasi
</Link>
            </div>
            <ul className="text-[12px] leading-relaxed mb-4 opacity-80">
              <li className="flex items-center gap-2">
                <Link
                  to={"https://wa.me/628117887443"} // Ganti dengan nomor resmi BBWS
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-mango transition-colors group/wa"
                >
                  <MessageCircle size={14} className="text-mango" />
                  <span>Whatsapp</span>
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-mango" />
                <span>bbws.sumatera8@pu.go.id</span>
              </li>
              <li className="flex items-center gap-2 ">
                <Instagram size={14} className="text-mango" />
                <span>
                  <Link
                    to="https://www.instagram.com/pupr_sda_sumatera8/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Instagram
                  </Link>
                </span>
              </li>
              <li className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
                <Youtube size={14} className="text-mango" />
                <span>
                  <Link
                    to="https://www.youtube.com/@bbwssumateraviii4910"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Youtube
                  </Link>
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Facebook size={14} className="text-mango" />
                <span>
                  <Link
                    to="https://www.facebook.com/bbwss8"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Facebook
                  </Link>
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Map size={14} className="text-mango" />
                <span>
                  <Link
                    to="https://maps.app.goo.gl/sNibrVZf7HyLPPGU8"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Google Map
                  </Link>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * HELPER UNTUK LINK DI DALAM MEGA MENU
 */
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
export default ProfilMenu;
