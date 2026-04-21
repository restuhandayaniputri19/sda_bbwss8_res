import { usePrediksiCuacaData } from "../../hooks/usePrediksiCuacaData";
import { 
  CloudRain, 
  CloudRainWind, 
  CloudLightning, 
  Cloud, 
  Sun, 
  CloudSun 
} from "lucide-react";

const PrediksiCuaca = () => {
  
  // Ambil semua yang dibutuhkan dari hook. 
  // Tidak perlu lagi membuat state atau useEffect fetch manual di sini.
  const { prediksiCuaca, loading } = usePrediksiCuacaData();

const WeatherIcon = ({ kondisi, className }) => {
  const k = kondisi?.toLowerCase() || "";
  
  if (k.includes("hujan petir")) return <CloudLightning className={`${className} text-red-500`} />;
  if (k.includes("hujan sedang")) return <CloudRainWind className={`${className} text-blue-600`} />;
  if (k.includes("hujan")) return <CloudRain className={`${className} text-blue-400`} />;
  if (k.includes("berawan")) return <Cloud className={`${className} text-slate-400`} />;
  if (k.includes("cerah berawan")) return <CloudSun className={`${className} text-orange-400`} />;
  if (k.includes("cerah")) return <Sun className={`${className} text-yellow-500`} />;
  
  return <Cloud className={className} />;
};
  return (
    <div className="flex min-h-screen flex-col p-10 gap-8">
      {/* Header */}
      <header className="w-full">
        <h1 className="text-2xl font-semibold text-indigo">Prakiraan Cuaca</h1>
        <p className="text-sm opacity-75">
          Terakhir diperbarui: {prediksiCuaca?.updated_at ? new Date(prediksiCuaca.updated_at).toLocaleString('id-ID') : '-'} | Sumber:{" "}
          <a href="https://www.bmkg.go.id/cuaca/prakiraan-cuaca/16" target="_blank" rel="noopener noreferrer" className="underline">BMKG</a>
        </p>
        <div className="border-t mt-4 border-slate-200" />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        
        {/* Seksi Kiri: Daftar Kabupaten */}
        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-medium opacity-80 text-slate-700">Wilayah Sumatera Selatan</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar">
            {loading ? (
              // Skeleton sederhana saat loading
              [...Array(6)].map((_, i) => (
                <div key={i} className="h-32 w-full bg-slate-100 animate-pulse rounded-lg border border-slate-200"></div>
              ))
            ) : (
              prediksiCuaca?.items?.map((item, index) => (
                <div key={index} className="card card-bordered bg-base-100 shadow-sm border-slate-300 hover:border-indigo-400 transition-all duration-300 border-[1.5px]">
                  <div className="card-body p-4">
                    <h3 className="card-title text-sm border-b border-rounded-sm pb-2 mb-2 text-indigo-700 font-bold">
                      {item.lokasi}
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-center">
                      {/* Hari Ini */}
                      <div className="flex flex-col gap-1 justify-between">
                        <p className="text-[9px] uppercase opacity-50 font-extrabold">Hari Ini</p>
                        <WeatherIcon kondisi={item.hari_ini.kondisi} className="w-6 h-6" />
                        
                        <p className="text-[11px] font-semibold mt-1 text-slate-700">{item.hari_ini.suhu}</p>
                      </div>
                      
                      {/* Besok */}
                      <div className="border-l border-slate-100 flex flex-col gap-1 justify-between">
                        <p className="text-[9px] uppercase opacity-50 font-extrabold">Besok</p>
                        <WeatherIcon kondisi={item.besok.kondisi} className="w-6 h-6" />
                        <p className="text-[11px] font-semibold mt-1 text-slate-700">{item.besok.suhu}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-50 opacity-60">
                       <span className="text-[9px]">Lembap: {item.hari_ini.kelembapan}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Seksi Kanan: Satelit */}
        <section className="flex flex-col gap-4 sticky top-10">
          <div className="flex justify-between items-end">
            <h2 className="text-lg font-medium opacity-80 text-slate-700">
              Citra Satelit Himawari-9 <br/>
              <span className="text-sm opacity-60 font-normal italic">UTC + 7 = WIB</span>
            </h2>
          </div>
          <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 bg-black">
            <img
              className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700 cursor-zoom-in"
              src="https://inderaja.bmkg.go.id/IMAGE/HIMA/H08_RP_Region1.png"
              alt="Visualisasi Potensi Hujan"
              loading="lazy"
            />
          </div>
        </section>

      </div>
    </div>
  );
};

export default PrediksiCuaca;