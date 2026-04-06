import { MenuIcon, XIcon, ChevronDown } from "lucide-react";
import { Instagram, Youtube, Facebook, Mail, Map as MapIcon, MessageCircle, Phone } from "lucide-react";
import React, { useEffect, useState } from "react";
import Dropdown from "../dropdown";
import { Link, useLocation } from "react-router-dom";
import ProfilMenu from "./ProfilMenu";
import PublikasiMenu from "./PublikasiMenu";
import InformasiPublikMenu from "./InformasiPublikMenu";
import LayananTerpaduMenu from "./LayananTerpaduMenu";

interface NavbarProps {
  backgroundColor?: string;
  shadow?: string;
  maxWidth?: string;
  logoIcon?: React.ReactNode;
  logoText?: string;
  links?: {
    path: string;
    label: string;
    submenu?: { path: string; label: string }[];
  }[];
  linksPosition?: "left" | "center" | "right";
  position?: "fixed" | "sticky";
  transparent?: boolean;
}

// ── Data submenu statis (diambil dari ProfilMenu, PublikasiMenu, InformasiPublikMenu) ──

const profilSections = [
  {
    title: "Struktur & Info",
    items: [
      { to: "/struktur-organisasi", label: "Struktur Organisasi", desc: "Bagan Organisasi Balai" },
      { to: "/tugas-fungsi", label: "Informasi Organisasi", desc: "Tugas Pokok dan Fungsi" },
      { to: "/profil-pejabat", label: "Informasi Pejabat", desc: "Nama dan Foto Pejabat" },
    ],
  },
  {
    title: "Satker & Dokumen",
    items: [
      { to: "/satker", label: "Informasi Satker", desc: "Alamat dan Kontak Satker" },
      { to: "/pola-rencana", label: "Pola dan RPSDA", desc: "Dokumen Rencana Strategi Pengelolaan SDA" },
    ],
  },
  {
    title: "Tentang Kami",
    items: [
      { to: "/profil", label: "Visi - Misi", desc: "Visi - Misi" },
      { to: "/sejarah", label: "Sejarah" },
    ],
  },
];

const publikasiSections = [
  {
    title: "Monitoring",
    items: [
      { to: "https://sinbad.sda.pu.go.id/simadu/main/login.php", label: "Early Warning System", desc: "E-SIMADU", external: true },
      { to: "https://www.windy.com/-2.989/104.757?clouds,-3.611,104.757,8", label: "Prakiraan Cuaca", desc: "Windy Weather Map", external: true },
      { to: "/prediksi-cuaca", label: "Prediksi Cuaca", desc: "Informasi Cuaca Terkini" },
    ],
  },
  {
    title: "Media",
    items: [
      { to: "/galeri", label: "Galeri", desc: "Foto & Dokumentasi Kegiatan" },
      { to: "/infografis", label: "Infografis", desc: "Data Visual & Statistik" },
      { to: "/aplikasi", label: "Aplikasi", desc: "Layanan Aplikasi Digital" },
    ],
  },
  {
    title: "Data & Peta",
    items: [
      { to: "/geoportal", label: "Geoportal", desc: "Peta Geospasial Digital" },
      { to: "/rpsda", label: "RPSDA", desc: "Rencana Pengelolaan SDA" },
    ],
  },
];

const informasiPublikSections = [
  {
    title: "Media & Berita",
    items: [
      { to: "/majalah", label: "Majalah", desc: "Majalah Digital BBWS" },
      { to: "/berita", label: "Berita", desc: "Berita & Kegiatan Terkini" },
      { to: "/kontak-kami", label: "Kontak Kami", desc: "Hubungi BBWS Sumatera VIII" },
    ],
  },
  {
    title: "Informasi",
    items: [
      { to: "/informasi-berkala", label: "Informasi Berkala", desc: "Laporan & Data Berkala" },
      { to: "/informasi-serta-merta", label: "Informasi Serta Merta", desc: "Informasi Darurat & Mendesak" },
      { to: "/informasi-tersedia", label: "Informasi Tersedia", desc: "Dokumen Tersedia Setiap Saat" },
    ],
  },
  {
    title: "Dokumen & Hukum",
    items: [
      { to: "/peraturan", label: "Peraturan", desc: "Regulasi & Peraturan Terkait" },
      { to: "/informasi", label: "Informasi", desc: "Dokumen Informasi Publik" },
    ],
  },
];

const layananTerpaduSections = [
  {
    title: "Layanan Publik",
    items: [
      { to: "/rekomtek", label: "Rekomtek", desc: "Rekomendasi Teknis SDA" },
      { to: "/posko-banjir", label: "Posko Banjir", desc: "Informasi & Laporan Banjir" },
      { to: "/permintaan-data", label: "Permintaan Data", desc: "Ajukan Permintaan Data SDA" },
      { to: "/pengaduan-masyarakat", label: "Pengaduan Masyarakat", desc: "Sampaikan Pengaduan Anda" },
      { to: "/whistleblowing", label: "Whistleblowing", desc: "Laporkan Pelanggaran Secara Aman" },
    ],
  },
];

