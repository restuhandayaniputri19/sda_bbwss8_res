import { useState, useEffect, useRef, Fragment } from "react";
import { API } from "../../services";
import VerificationForm from "../../components/VerificationForm";
import heroImage from "../../assets/Permintaan-data-gambar.jpeg";

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

const getFileUrl = (filePath) => {
    if (!filePath) return "";
    if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
      return filePath;
    }
    const baseUrl = import.meta.env.VITE_API_URL || "";
    const cleanPath = filePath.startsWith("/") ? filePath : `/${filePath}`;
    return `${baseUrl}${cleanPath}`;
  };

const PermintaanDataPage = () => {
  // State untuk alur Verifikasi
  const [isVerified, setIsVerified] = useState(false);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [verifiedNumber, setVerifiedNumber] = useState("");

  // State untuk Data
  const [formData, setFormData] = useState(initialFormState);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // State untuk dropdown/accordion Log Status pada tabel riwayat
  const [expandedRowId, setExpandedRowId] = useState(null);
  const fileInputRef = useRef(null);

  const isFileSelected = formData.file !== null;

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
        setFormData((prev) => ({ ...prev, telepon: savedNumber }));
        setIsVerified(true);
        fetchHistory(savedNumber);
      }
    }
  }, []);

  const fetchHistory = async (noWa) => {
    setLoadingHistory(true);
    try {
      const response = await API.get(`/api/permintaan-data`, {
        params: { no_wa: noWa },
      });
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
    setFormData((prev) => ({ ...prev, telepon: noWa }));
    fetchHistory(noWa);
  };

  const toggleRowExpand = (id) => {
    setExpandedRowId((prev) => (prev === id ? null : id));
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "pending":
        return "bg-orange-100 text-orange-700";
      case "diproses":
        return "bg-blue-100 text-blue-700";
      case "ditolak":
        return "bg-red-100 text-red-700";
      default:
        return "bg-green-100 text-green-700";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.file) {
      alert("Silakan pilih file surat permohonan terlebih dahulu.");
      return;
    }

    const payload = new FormData();
    payload.append("namaLengkap", formData.nama);
    payload.append("instansi", formData.instansi);
    payload.append("jenisData", formData.jenisData);
    payload.append("periodeDari", formData.periodeDari);
    payload.append("periodeSampai", formData.periodeSampai);
    payload.append("email", formData.email);
    payload.append("noWa", verifiedNumber);
    payload.append("tujuanPenggunaan", formData.tujuan);
    payload.append("fileSurat", formData.file);

    try {
      const response = await API.post("/api/permintaan-data", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201 || response.data.success) {
        alert("Permintaan berhasil dikirim!");
        setFormData({ ...initialFormState, telepon: verifiedNumber });
        if (fileInputRef.current) fileInputRef.current.value = "";
        fetchHistory(verifiedNumber);
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Terjadi kesalahan saat mengirim permintaan.";
      console.error("Detail Error:", error);
      alert(msg);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
      telepon: name === "telepon" ? verifiedNumber : prev.telepon,
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
        <img
          src={heroImage}
          alt="Ilustrasi Permintaan Data"
          className="mx-auto mt-6 w-full h-auto block"
        />
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
              Permohonan & Cek Status Data
            </div>
            <div className="p-6 bg-gray-50 flex-grow">
              {!showAuthForm ? (
                <div className="w-full">
                  <p className="mb-6">
                    Untuk layanan Permintaan Data Lakukan verifikasi nomor Whatsapp.
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
          {/* Riwayat Permohonan dengan Dropdown Logs Status */}
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
                <p className="text-gray-500 text-sm">Memuat riwayat...</p>
              ) : history.length > 0 ? (
<table className="w-full text-left text-sm min-w-[650px]">
                  <thead>
                    <tr className="border-b text-gray-400">
                      <th className="py-2">JENIS DATA</th>
                      <th className="py-2">PERIODE</th>
                      <th className="py-2 text-center">SURAT</th>
                      <th className="py-2 text-center">STATUS TERAKHIR</th>
                      <th className="py-2 text-right">LOG STATUS</th>
                    </tr>
                  </thead>
<tbody>
                    {history.map((item) => {
                      const isExpanded = expandedRowId === item.id;
                      const logs = Array.isArray(item.statusLogs) ? item.statusLogs : [];
                      const latestLog = logs.length > 0 ? logs[logs.length - 1] : null;
                      const fileUrl = getFileUrl(item.fileSurat);
                      const fileName = item.fileSurat ? item.fileSurat.split("/").pop() : "surat-permohonan";

                      return (
                        <Fragment key={item.id}>
                          <tr
                            onClick={() => toggleRowExpand(item.id)}
                            className={`border-b transition cursor-pointer ${
                              isExpanded ? "bg-blue-50/50" : "hover:bg-gray-50"
                            }`}
                          >
                            <td className="py-3 font-bold uppercase text-gray-800">
                              {item.jenisData}
                            </td>
                            <td className="py-3 text-gray-600">
                              {item.periodeDari || "-"} s/d {item.periodeSampai || "-"}
                            </td>
                            <td className="py-3 text-center">
                              {item.fileSurat ? (
                                <a
                                  href={fileUrl}
                                  download={fileName}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded text-xs font-semibold hover:bg-blue-100 transition"
                                  title={`Unduh ${fileName}`}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3.5 w-3.5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
                                    />
                                  </svg>
                                  Unduh
                                </a>
                              ) : (
                                <span className="text-xs text-gray-400 italic">-</span>
                              )}
                            </td>

                            {/* Kolom Status Terakhir + Note Terbaru */}
                            <td className="py-3 text-center">
                              <div className="flex flex-col items-center justify-center max-w-[220px] mx-auto">
                                <span
                                  className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${getStatusBadgeStyle(
                                    item.status
                                  )}`}
                                >
                                  {item.status}
                                </span>
                                {latestLog?.note && (
                                  <span
                                    className="text-xs text-gray-500 italic mt-1 line-clamp-2"
                                    title={latestLog.note}
                                  >
                                    "{latestLog.note}"
                                  </span>
                                )}
                              </div>
                            </td>

                            <td className="py-3 text-right">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleRowExpand(item.id);
                                }}
                                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
                              >
                                <span>{isExpanded ? "Tutup" : `Lihat (${logs.length})`}</span>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className={`h-4 w-4 transition-transform duration-200 ${
                                    isExpanded ? "rotate-180" : ""
                                  }`}
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                  />
                                </svg>
                              </button>
                            </td>
                          </tr>

                          {/* Dropdown Panel Timeline Riwayat Status */}
                          {isExpanded && (
                            <tr className="bg-slate-50 border-b">
                              <td colSpan={5} className="px-6 py-5">
                                <h3 className="text-sm font-bold mb-3 text-gray-800">
                                  Riwayat Status
                                </h3>
                                {logs.length > 0 ? (
                                  <div className="space-y-4 border-l-2 border-blue-200 ml-2 pl-5">
                                    {logs.map((log, index) => (
                                      <div key={index} className="relative">
                                        <div className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full bg-blue-500 border-2 border-white"></div>
                                        <p className="text-sm font-bold text-gray-800 capitalize">
                                          {log.status}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                          {new Date(log.timestamp).toLocaleString("id-ID")}
                                        </p>
                                        {log.note && (
                                          <p className="text-sm text-gray-600 mt-1 italic">
                                            {log.note}
                                          </p>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-xs text-gray-400 italic">
                                    Belum ada catatan log status.
                                  </p>
                                )}
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      );
                    })}
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
                    required
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
                  Upload Surat (PDF/JPG/PNG maks. 5MB){" "}
                  <span className="text-red-500">*Wajib</span>:
                </label>
                <input
                  ref={fileInputRef}
                  name="file"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleChange}
                  required
                  className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 cursor-pointer"
                />
                {!isFileSelected && (
                  <p className="text-xs text-amber-600 italic">
                    * Lampirkan file surat permohonan untuk mengaktifkan tombol kirim.
                  </p>
                )}
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={!isFileSelected}
                  className={`font-bold py-3 px-10 rounded shadow-lg transition-all ${
                    isFileSelected
                      ? "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                  }`}
                >
                  Kirim Permohonan
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
};

export default PermintaanDataPage;