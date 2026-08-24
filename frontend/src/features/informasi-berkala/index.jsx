import { Link } from "react-router-dom";
import callCenter from "../../assets/CallCenter.png";

const InformasiBerkalaPage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <img
        className="w-full h-[400px] object-cover"
        src={callCenter}
        alt="Call center picture"
      />

      <section className="p-10">
        <h1 className="text-2xl text-indigo font-bold">Informasi Berkala</h1>
        <div className="flex flex-row justify-end items-center gap-4 mt-5">
          <div className="w-full max-w-md">
          </div>
          <div className="flex">
          </div>
        </div>
      </section>
      <section className="grid grid-cols-1 gap-10 px-20 pb-20">
        <table className="w-full table-auto border border-gray-300">
            <thead>
                <tr className="">
                    <th className="border border-gray-300 w-16 px-4 py-2 text-left">#</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Judul Informasi</th>
                    <th className="w-48 px-4 py-2 text-center">Jenis Media</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                <tr>
                    <td className="border border-gray-300 px-4 py-4 text-left font-bold" colSpan="3">Informasi Mengenai Balai Besar Wilayah Sungai Sumatera VIII</td>
                </tr>
                <tr>
                    <td className="border border-gray-300 px-4 py-4 text-left">-</td>
                    <td className="border border-gray-300 px-4 py-4 text-left">Alamat Lengkap</td>
                    <td className="border border-gray-300 px-4 py-4 text-center">
                        <Link to="/lokasi-kantor" className="text-blue-600 hover:underline">Link</Link>
                    </td>
                </tr>
                <tr>
                    <td className="border border-gray-300 px-4 py-4 text-left">-</td>
                    <td className="border border-gray-300 px-4 py-4 text-left">Struktur Organisasi</td>
                    <td className="border border-gray-300 px-4 py-4 text-center">
                        <Link to="/struktur-organisasi" className="text-blue-600 hover:underline">Link</Link>
                    </td>
                </tr>
                <tr>
                    <td className="border border-gray-300 px-4 py-4 text-left">-</td>
                    <td className="border border-gray-300 px-4 py-4 text-left">Tugas dan Fungsi</td>
                    <td className="border border-gray-300 px-4 py-4 text-center">
                        <Link to="/tugas-fungsi" className="text-blue-600 hover:underline">Link</Link>
                    </td>
                </tr>
                <tr>
                    <td className="border border-gray-300 px-4 py-4 text-left">-</td>
                    <td className="border border-gray-300 px-4 py-4 text-left">Informasi Balai</td>
                    <td className="border border-gray-300 px-4 py-4 text-center">
                        <Link to="/informasi-balai" className="text-blue-600 hover:underline">Link</Link>
                    </td>
                </tr>
                <tr>
                    <td className="border border-gray-300 px-4 py-4 text-left font-bold" colSpan="3"></td>
                </tr>
            </tbody>
        </table>
      </section>
    </div>
  );
};

export default InformasiBerkalaPage;