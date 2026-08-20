import { useState, useEffect } from "react";
import Card from "../../components/card";
import CustomPagination from "../../components/pagination";
import { Button } from "../../components/button";
import { Input } from "../../components/input";
import {
  getUsers,
  createUser,
  forceSetPassword,
  deleteUser,
} from "../../services/users";
import { toast } from "sonner";
import { KeyRound, UserPlus, Trash2, ShieldAlert } from "lucide-react";

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [newUser, setNewUser] = useState({ username: "", email: "", password: "" });
  const [resetModal, setResetModal] = useState({ open: false, user: null, newPassword: "" });

  const fetchUsers = () => {
    setLoading(true);
    getUsers(page, 10)
      .then((res) => {
        if (res.status) {
          setUsers(res.data || []);
          setTotalPages(res.meta?.totalPages || 1);
        }
      })
      .catch((err) => toast.error(err.response?.data?.message || "Gagal memuat data user"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  // Handle Tambah User
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newUser.username || !newUser.email || !newUser.password) {
      return toast.warning("Semua field wajib diisi");
    }

    try {
      await createUser(newUser);
      toast.success("User berhasil ditambahkan");
      setNewUser({ username: "", email: "", password: "" });
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal membuat user");
    }
  };

  // Handle Set Password Paksa
  const handleForcePassword = async () => {
    if (!resetModal.newPassword || resetModal.newPassword.length < 6) {
      return toast.warning("Password baru minimal 6 karakter");
    }

    try {
      await forceSetPassword(resetModal.user.id, resetModal.newPassword);
      toast.success(`Password untuk ${resetModal.user.username} berhasil diubah`);
      setResetModal({ open: false, user: null, newPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal mengubah password");
    }
  };

  // Handle Hapus User
  const handleDelete = async (id, username) => {
    if (!window.confirm(`Yakin ingin menghapus user ${username}?`)) return;

    try {
      await deleteUser(id);
      toast.success("User berhasil dihapus");
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal menghapus user");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Manajemen User System</h1>

      {/* Form Tambah User Sederhana */}
      <Card className="p-4 border border-gray-200">
        <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <UserPlus className="h-4 w-4" /> Tambah User Baru
        </h2>
        <form onSubmit={handleCreate} className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Username"
              value={newUser.username}
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <Input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <Input
              type="password"
              placeholder="Password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            />
          </div>
          <Button type="submit">Tambah</Button>
        </form>
      </Card>

      {/* Tabel User */}
      {loading ? (
        <div className="p-8 text-center text-gray-500">Memuat data user...</div>
      ) : (
        <Card className="overflow-x-auto p-0 border border-gray-200">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-100 text-xs uppercase font-semibold text-gray-700 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3">Username</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Login Terakhir</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{user.username}</td>
                  <td className="px-4 py-3 text-gray-600">{user.email}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleString("id-ID") : "-"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        title="Set Password Paksa"
                        onClick={() => setResetModal({ open: true, user, newPassword: "" })}
                      >
                        <KeyRound className="h-3.5 w-3.5 mr-1" /> Reset Pass
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        title="Hapus User"
                        onClick={() => handleDelete(user.id, user.username)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
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

      {/* Inline Modal Set Password Paksa */}
      {resetModal.open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-5 w-full max-w-md border border-gray-200 shadow-lg space-y-4">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-amber-500" />
              Set Password Paksa ({resetModal.user?.username})
            </h3>
            <Input
              type="password"
              placeholder="Masukkan password baru"
              value={resetModal.newPassword}
              onChange={(e) => setResetModal({ ...resetModal, newPassword: e.target.value })}
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setResetModal({ open: false, user: null, newPassword: "" })}
              >
                Batal
              </Button>
              <Button onClick={handleForcePassword}>Simpan Password</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}