import React from "react";
import { ChevronDown, Boxes, Info, Phone, MessageCircle } from "lucide-react";
import { Instagram, Youtube, Facebook, Mail, Map } from "lucide-react";
import { Link } from "react-router-dom";

const ProfilMenu: React.FC<{ label: string }> = ({ label }) => {
  return (
    <div className="group flex items-center h-full relative">
      <button className="font-bold flex items-center text-sm text-black p-3 group-hover:bg-slate-50 rounded-t-lg transition-all hover:text-indigo">
        {label}
        <ChevronDown className="ml-1 w-4 h-4 group-hover:rotate-180 transition-transform" />
      </button>

      <div className="absolute top-full left-1/2 -translate-x-1/2 w-[900px] bg-white shadow-2xl rounded-b-lg border border-gray-100 hidden group-hover:block z-[70] animate-in fade-in zoom-in-95 duration-300">
        <div className="grid grid-cols-3 divide-x divide-gray-100">

          {/* Kolom 1: Struktur & Info */}
          <div className="p-5 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-2 mb-6 text-gray-400">
              <Boxes size={18} />
              <h4 className="font-bold text-xs uppercase tracking-widest">
                Struktur &amp; Info
              </h4>
            </div>
            <ul className="space-y-3">
              <li>
                <MenuLink to="/struktur-organisasi" label="Struktur Organisasi" desc="Bagan Organisasi Balai" />
              </li>
              <li>
                <MenuLink to="/tugas-fungsi" label="Informasi Organisasi" desc="Tugas Pokok dan Fungsi" />
              </li>
              <li>
                <MenuLink to="/profil-pejabat" label="Informasi Pejabat" desc="Nama dan Foto Pejabat" />
              </li>
              <li>
                <MenuLink to="/satker" label="Informasi Satker" desc="Alamat dan Kontak Satker" />
              </li>
            </ul>
          </div>

          {/* Kolom 2: Tentang Kami */}
          <div className="p-5 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-2 mb-6 text-gray-400">
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

          {/* Kolom 3: Kontak & Lokasi */}
          <div className="p-5 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-2 mb-6 text-gray-400">
              <Phone size={18} />
              <Link
                to="/kontak-lokasi"
                className="font-bold text-xs uppercase tracking-widest hover:text-indigo"
              >
                Kontak &amp; Lokasi
              </Link>
            </div>
            <ul className="space-y-2 text-[12px]">
              <li>
                <Link to="https://wa.me/628117887443" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-600 hover:text-indigo transition-colors">
                  <MessageCircle size={14} /> Whatsapp
                </Link>
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <Mail size={14} /> bbws.sumatera8@pu.go.id
              </li>
              <li>
                <Link to="https://www.instagram.com/pupr_sda_sumatera8/" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-600 hover:text-indigo transition-colors">
                  <Instagram size={14} /> Instagram
                </Link>
              </li>
              <li>
                <Link to="https://www.youtube.com/@bbwssumateraviii4910" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-600 hover:text-indigo transition-colors">
                  <Youtube size={14} /> Youtube
                </Link>
              </li>
              <li>
                <Link to="https://www.facebook.com/bbwss8" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-600 hover:text-indigo transition-colors">
                  <Facebook size={14} /> Facebook
                </Link>
              </li>
              <li>
                <Link to="https://maps.app.goo.gl/sNibrVZf7HyLPPGU8" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-600 hover:text-indigo transition-colors">
                  <Map size={14} /> Google Map
                </Link>
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

export default ProfilMenu;