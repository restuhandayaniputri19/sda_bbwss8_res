import { useBeritaData } from "../home/hooks/useBeritaData";
import { useNavigate } from "react-router-dom";
import Card from "../../components/card";
import { Hash } from "../../constants";
import { truncateText } from "../../utils/truncate-text";
import bendungPerjaya from "../../assets/11.png";
import wilayahKerja from "../../assets/1.jpeg";

const TentangKami = () => {
  const navigate = useNavigate();
  const { beritaData } = useBeritaData();

  return (
    <div className="flex min-h-screen flex-col">
      <img
  className="w-full object-contain"
  src={bendungPerjaya}
  alt="Bendung Perjaya D.I Komering"
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
              className="w-full object-contain"
              src={wilayahKerja}
              alt="Wilayah Kerja BBWSS8"
            />
          </div>
          <p className="text-base md:text-lg">
            <span className="font-semibold">
            Perubahan Jumlah Daerah Aliran Sungai MSBL.</span> 
          </p>
          <p className="text-base md:text-lg">
            A. Berdasarkan Permen PUPR Nomor 4 Tahun 2015 tentang kriteria dan penetapan Wilayah Sungai, WS MSBL terdiri dari 28 DAS dengan luas  86.116,02 km2 (RPSDA 2017).
          </p>
          <p className="text-base md:text-lg">
            B. Berdasarkan Kemenhut Nomor 150 Tahun 2025 tentang Penetapan Batas Daerah Aliran Sungai, WS MSBL terdiri dari 39 DAS dengan luas Wilayah Sungai 87.172,96 km2 dan Panjang Sungai 11.849,52 km (revisi RPSDA 2025).
          </p>
          <p className="text-base md:text-lg">
            <span className="font-semibold">
              Profil Wilayah Sungai (WS)
            </span>
          </p>
          <ul className="list-disc list-outside pl-5 space-y-2 text-base md:text-lg">
  <li><span className="font-semibold">Status WS:</span> WS Lintas Provinsi</li>
  <li><span className="font-semibold">Kode DAS:</span> 01.44.A2</li>
  <li><span className="font-semibold">Luas WS:</span> 87.172,96 km² (93,37% luas Provinsi Sumatera Selatan, 13,93% Provinsi Bengkulu, 6,27% Provinsi Jambi, 0,86% Provinsi Lampung)</li>
  <li><span className="font-semibold">Jumlah DAS:</span> 39 DAS </li>
  <li><span className="font-semibold">Wilayah Administrasi:</span> 17 Kabupaten/Kota di Provinsi Sumatera Selatan, 1 kabupaten di Provinsi Lampung, 4 kabupaten di Provinsi Jambi, dan 3 kabupaten di Provinsi Bengkulu</li>
  <li><span className="font-semibold">Jumlah penduduk:</span> 10.236.403 Jiwa (2024)</li>
  <li><span className="font-semibold">Kepadatan penduduk:</span> ± 358 jiwa/km²</li>
  <li><span className="font-semibold">Pertumbuhan Penduduk:</span> 2,78%</li>
  <li><span className="font-semibold">DAS-DAS Utama:</span> DAS Musi (62.404,58 km²/71,59%) dan DAS Banyuasin (13.548,63 km²/15,54%)</li>
  <li><span className="font-semibold">Panjang Sungai Utama:</span> S. Musi (752,15 km) dan S. Komering (381,96 km)</li>
</ul>
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