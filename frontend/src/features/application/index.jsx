import { Button } from "../../components/button";
import Card from "../../components/card";

const aplikasiTerkait = [
  { id: 1, img: "public/images/wrdc.png", title: "WRDC", platform: "Web", description: "Water Resources Data Center - Pusat data sumber daya air nasional.", url: "https://pdsda.sda.pu.go.id/" },
  { id: 2, img: "public/images/visiting-point.png", title: "Visiting Point", platform: "Web", description: "Sistem informasi kunjungan dan monitoring lokasi sumber daya air.", url: "https://sda.pu.go.id/balai/bbwssumatera8/map/" },
  { id: 3, img: "public/images/e-hidrologi.png", title: "E-Hidrologi", platform: "Web", description: "Aplikasi pengelolaan dan monitoring data hidrologi wilayah sungai.", url: "https://bbwssumateraviii.co.id" },
];

const Application = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <img
        className="w-full h-[50vh] md:h-[60vh] object-cover"
        src="https://mediabbwssviii.sgp1.cdn.digitaloceanspaces.com/image/WhatsApp%20Image%202024-10-25%20at%2015.11.43.jpeg"
        alt="Call center picture"
      />

      <section className="p-10">
        <h1 className="text-2xl text-indigo font-bold">APLIKASI</h1>
      </section>

      <section className="flex flex-col gap-10 px-20 pb-20">
        {aplikasiTerkait.map((item) => (
          <Card shadow={true} rounded={true} size="w-full" className="border" key={item.id}>
            <div className="flex flex-col md:flex-row md:space-x-4">
              <div className="md:w-1/2">
                <img src={item.img} alt="photo" className="w-full h-auto object-cover rounded-md" />
              </div>
              <div className="md:w-1/2 space-y-2 p-8">
                <h1 className="text-xl text-indigo font-bold">{item.title}</h1>
                <p className="font-semibold text-xs">{item.platform}</p>
                <p className="text-sm text-justify">{item.description}</p>
                <br />
                <div className="flex justify-end">
                  <Button
                    className="bg-indigo text-white rounded-lg px-6 py-3 hover:bg-indigo"
                    onClick={() => { window.open(item.url, "_blank"); }}
                  >
                    Kunjungi Website
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </section>
    </div>
  );
};

export default Application;