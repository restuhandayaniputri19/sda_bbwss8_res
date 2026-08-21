// features/admin/dashboard.jsx

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Card from "../../../components/card";
import api2 from "../../../services/api2";
import { 
  Newspaper, 
  FileSpreadsheet, 
  Megaphone, 
  History, 
  ArrowRight
} from "lucide-react";

const formatCreatedAt = (createdAt) => {
  if (!createdAt || Number.isNaN(new Date(createdAt).getTime())) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(createdAt));
};

const DashboardPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  let isMounted = true;
  setLoading(true);

  api2
    .get("/admin-logs?page=1&limit=5")
    .then((response) => {
      // Ambil array data dari response axios (response.data.data)
      const logsArray = response.data?.data || response.data || [];
      
      // Pastikan variabel yang di-set benar-benar bernilai Array
      if (isMounted) {
        setLogs(Array.isArray(logsArray) ? logsArray : []);
      }
    })
    .catch((err) => {
      console.error("Gagal mengambil log:", err);
      if (isMounted) setLogs([]); // Fallback ke array kosong jika error
    })
    .finally(() => {
      if (isMounted) setLoading(false);
    });

  return () => {
    isMounted = false;
  };
}, []);

  return (
    <div className="flex flex-col gap-6">
      {/* Header Dashboard */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Admin</h1>
        <p className="text-sm text-gray-500 mt-1">
          Ringkasan aktivitas dan kelola konten portal BBWS Sumatera VIII
        </p>
      </div>

      {/* Grid Card Manajemen Utama */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Manage Berita */}
        <Card className="p-5 border border-gray-200 hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Konten Publikasi
              </span>
              <h2 className="text-lg font-bold text-gray-800 mt-1">Berita</h2>
              <p className="text-xs text-gray-500 mt-1">
                Kelola artikel, berita kegiatan balai, dan pengumuman pers.
              </p>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <Newspaper className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-6 pt-3 border-t border-gray-100 flex items-center justify-between">
            <Link
              to="/admin/berita"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
            >
              Kelola Berita <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </Card>

        {/* Card 2: Manage Permintaan Data */}
        <Card className="p-5 border border-gray-200 hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Layanan Publik
              </span>
              <h2 className="text-lg font-bold text-gray-800 mt-1">Permintaan Data</h2>
              <p className="text-xs text-gray-500 mt-1">
                Verifikasi & tindak lanjuti permohonan data SDA dari masyarakat.
              </p>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
              <FileSpreadsheet className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-6 pt-3 border-t border-gray-100 flex items-center justify-between">
            <Link
              to="/admin/permintaan-data"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 hover:text-amber-800 transition-colors"
            >
              Proses Permintaan <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </Card>

        {/* Card 3: Manage Pengumuman */}
        <Card className="p-5 border border-gray-200 hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Informasi Serta Merta
              </span>
              <h2 className="text-lg font-bold text-gray-800 mt-1">Pengumuman</h2>
              <p className="text-xs text-gray-500 mt-1">
                Buat dan perbarui pengumuman resmi serta info darurat balai.
              </p>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
              <Megaphone className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-6 pt-3 border-t border-gray-100 flex items-center justify-between">
            <Link
              to="/admin/pengumuman"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-800 transition-colors"
            >
              Kelola Pengumuman <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </Card>
      </div>

      {/* Section: Latest Admin Logs */}
      <div className="flex flex-col gap-3 mt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
            <History className="h-4 w-4 text-gray-600" />
            Aktivitas Terakhir Admin (Latest Logs)
          </h2>
          <Link
            to="/admin/logs"
            className="text-xs font-semibold text-blue-600 hover:underline"
          >
            Lihat Semua Log
          </Link>
        </div>

        {loading ? (
          <div className="p-6 text-center text-xs text-gray-500 border border-gray-200 rounded-lg bg-white">
            Memuat riwayat aktivitas...
          </div>
        ) : logs.length === 0 ? (
          <div className="p-6 text-center text-xs text-gray-500 border border-dashed border-gray-300 rounded-lg bg-gray-50">
            Belum ada catatan aktivitas admin terbaru.
          </div>
        ) : (
          <Card className="overflow-x-auto p-0 border border-gray-200">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-100 text-[11px] font-semibold uppercase text-gray-700 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-2.5">Waktu</th>
                  <th className="px-4 py-2.5">Admin</th>
                  <th className="px-4 py-2.5">Aksi</th>
                  <th className="px-4 py-2.5">Target Entitas</th>
                  <th className="px-4 py-2.5">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-2.5 whitespace-nowrap text-xs text-gray-500">
                      {formatCreatedAt(log.createdAt)}
                    </td>
                    <td className="px-4 py-2.5 font-medium text-gray-800 text-xs">
                      {log.username || "System"}
                    </td>
                    <td className="px-4 py-2.5 text-xs">
                      <span className="inline-block px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-semibold border border-gray-200 text-[11px]">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-xs">
                      <span className="font-medium text-gray-700">
                        {log.targetEntity || "-"}
                      </span>
                      {log.targetId && (
                        <span className="text-gray-400"> (#{log.targetId})</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-xs font-mono text-gray-500">
                      {log.ipAddress || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;