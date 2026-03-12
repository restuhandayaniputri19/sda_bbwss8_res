import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../components/carousel";

import Card from "../../components/card";
import CustomCarousel from "../../components/carousel/custom-carousel";
import { Hash } from "../../constants";
import SpatialMap from "../../components/spatial-map";
import WeatherForecast from "../../components/weather";
import { truncateText } from "../../utils/truncate-text";
import { useBannerData } from "./hooks/useBannerData";
import { useBeritaData } from "./hooks/useBeritaData";
import { useGaleriData } from "./hooks/useGaleriData";
import { useInfografisData } from "./hooks/useInfografisData";
import { useLayananTerpaduData } from "./hooks/useLayananTerpaduData";
import { useMajalahData } from "./hooks/useMajalahData";
import { useNavigate } from "react-router-dom";
import { usePengumumanData } from "./hooks/usePengumumanData";
import { usePetaGeospasialData } from "./hooks/usePetaGeospasialData";
import { useEffect, useRef, useState } from "react";
import { useYoutubeData } from "./hooks/useYoutubeData";
import "leaflet/dist/leaflet.css";
import RealTimeClock from "../../components/clock";
import { useBeritaDataHighlighted } from "./hooks/useBeritaDataHighlighted";

// ── Definisi section untuk nav dots ──────────────────────────────────────────
const SECTIONS = [
  { id: "hero",       label: "Hero / Banner" },
  { id: "pengumuman", label: "Pengumuman" },
  { id: "berita",     label: "Berita" },
  { id: "geoportal",  label: "Geoportal" },
  { id: "banner",     label: "Banner" },
  { id: "konten",     label: "Infografis & Galeri" },
  { id: "youtube",    label: "Youtube" },
];

// ── CSS scroll snap (inject sekali ke <head>) ─────────────────────────────────
const snapStyles = `
  html {
    scroll-snap-type: y proximity;
    overflow-y: scroll;
    scroll-behavior: smooth;
  }
  html::-webkit-scrollbar { width: 5px; }
  html::-webkit-scrollbar-thumb { background: #F5A623; border-radius: 99px; }

  .snap-section {
    scroll-snap-align: start;
    height: 100vh;
    width: 100%;
    overflow: hidden;
    position: relative;
  }

  .nav-dots {
    position: fixed; right: 18px; top: 50%;
    transform: translateY(-50%);
    z-index: 9999; display: flex; flex-direction: column; gap: 10px;
  }
  .nav-dot-btn {
    width: 11px; height: 11px; border-radius: 50%;
    border: 2px solid #CBD5E1; background: #fff;
    cursor: pointer; transition: all 0.25s; position: relative; padding: 0;
  }
  .nav-dot-btn:hover { background: #D4881A; border-color: #D4881A; transform: scale(1.25); }
  .nav-dot-btn.dot-active { background: #F5A623; border-color: #0B3D5E; transform: scale(1.3); }
  .nav-dot-btn .dot-tooltip {
    position: absolute; right: 20px; top: 50%; transform: translateY(-50%);
    background: #0B3D5E; color: #fff; font-size: 10px; font-weight: 700;
    padding: 3px 8px; border-radius: 4px; white-space: nowrap;
    opacity: 0; pointer-events: none; transition: opacity 0.2s; font-family: sans-serif;
  }
  .nav-dot-btn:hover .dot-tooltip { opacity: 1; }
`;

