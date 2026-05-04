import { useEffect, useState } from "react";
import { API2 } from "../services";
import * as Dialog from "@radix-ui/react-dialog";

declare global {
  interface ImportMetaEnv {
    readonly VITE_API2_BASE_URL: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

const VerificationModal = ({
  isOpen,
  setIsOpen,
  onSuccess,
}: {
  isOpen: boolean;
  setIsOpen: (o: boolean) => void;
  onSuccess?: (phoneNumber: string) => void;
}) => {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(180);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Format detik ke MM:SS
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Gunakan awalan +62 sesuai logika Anda
    const formattedPhone = "+62" + phoneNumber;

    try {
      console.log("Mengirim OTP ke:", formattedPhone);

      // Gunakan instance axios (API2) secara langsung
      // Tidak perlu menuliskan full URL karena sudah ada di axiosConfig
      const response = await API2.post("/auth/send-otp", { 
        phoneNumber: formattedPhone 
      });

      // Axios secara otomatis memparse JSON, data ada di response.data
      if (response.data.success) {
        console.log("OTP berhasil dikirim!");
        setStep("otp"); // Pindah tahap HANYA jika sukses
      } else {
        console.error("Gagal mengirim OTP:", response.data.error);
        alert("Gagal mengirim OTP: " + (response.data.message || "Coba lagi."));
      }
    } catch (err) {
      console.error("Error saat mengirim OTP:", err);
      alert("Terjadi kesalahan koneksi. Pastikan server API2 aktif.");
    }
  };
  
const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Memverifikasi OTP:", otp);

    try {
      // 1. Gunakan API2.post (Instance Axios)
      // Tidak perlu `${API2}`, cukup sub-path-nya saja.
      const response = await API2.post("/auth/verify-otp", {
        phoneNumber: "+62" + phoneNumber,
        otp: otp
      });

      // 2. Axios otomatis mem-parse JSON, akses via response.data
      const data = response.data;

      if (data.success) {
        console.log("OTP valid!");
        
        const now = new Date();
        const midnight = new Date().setHours(23, 59, 59, 999);
        
        // Simpan status verifikasi yang akan hilang saat lewat tengah malam
        localStorage.setItem("verified_until", midnight.toString());
        localStorage.setItem("verified_number", "+62" + phoneNumber);
        
        setIsOpen(false);
        
        if (onSuccess) {
          onSuccess("+62" + phoneNumber);
        }
      } else {
        console.error("OTP tidak valid:", data.error);
        alert(data.message || "OTP tidak valid atau sudah kadaluwarsa.");
      }
    } catch (err: any) {
      // 3. Penanganan error yang lebih detail
      const errorMsg = err.response?.data?.message || "Terjadi kesalahan koneksi.";
      console.error("Error saat memverifikasi OTP:", err);
      alert(errorMsg);
    }
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) setStep("phone"); // Reset step saat tutup
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-xl shadow-xl w-[90vw] max-w-sm z-[51]">
          {step === "phone" ? (
            <>
              <Dialog.Title className="text-xl font-bold mb-2">
                Verifikasi WhatsApp
              </Dialog.Title>
              <Dialog.Description className="text-gray-500 mb-6 text-sm">
                Masukkan nomor WhatsApp Anda untuk memulai pengajuan.
              </Dialog.Description>
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="relative flex items-center shadow-sm">
                  {/* Bagian Bendera & +62 (Fixed) */}
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none border-r border-gray-200 pr-2 my-2">
                    <span
                      className="text-xl mr-1"
                      role="img"
                      aria-label="Indonesia Flag"
                    >
                      🇮🇩
                    </span>
                    <span className="text-gray-600 font-medium text-sm">
                      +62
                    </span>
                  </div>

                  {/* Input Utama */}
                  <input
                    type="tel"
                    placeholder="812xxxx"
                    className="block w-full pl-20 pr-4 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    value={phoneNumber}
                    onChange={(e) => {
                      // Hanya izinkan angka dan hapus angka 0 di depan jika ada
                      const val = e.target.value.replace(/\D/g, "");
                      setPhoneNumber(val.startsWith("0") ? val.slice(1) : val);
                    }}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                >
                  Kirim OTP
                </button>
              </form>
            </>
          ) : (
            <>
              <Dialog.Title className="text-xl font-bold mb-2">
                Masukkan Kode OTP
              </Dialog.Title>
              <Dialog.Description className="text-gray-500 mb-6 text-sm">
                Kode verifikasi telah dikirim ke <strong>{phoneNumber}</strong>{" "}
                via WhatsApp.
              </Dialog.Description>
              {/* Tampilan Countdown */}
              <div className="text-center mb-4">
                {timeLeft > 0 ? (
                  <p className="text-sm text-gray-600">
                    Sisa waktu:{" "}
                    <span className="font-mono font-bold text-orange-600">
                      {formatTime(timeLeft)}
                    </span>
                  </p>
                ) : (
                  <p className="text-sm text-red-600 font-semibold">
                    Kode telah kadaluwarsa.
                  </p>
                )}
              </div>
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <input
                  type="text"
                  placeholder="6 digit kode"
                  className="w-full px-4 py-2 border rounded-md text-center tracking-[0.5em] font-bold outline-none focus:ring-2 focus:ring-blue-500"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  disabled={timeLeft <= 0} // Nonaktifkan input jika waktu habis
                  required
                />
                <button
                  type="submit"
                  disabled={timeLeft <= 0} // Nonaktifkan tombol jika waktu habis
                  className={`w-full py-2 text-white rounded-md transition 
      ${
        timeLeft > 0
          ? "bg-blue-600 hover:bg-blue-700"
          : "bg-gray-400 cursor-not-allowed"
      }`}
                >
                  {timeLeft > 0 ? "Verifikasi Sekarang" : "Waktu Habis"}
                </button>
                <button
                  type="button"
                  onClick={() => setStep("phone")}
                  className="w-full text-xs text-gray-400 hover:underline"
                >
                  Ganti nomor HP?
                </button>
              </form>
            </>
          )}

          <Dialog.Close className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            ✕
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default VerificationModal;
