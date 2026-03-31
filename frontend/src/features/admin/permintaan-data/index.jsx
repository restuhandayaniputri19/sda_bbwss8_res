import { useEffect, useState } from "react";
import { API } from '../../../services';
import { Link } from "react-router-dom";

const getWaktuTunggu = (createdAt) => {
  const masuk = new Date(createdAt);
  const sekarang = new Date();
  const selisihMs = sekarang - masuk;

  const hari = Math.floor(selisihMs / (1000 * 60 * 60 * 24));
  const jam = Math.floor((selisihMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const menit = Math.floor((selisihMs % (1000 * 60 * 60)) / (1000 * 60));

  if (hari > 0) return `${hari} hari ${jam} jam`;
  if (jam > 0) return `${jam} jam ${menit} mnt`;
  return `${menit} menit yang lalu`;
};

const AdminPermintaan = () => {
  const [permintaan, setPermintaan] = useState([]);

  const fetchData = async (status) => {
    try {
      const response = await API.get(`/api/permintaan-data?status=${status}`);
      setPermintaan(response.data);
    } catch (err) {
      console.error("Gagal mengambil data", err);
    }
  };

  useEffect(() => {
    fetchData("semua"); // Default sort saat pertama buka
  }, []);

  // Contoh navigasi filter sederhana di atas tabel
  const [filterStatus, setFilterStatus] = useState("semua");

  const handleFilterChange = (status) => {
    setFilterStatus(status);
    fetchData(status); // Panggil fungsi fetch dengan parameter status
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Panel Admin Permintaan Data</h1>

        {/* Filter Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-lg">
          {["semua", "pending", "diproses", "selesai", "ditolak"].map((s) => (
            <button
              key={s}
              onClick={() => handleFilterChange(s)}
              className={`px-4 py-2 rounded-md text-sm capitalize transition ${
                filterStatus === s
                  ? "bg-white shadow-sm text-blue-600"
                  : "text-slate-500"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="table w-full bg-white text-left">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-4">Nama Pemohon</th>
              <th className="p-4">Instansi</th>
              <th className="p-4">Status</th>
              <th className="p-4">Tanggal Masuk</th>
              <th className="p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {permintaan.map((item) => {
                const durasi = getWaktuTunggu(item.createdAt);
                const isLama = new Date() - new Date(item.createdAt) > 3 * 24 * 60 * 60 * 1000; // > 3 hari
return (
    <tr key={item.id} className="border-b hover:bg-slate-50">
      <td className="p-4">{item.namaLengkap}</td>
      <td className="p-4">{item.instansi}</td>
      <td className="p-4">
        {/* Badge Status */}
        <span className={`badge ${item.status === 'pending' ? 'badge-warning' : 'badge-info'}`}>
          {item.status}
        </span>
      </td>
      <td className="p-4 text-sm">
        <div className="flex flex-col">
          <span className={isLama && item.status === 'pending' ? 'text-red-600 font-bold' : 'text-slate-600'}>
            {durasi}
          </span>
          <span className="text-xs text-slate-400">
            Masuk: {new Date(item.createdAt).toLocaleDateString('id-ID')}
          </span>
        </div>
      </td>
      <td className="p-4 text-center">
        <Link to={`${item.id}`} className="text-blue-600 hover:underline flex items-center justify-center gap-1">
          Detail
        </Link>
      </td>
    </tr>
  );
})}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPermintaan;