// ─────────────────────────────────────────────────────────────────────────────
const HomePage = () => {
  const navigate = useNavigate();

  // ── Semua hooks asli tetap utuh ──
  const { beritaData }                  = useBeritaData();
  const { beritaDataHighlighted }       = useBeritaDataHighlighted();
  const { banners }                     = useBannerData();
  const { infografisData }              = useInfografisData();
  const { layananTerpaduData: apiData }  = useLayananTerpaduData();
  const { galeriData }                  = useGaleriData();
  const { youtubeData }                 = useYoutubeData();
  const { majalahData }                 = useMajalahData();
  const { pengumumanData }              = usePengumumanData();
  const { petaGeospasialData }          = usePetaGeospasialData();

  const [fullScreenImage, setFullScreenImage] = useState(null);
  const [geoportalDialog, setGeoportalDialog] = useState(false);
  const [activeSection, setActiveSection]     = useState(0);

  const containerRef = useRef(null);
  const sectionRefs  = useRef([]);

  // ── Deteksi section aktif untuk nav dots ──
  useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const idx = sectionRefs.current.indexOf(entry.target);
          if (idx !== -1) setActiveSection(idx);
        }
      });
    },
    { root: null, threshold: 0.5 } // root: null = pakai viewport
  );
  sectionRefs.current.forEach((el) => el && observer.observe(el));
  return () => observer.disconnect();
}, []);
  const scrollToSection = (idx) => {
  sectionRefs.current[idx]?.scrollIntoView({ behavior: "smooth" });
};

  // ── Handler asli tetap utuh ──
  const handleImageClick      = (src) => setFullScreenImage(src);
  const handleFullScreenClose = ()    => setFullScreenImage(null);
  const handleDownload = (url) => {
    const link = document.createElement("a");
    link.href     = url;
    link.download = url.split("/").pop();
    link.target   = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ── Data statis layanan terpadu (dari kode aslimu) ──
  const layananTerpaduData = [
    { id: 1, img: "public/images/wrdc.png",           title: "WRDC",          url: "https://pdsda.sda.pu.go.id/" },
    { id: 2, img: "public/images/visiting-point.png", title: "Visiting Point", url: "https://sda.pu.go.id/balai/bbwssumatera8/map/" },
    { id: 3, img: "public/images/e-hidrologi.png",    title: "E-Hidrologi",   url: "https://bbwssumateraviii.co.id" },
  ];

  // ───────────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Inject CSS scroll snap */}
      <style dangerouslySetInnerHTML={{ __html: snapStyles }} />

      {/* ── Nav Dots kanan layar ── */}
      <div className="nav-dots">
        {SECTIONS.map((s, i) => (
          <button
            key={s.id}
            className={`nav-dot-btn ${activeSection === i ? "dot-active" : ""}`}
            onClick={() => scrollToSection(i)}
            aria-label={s.label}
          >
            <span className="dot-tooltip">{s.label}</span>
          </button>
        ))}
      </div>

      {/* ══════════════ SCROLL SNAP CONTAINER ══════════════ */}

        {/* ── SNAP 1/7 · HERO / BANNER UTAMA ── */}
        <section
          id="hero"
          className="snap-section"
          ref={(el) => (sectionRefs.current[0] = el)}
        >
          <div className="max-w-5xl mx-auto px-4 h-full flex items-center justify-center">
            {beritaDataHighlighted?.length > 0 ? (
              <Carousel autoSlide={true} interval={5000} className="w-full">
                <CarouselContent className="-ml-1">
                  {beritaDataHighlighted.map((item, index) => (
                    <CarouselItem key={index} className="pl-1 relative">
                      <Card
                        shadow={true}
                        rounded={true}
                        onClick={() => navigate(`/berita?id=${item.id}${Hash.DETAIL}`)}
                      >
                        <img
                          src={item.img}
                          alt={item.title}
                          className="w-full h-[85vh] object-cover"
                        />
                        <div className="absolute inset-0 flex flex-col justify-end">
                          <h1 className="min-w-96 w-fit text-xl text-white bg-indigo p-5 rounded-tr-md">
                            {truncateText(item.title, 60)}
                          </h1>
                        </div>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg hover:bg-gray-200 focus:outline-none" />
                <CarouselNext    className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg hover:bg-gray-200 focus:outline-none" />
              </Carousel>
            ) : (
              <p className="text-gray-400">No highlighted news available</p>
            )}
          </div>
        </section>

        {/* ── SNAP 2/7 · PENGUMUMAN ── */}
        <section
          id="pengumuman"
          className="snap-section flex flex-col"
          ref={(el) => (sectionRefs.current[1] = el)}
        >
          {/* Bar marquee asli */}
          <div className="bg-mango text-indigo hover:text-blue-950 py-1 shrink-0">
            <div className="flex flex-row items-center w-full overflow-hidden justify-between">
              <div className="flex flex-row gap-2 pl-6 pr-2 bg-mango z-10 text-sm">
                <RealTimeClock />
                <div className="border-l border-l-black" />
                <WeatherForecast />
              </div>
              <div className="flex space-x-6 animate-marquee whitespace-nowrap flex-grow">
                {pengumumanData.map((item) => (
                  <a
                    key={item.id}
                    href={item.url}
                    className="hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>{item.title}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Daftar pengumuman sebagai kartu */}
          <div className="flex-1 overflow-y-auto p-10">
            <h1 className="text-2xl text-indigo font-bold mb-6">PENGUMUMAN</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pengumumanData.map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block border border-indigo rounded-md p-4 hover:bg-indigo hover:text-white transition-colors duration-200"
                >
                  <p className="font-semibold text-sm line-clamp-3">{item.title}</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── SNAP 3/7 · BERITA ── */}
        <section
          id="berita"
          className="snap-section"
          ref={(el) => (sectionRefs.current[2] = el)}
        >
          <div className="p-10 space-y-8 h-full flex flex-col justify-center">
            <h1 className="text-2xl text-indigo font-bold">BERITA</h1>
            {beritaData !== undefined ? (
              <Carousel autoSlide={true} interval={3000} className="w-full">
                <CarouselContent className="-ml-1">
                  {beritaData.map((item, index) => (
                    <CarouselItem
                      key={index}
                      className="pl-1 md:basis-1/3 lg:basis-1/4 px-2 py-7"
                    >
                      <Card
                        shadow={true}
                        rounded={true}
                        onClick={() => navigate(`/berita?id=${item.id}${Hash.DETAIL}`)}
                        className="transition-transform transform hover:scale-105 hover:shadow-lg cursor-pointer rounded-md"
                      >
                        <img
                          src={item.img}
                          alt="photo"
                          className="w-full h-48 object-cover rounded-t-md"
                        />
                        <div className="p-4 space-y-2 h-36">
                          <h1 className="text-base text-indigo">
                            {truncateText(item.title, 45)}
                          </h1>
                          <div
                            className="text-sm text-gray-500"
                            dangerouslySetInnerHTML={{
                              __html: truncateText(item.description, 60),
                            }}
                          />
                        </div>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg hover:bg-gray-200 focus:outline-none" />
                <CarouselNext    className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg hover:bg-gray-200 focus:outline-none" />
              </Carousel>
            ) : null}
            <div className="flex justify-center">
              <a
                href="/berita"
                className="px-4 py-2 bg-indigo text-white rounded-md hover:bg-indigo-dark transition duration-300"
              >
                Lihat Semua Berita
              </a>
            </div>
          </div>
        </section>

        {/* ── SNAP 4/7 · GEOPORTAL ── */}
        <section
          id="geoportal"
          className="snap-section"
          ref={(el) => (sectionRefs.current[3] = el)}
        >
          <div className="p-10 h-full flex flex-col justify-center">
            <h1 className="text-2xl text-indigo font-bold mb-4">Geoportal</h1>
            <Carousel className="w-full">
              <CarouselContent className="-ml-1">
                {petaGeospasialData.map((item, index) => (
                  <CarouselItem
                    key={index}
                    className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4 px-2 py-7"
                  >
                    <div className="max-w-xs rounded-lg shadow-md border border-gray-300">
                      <div className="relative bg-gray-200 rounded-t-lg h-64">
                        <div className="absolute top-2 right-2 flex space-x-2 z-10">
                          <button className="bg-white p-1 rounded-full shadow-md">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 text-gray-600">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
                            </svg>
                          </button>
                          <button className="bg-white p-1 rounded-full shadow-md" onClick={() => handleDownload(item.url)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 text-gray-600">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
                            </svg>
                          </button>
                        </div>
                        <div onClick={() => setGeoportalDialog(item.url)}>
                          <SpatialMap
                            zipData={item.url}
                            width="300px" height="256px"
                            dragging={false} scrollWheelZoom={false}
                            doubleClickZoom={false} zoomControl={false}
                          />
                        </div>
                      </div>
                      <div className="p-4" onClick={() => setGeoportalDialog(item.url)}>
                        <p className="text-sm text-gray-500">{item.location}</p>
                        <p
                          className="text-lg font-semibold text-gray-900"
                          dangerouslySetInnerHTML={{ __html: truncateText(item.title, 100) }}
                        />
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg hover:bg-gray-200 focus:outline-none" />
              <CarouselNext    className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg hover:bg-gray-200 focus:outline-none" />
            </Carousel>
          </div>
        </section>

        {/* ── SNAP 5/7 · BANNER (CustomCarousel) ── */}
        <section
          id="banner"
          className="snap-section"
          ref={(el) => (sectionRefs.current[4] = el)}
        >
          <div className="p-10 h-full flex items-center justify-center">
            {banners !== undefined ? <CustomCarousel items={banners} /> : null}
          </div>
        </section>

        {/* ── SNAP 6/7 · INFOGRAFIS + GALERI + LAYANAN TERPADU ── */}
        <section
          id="konten"
          className="snap-section"
          ref={(el) => (sectionRefs.current[5] = el)}
        >
          <div className="grid grid-cols-12 gap-4 p-10 h-full">
            {/* Infografis */}
            <div className="col-span-12 md:col-span-4 flex flex-col border border-indigo rounded-sm">
              <h1 className="text-2xl border-b border-b-indigo p-2 bg-indigo text-white">Infografis</h1>
              {infografisData !== undefined && infografisData.length > 0 ? (
                <Carousel autoSlide={true} interval={3000} className="relative w-full h-full overflow-hidden">
                  <CarouselContent className="flex transition-transform">
                    {infografisData.map((item, index) => (
                      <CarouselItem key={index} className="flex-shrink-0 w-full">
                        <div
                          className="flex flex-col justify-center items-center bg-white h-full"
                          onClick={() => handleImageClick(item.url)}
                        >
                          <img src={item.url} alt="Infografis" className="rounded-sm w-full h-[400px] object-contain" />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg hover:bg-gray-200 focus:outline-none" />
                  <CarouselNext    className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg hover:bg-gray-200 focus:outline-none" />
                </Carousel>
              ) : null}
            </div>

            {/* Galeri + Layanan Terpadu */}
            <div className="col-span-12 md:col-span-8 grid gap-4">
              {/* Galeri */}
              <div className="flex flex-col border border-indigo rounded-sm">
                <h1 className="text-2xl border-b border-b-indigo p-2 bg-indigo text-white">Galeri Infrastruktur</h1>
                {galeriData !== undefined ? (
                  <Carousel autoSlide={true} interval={3000} className="flex items-center w-full h-full overflow-hidden">
                    <CarouselContent>
                      {galeriData.map((item, index) => (
                        <CarouselItem key={index} className="pl-1 sm:basis-1/2 lg:basis-1/4 p-2">
                          <div
                            className="flex flex-col justify-center items-center bg-white rounded-sm shadow-lg"
                            onClick={() => handleImageClick(item.url)}
                          >
                            <img src={item.url} alt="Galeri" className="object-cover rounded-sm w-full h-36" />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg hover:bg-gray-200 focus:outline-none" />
                    <CarouselNext    className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg hover:bg-gray-200 focus:outline-none" />
                  </Carousel>
                ) : null}
              </div>

              {/* Layanan Terpadu */}
              <div className="flex flex-col space-y-5 border border-indigo rounded-sm">
                <h1 className="text-2xl border-b border-b-indigo p-2 bg-indigo text-white">Layanan Terpadu</h1>
                <Carousel className="w-full">
                  <CarouselContent className="-ml-1">
                    {layananTerpaduData.map((item, index) => (
                      <CarouselItem key={index} className="pl-1 sm:basis-1/2 lg:basis-1/3 p-2">
                        <a href={item.url} target="_blank" rel="noopener noreferrer">
                          <div className="flex flex-col bg-white rounded-md shadow-md border border-gray-300">
                            <div className="w-full h-36 bg-gray-200">
                              <img src={item.img} alt={item.title} className="w-full h-full object-contain" />
                            </div>
                            <div className="p-3 bg-indigo text-center">
                              <span className="text-white font-bold block uppercase text-sm">{item.title}</span>
                            </div>
                          </div>
                        </a>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg hover:bg-gray-200 focus:outline-none" />
                  <CarouselNext    className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg hover:bg-gray-200 focus:outline-none" />
                </Carousel>
              </div>
            </div>
          </div>
        </section>

        {/* ── SNAP 7/7 · YOUTUBE ── */}
        <section
           id="youtube"
           className="min-h-screen w-full relative"
           ref={(el) => (sectionRefs.current[6] = el)}
        >
          <div className="p-10 h-full flex flex-col justify-center">
            <div className="flex flex-col space-y-5 border border-indigo rounded-sm">
              <h1 className="text-2xl border-b border-b-indigo p-2 bg-indigo text-white">Youtube</h1>
              {youtubeData !== undefined ? (
                <Carousel className="w-full">
                  <CarouselContent className="-ml-1">
                    {youtubeData.map((item, index) => (
                      <CarouselItem key={index} className="pl-1 sm:basis-1/2 lg:basis-1/4 p-2">
                        <iframe
                          src={item.url}
                          className="w-full h-52"
                          allowFullScreen
                          loading="lazy"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg hover:bg-gray-200 focus:outline-none" />
                  <CarouselNext    className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg hover:bg-gray-200 focus:outline-none" />
                </Carousel>
              ) : null}
            </div>
          </div>
        </section>

      {/* ── Modal: Full Screen Image ── */}
      {fullScreenImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          onClick={handleFullScreenClose}
        >
          <img src={fullScreenImage} className="max-w-[800px] max-h-[900px] rounded-sm" alt="Full Screen" />
        </div>
      )}

      {/* ── Modal: Geoportal ── */}
      {geoportalDialog && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          onClick={() => setGeoportalDialog(null)}
        >
          <div className="flex w-full justify-center bg-white p-10 m-10 rounded-md">
            <SpatialMap zipData={geoportalDialog} />
          </div>
        </div>
      )}
    </>
  );
};

export default HomePage;
