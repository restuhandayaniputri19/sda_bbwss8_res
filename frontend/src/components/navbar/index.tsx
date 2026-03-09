import { MenuIcon, XIcon, ChevronDown } from "lucide-react";
import React, { useEffect, useState } from "react";
import Dropdown from "../dropdown";
import { Link, useLocation } from "react-router-dom";
import ProfilMenu from "./ProfilMenu";
import PublikasiMenu from "./PublikasiMenu";
import InformasiPublikMenu from "./InformasiPublikMenu";

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
  const [activeSubmenu, setActiveSubmenu] = useState<number | null>(null);
  const location = useLocation();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleSubmenu = (index: number) => {
    setActiveSubmenu((prev) => (prev === index ? null : index));
  };

  useEffect(() => {
    setMenuOpen(false);
    setActiveSubmenu(null);
  }, [location.pathname]);

  const getLinksPositionClasses = () => {
    switch (linksPosition) {
      case "center": return "justify-center";
      case "right": return "justify-end";
      default: return "justify-start";
    }
  };

  const positionClass = position === "fixed" ? "fixed top-0 left-0 w-full z-50" : "sticky top-0 z-50";

  return (
    <nav className={`${transparent ? "bg-transparent" : "bg-white"} ${shadow} ${positionClass} transition-colors duration-300 border-b-8 border-b-mango`}>
      <div className={`w-full ${maxWidth} mx-auto px-4`}>
        <div className="flex justify-between h-20 items-center">
          {/* Logo Section */}
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

          {/* Mobile Toggle */}
          <div className="flex items-center min-[1021px]:hidden">
            <button onClick={toggleMenu} className="p-2 rounded-md text-gray-700 focus:outline-none">
              {menuOpen ? <XIcon /> : <MenuIcon />}
            </button>
          </div>

          {/* Desktop Navigation */}
          {links && (
            <nav className={`hidden min-[1021px]:flex h-full gap-5 flex-1 ${getLinksPositionClasses()} ml-4`}>
              {links.map((link, index) => {
                // KONTEN KHUSUS INDEX 0 (Misal: Beranda atau Highlight)
                if (index === 0) {
                  return (
                    <Link key={index} to={link.path} className="font-bold flex items-center self-center text-sm text-black p-3 hover:text-indigo hover:bg-slate-50 rounded-t-lg transition-all">
                      {link.label}
                    </Link>
                  );
                }

                // KONTEN KHUSUS INDEX 1: MEGA MENU
                if (index === 1) {
                  return (
                    <ProfilMenu key={index} label={link.label} />
                  );
                }

                // Tambahan update
                if (index === 2) {
                  return <PublikasiMenu key={index} label={link.label} />;
                }
                if (index === 3) {
                  return <InformasiPublikMenu key={index} label={link.label} />;
                }

                // LOGIKA BAWAAN (Index 2 ke atas)
                return link.submenu ? (
                  <Dropdown key={index} label={link.label} submenu={link.submenu} />
                ) : (
                  <Link
                    key={index}
                    to={link.path}
                    className="font-medium flex items-center text-base transition-colors hover:underline text-black p-2"
                    onClick={() => link.submenu ? toggleSubmenu(index) : setMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {links && menuOpen && (
        <div className={`min-[1021px]:hidden px-2 pb-3 fixed ${backgroundColor} ${shadow} w-full max-h-[calc(100vh-80px)] overflow-y-auto`}>
          {links.map((link, index) => (
            <div key={index} className="border-b border-gray-100 last:border-none">
              <div 
                className={`flex justify-between items-center px-3 py-3 rounded-md text-base font-medium ${activeSubmenu === index ? "text-indigo" : "text-gray-700"}`}
                onClick={() => link.submenu ? toggleSubmenu(index) : setMenuOpen(false)}
              >
                {link.submenu ? (
                  <span>{link.label}</span>
                ) : (
                  <Link to={link.path} className="w-full">{link.label}</Link>
                )}
                {link.submenu && <ChevronDown className={`w-4 h-4 transition-transform ${activeSubmenu === index ? "rotate-180" : ""}`} />}
              </div>
              
              {link.submenu && activeSubmenu === index && (
                <div className="ml-4 bg-gray-50 rounded-lg mb-2">
                  {link.submenu.map((submenuItem, subIndex) => (
                    <Link
                      key={subIndex}
                      to={submenuItem.path}
                      className={`block px-4 py-2 text-sm font-medium hover:text-indigo ${location.pathname === submenuItem.path ? "text-indigo font-bold" : "text-gray-600"}`}
                    >
                      {submenuItem.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;