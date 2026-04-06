import { ChevronDown } from "lucide-react";
import { useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FileText,
  AlertTriangle,
  Database,
  MessageSquare,
  ShieldAlert,
} from "lucide-react";

interface LayananTerpaduMenuProps {
  label: string;
}

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

const LayananTerpaduMenu: React.FC<LayananTerpaduMenuProps> = ({ label }) => {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 120);
  };

  const isActive = layananItems.some((item) => location.pathname === item.to);

  return (
    <div
      className="relative h-full flex items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={`font-bold flex items-center gap-1 self-center text-sm p-3 rounded-t-lg transition-all ${
          open || isActive
            ? "text-indigo bg-slate-50"
            : "text-black hover:text-indigo hover:bg-slate-50"
        }`}
        aria-expanded={open}
      >
        {label}
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 mt-0 w-72 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="bg-indigo px-4 py-3">
            <p className="text-white text-xs font-bold uppercase tracking-widest">
              Layanan Terpadu
            </p>
            <p className="text-white/70 text-[11px] mt-0.5">
              Pelayanan publik BBWS Sumatera VIII
            </p>
          </div>

          <div className="p-2">
            {layananItems.map((item, i) => {
              const Icon = item.icon;
              const active = location.pathname === item.to;
              return (
                <Link
                  key={i}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                    active ? "bg-slate-50" : "hover:bg-slate-50"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-4 h-4 ${item.color}`} />
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${active ? "text-indigo" : "text-gray-800 group-hover:text-indigo"}`}>
                      {item.label}
                    </p>
                    <p className="text-[11px] text-gray-400">{item.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default LayananTerpaduMenu;