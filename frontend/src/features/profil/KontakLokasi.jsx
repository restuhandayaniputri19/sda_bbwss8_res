import Card from "../../components/card";
import { Hash } from "../../constants";
import { truncateText } from "../../utils/truncate-text";
import { useBeritaData } from "../home/hooks/useBeritaData";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import MapComponent from "../../components/locationMap";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaInstagram, FaYoutube, FaTiktok, FaWhatsapp, FaFacebook } from "react-icons/fa";

const infoKontak = [
  {
    id: "telepon",
    icon: <FaPhone className="text-2xl text-indigo" />,
    label: "TELEPON",
    title: "Hubungi Kami",
    lines: ["(0711) 123-456", "Senin – Jumat, 08.00 – 16.00 WIB"],
  },
  {
    id: "email",
    icon: <FaEnvelope className="text-2xl text-indigo" />,
    label: "EMAIL",
    title: "Kirim Pesan",
    lines: ["bbws.sumatera8@pu.go.id", "Respon dalam 1×24 jam kerja"],
  },
  {
    id: "alamat",
    icon: <FaMapMarkerAlt className="text-2xl text-indigo" />,
    label: "ALAMAT",
    title: "Kantor Kami",
    lines: [
      "Jl. Demang Lebar Daun No. 1",
      "Palembang, Sumatera Selatan 30137",
    ],
  },
];

const sosmedLinks = [
  {
    id: "whatsapp",
    icon: <FaWhatsapp className="text-2xl" />,
    label: "WhatsApp",
    handle: "+62 811-123-456",
    href: "https://wa.me/62811123456",
    bg: "bg-green-500",
    hoverBg: "hover:bg-green-600",
  },
  {
    id: "instagram",
    icon: <FaInstagram className="text-2xl" />,
    label: "Instagram",
    handle: "@bbws_sumatera8",
    href: "https://instagram.com/bbws_sumatera8",
    bg: "bg-pink-500",
    hoverBg: "hover:bg-pink-600",
  },
  {
    id: "youtube",
    icon: <FaYoutube className="text-2xl" />,
    label: "YouTube",
    handle: "BBWS Sumatera VIII",
    href: "https://youtube.com/@bbwssumatera8",
    bg: "bg-red-600",
    hoverBg: "hover:bg-red-700",
  },
  {
    id: "facebook",
    icon: <FaFacebook className="text-2xl" />,
    label: "Facebook",
    handle: "BBWS Sumatera VIII",
    href: "https://facebook.com/bbwssumatera8",
    bg: "bg-blue-600",
    hoverBg: "hover:bg-blue-700",
  },
  {
    id: "tiktok",
    icon: <FaTiktok className="text-2xl" />,
    label: "TikTok",
    handle: "@bbws_sumatera8",
    href: "https://tiktok.com/@bbws_sumatera8",
    bg: "bg-gray-900",
    hoverBg: "hover:bg-black",
  },
];

const KontakLokasi = () => {
  const navigate = useNavigate();
  const { beritaData } = useBeritaData();

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Banner */}
      <img
        className="w-full h-[400px] object-cover"
        src="https://mediabbwssviii.sgp1.cdn.digitaloceanspaces.com/image/WhatsApp%20Image%202024-10-25%20at%2015.07.39.jpeg"
        alt="Kontak & Lokasi"
      />

      <section className="flex flex-col lg:flex-row p-5 lg:p-10">
        {/* Konten Utama */}
        <div className="flex flex-col lg:w-3/4 w-full gap-10 px-4 lg:px-10 mb-10">

          {/* ── SECTION 1: INFO KONTAK ── */}
          <div>
            <h1 className="text-2xl font-semibold">Kontak & Lokasi</h1>
            <div className="border-t w-20 border-indigo mt-2 mb-6" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {infoKontak.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-3 p-5 border border-gray-200 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-indigo/10 border border-indigo/20">
                    {item.icon}
                  </div>
                  <span className="text-xs font-bold text-indigo tracking-widest uppercase">
                    {item.label}
                  </span>
                  <p className="font-semibold text-gray-800">{item.title}</p>
                  {item.lines.map((line, i) => (
                    <p key={i} className="text-sm text-gray-500">{line}</p>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* ── SECTION 2: MEDIA SOSIAL ── */}
          <div>
            <h2 className="text-xl font-semibold">Media Sosial</h2>
            <div className="border-t w-20 border-indigo mt-2 mb-6" />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {sosmedLinks.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex flex-col items-center gap-2 p-5 rounded-lg text-white ${item.bg} ${item.hoverBg} transition-all hover:-translate-y-1 hover:shadow-lg`}
                >
                  {item.icon}
                  <span className="text-sm font-bold">{item.label}</span>
                  <span className="text-xs opacity-80 text-center">{item.handle}</span>
                </a>
              ))}
            </div>
          </div>

          {/* ── SECTION 3: PETA LOKASI ── */}
          <div>
            <h2 className="text-xl font-semibold">Lokasi Kantor</h2>
            <div className="border-t w-20 border-indigo mt-2 mb-6" />

            <div className="w-full h-[400px] md:h-[600px] lg:h-[800px] rounded-lg overflow-hidden shadow-md">
              <MapComponent />
            </div>
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
                    alt="photo"
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

export default KontakLokasi;
