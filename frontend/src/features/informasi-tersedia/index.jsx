import { Link } from "react-router-dom";
import callCenter from "../../assets/CallCenter.png";

const data = [
  { judul: "Aset Sumber Daya Air", link: "/geoportal" },
  { judul: "Informasi Anggaran Direktorat Jenderal Sumber Daya Air", link: "/dipa" },
  { judul: "Profil Pimpinan Direktorat Jenderal Sumber Daya Air", link: "/profil-pejabat" },
  { judul: "Rencana Strategis Direktorat Jenderal Sumber Daya Air", link: "/publikasi" },
  { judul: "Kondisi Muka Air Waduk & Embung", link: "/prakiraan-cuaca" },
  { judul: "Pola Wilayah Sungai", link: "/pola-rpsda" },
  { judul: "Rencana PSDA Wilayah Sungai", link: "/rpsda" },
  { judul: "Disclosure Document - Food and Water Security Project Grant under the Grant Facility for Project Preparation", link: "/publikasi" },
];

const InformasiSetiapSaatPage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <img
        className="w-full h-[400px] object-cover"
        src={callCenter}
        alt="Call center picture"
      />

      <section className="p-10">
        <h1 className="text-2xl text-indigo font-bold">Informasi Tersedia Setiap Saat</h1>
      </section>

      <section className="grid grid-cols-1 gap-10 px-20 pb-20">
        <table className="w-full table-auto border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 w-16 px-4 py-2 text-left">#</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Judul Informasi</th>
              <th className="w-48 px-4 py-2 text-center">Jenis Media</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((item, index) => (
              <tr key={index}>
                <td className="border border-gray-300 px-4 py-4 text-left">-</td>
                <td className="border border-gray-300 px-4 py-4 text-left">{item.judul}</td>
                <td className="border border-gray-300 px-4 py-4 text-center">
                  <Link to={item.link} className="text-blue-600 hover:underline">
                    Link
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default InformasiSetiapSaatPage;