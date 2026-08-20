import { useState, useEffect, useMemo } from "react";
import Card from "../../components/card";
import CustomPagination from "../../components/pagination";
import { getAdminLogs, getUsersOption } from "../../services/adminLogs";

const formatTimeOnly = (createdAt) => {
  if (!createdAt || Number.isNaN(new Date(createdAt).getTime())) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(createdAt));
};

const formatMonthYearHeader = (dateString) => {
  if (!dateString) return "Lainnya";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "Lainnya";

  return new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(date);
};

const AdminLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Load daftar user untuk pilihan filter
  useEffect(() => {
    getUsersOption()
      .then((res) => {
        if (res.status) setUsers(res.data || []);
      })
      .catch((err) => console.error("Gagal mengambil daftar user:", err));
  }, []);

  // Load data log
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    getAdminLogs(page, 10, selectedUser)
      .then((res) => {
        if (isMounted && res.status) {
          setLogs(res.data || []);
          setTotalPages(res.pagination?.totalPages || 1);
        }
      })
      .catch((err) => console.error("Gagal mengambil log admin:", err))
      .finally(() => isMounted && setLoading(false));

    return () => {
      isMounted = false;
    };
  }, [page, selectedUser]);

  // Grouping log berdasarkan "Bulan Tahun" (misal: "Agustus 2026")
  const groupedLogs = useMemo(() => {
    return logs.reduce((groups, log) => {
      const groupKey = formatMonthYearHeader(log.createdAt);
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(log);
      return groups;
    }, {});
  }, [logs]);

  const handleUserChange = (e) => {
    setSelectedUser(e.target.value);
    setPage(1); // Reset ke halaman 1 saat filter berubah
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Riwayat Aktivitas Admin</h1>

        {/* Filter User */}
        <div className="flex items-center gap-2">
          <label htmlFor="filter-user" className="text-xs font-medium text-gray-600">
            Filter Admin:
          </label>
          <select
            id="filter-user"
            value={selectedUser}
            onChange={handleUserChange}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none"
          >
            <option value="">-- Semua Admin --</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.username}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-gray-500">Memuat data log...</div>
      ) : logs.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-500">
          Belum ada riwayat log aktivitas.
        </div>
      ) : (
        <Card className="overflow-x-auto p-0 border border-gray-200">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-100 text-xs font-semibold uppercase text-gray-700 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3">Waktu</th>
                <th className="px-4 py-3">Admin</th>
                <th className="px-4 py-3">Aksi</th>
                <th className="px-4 py-3">Target Entitas</th>
                <th className="px-4 py-3">Detail</th>
                <th className="px-4 py-3">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {Object.entries(groupedLogs).map(([monthYear, groupLogs]) => (
                <tr key={monthYear} className="contents">
                  {/* Header Grouping Bulan & Tahun */}
                  <td
                    colSpan={6}
                    className="bg-gray-50/80 px-4 py-2 text-xs font-bold text-gray-700 border-y border-gray-200 uppercase tracking-wider"
                  >
                    📅 {monthYear}
                  </td>

                  {/* Item Log dalam Group */}
                  {groupLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500">
                        {formatTimeOnly(log.createdAt)}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-800">
                        {log.username || "System"}
                      </td>
                      <td className="px-4 py-3 font-semibold text-xs">
                        <span className="inline-block px-2 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-200">
                          {log.action}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <span className="font-medium text-gray-700">
                          {log.targetEntity || "-"}
                        </span>
                        {log.targetId && (
                          <span className="text-gray-400"> (#{log.targetId})</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs max-w-xs truncate text-gray-500">
                        {log.details ? JSON.stringify(log.details) : "-"}
                      </td>
                      <td className="px-4 py-3 text-xs font-mono text-gray-500">
                        {log.ipAddress || "-"}
                      </td>
                    </tr>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {totalPages > 1 && (
        <CustomPagination
          currentPage={page}
          totalPageCount={totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
};

export default AdminLogsPage;