// ── Komponen MobileSection: accordion per grup ──
const MobileSection: React.FC<{
  title: string;
  sections: { title: string; items: { to: string; label: string; desc?: string; external?: boolean }[] }[];
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  extraContent?: React.ReactNode;
}> = ({ title, sections, isOpen, onToggle, onClose }) => {
  const location = useLocation();
  return (
    <div className="border-b border-gray-100">
      <button
        className={`flex justify-between items-center w-full px-3 py-3 text-base font-bold ${isOpen ? "text-indigo" : "text-gray-700"}`}
        onClick={onToggle}
      >
        <span>{title}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="pb-2 px-1">
          {sections.map((section, si) => (
            <div key={si} className="mb-3">
              <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                {section.title}
              </p>
              {section.items.map((item, ii) => (
                <Link
                  key={ii}
                  to={item.to}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  onClick={onClose}
                  className={`block px-4 py-2 rounded-md ${
                    location.pathname === item.to
                      ? "text-indigo font-bold bg-slate-50"
                      : "text-gray-700 hover:text-indigo hover:bg-slate-50"
                  }`}
                >
                  <span className="text-sm font-semibold">{item.label}</span>
                  {item.desc && (
                    <span className="block text-[11px] text-gray-400">{item.desc}</span>
                  )}
                </Link>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Komponen utama Navbar ──
const Navbar: React.FC<NavbarProps> = ({
  backgroundColor = "bg-white",
  shadow = "shadow-sm",
  maxWidth = "max-w-7xl",
  logoIcon,
  logoText = "",
  links,
  linksPosition = "left",
  position = "sticky",
  transparent = false,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const location = useLocation();

  const toggleMenu = () => setMenuOpen((v) => !v);
  const toggleSubmenu = (key: string) =>
    setActiveSubmenu((prev) => (prev === key ? null : key));
  const closeMenu = () => {
    setMenuOpen(false);
    setActiveSubmenu(null);
  };

  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  // Tutup mobile menu saat resize ke desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1021) closeMenu();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getLinksPositionClasses = () => {
    switch (linksPosition) {
      case "center": return "justify-center";
      case "right": return "justify-end";
      default: return "justify-start";
    }
  };

  const positionClass =
    position === "fixed"
      ? "fixed top-0 left-0 w-full z-50"
      : "sticky top-0 z-50";

  return (
    <nav
      className={`${transparent ? "bg-transparent" : "bg-white"} ${shadow} ${positionClass} transition-colors duration-300 border-b-8 border-b-mango`}
    >
      <div className={`w-full ${maxWidth} mx-auto px-4 overflow-visible`}>
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          {logoIcon && (
            <Link to={"/"} className="flex items-center gap-2">
              {logoIcon}
              <div className="flex flex-col uppercase text-indigo">
                <span className="text-xs font-semibold">Kementerian Pekerjaan Umum</span>
                <span className="text-xs font-semibold">Direktorat Jenderal Sumber Daya Air</span>
                <span className="text-sm">BBWS Sumatera VIII</span>
              </div>
            </Link>
          )}
          <span className="uppercase text-indigo">{logoText}</span>

          {/* Hamburger */}
          <div className="flex items-center min-[1021px]:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-700 focus:outline-none"
              aria-label="Toggle menu"
            >
              {menuOpen ? <XIcon /> : <MenuIcon />}
            </button>
          </div>

          {/* Desktop Navigation */}
          {links && (
            <nav
  className={`hidden min-[1021px]:flex h-full gap-5 flex-1 ${getLinksPositionClasses()} ml-4 overflow-visible`}
>
              {links.map((link, index) => {
                if (index === 0)
                  return (
                    <Link
                      key={index}
                      to={link.path}
                      className="font-bold flex items-center self-center text-sm text-black p-3 hover:text-indigo hover:bg-slate-50 rounded-t-lg transition-all"
                    >
                      {link.label}
                    </Link>
                  );
                if (index === 1) return <ProfilMenu key={index} label={link.label} />;
                if (index === 2) return <PublikasiMenu key={index} label={link.label} />;
                if (index === 3) return <LayananTerpaduMenu key={index} label={link.label} />;
                if (index === 4) return <InformasiPublikMenu key={index} label={link.label} />;
                
                return link.submenu ? (
                  <Dropdown key={index} label={link.label} submenu={link.submenu} />
                ) : (
                  <Link
                    key={index}
                    to={link.path}
                    className="font-medium flex items-center text-base transition-colors hover:underline text-black p-2"
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>
      </div>

      {/* ── MOBILE MENU ── */}
      {menuOpen && (
        <div
          className={`min-[1021px]:hidden fixed top-20 left-0 right-0 ${backgroundColor} ${shadow} w-full max-h-[calc(100vh-80px)] overflow-y-auto z-50`}
        >
          {links && links.map((link, index) => {
            // Beranda
            if (index === 0) {
              return (
                <div key={index} className="border-b border-gray-100">
                  <Link
                    to={link.path}
                    onClick={closeMenu}
                    className="block px-3 py-3 text-base font-bold text-gray-700 hover:text-indigo"
                  >
                    {link.label}
                  </Link>
                </div>
              );
            }

            // Profil (index 1)
            if (index === 1) {
              return (
                <div key={index}>
                  <MobileSection
                    title={link.label}
                    sections={profilSections}
                    isOpen={activeSubmenu === "profil"}
                    onToggle={() => toggleSubmenu("profil")}
                    onClose={closeMenu}
                  />
                  {/* Kontak & Lokasi khusus di bawah Profil */}
                  {activeSubmenu === "profil" && (
                    <div className="mx-3 mb-3 rounded-xl bg-indigo text-white p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Phone size={14} className="text-mango" />
                        <Link
                          to="/kontak-lokasi"
                          onClick={closeMenu}
                          className="text-xs font-bold uppercase tracking-widest text-mango hover:underline"
                        >
                          Kontak &amp; Lokasi
                        </Link>
                      </div>
                      <ul className="space-y-1.5 text-xs opacity-90">
                        <li>
                          <Link to="https://wa.me/628117887443" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-mango">
                            <MessageCircle size={12} className="text-mango" /> Whatsapp
                          </Link>
                        </li>
                        <li className="flex items-center gap-2">
                          <Mail size={12} className="text-mango" /> bbws.sumatera8@pu.go.id
                        </li>
                        <li>
                          <Link to="https://www.instagram.com/pupr_sda_sumatera8/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white hover:!text-mango transition-colors">
                            <Instagram size={12} className="text-mango" /> Instagram
                          </Link>
                        </li>
                        <li>
                          <Link to="https://www.youtube.com/@bbwssumateraviii4910" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white hover:!text-mango transition-colors">
                            <Youtube size={12} className="text-mango" /> Youtube
                          </Link>
                        </li>
                        <li>
                          <Link to="https://www.facebook.com/bbwss8" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white hover:!text-mango transition-colors">
                            <Facebook size={12} className="text-mango" /> Facebook
                          </Link>
                        </li>
                        <li>
                          <Link to="https://maps.app.goo.gl/sNibrVZf7HyLPPGU8" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white hover:!text-mango transition-colors">
                            <MapIcon size={12} className="text-mango" /> Google Map
                          </Link>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              );
            }

            // Publikasi (index 2)
            if (index === 2) {
              return (
                <MobileSection
                  key={index}
                  title={link.label}
                  sections={publikasiSections}
                  isOpen={activeSubmenu === "publikasi"}
                  onToggle={() => toggleSubmenu("publikasi")}
                  onClose={closeMenu}
                />
              );
            }

            // Layanan Terpadu (index 3)
            if (index === 3) {
              return (
                <MobileSection
                  key={index}
                  title={link.label}
                  sections={layananTerpaduSections}
                  isOpen={activeSubmenu === "layanan"}
                  onToggle={() => toggleSubmenu("layanan")}
                  onClose={closeMenu}
                />
              );
            }

// Informasi Publik (index 4)
            if (index === 4) {
              return (
                <MobileSection
                  key={index}
                  title={link.label}
                  sections={informasiPublikSections}
                  isOpen={activeSubmenu === "informasi"}
                  onToggle={() => toggleSubmenu("informasi")}
                  onClose={closeMenu}
                />
              );
            }

            // Link biasa
            return (
              <div key={index} className="border-b border-gray-100">
                {link.submenu ? (
                  <>
                    <button
                      className={`flex justify-between items-center w-full px-3 py-3 text-base font-bold ${activeSubmenu === String(index) ? "text-indigo" : "text-gray-700"}`}
                      onClick={() => toggleSubmenu(String(index))}
                    >
                      <span>{link.label}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${activeSubmenu === String(index) ? "rotate-180" : ""}`} />
                    </button>
                    {activeSubmenu === String(index) && (
                      <div className="ml-4 bg-gray-50 rounded-lg mb-2">
                        {link.submenu.map((sub, si) => (
                          <Link
                            key={si}
                            to={sub.path}
                            onClick={closeMenu}
                            className={`block px-4 py-2 text-sm font-medium hover:text-indigo ${location.pathname === sub.path ? "text-indigo font-bold" : "text-gray-600"}`}
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={link.path}
                    onClick={closeMenu}
                    className="block px-3 py-3 text-base font-bold text-gray-700 hover:text-indigo"
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
