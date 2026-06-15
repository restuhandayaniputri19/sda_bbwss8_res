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

const tanjak = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 620'>
  <g transform='translate(720,-30)' opacity='0.13'>
    <polygon points='360,520 0,520 360,20' fill='%238B1A1A'/>
    <g fill='%23C8A415' opacity='0.7'>
      <polygon points='0,520 40,520 20,480'/><polygon points='40,520 80,520 60,480'/>
      <polygon points='80,520 120,520 100,480'/><polygon points='120,520 160,520 140,480'/>
      <polygon points='160,520 200,520 180,480'/><polygon points='200,520 240,520 220,480'/>
      <polygon points='240,520 280,520 260,480'/><polygon points='280,520 320,520 300,480'/>
      <polygon points='320,520 360,520 340,480'/><polygon points='360,520 400,520 380,480'/>
      <polygon points='400,520 440,520 420,480'/><polygon points='440,520 480,520 460,480'/>
      <polygon points='480,520 520,520 500,480'/><polygon points='520,520 560,520 540,480'/>
      <polygon points='560,520 600,520 580,480'/><polygon points='600,520 640,520 620,480'/>
      <polygon points='640,520 680,520 660,480'/><polygon points='680,520 720,520 700,480'/>
      <rect x='300' y='120' width='14' height='14' transform='rotate(45 307 127)'/>
      <rect x='270' y='160' width='11' height='11' transform='rotate(45 275 165)'/>
      <rect x='330' y='160' width='11' height='11' transform='rotate(45 335 165)'/>
      <rect x='240' y='200' width='10' height='10' transform='rotate(45 245 205)'/>
      <rect x='300' y='200' width='10' height='10' transform='rotate(45 305 205)'/>
      <rect x='355' y='200' width='10' height='10' transform='rotate(45 360 205)'/>
      <rect x='200' y='240' width='9' height='9' transform='rotate(45 204 244)'/>
      <rect x='255' y='240' width='9' height='9' transform='rotate(45 259 244)'/>
      <rect x='310' y='240' width='9' height='9' transform='rotate(45 314 244)'/>
      <rect x='365' y='240' width='9' height='9' transform='rotate(45 369 244)'/>
      <rect x='160' y='280' width='9' height='9' transform='rotate(45 164 284)'/>
      <rect x='215' y='280' width='9' height='9' transform='rotate(45 219 284)'/>
      <rect x='270' y='280' width='9' height='9' transform='rotate(45 274 284)'/>
      <rect x='325' y='280' width='9' height='9' transform='rotate(45 329 284)'/>
      <rect x='380' y='280' width='9' height='9' transform='rotate(45 384 284)'/>
      <rect x='120' y='320' width='8' height='8' transform='rotate(45 124 324)'/>
      <rect x='175' y='320' width='8' height='8' transform='rotate(45 179 324)'/>
      <rect x='230' y='320' width='8' height='8' transform='rotate(45 234 324)'/>
      <rect x='285' y='320' width='8' height='8' transform='rotate(45 289 324)'/>
      <rect x='340' y='320' width='8' height='8' transform='rotate(45 344 324)'/>
      <rect x='395' y='320' width='8' height='8' transform='rotate(45 399 324)'/>
    </g>
    <line x1='0' y1='520' x2='360' y2='20' stroke='%23C8A415' stroke-width='3' opacity='0.6'/>
    <line x1='0' y1='480' x2='720' y2='480' stroke='%23C8A415' stroke-width='2' opacity='0.4'/>
    <g transform='translate(30,400)' fill='%23C8A415' opacity='0.7'>
      <circle cx='0' cy='0' r='8'/>
      <ellipse cx='0' cy='-14' rx='5' ry='9'/>
      <ellipse cx='0' cy='-14' rx='5' ry='9' transform='rotate(60)'/>
      <ellipse cx='0' cy='-14' rx='5' ry='9' transform='rotate(120)'/>
      <ellipse cx='0' cy='-14' rx='5' ry='9' transform='rotate(180)'/>
      <ellipse cx='0' cy='-14' rx='5' ry='9' transform='rotate(240)'/>
      <ellipse cx='0' cy='-14' rx='5' ry='9' transform='rotate(300)'/>
    </g>
    <g transform='translate(340,80)' fill='%23C8A415' opacity='0.7'>
      <circle cx='0' cy='0' r='10'/>
      <ellipse cx='0' cy='-18' rx='6' ry='11'/>
      <ellipse cx='0' cy='-18' rx='6' ry='11' transform='rotate(45)'/>
      <ellipse cx='0' cy='-18' rx='6' ry='11' transform='rotate(90)'/>
      <ellipse cx='0' cy='-18' rx='6' ry='11' transform='rotate(135)'/>
      <ellipse cx='0' cy='-18' rx='6' ry='11' transform='rotate(180)'/>
      <ellipse cx='0' cy='-18' rx='6' ry='11' transform='rotate(225)'/>
      <ellipse cx='0' cy='-18' rx='6' ry='11' transform='rotate(270)'/>
      <ellipse cx='0' cy='-18' rx='6' ry='11' transform='rotate(315)'/>
    </g>
  </g>
  <g opacity='0.06' fill='%238B1A1A'>
    <polygon points='0,620 60,620 30,580'/><polygon points='60,620 120,620 90,580'/>
    <polygon points='120,620 180,620 150,580'/><polygon points='180,620 240,620 210,580'/>
    <polygon points='240,620 300,620 270,580'/><polygon points='300,620 360,620 330,580'/>
    <polygon points='360,620 420,620 390,580'/><polygon points='420,620 480,620 450,580'/>
    <polygon points='480,620 540,620 510,580'/><polygon points='540,620 600,620 570,580'/>
    <polygon points='600,620 660,620 630,580'/><polygon points='660,620 720,620 690,580'/>
    <polygon points='720,620 780,620 750,580'/><polygon points='780,620 840,620 810,580'/>
    <polygon points='840,620 900,620 870,580'/><polygon points='900,620 960,620 930,580'/>
    <polygon points='960,620 1020,620 990,580'/><polygon points='1020,620 1080,620 1050,580'/>
    <polygon points='1080,620 1140,620 1110,580'/><polygon points='1140,620 1200,620 1170,580'/>
    <polygon points='1200,620 1260,620 1230,580'/><polygon points='1260,620 1320,620 1290,580'/>
    <polygon points='1320,620 1380,620 1350,580'/><polygon points='1380,620 1440,620 1410,580'/>
  </g>
