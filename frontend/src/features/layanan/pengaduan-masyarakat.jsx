import { useState } from "react";
import heroImage from "../../assets/Pengaduan-masyarakat-gambar.jpeg";

const PengaduanMasyarakat = () => {
  const [nomorTiket, setNomorTiket] = useState("");
  const [form, setForm] = useState({
    nama: "",
    telepon: "",
    email: "",
    kategori: "",
    lokasi: "",
    deskripsi: "",
    file: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Pengaduan berhasil dikirim! Kami akan menghubungi Anda dalam 5 hari kerja.");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Heading */}
        <div className="max-w-2xl mx-auto text-center pt-8 pb-2 px-4">
          <h1 className="text-3xl font-semibold text-gray-900 mb-3">
            Pengaduan Masyarakat
          </h1>
        <div className="w-16 h-1 bg-[#2E6DB4] mx-auto mb-4"></div>
          <p className="text-sm text-gray-500 leading-relaxed">
            Sampaikan pengaduan Anda terkait pengelolaan sumber daya air, irigasi,
            serta prasarana pengairan di wilayah BWS Sumatera VIII.
          </p>
        </div>

        {/* Gambar */}
        <div className="max-w-3xl mx-auto px-4 py-4">
          <img
            src={heroImage}
            alt="Alur Prosedur Pengaduan"
            className="w-full rounded-xl"
          />
</div>
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

        {/* Cek Status */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-gray-600 whitespace-nowrap">
            Cek Status Pengaduan:
          </span>
          <input
            type="text"
            placeholder="Masukkan nomor tiket..."
            value={nomorTiket}
            onChange={(e) => setNomorTiket(e.target.value)}
            className="flex-1 min-w-[160px] border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E6DB4]"
          />
          <button className="bg-[#1A3A6B] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#2E6DB4] transition-colors">
            Cek Sekarang
          </button>
        </div>

        {/* Form Pengaduan */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-base font-semibold text-[#1A3A6B] mb-5 pb-3 border-b border-gray-100">
            Form Pengaduan
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Pelapor <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nama"
                  value={form.nama}
                  onChange={handleChange}
                  required
                  placeholder="Nama lengkap Anda"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E6DB4]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nomor Telepon <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="telepon"
                  value={form.telepon}
                  onChange={handleChange}
                  required
                  placeholder="08xx-xxxx-xxxx"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E6DB4]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-gray-400 font-normal">(opsional)</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="email@contoh.com"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E6DB4]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori Pengaduan <span className="text-red-500">*</span>
                </label>
                <select
                  name="kategori"
                  value={form.kategori}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E6DB4] bg-white"
                >
                  <option value="">Pilih kategori...</option>
                  <option value="banjir">Banjir</option>
                  <option value="infrastruktur">Kerusakan Infrastruktur</option>
                  <option value="perizinan">Perizinan</option>
                  <option value="lainnya">Lainnya</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lokasi Kejadian <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="lokasi"
                value={form.lokasi}
                onChange={handleChange}
                required
                placeholder="Alamat / nama lokasi kejadian"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E6DB4]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deskripsi Pengaduan Lengkap <span className="text-red-500">*</span>
              </label>
              <textarea
                name="deskripsi"
                value={form.deskripsi}
                onChange={handleChange}
                required
                rows={5}
                placeholder="Jelaskan pengaduan Anda secara detail..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E6DB4] resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Foto / Dokumen Pendukung
              </label>
              <input
                type="file"
                name="file"
                onChange={handleChange}
                multiple
                accept="image/*,.pdf,.doc,.docx"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E6DB4] bg-white"
              />
              <p className="text-xs text-gray-400 mt-1">
                Maks. 3 file, 5MB/file. Format: JPG, PNG, PDF
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-[#1A3A6B] text-white font-medium py-3 rounded-lg hover:bg-[#2E6DB4] transition-colors text-sm"
            >
              Kirim Pengaduan
            </button>

          </form>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
          <p className="font-medium mb-1">Informasi Penting</p>
          <ul className="list-disc list-inside space-y-1 text-xs text-blue-700">
            <li>Pengaduan akan ditindaklanjuti dalam 5 hari kerja</li>
            <li>Nomor tiket akan dikirim ke email Anda setelah pengaduan dikirim</li>
            <li>Gunakan nomor tiket untuk memantau status pengaduan Anda</li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default PengaduanMasyarakat;