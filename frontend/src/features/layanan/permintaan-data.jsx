import { useState } from "react";
import { API2 } from "../../services";
import VerificationModal from "../../components/VerificationModal";

const initialFormState = {
  nama: "",
  instansi: "",
  jenisData: "",
  periodeDari: "",
  periodeSampai: "",
  email: "",
  telepon: "",
  tujuan: "",
  file: null,
};

const PermintaanDataPage = () => {
  // State untuk alur Verifikasi
  const [isVerified, setIsVerified] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [verifiedNumber, setVerifiedNumber] = useState("");

  // State untuk Data
  const [formData, setFormData] = useState(initialFormState);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Fungsi Ambil Riwayat (Hanya dipanggil setelah verified)
  const fetchHistory = async (noWa) => {
    setLoadingHistory(true);
    try {
      console.log("Mengambil riwayat untuk nomor:", noWa); // Debug log untuk memastikan nomor yang digunakan
      const response = await API2.get(`/permintaan_data?no_wa=${noWa}`);
      if (response.data.success) {
        setHistory(response.data.data);
      }
    } catch (error) {
      console.error("Gagal mengambil riwayat:", error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleVerificationSuccess = (noWa) => {
    setIsVerified(true);
    setVerifiedNumber(noWa);
    // Masukkan nomor ke form secara otomatis
    setFormData((prev) => ({ ...prev, telepon: noWa }));
    fetchHistory(noWa);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      dataToSend.append(key, formData[key]);
    });

    try {
      const response = await API2.post("/permintaan_data", dataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        alert("Permintaan berhasil dikirim!");
        setFormData({ ...initialFormState, telepon: verifiedNumber });
        fetchHistory(verifiedNumber);
      }
    } catch (error) {
      alert("Terjadi kesalahan saat mengirim permintaan.", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 bg-white">
      {/* Header Halaman */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
          Permintaan Data
        </h1>
        <div className="h-1 w-20 bg-blue-600 mx-auto mb-4"></div>
               <p className="text-gray-500 text-lg">
          Layanan permintaan data hidrologi, klimatologi, dan sumber daya air wilayah BBWS Sumatera VIII
        </p>
      </div>

      {!isVerified ? (
        /* --- STATE 1: PENGGUNA NON-VERIFIED --- */
        <div className="grid grid-cols-1 md:grid-cols-10 gap-8">
          <div className="md:col-span-7 flex flex-col border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-[#1e3a8a] py-4 px-6">
              <h2 className="text-xl font-bold text-white">Tentang Layanan</h2>
            </div>
            <div className="p-8 flex-grow bg-gray-50">
              <p className="text-gray-700 leading-relaxed mb-4 text-lg">
                Masyarakat, akademisi, dan instansi dapat mengajukan permohonan
                data. Setiap permohonan wajib disertai surat resmi dan tujuan
                penggunaan yang jelas.
              </p>
              <p className="text-[#1e3a8a] leading-relaxed font-bold text-lg">
                Data akan dikirimkan dalam waktu 5 - 10 hari kerja.
              </p>
            </div>
          </div>
          <div className="md:col-span-3 flex flex-col border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-[#ffbe0b] py-4 px-6 text-gray-900 font-bold text-lg">
              Cek Status
            </div>
            <div className="p-6 bg-gray-50 flex-grow">
              <p className="text-sm text-gray-500 mb-4">
                Lihat riwayat permohonan Anda.
              </p>
              <button
                onClick={() => setShowAuthModal(true)}
                className="w-full bg-blue-700 text-white font-bold py-2 rounded-md hover:bg-blue-800 transition"
              >
                Masuk ke Sistem
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* --- STATE 2: PENGGUNA VERIFIED --- */
        <div className="space-y-12">
          {/* Riwayat Permohonan */}
          <section className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-gray-100 py-3 px-6 border-b flex justify-between items-center">
              <h2 className="font-bold text-gray-700">
                Riwayat Anda: {verifiedNumber}
              </h2>
              <button
                onClick={() => setIsVerified(false)}
                className="text-xs text-red-600 hover:underline"
              >
                Ganti Nomor
              </button>
            </div>
            <div className="p-6 bg-white overflow-x-auto">
              {loadingHistory ? (
                <p>Memuat...</p>
              ) : history.length > 0 ? (
                <table className="w-full text-left text-sm min-w-[500px]">
                  <thead>
                    <tr className="border-b text-gray-400">
                      <th className="py-2">JENIS DATA</th>
                      <th className="py-2">PERIODE</th>
                      <th className="py-2 text-center">STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((item) => (
                      <tr key={item.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 font-bold uppercase">
                          {item.jenisData}
                        </td>
                        <td className="py-3 text-gray-600">
                          {item.periodeDari} - {item.periodeSampai}
                        </td>
                        <td className="py-3 text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                              item.status === "pending"
                                ? "bg-orange-100 text-orange-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-400 italic text-center py-4">
                  Belum ada data.
                </p>
              )}
            </div>
          </section>

          {/* Form Permintaan Data Baru */}
          <section className="border border-gray-200 rounded-xl overflow-hidden shadow-md">
            <div className="bg-[#1e3a8a] py-4 px-6 text-white font-bold uppercase tracking-widest">
              Form Permintaan Baru
            </div>
            <form className="p-8 bg-white space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Nama Lengkap:
                  </label>
                  <input
                    name="nama"
                    value={formData.nama}
                    onChange={handleChange}
                    type="text"
                    className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-600 outline-none"
                    required
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Instansi/Universitas:
                  </label>
                  <input
                    name="instansi"
                    value={formData.instansi}
                    onChange={handleChange}
                    type="text"
                    className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-600 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Jenis Data:
                  </label>
                  <select
                    name="jenisData"
                    value={formData.jenisData}
                    onChange={handleChange}
                    className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-600 bg-white outline-none"
                  >
                    <option value="">Pilih Jenis Data</option>
                    <option value="debit">Data Debit</option>
                    <option value="curahhujan">Data Curah Hujan</option>
                    <option value="kualitasair">Data Kualitas Air</option>
                  </select>
                </div>
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Dari:
                  </label>
                  <input
                    type="date"
                    name="periodeDari"
                    value={formData.periodeDari}
                    onChange={handleChange}
                    className="border border-gray-300 p-2 rounded outline-none"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Sampai:
                  </label>
                  <input
                    type="date"
                    name="periodeSampai"
                    value={formData.periodeSampai}
                    onChange={handleChange}
                    className="border border-gray-300 p-2 rounded outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Email:
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="border border-gray-300 p-2 rounded outline-none"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    No Telepon (Verified):
                  </label>
                  <input
                    type="tel"
                    name="telepon"
                    value={formData.telepon}
                    disabled
                    className="bg-gray-100 border border-gray-300 p-2 rounded cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Tujuan Penggunaan:
                </label>
                <textarea
                  name="tujuan"
                  value={formData.tujuan}
                  onChange={handleChange}
                  rows="4"
                  className="border border-gray-300 p-2 rounded outline-none"
                ></textarea>
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Upload Surat (PDF/JPG):
                </label>
                <input
                  name="file"
                  type="file"
                  onChange={handleChange}
                  className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 cursor-pointer"
                />
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-10 rounded shadow-lg transition-all"
                >
                  Kirim Permohonan
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {/* Modal Verifikasi */}
      <VerificationModal
        isOpen={showAuthModal}
        setIsOpen={setShowAuthModal}
        onSuccess={handleVerificationSuccess}
      />
    </div>
  );
};

export default PermintaanDataPage;
