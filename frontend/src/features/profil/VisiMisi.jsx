import TimelineItem from "./TimelineItem";
import { useBeritaData } from "../home/hooks/useBeritaData";
import { useNavigate } from "react-router-dom";
import Card from "../../components/card";
import { Hash } from "../../constants";
import { truncateText } from "../../utils/truncate-text";

const misiData = [
  { periode: "01", deskripsi: "Konservasi sumber daya air secara konsisten dan berkelanjutan." },
  { periode: "02", deskripsi: "Pengendalian dan penanggulangan daya rusak air." },
  { periode: "03", deskripsi: "Pendayagunaan sumber daya air secara adil dan merata." },
  { periode: "04", deskripsi: "Pemberdayaan dan peningkatan peran masyarakat, swasta dan pemerintah." },
  { periode: "05", deskripsi: "Peningkatan ketersediaan dan keterbukaan data serta informasi sumber daya air." },
  { periode: "06", deskripsi: "Penyelenggaraan administrasi pemerintahan yang baik." },
];

const VisiMisi = () => {
  const navigate = useNavigate();
  const { beritaData } = useBeritaData();

  return (
    <div className="flex min-h-screen flex-col">
      <img
        className="w-full h-[50vh] md:h-[60vh] object-cover"
        src="https://mediabbwssviii.sgp1.cdn.digitaloceanspaces.com/image/WhatsApp%20Image%202024-10-25%20at%2015.09.11.jpeg"
        alt="Visi Misi picture"
      />

      <section className="flex flex-col lg:flex-row p-10">
        <div className="flex flex-col lg:w-3/4 w-full gap-5 px-10 mb-10">

          {/* Visi */}
          <h2 className="text-2xl font-semibold">Visi</h2>
          <div className="border-t w-20 border-indigo" />
          <div className="bg-indigo text-white rounded-md p-6">
            <p className="text-base md:text-lg leading-relaxed">
              Terwujudnya pengelolaan dan pendayagunaan sumber daya air secara
              adil, merata dan berkelanjutan, dan berperan aktif dalam upaya
              mewujudkan Sumatera Selatan sebagai Lumbung Pangan dalam rangka
              mendukung program ketahanan pangan nasional.
            </p>
          </div>

          {/* Misi */}
          <h2 className="text-2xl font-semibold mt-6">Misi</h2>
          <div className="border-t w-20 border-indigo" />
          <div style={{ borderLeft: '3px solid #1a3a6b', paddingLeft: '24px' }}>
            {misiData.map((item, index) => (
              <TimelineItem
                key={index}
                index={index}
                periode={item.periode}
                deskripsi={item.deskripsi}
              />
            ))}
          </div>

        </div>

        {/* Sidebar Berita */}
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

export default VisiMisi;