import { useState, useEffect } from "react";
import { API2 } from "../../services";
import VerificationForm from "../../components/VerificationForm";
import heroImage from "../../assets/pengaduanmasyarakat.jpeg";

const initialFormState = {
  nama: "",
  telepon: "",
  email: "",
  kategori: "",
  lokasi: "",
  deskripsi: "",
  file: null,
};

const PengaduanMasyarakat = () => {
  // State Verifikasi WA
  const [isVerified, setIsVerified] = useState(false);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [verifiedNumber, setVerifiedNumber] = useState("");

  // State Data & Form
  const [formData, setFormData] = useState(initialFormState);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Cek Sesi Verifikasi saat Komponen Dimuat
  useEffect(() => {
    const expiry = localStorage.getItem("verified_until");
    const savedNumber = localStorage.getItem("verified_number");

    if (expiry && savedNumber) {
      if (new Date().getTime() > parseInt(expiry)) {
        localStorage.removeItem("verified_until");
        localStorage.removeItem("verified_number");
        setIsVerified(false);
      } else {
        setVerifiedNumber(savedNumber);
        setIsVerified(true);
        fetchHistory(savedNumber);
      }
    }
  }, []);

  // Ambil Riwayat Pengaduan dari Server
  const fetchHistory = async (noWa) => {
    setLoadingHistory(true);
    try {
      const response = await API2.get(`/pengaduan-masyarakat`, {
        params: { no_wa: noWa },
      });
      if (response.data?.success) {
        setHistory(response.data.data);
      }
    } catch (error) {
      console.error("Gagal mengambil riwayat pengaduan:", error);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Handler Verifikasi Berhasil
  const handleVerificationSuccess = (noWa) => {
    setIsVerified(true);
    setVerifiedNumber(noWa);
    setFormData((prev) => ({ ...prev, telepon: noWa }));
    fetchHistory(noWa);
  };

  // Handler Input Form
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
      telepon: name === "telepon" ? verifiedNumber : prev.telepon,
    }));
  };

  // Handler Submit Pengaduan
  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataForBackend = {
      namaPelapor: formData.nama,
      noWa: verifiedNumber,
      email: formData.email,
      kategori: formData.kategori,
      lokasi: formData.lokasi,
      deskripsi: formData.deskripsi,
      fileLampiran: formData.file,
    };

    try {
      const response = await API2.post("/pengaduan-masyarakat", dataForBackend);

      if (response.status === 201 || response.data?.success) {
        alert("Pengaduan berhasil dikirim! Kami akan menindaklanjuti dalam 5 hari kerja.");
        setFormData({ ...initialFormState, telepon: verifiedNumber });
        fetchHistory(verifiedNumber);
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Terjadi kesalahan saat mengirim pengaduan.";
      console.error("Detail Error:", error);
      alert(msg);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 bg-white">
      {/* Header Halaman */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
          Pengaduan Masyarakat
        </h1>
        <div className="h-1 w-20 bg-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-500 text-lg">
          Sampaikan pengaduan Anda terkait pengelolaan sumber daya air, irigasi, serta prasarana pengairan di wilayah BWS Sumatera VIII.
        </p>
        <img
          src={heroImage}
          alt="Alur Prosedur Pengaduan"
          className="mx-auto mt-6 w-full h-auto block rounded-xl"
        />
      </div>

      {!isVerified ? (
        /* --- STATE 1: PENGGUNA NON-VERIFIED --- */
        <div className="grid grid-cols-1 md:grid-cols-10 gap-8">
          <div className="md:col-span-7 flex flex-col border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-[#1e3a8a] py-4 px-6">
              <h2 className="text-xl font-bold text-white">Tentang Layanan Pengaduan</h2>
            </div>
            <div className="p-8 flex-grow bg-gray-50">
              <p className="text-gray-700 leading-relaxed mb-4 text-lg">
                Masyarakat dapat menyampaikan keluhan, laporan kerusakan prasarana, atau pengaduan terkait pengelolaan sumber daya air secara transparan.
              </p>
              <p className="text-[#1e3a8a] leading-relaxed font-bold text-lg">
                Setiap laporan akan ditindaklanjuti dalam waktu 5 hari kerja.
              </p>
            </div>
          </div>

          <div className="md:col-span-3 flex flex-col border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-[#ffbe0b] py-4 px-6 text-gray-900 font-bold text-lg">
              Pengaduan & Cek Status
            </div>
            <div className="p-6 bg-gray-50 flex-grow">
              {!showAuthForm ? (
                <div className="w-full">
                  <p className="mb-6 text-gray-600">
                    Untuk mengajukan pengaduan dan memantau status laporan, silakan lakukan verifikasi nomor WhatsApp.
                  </p>
                  <button
                    onClick={() => setShowAuthForm(true)}
                    className="w-full bg-blue-700 text-white font-bold py-2 rounded-md hover:bg-blue-800 transition text-sm"
                  >
                    Masukkan Nomor WA
                  </button>
                </div>
              ) : (
                <VerificationForm
                  onSuccess={handleVerificationSuccess}
                  onCancel={() => setShowAuthForm(false)}
                />
              )}
            </div>
          </div>
        </div>
      ) : (
        /* --- STATE 2: PENGGUNA VERIFIED --- */
        <div className="space-y-12">
          {/* Riwayat Pengaduan */}
          <section className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-gray-100 py-3 px-6 border-b flex justify-between items-center">
              <h2 className="font-bold text-gray-700">
                Riwayat Pengaduan Anda: {verifiedNumber}
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
                <p className="text-gray-500">Memuat riwayat...</p>
              ) : history.length > 0 ? (
                <table className="w-full text-left text-sm min-w-[500px]">
                  <thead>
                    <tr className="border-b text-gray-400">
                      <th className="py-2">KATEGORI</th>
                      <th className="py-2">LOKASI</th>
                      <th className="py-2">DESKRIPSI</th>
                      <th className="py-2 text-center">STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((item) => (
                      <tr key={item.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 font-bold uppercase">{item.kategori}</td>
                        <td className="py-3 text-gray-600">{item.lokasi}</td>
                        <td className="py-3 text-gray-600 truncate max-w-xs">{item.deskripsi}</td>
                        <td className="py-3 text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                              item.status === "proses"
                                ? "bg-orange-100 text-orange-700"
                                : item.status === "selesai"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {item.status || "Pending"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-400 italic text-center py-4">
                  Belum ada riwayat pengaduan.
                </p>
              )}
            </div>
          </section>

          {/* Form Pengaduan Baru */}
          <section className="border border-gray-200 rounded-xl overflow-hidden shadow-md">
            <div className="bg-[#1e3a8a] py-4 px-6 text-white font-bold uppercase tracking-widest">
              Form Buat Pengaduan Baru
            </div>
            <form className="p-8 bg-white space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Nama Pelapor <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="nama"
                    value={formData.nama}
                    onChange={handleChange}
                    type="text"
                    placeholder="Nama lengkap Anda"
                    className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-600 outline-none text-sm"
                    required
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    No Telepon (Verified)
                  </label>
                  <input
                    type="tel"
                    name="telepon"
                    value={formData.telepon}
                    disabled
                    className="bg-gray-100 border border-gray-300 p-2 rounded cursor-not-allowed text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Email <span className="text-gray-400 font-normal">(opsional)</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@contoh.com"
                    className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-600 outline-none text-sm"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Kategori Pengaduan <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="kategori"
                    value={formData.kategori}
                    onChange={handleChange}
                    required
                    className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-600 bg-white outline-none text-sm"
                  >
                    <option value="">Pilih Kategori</option>
                    <option value="banjir">Banjir</option>
                    <option value="infrastruktur">Kerusakan Infrastruktur</option>
                    <option value="perizinan">Perizinan</option>
                    <option value="lainnya">Lainnya</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Lokasi Kejadian <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lokasi"
                  value={formData.lokasi}
                  onChange={handleChange}
                  required
                  placeholder="Alamat / nama lokasi kejadian"
                  className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-600 outline-none text-sm"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Deskripsi Pengaduan Lengkap <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="deskripsi"
                  value={formData.deskripsi}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Jelaskan pengaduan Anda secara detail..."
                  className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-600 outline-none text-sm resize-none"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Upload Foto / Dokumen Pendukung
                </label>
                <input
                  name="file"
                  type="file"
                  onChange={handleChange}
                  accept="image/*,.pdf,.doc,.docx"
                  className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 cursor-pointer"
                />
                <p className="text-xs text-gray-400">Format: JPG, PNG, PDF (Maks. 5MB)</p>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-10 rounded shadow-lg transition-all text-sm"
                >
                  Kirim Pengaduan
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
};

export default PengaduanMasyarakat;