import * as Dialog from '@radix-ui/react-dialog';
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { API } from '../../../services';

const AdminDetailPermintaanData = () => {
  const { id } = useParams();
  const [permohonan, setPermohonan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [open, setOpen] = useState(false);
  const [statusValue, setStatusValue] = useState("");
  const [note, setNote] = useState("");

    const fetchData = async () => {
      try {
        setLoading(true);
        // Sesuaikan URL API dengan endpoint backend Anda
        const response = await API.get(`/api/permintaan-data/${id}`);
        console.log("Response from API:", response);
        const result = await response.data;

        if (result.success) {
          setPermohonan(result.data);
        } else {
          setError(result.message || "Gagal mengambil data");
        }
      } catch (err) {
        setError("Terjadi kesalahan koneksi ke server", err);
      } finally {
        setLoading(false);
      }
    };

  const handleUpdate = async () => {
    try {
      const response = await API.patch(`/api/permintaan-data/${id}/status`, {
        status: statusValue,
        catatan: note
      });
      if (response.status === 200) {
        setOpen(false);
        // Panggil kembali fungsi fetchData() agar timeline terupdate
        fetchData(); 
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {

    fetchData();
  }, [id]);

  if (loading) return <div className="p-8 text-center">Memuat data...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;
  if (!permohonan) return <div className="p-8 text-center">Data tidak ditemukan</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Detail Permintaan <span className="text-blue-600">#{id}</span>{permohonan.jenisData && ` - ${permohonan.jenisData}`}
        </h1>
<Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger asChild>
            <span className={`px-4 py-1 rounded-full text-sm font-bold uppercase cursor-pointer hover:ring-2 ring-blue-300 transition-all ${
              permohonan.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
            }`}>
              {permohonan.status}
            </span>
          </Dialog.Trigger>

          <Dialog.Portal>
            {/* Overlay untuk menggelapkan background */}
            <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
            
            {/* Konten Modal */}
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
                  <button className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg">Batal</button>
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
          <label className="text-xs font-bold text-gray-400 uppercase">No. Telepon</label>
          <p className="text-lg text-gray-900">{permohonan.noTelepon}</p>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase">Email</label>
          <p className="text-lg text-gray-900">{permohonan.email}</p>
        </div>
        <div className="md:col-span-2 border-t pt-4">
          <label className="text-xs font-bold text-gray-400 uppercase">Tujuan Penggunaan</label>
          <p className="text-gray-700 mt-1">{permohonan.tujuanPenggunaan}</p>
        </div>
      </div>

      {/* Bagian Log Status (Timeline) */}
      <div className="mt-8">
        <h3 className="text-lg font-bold mb-4 text-gray-800">Riwayat Status</h3>
        <div className="space-y-4 border-l-2 border-blue-200 ml-4 pl-6">
          {permohonan.statusLogs && permohonan.statusLogs.map((log, index) => (
            <div key={index} className="relative">
              <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-blue-500 border-2 border-white"></div>
              <p className="text-sm font-bold text-gray-800 capitalize">{log.status}</p>
              <p className="text-xs text-gray-500">{new Date(log.timestamp).toLocaleString('id-ID')}</p>
              <p className="text-sm text-gray-600 mt-1 italic">{log.note}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDetailPermintaanData;