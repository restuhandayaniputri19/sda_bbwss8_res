import { Globe, ExternalLink } from "lucide-react";
import bannerAplikasi from "../../assets/4_11zon.webp";

const aplikasiTerkait = [
  {
    id: 1,
    img: `${import.meta.env.BASE_URL}images/wrdc.png`,
    title: "WRDC",
    platform: "Web",
    description:
      "Water Resources Data Center - Pusat data sumber daya air nasional.",
    url: "https://pdsda.sda.pu.go.id/",
  },
  {
    id: 2,
    img: `${import.meta.env.BASE_URL}images/visiting-point.png`,
    title: "Visiting Point",
    platform: "Web",
    description:
      "Sistem informasi kunjungan dan monitoring lokasi sumber daya air.",
    url: "https://sda.pu.go.id/balai/bbwssumatera8/map/",
  },
  {
    id: 3,
    img: `${import.meta.env.BASE_URL}images/e-hidrologi.png`,
    title: "E-Hidrologi",
    platform: "Web",
    description:
      "Aplikasi pengelolaan dan monitoring data hidrologi wilayah sungai.",
    url: "https://bbwssumateraviii.co.id",
  },
  {
    id: 4,
    img: `${import.meta.env.BASE_URL}images/smart-bim.png`,
    title: "Smart Bim",
    platform: "Web",
    description:
      "Platform digital untuk memantau, mengelola, dan mengintegrasikan data Building Information Modelling (BIM) pada proyek-proyek infrastruktur di seluruh Indonesia.",
    url: "https://bim.pu.go.id/",
  },
];

const Application = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Banner */}
      <img
        className="w-full h-[50vh] md:h-[60vh] object-cover"
        src={bannerAplikasi}
        alt="Aplikasi Terkait"
      />

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-2">
            Daftar
          </p>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
            Aplikasi Terkait
          </h1>
          <div className="h-1 w-20 bg-indigo mx-auto mb-4"></div>
          <p className="text-gray-500 text-lg">
            Portal aplikasi & sistem informasi pendukung BBWS Sumatera VIII
          </p>
        </div>

        {/* Grid Aplikasi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {aplikasiTerkait.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block h-full"
            >
              <div className="flex flex-col items-center text-center p-8 border border-gray-100 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group relative h-full justify-between bg-white">
                {/* Badge Platform */}
                {item.platform && (
                  <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full">
                    {item.platform}
                  </span>
                )}

                <div className="flex flex-col items-center w-full">
                  {/* Visual Gambar apa adanya (tanpa rounded/crop) */}
                  <div className="mb-4 flex items-center justify-center">
                    {item.img ? (
                      <img
                        src={item.img}
                        alt={item.title}
                        className="max-h-24 w-auto object-contain"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-indigo-50 flex items-center justify-center">
                        <Globe className="w-7 h-7 text-indigo-600" />
                      </div>
                    )}
                  </div>

                  <h2 className="text-lg font-bold text-gray-800 group-hover:text-indigo transition-colors flex items-center gap-1">
                    {item.title}
                    <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-indigo" />
                  </h2>

                  <p className="text-sm text-gray-500 mt-2 leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Application;