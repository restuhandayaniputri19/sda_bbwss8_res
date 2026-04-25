import React from "react";
import { ChevronDown, Radio, Cloud, Image, BarChart2, AppWindow, Map, FileText, Thermometer } from "lucide-react";
import { Link } from "react-router-dom";

const PublikasiMenu: React.FC<{ label: string }> = ({ label }) => {
  return (
    <div className="group flex items-center h-full relative">
      <button className="font-bold flex items-center text-sm text-black p-3 group-hover:bg-slate-50 rounded-t-lg transition-all hover:text-indigo">
        {label}
        <ChevronDown className="ml-1 w-4 h-4 group-hover:rotate-180 transition-transform" />
      </button>

      {/* Panel Mega Menu */}
      <div className="absolute top-full right-0 w-[700px] bg-white shadow-2xl rounded-bl-3xl rounded-br-lg border border-gray-100 hidden group-hover:block z-[70] animate-in fade-in zoom-in-95 slide-in-from-right-10 duration-300 overflow-hidden">
        <div className="grid grid-cols-3 divide-x divide-gray-100">

          {/* Kolom 1: Monitoring */}
          <div className="p-5 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-2 mb-6 text-gray-400">
              <Radio size={18} />
              <h4 className="font-bold text-xs uppercase tracking-widest">
                Monitoring
              </h4>
            </div>
            <ul className="space-y-3">
              <li>
                <MenuLink
                  to="https://sinbad.sda.pu.go.id/simadu/main/login.php"
                  label="Early Warning System"
                  desc="E-SIMADU"
                  external
                />
              </li>
              <li>
                <MenuLink
                  to="/prakiraan-cuaca"
                  label="Prakiraan Cuaca"
                  desc="Prakiraan Cuaca Terkini (BMKG)"
                />
              </li>
              <li>
                <MenuLink
                  to="/prakiraan-cuaca"
                  label="Prakiraan Cuaca"
                  desc="Prakiraan Cuaca Terkini (BMKG)"
                />
              </li>
            </ul>
          </div>

          {/* Kolom 2: Media */}
          <div className="p-5 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-2 mb-6 text-gray-400">
              <Image size={18} />
              <h4 className="font-bold text-xs uppercase tracking-widest">
                Media
              </h4>
            </div>
            <ul className="space-y-3">
              <li>
                <MenuLink
                  to="/galeri"
                  label="Galeri"
                  desc="Foto & Dokumentasi Kegiatan"
                />
              </li>
              <li>
                <MenuLink
                  to="/infografis"
                  label="Infografis"
                  desc="Data Visual & Statistik"
                />
              </li>
              <li>
                <MenuLink
                  to="/aplikasi"
                  label="Aplikasi"
                  desc="Layanan Aplikasi Digital"
                />
              </li>
            </ul>
          </div>

          {/* Kolom 3: Data & Peta */}
          <div className="p-5 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-2 mb-6 text-gray-400">
              <Map size={18} />
              <h4 className="font-bold text-xs uppercase tracking-widest">
                Data & Peta
              </h4>
            </div>
            <ul className="space-y-3">
              <li>
                <MenuLink
                  to="/geoportal"
                  label="Geoportal"
                  desc="Peta Geospasial Digital"
                />
              </li>
              <li>
  <MenuLink
    to="/pola-rpsda"
    label="Pola dan RPSDA"
    desc="Pola & Rencana Pengelolaan SDA"
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
  external,
}: {
  to: string;
  label: string;
  desc?: string;
  external?: boolean;
}) => (
  <Link
    to={to}
    className="group/link block"
    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
  >
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

export default PublikasiMenu;
