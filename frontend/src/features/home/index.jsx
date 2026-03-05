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
import { useState } from "react";
import { useYoutubeData } from "./hooks/useYoutubeData";
import "leaflet/dist/leaflet.css";
import RealTimeClock from "../../components/clock";
import { useBeritaDataHighlighted } from "./hooks/useBeritaDataHighlighted";

const HomePage = () => {
  const navigate = useNavigate();
  const { beritaData } = useBeritaData();
  const { beritaDataHighlighted } = useBeritaDataHighlighted();
  const { banners } = useBannerData();
  const { infografisData } = useInfografisData();
  const { layananTerpaduData: apiData } = useLayananTerpaduData();
  const { galeriData } = useGaleriData();
  const { youtubeData } = useYoutubeData();
  const { majalahData } = useMajalahData();
  const { pengumumanData } = usePengumumanData();
  const { petaGeospasialData } = usePetaGeospasialData();

  const [fullScreenImage, setFullScreenImage] = useState(null);
  const [geoportalDialog, setGeoportalDialog] = useState(false);

  const handleImageClick = (src) => {
    setFullScreenImage(src);
  };

  const handleFullScreenClose = () => {
    setFullScreenImage(null);
  };

  const handleDownload = (url) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = url.split("/").pop(); // Set filename from URL
    link.target = "_blank"; // Ensure it opens in a new tab
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Clean up the link
  };

 const layananTerpaduData = [
  {
    id: 1,
    img: "public/images/wrdc.png",
    title: "WRDC",
    url: "https://pdsda.sda.pu.go.id/",
  },
  {
    id: 2,
    img: "public/images/visiting-point.png",
    title: "Visiting Point",
    url: "https://sda.pu.go.id/balai/bbwssumatera8/map/",
  },
  {
    id: 3,
    img: "public/images/e-hidrologi.png",
    title: "E-Hidrologi",
    url: "https://bbwssumateraviii.co.id",
  },
];

  return (
    <div className="flex min-h-screen flex-col">
      <section className="max-w-5xl mx-auto px-4">
        {beritaDataHighlighted?.length > 0 ? (
          <Carousel autoSlide={true} interval={5000} className="w-sm">
            <CarouselContent className="-ml-1">
              {beritaDataHighlighted.map((item, index) => (
                <CarouselItem key={index} className="pl-1 relative">
                  <Card
                    shadow={true}
                    rounded={true}
                    onClick={() =>
                      navigate(`/berita?id=${item.id}${Hash.DETAIL}`)
                    }
                  >
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-sm h-[600px] object-cover"
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
            <CarouselNext className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg hover:bg-gray-200 focus:outline-none" />
          </Carousel>
        ) : (
          "No highlighted news available"
        )}
      </section>

      <section className="bg-mango text-indigo hover:text-blue-950 py-1">
        <div className="flex flex-row items-center w-full overflow-hidden justify-between">
          {/* RealTimeClock component */}

          <div className="flex flex-row gap-2 pl-6 pr-2 bg-mango z-10 text-sm">
            <RealTimeClock />
            <div className="border-l border-l-black"></div>
            <WeatherForecast />
          </div>

          {/* Marquee section */}
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
      </section>

      <section className="p-10 space-y-8">
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
                    onClick={() =>
                      navigate(`/berita?id=${item.id}${Hash.DETAIL}`)
                    }
                    className="transition-transform transform hover:scale-105 hover:shadow-lg cursor-pointer rounded-md"
                  >
                    <img
                      src={item.img}
                      alt={"photo"}
                      className="w-full h-80 object-cover rounded-t-md"
                    />
                    <div className="p-4 space-y-2 h-48">
                      <h1 className="text-xl text-indigo">
                        {truncateText(item.title, 45)}
                      </h1>
                      <div
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
            <CarouselNext className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg hover:bg-gray-200 focus:outline-none" />
          </Carousel>
        ) : (
          ""
        )}
        <div className="flex justify-center mt-4">
          <a
            href="/berita"
            className="px-4 py-2 bg-indigo text-white rounded-md hover:bg-indigo-dark transition duration-300"
          >
            Lihat Semua Berita
          </a>
        </div>
      </section>

      <section className="p-10">
        <h1 className="text-2xl text-indigo font-bold">Geoportal</h1>
        <Carousel className="w-full">
          <CarouselContent className="-ml-1">
            {petaGeospasialData.map((item, index) => (
              <CarouselItem
                key={index}
                className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4 px-2 py-7"
              >
                <div className="max-w-xs rounded-lg shadow-md border border-gray-300">
                  {/* Card Header */}
                  <div className="relative bg-gray-200 rounded-t-lg h-64">
                    {/* Icon Buttons (example placeholders) */}
                    <div className="absolute top-2 right-2 flex space-x-2 z-10">
                      {/* Info Button */}
                      <button className="bg-white p-1 rounded-full shadow-md">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="w-4 h-4 text-gray-600"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
                          />
                        </svg>
                      </button>
                      {/* Download Button */}
                      <button
                        className="bg-white p-1 rounded-full shadow-md"
                        onClick={() => handleDownload(item.url)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="w-4 h-4 text-gray-600"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
                          />
                        </svg>
                      </button>
                    </div>
                    <div onClick={() => setGeoportalDialog(item.url)}>
                      <SpatialMap
                        zipData={item.url}
                        width="300px"
                        height="256px"
                        dragging={false} // Disable dragging
                        scrollWheelZoom={false} // Disable scroll wheel zoom
                        doubleClickZoom={false} // Disable double-click zoom
                        zoomControl={false} // Hide zoom control buttons
                      />
                    </div>
                  </div>

                  {/* Card Body */}
                  <div
                    className="p-4"
                    onClick={() => setGeoportalDialog(item.url)}
                  >
                    <p className="text-sm text-gray-500">{item.location}</p>
                    <p
                      className="text-lg font-semibold text-gray-900"
                      dangerouslySetInnerHTML={{
                        __html: truncateText(item.title, 100),
                      }}
                    ></p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg hover:bg-gray-200 focus:outline-none" />
          <CarouselNext className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg hover:bg-gray-200 focus:outline-none" />
        </Carousel>
      </section>

      <section className="p-10">
        {banners !== undefined ? <CustomCarousel items={banners} /> : ""}
      </section>

      <section className="grid grid-cols-12 gap-4 p-10">
        <div className="col-span-12 md:col-span-4 flex flex-col border border-indigo rounded-sm">
          <h1 className="text-2xl border-b border-b-indigo p-2 bg-indigo text-white">
            Infografis
          </h1>
          {infografisData !== undefined && infografisData.length > 0 ? (
            <Carousel
              autoSlide={true}
              interval={3000}
              className="relative w-full h-full overflow-hidden"
            >
              <CarouselContent className="flex transition-transform">
                {infografisData.map((item, index) => (
                  <CarouselItem key={index} className="flex-shrink-0 w-full">
                    <div
                      className="flex flex-col justify-center items-center bg-white h-full"
                      onClick={() => handleImageClick(item.url)}
                    >
                      <img
                        src={item.url}
                        alt="Image"
                        className="rounded-sm w-full h-[530px] object-contain"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg hover:bg-gray-200 focus:outline-none" />
              <CarouselNext className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg hover:bg-gray-200 focus:outline-none" />
            </Carousel>
          ) : (
            ""
          )}
        </div>

        <div className="col-span-12 md:col-span-8 grid gap-4">
          <div className="flex flex-col border border-indigo rounded-sm">
            <h1 className="text-2xl border-b border-b-indigo p-2 bg-indigo text-white">
              Galeri Infrastruktur
            </h1>
            {galeriData !== undefined ? (
              <Carousel
                autoSlide={true}
                interval={3000}
                className="flex items-center w-full h-full overflow-hidden"
              >
                <CarouselContent>
                  {galeriData.map((item, index) => (
                    <CarouselItem
                      key={index}
                      className="pl-1 sm:basis-1/2  lg:basis-1/4 p-2"
                    >
                      <div
                        className="flex flex-col justify-center items-center bg-white rounded-sm shadow-lg"
                        onClick={() => handleImageClick(item.url)}
                      >
                        <img
                          src={item.url}
                          alt="Image"
                          className="object-cover rounded-sm w-full h-48"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg hover:bg-gray-200 focus:outline-none" />
                <CarouselNext className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg hover:bg-gray-200 focus:outline-none" />
              </Carousel>
            ) : (
              ""
            )}
          </div>

          <div className="flex flex-col space-y-5 border border-indigo rounded-sm">
            <h1 className="text-2xl border-b border-b-indigo p-2 bg-indigo text-white">
              Layanan Terpadu
            </h1>
            {layananTerpaduData !== undefined ? (
              <Carousel className="w-full">
                <CarouselContent className="-ml-1">
                  {layananTerpaduData?.map((item, index) => (
  <CarouselItem key={index} className="pl-1 sm:basis-1/2 lg:basis-1/3 p-2">
    <a href={item.url} target="_blank" rel="noopener noreferrer">
      <div className="flex flex-col bg-white rounded-md shadow-md border border-gray-300">
        <div className="w-full h-44 bg-gray-200">
          <img
            src={item.img}
            alt={item.title}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="p-3 bg-indigo text-center">
          <span className="text-white font-bold block uppercase text-sm">
            {item.title}
          </span>
        </div>
      </div>
    </a>
  </CarouselItem>
))}
                </CarouselContent>
                <CarouselPrevious className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg hover:bg-gray-200 focus:outline-none" />
                <CarouselNext className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg hover:bg-gray-200 focus:outline-none" />
              </Carousel>
            ) : (
              ""
            )}
          </div>
        </div>
      </section>

      <section className="p-10">
        <div className="flex flex-col space-y-5 border border-indigo rounded-sm">
          <h1 className="text-2xl border-b border-b-indigo p-2 bg-indigo text-white">
            Youtube
          </h1>
          {youtubeData !== undefined ? (
            <Carousel className="w-full">
              <CarouselContent className="-ml-1">
                {youtubeData.map((item, index) => (
                  <CarouselItem
                    key={index}
                    className="pl-1 sm:basis-1/2 lg:basis-1/4 p-2"
                  >
                    <iframe
                      src={item.url}
                      className="w-full h-60"
                      allowFullScreen
                      loading="lazy"
                      onClick={(e) => e.stopPropagation()} // Prevent the iframe click from triggering the modal
                    ></iframe>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg hover:bg-gray-200 focus:outline-none" />
              <CarouselNext className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg hover:bg-gray-200 focus:outline-none" />
            </Carousel>
          ) : (
            ""
          )}
        </div>
      </section>

      

      {fullScreenImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          onClick={handleFullScreenClose}
        >
          <img
            src={fullScreenImage}
            className="max-w-[800px] max-h-[900px] rounded-sm"
            alt="Full Screen"
          />
        </div>
      )}

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
    </div>
  );
};

export default HomePage;
