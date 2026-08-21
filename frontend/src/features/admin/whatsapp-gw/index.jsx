import { useState, useEffect } from "react";
import Card from "../../../components/card";
import { Button } from "../../../components/button";
import { 
  Wifi, 
  WifiOff, 
  QrCode, 
  RefreshCw, 
  Users, 
  Phone, 
  LogOut, 
  CheckCircle2, 
  XCircle 
} from "lucide-react";
import { toast } from "sonner";

const WA_SERVER_URL = "https://wa.bbwssumatera8.id";

const WaGwAdmin = () => {
  const [status, setStatus] = useState("checking"); // 'connected' | 'disconnected' | 'checking'
  const [phoneNumber, setPhoneNumber] = useState("");
  const [groups, setGroups] = useState([]);
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function untuk cek status dari server WA
// Function untuk cek status dari server WA
  const checkStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${WA_SERVER_URL}/status`);
      const data = await response.json();

      // Mengecek status dari field uppercase "CONNECTED"
      if (data.status === "CONNECTED") {
        setStatus("connected");
        // Mengambil nomor telepon dari device.me.user
        setPhoneNumber(data.device?.me?.user ? `+${data.device.me.user}` : "-");
        setGroups(data.groups || []);
        setQrCodeUrl(null);
      } else {
        setStatus("disconnected");
        setPhoneNumber("");
        setGroups([]);
        if (data.qrcode) {
          setQrCodeUrl(data.qrcode);
        }
      }
    } catch (error) {
      console.error("Gagal memeriksa status WhatsApp Gateway:", error);
      setStatus("disconnected");
      toast.error("Gagal terhubung ke WhatsApp Server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  // Handler Connect / Scan QR
  const handleConnect = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${WA_SERVER_URL}/connect`, { method: "POST" });
      const data = await response.json();
      
      if (data.qr) {
        setQrCodeUrl(data.qr);
      }
      toast.info("Silakan scan QR Code yang muncul di layar");
      checkStatus();
    } catch (error) {
      console.error("Gagal memulai koneksi WA:", error);
      toast.error("Gagal menghubungkan ke WA Server");
    } finally {
      setLoading(false);
    }
  };

  // Handler Disconnect
  const handleDisconnect = async () => {
    if (!window.confirm("Apakah Anda yakin ingin memutuskan koneksi WhatsApp?")) return;

    setLoading(true);
    try {
      await fetch(`${WA_SERVER_URL}/disconnect`, { method: "POST" });
      toast.success("Koneksi WhatsApp berhasil diputuskan");
      checkStatus();
    } catch (error) {
      console.error("Gagal memutuskan koneksi WA:", error);
      toast.error("Gagal melakukan disconnect");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">WhatsApp Gateway Admin</h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelola koneksi nomor WhatsApp resmi dan grup terasosiasi
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={checkStatus}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh Status
        </Button>
      </div>

      {/* Card Status Utama */}
      <Card className="p-5 border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className={`p-3 rounded-full ${
                status === "connected"
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {status === "connected" ? (
                <Wifi className="h-6 w-6" />
              ) : (
                <WifiOff className="h-6 w-6" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Status Koneksi
                </span>
                {status === "connected" ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                    <CheckCircle2 className="h-3 w-3" /> Connected
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                    <XCircle className="h-3 w-3" /> Disconnected
                  </span>
                )}
              </div>
              <p className="text-base font-semibold text-gray-800 mt-1 flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400" />
                {phoneNumber || "Tidak ada nomor terhubung"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {status === "connected" ? (
              <Button
                variant="destructive"
                onClick={handleDisconnect}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" /> Disconnect
              </Button>
            ) : (
              <Button
                onClick={handleConnect}
                disabled={loading}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
              >
                <QrCode className="h-4 w-4" /> Connect WA Server
              </Button>
            )}
          </div>
        </div>

        {/* QR Code Container jika Disconnected */}
        {status !== "connected" && qrCodeUrl && (
          <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col items-center justify-center">
            <p className="text-sm font-medium text-gray-700 mb-3">
              Pindai QR Code di bawah menggunakan aplikasi WhatsApp Anda:
            </p>
            <div className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
              <img
                src={qrCodeUrl.startsWith("http") || qrCodeUrl.startsWith("data:") ? qrCodeUrl : `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrCodeUrl)}`}
                alt="WhatsApp QR Code"
                className="w-56 h-56 object-contain"
              />
            </div>
          </div>
        )}
      </Card>

      {/* Tabel / Daftar Group yang Terasosiasi */}
      {status === "connected" && (
        <div className="flex flex-col gap-3">
          <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-600" />
            Daftar Grup Terhubung ({groups.length})
          </h2>

          {groups.length === 0 ? (
            <div className="p-6 text-center text-xs text-gray-500 border border-dashed border-gray-300 rounded-lg bg-gray-50">
              Belum ada grup yang terasosiasi atau terdeteksi.
            </div>
          ) : (
            <Card className="overflow-x-auto p-0 border border-gray-200">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-100 text-xs font-semibold uppercase text-gray-700 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">Nama Grup</th>
                    <th className="px-4 py-3">Group ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {groups.map((group, index) => (
                    <tr key={group.id || index} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 text-xs text-gray-400">{index + 1}</td>
                      <td className="px-4 py-3 font-medium text-gray-800">
                        {group.name || group.subject || "-"}
                      </td>
                      <td className="px-4 py-3 text-xs font-mono text-gray-500">
                        {group.id || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default WaGwAdmin;