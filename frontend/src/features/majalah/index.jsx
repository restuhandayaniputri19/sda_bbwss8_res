import { useEffect, useState } from "react";
import { getMajalah } from "../../services/majalah"; 
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "../../components/carousel";

const MajalahUser = () => {
  const [majalahData, setMajalahData] = useState([]);

  useEffect(() => {
    const fetchMajalah = async () => {
      try {
        const response = await getMajalah();
        if (response) setMajalahData(response.data);
      } catch (error) {
        console.error("Gagal ambil data majalah:", error);
      }
    };
    fetchMajalah();
  }, []);

  const truncateText = (text, length) => {
    return text?.length > length ? text.substring(0, length) + "..." : text;
  };

  return (
    <div className="p-10 min-h-screen bg-white">
      <div className="flex flex-col space-y-5 border border-indigo rounded-sm">
        <h1 className="text-2xl border-b border-b-indigo p-2 bg-indigo text-white font-bold">
          Majalah Digital
        </h1>
        {majalahData.length > 0 ? (
          <div className="p-4"> 
            <Carousel autoSlide={true} interval={3000} className="w-full">
              <CarouselContent className="-ml-1">
                {majalahData.map((item, index) => (
                  <CarouselItem key={index} className="pl-1 sm:basis-1/2 lg:basis-1/4 p-2">
                    <div 
                      className="flex flex-col bg-white rounded-sm shadow-lg cursor-pointer border border-gray-200"
                      onClick={() => { window.open(item.url, "_blank"); }}
                    >
                      <img src={item.thumbnail} alt={item.title} className="w-full h-64 object-cover rounded-t-sm" />
                      <div className="p-4 bg-indigo text-white">
                          <p className="font-semibold">{truncateText(item.title, 25)}</p>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </Carousel>
          </div>
        ) : (
          <p className="p-10 text-center text-gray-500">Memuat data majalah...</p>
        )}
      </div>
    </div>
  );
};

export default MajalahUser;