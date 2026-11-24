import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { API } from "../../../services";

const STATUSES = ["pending", "diproses", "selesai", "ditolak"];
const statusLabel = { pending: "Pending", diproses: "Diproses", selesai: "Selesai", ditolak: "Ditolak" };
const badgeClass = {
  pending: "bg-amber-100 text-amber-800",
  diproses: "bg-blue-100 text-blue-800",
  selesai: "bg-green-100 text-green-800",
  ditolak: "bg-red-100 text-red-800",
};

const formatDate = (value) => value ? new Date(value).toLocaleString("id-ID") : "-";

export default function AdminPengaduanMasyarakat() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("semua");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    API.get("/api/pengaduan-masyarakat/admin")
      .then(({ data }) => {
        if (active) setItems(data?.data || []);
      })
      .catch((err) => {
        if (active) setError(err.response?.data?.message || "Gagal memuat daftar pengaduan.");
      })
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => filter === "semua" ? items : items.filter((item) => item.status === filter), [items, filter]);

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Pengaduan Masyarakat</h1>
          <p className="text-sm text-slate-500">Daftar laporan masuk dan status penanganannya.</p>
        </div>
        <select aria-label="Filter status" className="rounded-lg border border-slate-300 bg-white px-3 py-2" value={filter} onChange={(event) => setFilter(event.target.value)}>
          <option value="semua">Semua status</option>
          {STATUSES.map((status) => <option key={status} value={status}>{statusLabel[status]}</option>)}
        </select>
      </div>

      {error && <div role="alert" className="rounded-lg bg-red-50 p-4 text-red-700">{error}</div>}
      {loading ? <p className="py-10 text-center text-slate-500">Memuat pengaduan...</p> : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr><th className="px-4 py-3">Tanggal</th><th className="px-4 py-3">Pelapor</th><th className="px-4 py-3">Kategori</th><th className="px-4 py-3">Lokasi</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Detail</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="whitespace-nowrap px-4 py-3">{formatDate(item.createdAt)}</td>
                  <td className="px-4 py-3"><div className="font-medium text-slate-800">{item.namaPelapor}</div><div className="text-slate-500">{item.noWa}</div></td>
                  <td className="px-4 py-3 capitalize">{item.kategori}</td>
                  <td className="max-w-xs truncate px-4 py-3" title={item.lokasi}>{item.lokasi}</td>
                  <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${badgeClass[item.status] || "bg-slate-100 text-slate-700"}`}>{statusLabel[item.status] || item.status}</span></td>
                  <td className="px-4 py-3"><Link className="font-semibold text-blue-700 hover:underline" to={`/admin/pengaduan-masyarakat/${item.id}`}>Buka</Link></td>
                </tr>
              ))}
              {!filtered.length && <tr><td colSpan="6" className="px-4 py-10 text-center text-slate-500">Belum ada pengaduan pada status ini.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
