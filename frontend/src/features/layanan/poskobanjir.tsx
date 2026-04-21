import React, { useRef } from 'react';
import { Phone, Database, Map, Droplets, Activity, ChevronRight, Home } from "lucide-react";

const SIDEBAR_ITEMS = [
  { id: 1, label: "Posko Banjir", icon: <Home size={16} />, alamat: "", phone: "" },
  { id: 2, label: "Posko Banjir Wilayah 1", icon: <Map size={16} />, alamat: "Jl. Kapten Anwar Sastro no 3 Palembang 30113", phone: "(0711) 567890" },
  { id: 3, label: "Posko Banjir Wilayah 2", icon: <Activity size={16} />, alamat: "Jl. Raya Kertapati no 123 Palembang 30113", phone: "(0711) 987654" },
  { id: 4, label: "Posko Banjir Wilayah 3", icon: <Database size={16} />, alamat: "Jl. Diponegoro no 456 Palembang 30113", phone: "(0711) 456789" },
  { id: 5, label: "Posko Banjir Wilayah 4", icon: <Phone size={16} />, alamat: "Jl. Sudirman no 789 Palembang 30113", phone: "(0711) 321654" },
];

export default function PoskoBanjirPage() {
  const sectionRefs = useRef({});

  const scrollToSection = (id: number) => {
    const element: HTMLElement | null = sectionRefs.current[id];
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-slate-50 font-sans">
      <div className="flex flex-1 overflow-hidden">
        
        {/* SISI KIRI: Sidebar */}
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

        {/* SISI KANAN: Main Content */}
        <main className="flex-1 overflow-y-auto scroll-smooth snap-y snap-mandatory">
          {SIDEBAR_ITEMS.map((section) => (
            <section 
              key={section.id}
              ref={(el) => (sectionRefs.current[section.id] = el)}
              className="w-full h-full snap-start flex flex-col p-10 outline-none"
              style={{ minHeight: '100vh' }}
            >
              <div className="max-w-5xl w-full mx-auto flex-1 flex flex-col">
                
                {/* Header Section */}
                <div className="mb-8">
                  <span className="text-mango font-bold uppercase tracking-[0.3em] text-[10px] block mb-2">
                    {section.id === 1 ? "Dashboard Utama" : `Detail Satker 0${section.id - 1}`}
                  </span>
                  <h2 className="text-3xl font-black text-indigo leading-tight uppercase tracking-tighter">
                    {section.label}
                  </h2>
                  <div className="h-1.5 w-24 bg-mango rounded-full mt-4"></div>
                </div>

                {/* Content Logic */}
                {section.id === 1 ? (
                  /* GRID 2 KOLOM UNTUK ID=1 */
                  <div className="grid grid-cols-2 gap-6 mb-10">
                    {SIDEBAR_ITEMS.filter(item => item.id !== 1).map((satker) => (
                      <div 
                        key={satker.id}
                        onClick={() => scrollToSection(satker.id)}
                        className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-4 mb-4">
                          <div className="p-3 bg-indigo-50 text-indigo rounded-2xl group-hover:bg-indigo group-hover:text-white transition-colors">
                            {satker.icon}
                          </div>
                          <h4 className="font-bold text-slate-800 leading-tight group-hover:text-indigo">
                            {satker.label}
                          </h4>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-2 mb-4 italic">
                          {satker.alamat || "Alamat belum tersedia."}
                        </p>
                        <div className="flex items-center text-[10px] font-bold text-indigo uppercase tracking-wider">
                          Lihat Detail <ChevronRight size={12} className="ml-1" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* DETAIL PAGE UNTUK ID 2-5 */
                  <div className="bg-white border border-slate-200 rounded-[2.5rem] p-12 shadow-sm flex-1 mb-10 relative overflow-hidden flex flex-col justify-center">
                    <div className="relative z-10">
                      <div className="flex flex-col gap-6">
                        <div className="space-y-1">
                          <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Alamat Kantor</p>
                          <p className="text-lg text-slate-700 font-medium leading-relaxed">
                            {section.alamat || "Informasi alamat sedang diperbarui."}
                          </p>
                        </div>
                        
                        <div className="space-y-1">
                          <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Kontak</p>
                          <div className="flex items-center gap-2 text-indigo font-bold text-xl">
                            <Phone size={20} />
                            <span>{section.phone || "-"}</span>
                          </div>
                        </div>

                        <div className="pt-8 border-t border-slate-100">
                        </div>
                      </div>
                    </div>
                    
                    {/* Watermark Icon */}
                    <div className="absolute -right-16 -bottom-16 text-slate-50 opacity-10 pointer-events-none">
                      {React.cloneElement(section.icon, { size: 320 })}
                    </div>
                  </div>
                )}
              </div>
            </section>
          ))}
        </main>
      </div>
    </div>
  );
}