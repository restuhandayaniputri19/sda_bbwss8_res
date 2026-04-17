import { useBeritaData } from "../home/hooks/useBeritaData";
import { useNavigate } from "react-router-dom";
import Card from "../../components/card";
import { Hash } from "../../constants";
import { truncateText } from "../../utils/truncate-text";

const TentangKami = () => {
  const navigate = useNavigate();
  const { beritaData } = useBeritaData();

  return (
    <div className="flex min-h-screen flex-col">
      <img
        className="w-full h-[50vh] md:h-[60vh] object-cover"
        src="https://mediabbwssviii.sgp1.cdn.digitaloceanspaces.com/image/WhatsApp%20Image%202024-10-25%20at%2015.07.39.jpeg"
        alt="Call center picture"
      />

      <section className="flex flex-col lg:flex-row p-10">
        <div className="flex flex-col lg:w-3/4 w-full gap-5 px-10 mb-10">
          <h2 className="text-2xl md:text-3xl font-bold">TENTANG KAMI</h2>
          <div className="border-t w-20 border-indigo my-4" />
          <div className="space-y-3">
            <p className="text-base md:text-lg">
              <span className="font-semibold">
                Balai Besar Wilayah Sungai (BBWS) Sumatera VIII
              </span>{" "}
              adalah salah satu unit pelaksana teknis di bawah Kementerian
              Pekerjaan Umum (PU) Republik Indonesia, yang bertanggung jawab
              atas pengelolaan sumber daya air di wilayah Sungai yang berada
              di wilayah Provinsi Sumatera bagian Selatan.
            </p>
            <p className="text-base md:text-lg">
              Secara spesifik, tugas utama dari BBWS Sumatera VIII adalah
              merencanakan, melaksanakan, dan mengawasi pembangunan serta
              pengelolaan infrastruktur sumber daya air, seperti bendungan,
              irigasi, pengendalian banjir, dan sistem drainase, serta menjaga
              kelestarian lingkungan perairan di wilayah tersebut.
            </p>
            <p className="text-base md:text-lg">
              BBWS Sumatera VIII juga memiliki peran penting dalam koordinasi
              pengelolaan wilayah sungai, mitigasi bencana terkait air (seperti
              banjir dan kekeringan), serta mendukung keberlanjutan pemanfaatan
              air untuk berbagai kebutuhan, termasuk pertanian, industri, dan
              kebutuhan domestik.
            </p>
            <p className="text-base md:text-lg">
              Tujuan utama dari BBWS ini adalah untuk mewujudkan pengelolaan
              sungai yang berkelanjutan dan mendukung kesejahteraan masyarakat
              yang bergantung pada sumber daya air.
            </p>
          </div>
          <div className="mt-4">
            <img
              className="w-full h-[300px] md:h-[400px] rounded-md shadow-md object-cover"
              src="https://mediabbwssviii.sgp1.cdn.digitaloceanspaces.com/image/WhatsApp%20Image%202024-10-25%20at%2015.11.43.jpeg"
              alt="River infrastructure"
            />
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

export default TentangKami;