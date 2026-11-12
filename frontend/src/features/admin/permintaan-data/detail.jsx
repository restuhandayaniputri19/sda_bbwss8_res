import * as Dialog from '@radix-ui/react-dialog';
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { API } from '../../../services';

const AdminDetailPermintaanData = () => {
  const { id } = useParams();
  const [permohonan, setPermohonan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State Modal Update Status
  const [open, setOpen] = useState(false);
  const [statusValue, setStatusValue] = useState("");
  const [note, setNote] = useState("");

  // State Modal Preview File
  const [previewOpen, setPreviewOpen] = useState(false);

  // Helper untuk mendapatkan URL lengkap file
  const getFileUrl = (filePath) => {
    if (!filePath) return "";
    if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
      return filePath;
    }
    const baseUrl = import.meta.env.VITE_API_URL || "";
    const cleanPath = filePath.startsWith("/") ? filePath : `/${filePath}`;
    return `${baseUrl}${cleanPath}`;
  };

  // Cek apakah file berformat PDF
  const isPdfFile = (filePath) => {
    return filePath?.toLowerCase().endsWith(".pdf");
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/api/permintaan-data/${id}`);
      const result = response.data;

      if (result.success) {
        setPermohonan(result.data);
        setStatusValue(result.data.status);
      } else {
        setError(result.message || "Gagal mengambil data");
      }
    } catch (err) {
      setError("Terjadi kesalahan koneksi ke server");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await API.patch(`/api/permintaan-data/${id}/status`, {
        status: statusValue || permohonan.status,
        note: note // Disesuaikan dengan key 'note' di backend Hono
      });
      if (response.status === 200) {
        setOpen(false);
        setNote("");
        fetchData();
      }
    } catch (err) {
      console.error(err);
      alert("Gagal memperbarui status");
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  if (loading) return <div className="p-8 text-center">Memuat data...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;
  if (!permohonan) return <div className="p-8 text-center">Data tidak ditemukan</div>;

  const fullFileUrl = getFileUrl(permohonan.fileSurat);
  const fileName = permohonan.fileSurat ? permohonan.fileSurat.split('/').pop() : "";

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header & Modal Update Status */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Detail Permintaan <span className="text-blue-600">#{id}</span>
          {permohonan.jenisData && ` - ${permohonan.jenisData}`}
        </h1>

        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger asChild>
            <span
              className={`px-4 py-1 rounded-full text-sm font-bold uppercase cursor-pointer hover:ring-2 ring-blue-300 transition-all ${
                permohonan.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-700'
                  : permohonan.status === 'ditolak'
                  ? 'bg-red-100 text-red-700'
                  : permohonan.status === 'diproses'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-green-100 text-green-700'
              }`}
            >
              {permohonan.status}
            </span>
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
            <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-xl shadow-2xl w-[90vw] max-w-md z-50">
              <Dialog.Title className="text-xl font-bold mb-2">Update Status</Dialog.Title>
              <Dialog.Description className="text-gray-500 mb-6 text-sm">
                Ubah status permintaan dan berikan catatan untuk log sistem.
              </Dialog.Description>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-1">Status Baru</label>
                  <select
                    className="w-full border rounded-lg p-2 outline-none focus:ring-2 ring-blue-500"
                    value={statusValue || permohonan.status}
                    onChange={(e) => setStatusValue(e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="diproses">Diproses</option>
                    <option value="selesai">Selesai</option>
                    <option value="ditolak">Ditolak</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1">Catatan</label>
                  <textarea
                    className="w-full border rounded-lg p-2 h-24 outline-none focus:ring-2 ring-blue-500"
                    placeholder="Contoh: Dokumen telah diverifikasi..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <Dialog.Close asChild>
                  <button className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                    Batal
                  </button>
                </Dialog.Close>
                <button
                  onClick={handleUpdate}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700"
                >
                  Simpan
                </button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>

      {/* Grid Detail Informasi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase">Nama Pemohon</label>
          <p className="text-lg font-medium text-gray-900">{permohonan.namaLengkap}</p>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase">Instansi</label>
          <p className="text-lg text-gray-900">{permohonan.instansi}</p>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase">No. WhatsApp</label>
          <p className="text-lg text-gray-900">{permohonan.noWa}</p>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase">Email</label>
          <p className="text-lg text-gray-900">{permohonan.email}</p>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase">Periode Data</label>
          <p className="text-gray-700 mt-1">
            {permohonan.periodeDari || '-'} s/d {permohonan.periodeSampai || '-'}
          </p>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase">Surat Permohonan</label>
          {permohonan.fileSurat ? (
            <div className="mt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPreviewOpen(true)}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-sm font-semibold hover:bg-blue-100 transition-colors cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Preview Surat
              </button>
              <a
                href={fullFileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-500 hover:text-gray-800 underline truncate max-w-[180px]"
                title={fileName}
              >
                {fileName}
              </a>
            </div>
          ) : (
            <p className="text-gray-400 italic mt-1 text-sm">Tidak ada lampiran file</p>
          )}
        </div>
        <div className="md:col-span-2">
          <label className="text-xs font-bold text-gray-400 uppercase">Tujuan Penggunaan</label>
          <p className="text-gray-700 mt-1">{permohonan.tujuanPenggunaan}</p>
        </div>
      </div>

      {/* Modal Preview File (Gambar & PDF) */}
      <Dialog.Root open={previewOpen} onOpenChange={setPreviewOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl w-[95vw] max-w-4xl h-[85vh] flex flex-col z-50 overflow-hidden">
            {/* Header Modal Preview */}
            <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50">
              <div>
                <Dialog.Title className="text-lg font-bold text-gray-800">
                  Preview Surat Permohonan
                </Dialog.Title>
                <Dialog.Description className="text-xs text-gray-500 truncate max-w-md">
                  {fileName}
                </Dialog.Description>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={fullFileUrl}
                  download={fileName}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition"
                >
                  Unduh / Tab Baru
                </a>
                <Dialog.Close asChild>
                  <button className="p-1.5 text-gray-500 hover:bg-gray-200 rounded-lg font-bold text-sm">
                    ✕
                  </button>
                </Dialog.Close>
              </div>
            </div>

            {/* Area Konten Preview */}
            <div className="flex-1 bg-gray-200 flex items-center justify-center overflow-auto p-4">
              {isPdfFile(permohonan.fileSurat) ? (
                <iframe
                  src={fullFileUrl}
                  title="Preview PDF Surat Permohonan"
                  className="w-full h-full rounded bg-white border-0"
                />
              ) : (
                <img
                  src={fullFileUrl}
                  alt="Preview Surat Permohonan"
                  className="max-w-full max-h-full object-contain rounded shadow-md bg-white"
                />
              )}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Bagian Log Status (Timeline) */}
      <div className="mt-8">
        <h3 className="text-lg font-bold mb-4 text-gray-800">Riwayat Status</h3>
        <div className="space-y-4 border-l-2 border-blue-200 ml-4 pl-6">
          {permohonan.statusLogs &&
            permohonan.statusLogs.map((log, index) => (
              <div key={index} className="relative">
                <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-blue-500 border-2 border-white"></div>
                <p className="text-sm font-bold text-gray-800 capitalize">{log.status}</p>
                <p className="text-xs text-gray-500">
                  {new Date(log.timestamp).toLocaleString('id-ID')}
                </p>
                <p className="text-sm text-gray-600 mt-1 italic">{log.note}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDetailPermintaanData;