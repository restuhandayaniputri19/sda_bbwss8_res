import { useEffect, useState } from "react";
import { API } from "../../../services";
import { Link } from "react-router-dom";
import * as Dialog from "@radix-ui/react-dialog";

const getWaktuTunggu = (createdAt) => {
  const masuk = new Date(createdAt);
  const sekarang = new Date();
  const selisihMs = sekarang - masuk;

  const hari = Math.floor(selisihMs / (1000 * 60 * 60 * 24));
  const jam = Math.floor(
    (selisihMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const menit = Math.floor((selisihMs % (1000 * 60 * 60)) / (1000 * 60));

  if (hari > 0) return `${hari} hari ${jam} jam`;
  if (jam > 0) return `${jam} jam ${menit} mnt`;
  return `${menit} menit yang lalu`;
};

const AdminPermintaan = () => {
  const [permintaan, setPermintaan] = useState([]);
  const [filterStatus, setFilterStatus] = useState("semua");
  const [previewFile, setPreviewFile] = useState(null); // Menyimpan path file untuk preview

  // Helper format URL lengkap
  const getFileUrl = (filePath) => {
    if (!filePath) return "";
    if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
      return filePath;
    }
    const baseUrl = import.meta.env.VITE_API_URL || "";
    const cleanPath = filePath.startsWith("/") ? filePath : `/${filePath}`;
    return `${baseUrl}${cleanPath}`;
  };

  const isPdfFile = (filePath) => {
    return filePath?.toLowerCase().endsWith(".pdf");
  };

  const fetchData = async (status) => {
    try {
      const url =
        status && status !== "semua"
          ? `/api/permintaan-data?status=${status}`
          : `/api/permintaan-data`;
      const response = await API.get(url);
      setPermintaan(response.data.data || []);
    } catch (err) {
      console.error("Gagal mengambil data", err);
    }
  };

  useEffect(() => {
    fetchData("semua");
  }, []);

  const handleFilterChange = (status) => {
    setFilterStatus(status);
    fetchData(status);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "diproses":
        return "bg-blue-100 text-blue-800";
      case "selesai":
        return "bg-green-100 text-green-800";
      case "ditolak":
        return "bg-red-100 text-red-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const fullPreviewUrl = getFileUrl(previewFile);
  const previewFileName = previewFile ? previewFile.split("/").pop() : "";

  return (
    <div className="">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Panel Admin Permintaan Data</h1>

        {/* Filter Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-lg">
          {["semua", "pending", "diproses", "selesai", "ditolak"].map((s) => (
            <button
              key={s}
              onClick={() => handleFilterChange(s)}
              className={`px-4 py-2 rounded-md text-sm capitalize transition cursor-pointer ${
                filterStatus === s
                  ? "bg-white shadow-sm text-blue-600 font-semibold"
                  : "text-slate-500 hover:text-slate-700"
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
              <th className="p-4">Surat</th>
              <th className="p-4">Status</th>
              <th className="p-4">Tanggal Masuk</th>
              <th className="p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {permintaan.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="p-8 text-center text-slate-400 italic"
                >
                  Tidak ada data permohonan.
                </td>
              </tr>
            ) : (
              permintaan.map((item) => {
                const durasi = getWaktuTunggu(item.createdAt);
                const isLama =
                  new Date() - new Date(item.createdAt) >
                  3 * 24 * 60 * 60 * 1000;

                return (
                  <tr key={item.id} className="border-b hover:bg-slate-50">
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-800">
                          {item.namaLengkap}
                        </span>
                        {item.noWa && (
                          <span className="text-xs text-slate-500 mt-0.5">
                            {item.noWa}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-slate-600">{item.instansi}</td>
                    <td className="p-4">
                      {item.fileSurat ? (
                        <button
                          type="button"
                          onClick={() => setPreviewFile(item.fileSurat)}
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-md text-xs font-semibold hover:bg-blue-100 transition cursor-pointer"
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
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                          Preview
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400 italic">-</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${getStatusBadgeClass(item.status)}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm">
                      <div className="flex flex-col">
                        <span
                          className={
                            isLama && item.status === "pending"
                              ? "text-red-600 font-bold"
                              : "text-slate-600"
                          }
                        >
                          {durasi}
                        </span>
                        <span className="text-xs text-slate-400">
                          Masuk:{" "}
                          {new Date(item.createdAt).toLocaleDateString("id-ID")}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <Link
                        to={`${item.id}`}
                        className="text-blue-600 hover:underline font-medium text-sm"
                      >
                        Detail
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Preview File Surat */}
      <Dialog.Root
        open={!!previewFile}
        onOpenChange={(open) => !open && setPreviewFile(null)}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl w-[95vw] max-w-4xl h-[85vh] flex flex-col z-50 overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b bg-slate-50">
              <div>
                <Dialog.Title className="text-lg font-bold text-slate-800">
                  Preview Surat Permohonan
                </Dialog.Title>
                <Dialog.Description className="text-xs text-slate-500 truncate max-w-md">
                  {previewFileName}
                </Dialog.Description>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={fullPreviewUrl}
                  download={previewFileName}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition"
                >
                  Unduh / Tab Baru
                </a>
                <Dialog.Close asChild>
                  <button className="p-1.5 text-slate-500 hover:bg-slate-200 rounded-lg font-bold text-sm cursor-pointer">
                    ✕
                  </button>
                </Dialog.Close>
              </div>
            </div>

            <div className="flex-1 bg-slate-200 flex items-center justify-center overflow-auto p-4">
              {isPdfFile(previewFile) ? (
                <iframe
                  src={fullPreviewUrl}
                  title="Preview PDF Surat Permohonan"
                  className="w-full h-full rounded bg-white border-0"
                />
              ) : (
                <img
                  src={fullPreviewUrl}
                  alt="Preview Surat Permohonan"
                  className="max-w-full max-h-full object-contain rounded shadow-md bg-white"
                />
              )}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default AdminPermintaan;
