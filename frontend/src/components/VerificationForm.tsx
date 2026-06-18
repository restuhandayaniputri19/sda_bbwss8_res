import { useEffect, useState } from "react";
import { API2 } from "../services";

interface VerificationFormProps {
  onSuccess?: (phoneNumber: string) => void;
  onCancel?: () => void;
}

const VerificationForm = ({ onSuccess, onCancel }: VerificationFormProps) => {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(180);

  useEffect(() => {
    if (timeLeft <= 0 || step === "phone") return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, step]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const formattedPhone = "+62" + phoneNumber;

    try {
      console.log("Mengirim OTP ke:", formattedPhone);
      const response = await API2.post("/auth/send-otp", { 
        phoneNumber: formattedPhone 
      });

      if (response.data.success) {
        console.log("OTP berhasil dikirim!");
        setTimeLeft(180); // Reset timer untuk OTP baru
        setStep("otp"); 
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
    try {
      const response = await API2.post("/auth/verify-otp", {
        phoneNumber: "+62" + phoneNumber,
        otp: otp
      });

      const data = response.data;

      if (data.success) {
        console.log("OTP valid!");
        const midnight = new Date().setHours(23, 59, 59, 999);
        
        localStorage.setItem("verified_until", midnight.toString());
        localStorage.setItem("verified_number", "+62" + phoneNumber);
        
        if (onSuccess) {
          onSuccess("+62" + phoneNumber);
        }
      } else {
        console.error("OTP tidak valid:", data.error);
        alert(data.message || "OTP tidak valid atau sudah kadaluwarsa.");
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Terjadi kesalahan koneksi.";
      alert(errorMsg);
    }
  };

  return (
    <div className="w-full space-y-4">
      {step === "phone" ? (
        <>
          <h3 className="text-base font-bold text-gray-800">Nomor WhatsApp</h3>
          <form onSubmit={handleSendOtp} className="space-y-3">
            <div className="relative flex items-center shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none border-r border-gray-200 pr-2 my-2">
                <span className="text-lg mr-1" role="img" aria-label="ID Flag">🇮🇩</span>
                <span className="text-gray-600 font-medium">+62</span>
              </div>

              <input
                type="tel"
                placeholder="812xxxx"
                className="block w-full pl-20 pr-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={phoneNumber}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  setPhoneNumber(val.startsWith("0") ? val.slice(1) : val);
                }}
                required
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onCancel}
                className="w-1/3 py-2 border border-gray-300 text-gray-600 rounded-md hover:bg-gray-50 transition"
              >
                Batal
              </button>
              <button
                type="submit"
                className="w-2/3 py-2 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 transition"
              >
                Kirim OTP
              </button>
            </div>
          </form>
        </>
      ) : (
        <>
          <h3 className="text-base font-bold text-gray-800">Masukkan Kode OTP</h3>
          <p className="text-xs text-gray-500">
            Kode dikirim ke <strong>+62{phoneNumber}</strong>
          </p>
          
          <div className="text-center py-1">
            {timeLeft > 0 ? (
              <p className="text-xs text-gray-600">
                Sisa waktu: <span className="font-mono font-bold text-orange-600">{formatTime(timeLeft)}</span>
              </p>
            ) : (
              <p className="text-xs text-red-600 font-semibold">Kode kadaluwarsa.</p>
            )}
          </div>

          <form onSubmit={handleVerifyOtp} className="space-y-3">
            <input
              type="text"
              placeholder="4 digit"
              className="w-full px-3 py-2 text-sm border rounded-md text-center tracking-[0.3em] pl-[0.4em] font-bold outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={4}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              disabled={timeLeft <= 0}
              required
            />
            <button
              type="submit"
              disabled={timeLeft <= 0}
              className={`w-full py-2 text-xs text-white font-bold rounded-md transition ${
                timeLeft > 0 ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {timeLeft > 0 ? "Verifikasi Sekarang" : "Waktu Habis"}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep("phone");
                setOtp("");
              }}
              className="w-full text-[10px] text-gray-400 hover:underline text-center"
            >
              Ganti nomor HP?
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default VerificationForm;