import Card from "../../components/card";
import { Hash } from "../../constants";
import { truncateText } from "../../utils/truncate-text";
import { useBeritaData } from "../home/hooks/useBeritaData";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import MapComponent from "../../components/locationMap";
import bannerKontak from "../../assets/7_3_11zon.webp";

const LokasiKantor = () => {
  const navigate = useNavigate();
  const { beritaData } = useBeritaData();

  return (
    <div className="flex min-h-screen flex-col">
      <img
        className="w-full h-[400px] object-cover"
        src={bannerKontak}
        alt="Call center picture"
      />

      <section className="flex flex-col lg:flex-row p-5 lg:p-10">
        <div className="flex flex-col lg:w-3/4 w-full gap-5 px-4 lg:px-10 mb-10">
          <h1 className="text-2xl font-semibold">Lokasi Kantor</h1>
          <div className="border-t w-20 border-indigo " />

          {/* Leaflet Map */}

          <div className="lg:block object-cover w-full h-[400px] md:h-[600px] lg:h-[800px]">
            <MapComponent className="rounded-lg shadow-md" />
          </div>
        </div>

        <div className="flex flex-col space-y-5 border border-indigo rounded-sm mx-auto lg:w-1/3 w-full h-fit">
          <h1 className="text-2xl border-b border-b-indigo p-2 bg-indigo text-white">
            Berita Terkini
          </h1>
          <div className="flex flex-col">
            {beritaData.map((item, index) => (
              <Card
                key={index}
                shadow={true}
                rounded={true}
                className="transition-transform transform hover:scale-95 hover:shadow-lg cursor-pointer"
                onClick={() => navigate(`/berita?id=${item.id}${Hash.DETAIL}`)}
              >
                <div className="flex p-2">
                  <img
                    src={item.img}
                    alt={"photo"}
                    className="h-36 w-36 object-cover"
                  />
                  <div className="p-4 space-y-2">
                    <h1 className="text-md text-indigo">
                      {truncateText(item.title, 100)}
                    </h1>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LokasiKantor;
