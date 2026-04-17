import { ChevronDown } from "lucide-react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";

interface LayananTerpaduMenuProps {
  label: string;
}

const LayananTerpaduMenu: React.FC<LayananTerpaduMenuProps> = ({ label }) => {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 120);
  };


  return (
    <div
      className="relative h-full flex items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={`font-bold flex items-center gap-1 self-center text-sm p-3 rounded-t-lg transition-all ${
          open 
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
          <Link
            to="/layanan-terpadu"
            onClick={() => setOpen(false)}
            className="block bg-indigo px-4 py-5 hover:brightness-110 transition-all"
          >
            <p className="text-white text-xs font-bold uppercase tracking-widest">
              Layanan Terpadu
            </p>
            <p className="text-white/70 text-[11px] mt-0.5">
              Pelayanan publik BBWS Sumatera VIII
            </p>
          </Link>
        </div>
      )}
    </div>
  );
};

export default LayananTerpaduMenu;