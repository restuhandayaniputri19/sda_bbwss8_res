import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, Globe } from "lucide-react";
import { useLayananTerpaduData } from "../../home/hooks/useLayananTerpaduData";
import {
  isLayananIcon,
  isLayananImageUrl,
  LAYANAN_COLOR_PALETTE,
  LAYANAN_ICON_MAP,
} from "./icons";

const LayananVisual = ({ item }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const Icon = item.icon || Globe;

  if (item.img && !imageFailed) {
    return (
      <img
        src={item.img}
        alt={item.label}
        onError={() => setImageFailed(true)}
        className="w-full h-full object-cover"
      />
    );
  }

  return <Icon className={`w-7 h-7 ${item.color}`} />;
};

const LayananTerpaduPage = () => {
  // Ambil data dinamis dari database backend via Hook
  const { layananTerpaduData, loading } = useLayananTerpaduData();

  // Gabungkan items fixed dengan item dari database
  const combinedLayananItems = useMemo(() => {
    if (!Array.isArray(layananTerpaduData)) return [];

    return layananTerpaduData
      .filter((item) => item.isVisible !== false)
      .map((item, index) => {
        const palette = LAYANAN_COLOR_PALETTE[index % LAYANAN_COLOR_PALETTE.length];
        const iconName = isLayananIcon(item.img) ? item.img : "Globe";

        return {
          id: item.id,
          to: item.url || "#",
          label: item.title,
          desc: item.description,
          platform: item.platform,
          img: isLayananImageUrl(item.img) ? item.img : null,
          icon: LAYANAN_ICON_MAP[iconName] || Globe,
          color: palette.color,
          bg: palette.background,
          isClickable: item.isClickable !== false,
        };
      });
  }, [layananTerpaduData]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 bg-white min-h-screen">
      {/* Header */}
      <div className="text-center mb-16">
        <p className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-2">
          Daftar
        </p>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
          Layanan Terpadu
        </h1>
        <div className="h-1 w-20 bg-indigo mx-auto mb-4"></div>
        <p className="text-gray-500 text-lg">
          Pelayanan publik & portal sistem informasi BBWS Sumatera VIII
        </p>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[...Array(3)].map((_, idx) => (
            <div
              key={idx}
              className="p-8 border border-gray-100 rounded-xl bg-gray-50 animate-pulse flex flex-col items-center h-48 justify-center"
            >
              <div className="w-16 h-16 rounded-full bg-gray-200 mb-4"></div>
              <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      )}

      {/* Grid Layanan dari database */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {combinedLayananItems.map((item, i) => {
          const isInternal = item.platform === "internal";
          const opensExternally = ["external", "android", "ios"].includes(item.platform);
          const isDownload = item.platform === "download";

          const cardContent = (
            <div className={`flex flex-col items-center text-center p-8 border border-gray-100 rounded-xl shadow-sm transition-all group relative h-full justify-between bg-white ${item.isClickable ? "hover:shadow-md hover:-translate-y-1" : ""}`}>
              {item.platform && (
                <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full">
                  {item.platform}
                </span>
              )}

              <div className="flex flex-col items-center">
                <div
                  className={`w-16 h-16 rounded-full ${
                    item.bg || "bg-indigo-50"
                  } flex items-center justify-center mb-4 overflow-hidden shadow-inner`}
                >
                  <LayananVisual item={item} />
                </div>

                <h2 className="text-lg font-bold text-gray-800 group-hover:text-indigo transition-colors flex items-center gap-1">
                  {item.label}
                  {item.isClickable && !isInternal && (
                    <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-indigo" />
                  )}
                </h2>

                <p className="text-sm text-gray-500 mt-2 leading-relaxed line-clamp-3">
                  {item.desc}
                </p>
              </div>
            </div>
          );

          if (!item.isClickable) {
            return (
              <div key={item.id || i} className="h-full">
                {cardContent}
              </div>
            );
          }

          if (isInternal) {
            return (
              <Link key={item.id || i} to={item.to} className="block h-full">
                {cardContent}
              </Link>
            );
          }

          if (opensExternally || item.platform === "deeplink" || isDownload) {
            return (
              <a
                key={item.id || i}
                href={item.to}
                target={item.platform === "deeplink" ? "_self" : "_blank"}
                rel={item.platform === "deeplink" ? undefined : "noopener noreferrer"}
                download={isDownload ? true : undefined}
                className="block h-full"
              >
                {cardContent}
              </a>
            );
          }

          return (
            <a key={item.id || i} href={item.to} target="_blank" rel="noopener noreferrer" className="block h-full">
              {cardContent}
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default LayananTerpaduPage;
