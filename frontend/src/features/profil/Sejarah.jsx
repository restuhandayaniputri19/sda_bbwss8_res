import Card from "../../components/card";
import { Hash } from "../../constants";
import { truncateText } from "../../utils/truncate-text";
import { useBeritaData } from "../home/hooks/useBeritaData";
import { useNavigate } from "react-router-dom";
import TimelineItem from "./TimelineItem";

const timelineData = [
  { periode: "1976–1983", deskripsi: "Proyek Pembukaan Persawahan Pasang Surut (P4S) Sumatera Selatan." },
  { periode: "1984–1993", deskripsi: "Badan Pelaksana Proyek Pengairan Pasang Surut (P3S) Sumatera Selatan." },
  { periode: "1994–2001", deskripsi: "Proyek Pengembangan Daerah Rawa (P2DR) Sumatera Selatan." },
  { periode: "2002–2004", deskripsi: "Proyek Irigasi dan Rawa Andalan Sumatera Selatan." },
  { periode: "2005", deskripsi: "Satuan Kerja Sementara Irigasi dan Rawa Andalan (SKS IRA) Sumatera Selatan." },
  { periode: "2006", deskripsi: "Satuan Kerja Irigasi dan Rawa Sumatera Selatan (Satker IRA SS)." },
  { periode: "2007–2008", deskripsi: "Balai Wilayah Sungai Sumatera (BWSS) VIII." },
  { periode: "2009–Sekarang", deskripsi: "Balai Besar Wilayah Sungai Sumatera VIII resmi menjadi Balai Besar bertipe A." },
];

const Sejarah = () => {
  const navigate = useNavigate();
  const { beritaData } = useBeritaData();

  return (
    <div className="flex min-h-screen flex-col">
      <img
        className="w-full h-[400px] object-cover"
        src="https://mediabbwssviii.sgp1.cdn.digitaloceanspaces.com/image/WhatsApp%20Image%202024-10-25%20at%2015.09.11.jpeg"
        alt="Call center picture"
      />

      <section className="flex flex-col lg:flex-row p-10">
        <div className="flex flex-col lg:w-3/4 w-full gap-5 px-10 mb-10">
          <h1 className="text-2xl font-semibold">Sejarah</h1>
          <div className="border-t w-20 border-indigo" />

          <p className="text-base">
  Balai Besar Wilayah Sungai Sumatera VIII (BBWS Sumatera VIII) berdiri
  sejak tahun 1976 dan telah mengalami beberapa kali perubahan nama seiring
  perkembangan organisasi. Bermula dari proyek pengairan dan irigasi di
  Sumatera Selatan, hingga akhirnya pada tahun 2009 resmi menjadi Balai
  Besar bertipe A dengan cakupan wilayah kerja yang luas sebagai lumbung
  pangan dan energi nasional.
</p>

          {/* Timeline */}
          <div style={{ borderLeft: '3px solid #1a3a6b', paddingLeft: '24px' }}>
            {timelineData.map((item, index) => (
              <TimelineItem
                key={index}
                index={index}
                periode={item.periode}
                deskripsi={item.deskripsi}
              />
            ))}
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

export default Sejarah;