</svg>`;

const Sejarah = () => {
  const navigate = useNavigate();
  const { beritaData } = useBeritaData();

  return (
    <div className="flex min-h-screen flex-col" style={{ position: "relative" }}>

  {/* Background tanjak */}
  <div style={{
    position: "absolute",
    inset: 0,
    zIndex: 0,
    pointerEvents: "none",
    overflow: "hidden",
  }}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 620" width="100%" height="100%" preserveAspectRatio="xMaxYMin slice">
      <g transform="translate(720,-30)" opacity="0.13">
        <polygon points="360,520 0,520 360,20" fill="#8B1A1A"/>
        <g fill="#C8A415" opacity="0.7">
          <polygon points="0,520 40,520 20,480"/><polygon points="40,520 80,520 60,480"/>
          <polygon points="80,520 120,520 100,480"/><polygon points="120,520 160,520 140,480"/>
          <polygon points="160,520 200,520 180,480"/><polygon points="200,520 240,520 220,480"/>
          <polygon points="240,520 280,520 260,480"/><polygon points="280,520 320,520 300,480"/>
          <polygon points="320,520 360,520 340,480"/><polygon points="360,520 400,520 380,480"/>
          <polygon points="400,520 440,520 420,480"/><polygon points="440,520 480,520 460,480"/>
          <polygon points="480,520 520,520 500,480"/><polygon points="520,520 560,520 540,480"/>
          <polygon points="560,520 600,520 580,480"/><polygon points="600,520 640,520 620,480"/>
          <polygon points="640,520 680,520 660,480"/><polygon points="680,520 720,520 700,480"/>
          <rect x="300" y="120" width="14" height="14" transform="rotate(45 307 127)"/>
          <rect x="270" y="160" width="11" height="11" transform="rotate(45 275 165)"/>
          <rect x="330" y="160" width="11" height="11" transform="rotate(45 335 165)"/>
          <rect x="240" y="200" width="10" height="10" transform="rotate(45 245 205)"/>
          <rect x="300" y="200" width="10" height="10" transform="rotate(45 305 205)"/>
          <rect x="355" y="200" width="10" height="10" transform="rotate(45 360 205)"/>
          <rect x="200" y="240" width="9" height="9" transform="rotate(45 204 244)"/>
          <rect x="255" y="240" width="9" height="9" transform="rotate(45 259 244)"/>
          <rect x="310" y="240" width="9" height="9" transform="rotate(45 314 244)"/>
          <rect x="365" y="240" width="9" height="9" transform="rotate(45 369 244)"/>
          <rect x="160" y="280" width="9" height="9" transform="rotate(45 164 284)"/>
          <rect x="215" y="280" width="9" height="9" transform="rotate(45 219 284)"/>
          <rect x="270" y="280" width="9" height="9" transform="rotate(45 274 284)"/>
          <rect x="325" y="280" width="9" height="9" transform="rotate(45 329 284)"/>
          <rect x="380" y="280" width="9" height="9" transform="rotate(45 384 284)"/>
        </g>
        <line x1="0" y1="520" x2="360" y2="20" stroke="#C8A415" strokeWidth="3" opacity="0.6"/>
        <line x1="0" y1="480" x2="720" y2="480" stroke="#C8A415" strokeWidth="2" opacity="0.4"/>
        <g transform="translate(340,80)" fill="#C8A415" opacity="0.8">
          <circle cx="0" cy="0" r="10"/>
          <ellipse cx="0" cy="-18" rx="6" ry="11"/>
          <ellipse cx="0" cy="-18" rx="6" ry="11" transform="rotate(45)"/>
          <ellipse cx="0" cy="-18" rx="6" ry="11" transform="rotate(90)"/>
          <ellipse cx="0" cy="-18" rx="6" ry="11" transform="rotate(135)"/>
          <ellipse cx="0" cy="-18" rx="6" ry="11" transform="rotate(180)"/>
          <ellipse cx="0" cy="-18" rx="6" ry="11" transform="rotate(225)"/>
          <ellipse cx="0" cy="-18" rx="6" ry="11" transform="rotate(270)"/>
          <ellipse cx="0" cy="-18" rx="6" ry="11" transform="rotate(315)"/>
        </g>
      </g>
      <g opacity="0.06" fill="#8B1A1A">
        <polygon points="0,620 60,620 30,580"/><polygon points="60,620 120,620 90,580"/>
        <polygon points="120,620 180,620 150,580"/><polygon points="180,620 240,620 210,580"/>
        <polygon points="240,620 300,620 270,580"/><polygon points="300,620 360,620 330,580"/>
        <polygon points="360,620 420,620 390,580"/><polygon points="420,620 480,620 450,580"/>
        <polygon points="480,620 540,620 510,580"/><polygon points="540,620 600,620 570,580"/>
        <polygon points="600,620 660,620 630,580"/><polygon points="660,620 720,620 690,580"/>
        <polygon points="720,620 780,620 750,580"/><polygon points="780,620 840,620 810,580"/>
        <polygon points="840,620 900,620 870,580"/><polygon points="900,620 960,620 930,580"/>
        <polygon points="960,620 1020,620 990,580"/><polygon points="1020,620 1080,620 1050,580"/>
        <polygon points="1080,620 1140,620 1110,580"/><polygon points="1140,620 1200,620 1170,580"/>
        <polygon points="1200,620 1260,620 1230,580"/><polygon points="1260,620 1320,620 1290,580"/>
        <polygon points="1320,620 1380,620 1350,580"/><polygon points="1380,620 1440,620 1410,580"/>
      </g>
    </svg>
  </div>
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