import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { API } from "../../../services";

const STATUSES = ["pending", "diproses", "selesai", "ditolak"];
const statusLabel = { pending: "Pending", diproses: "Diproses", selesai: "Selesai", ditolak: "Ditolak" };
const formatDate = (value) => value ? new Date(value).toLocaleString("id-ID") : "-";

export default function AdminDetailPengaduanMasyarakat() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [status, setStatus] = useState("pending");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const fetchItem = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await API.get(`/api/pengaduan-masyarakat/${id}`);
      if (!data?.success) throw new Error(data?.message || "Data pengaduan tidak ditemukan.");
      setItem(data.data);
      setStatus(data.data.status);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Gagal memuat pengaduan.");
    } finally { setLoading(false); }
  }, [id]);

  useEffect(() => { fetchItem(); }, [fetchItem]);

  const fileUrl = (filePath) => {
    if (!filePath) return "";
    if (/^https?:\/\//i.test(filePath)) return filePath;
    return `${import.meta.env.VITE_API_URL || ""}${filePath.startsWith("/") ? "" : "/"}${filePath}`;
  };

  const saveStatus = async () => {
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const { data } = await API.patch(`/api/pengaduan-masyarakat/${id}`, { status, note: note.trim() });
      if (!data?.success) throw new Error(data?.message || "Gagal memperbarui status.");
      setItem(data.data);
      setNote("");
      setNotice(data.whatsappSent === true
        ? "Status tersimpan dan pemberitahuan WhatsApp berhasil diteruskan ke pelapor."
        : data.whatsappSent === false
          ? "Status tersimpan, tetapi pemberitahuan WhatsApp gagal dikirim. Periksa konfigurasi atau log gateway."
          : "Status tersimpan. Pemberitahuan WhatsApp tidak dikirim karena status tidak berubah.");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Gagal memperbarui status.");
    } finally { setSaving(false); }
  };

  if (loading) return <p className="py-10 text-center text-slate-500">Memuat detail pengaduan...</p>;
  if (error && !item) return <div className="space-y-4"><p role="alert" className="text-red-700">{error}</p><Link to="/admin/pengaduan-masyarakat" className="text-blue-700 hover:underline">Kembali ke daftar</Link></div>;
  if (!item) return null;

  const mapUrl = Number.isFinite(Number(item.latitude)) && Number.isFinite(Number(item.longitude))
    ? `https://maps.google.com/?q=${item.latitude},${item.longitude}` : "";
  const logs = Array.isArray(item.statusLogs) ? [...item.statusLogs].reverse() : [];

  return (
    <main className="mx-auto max-w-4xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><Link to="/admin/pengaduan-masyarakat" className="text-sm text-blue-700 hover:underline">← Kembali ke daftar</Link><h1 className="mt-2 text-2xl font-bold text-slate-800">Pengaduan #{item.id}</h1></div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold">{statusLabel[item.status] || item.status}</span>
      </div>

      {error && <div role="alert" className="rounded-lg bg-red-50 p-3 text-red-700">{error}</div>}
      {notice && <div role="status" className={`rounded-lg p-3 ${notice.includes("gagal") ? "bg-amber-50 text-amber-800" : "bg-green-50 text-green-800"}`}>{notice}</div>}
      <section className="grid gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2">
        <Info label="Nama pelapor" value={item.namaPelapor} /><Info label="Telepon / WhatsApp" value={item.noWa} />
        <Info label="Email" value={item.email || "-"} /><Info label="Kategori" value={item.kategori} capitalize />
        <Info label="Tanggal masuk" value={formatDate(item.createdAt)} /><Info label="Lokasi kejadian" value={item.lokasi} />
        <div className="sm:col-span-2"><Info label="Deskripsi" value={item.deskripsi} /></div>
        <div className="sm:col-span-2"><span className="text-xs font-semibold uppercase text-slate-500">Titik peta</span><p className="mt-1 text-slate-800">{mapUrl ? <a className="text-blue-700 hover:underline" href={mapUrl} target="_blank" rel="noreferrer">{item.latitude}, {item.longitude} · Buka di Google Maps</a> : "Tidak tersedia"}</p></div>
        <div className="sm:col-span-2"><span className="text-xs font-semibold uppercase text-slate-500">Lampiran</span><p className="mt-1">{item.fileLampiran ? <a className="text-blue-700 hover:underline" href={fileUrl(item.fileLampiran)} target="_blank" rel="noreferrer">Buka {item.fileLampiran.split("/").pop()}</a> : <span className="text-slate-500">Tidak ada lampiran</span>}</p></div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800">Perbarui penanganan</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_2fr_auto] sm:items-end">
          <label className="text-sm font-medium text-slate-700">Status<select className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2" value={status} onChange={(event) => setStatus(event.target.value)}>{STATUSES.map((value) => <option key={value} value={value}>{statusLabel[value]}</option>)}</select></label>
          <label className="text-sm font-medium text-slate-700">Catatan<textarea className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2" rows="2" value={note} onChange={(event) => setNote(event.target.value)} placeholder="Catatan proses penanganan" /></label>
          <button type="button" disabled={saving} onClick={saveStatus} className="rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60">{saving ? "Menyimpan..." : "Simpan"}</button>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800">Riwayat status</h2>
        {logs.length ? <ol className="mt-4 space-y-4">{logs.map((log, index) => <li key={`${log.timestamp}-${index}`} className="border-l-2 border-blue-200 pl-4"><p className="font-semibold text-slate-800">{statusLabel[log.status] || log.status}</p><p className="text-xs text-slate-500">{formatDate(log.timestamp)}</p>{log.note && <p className="mt-1 text-sm text-slate-700">{log.note}</p>}</li>)}</ol> : <p className="mt-3 text-sm text-slate-500">Belum ada catatan status.</p>}
      </section>
    </main>
  );
}

function Info({ label, value, capitalize = false }) {
  return <div><span className="text-xs font-semibold uppercase text-slate-500">{label}</span><p className={`mt-1 whitespace-pre-wrap text-slate-800 ${capitalize ? "capitalize" : ""}`}>{value || "-"}</p></div>;
}
