import rekomtekFlow from '../../assets/Perizinanrekomtek.jpeg';

const KONTAK_WA = [
  { nama: 'Tim 1 Yayan', nomor: '628974444492' },
  { nama: 'Tim 2 Gea', nomor: '62895339096615' },
];
const PESAN_WA = 'Halo, saya ingin konsultasi terkait pengajuan Rekomtek.';

const RekomtekPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 bg-white">
      {/* Header Halaman */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
          Rekomtek
        </h1>
        <div className="h-1 w-20 bg-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-500 text-lg">
          Layanan rekomendasi teknis sumber daya air wilayah BBWS Sumatera VIII
        </p>
        <p className="text-gray-500 text-lg">
          Lihat prosedur rekomtek di bawah ↓ sebelum mengajukan permohonan.
        </p>
        <div className="mt-6 flex justify-center">
          <a href="https://perizinansda.pu.go.id/" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition duration-300">
            Ajukan Rekomtek
          </a>
        </div>
      </div>
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Prosedur Rekomtek
        </h2>
        <img src={rekomtekFlow} alt="Rekomtek" className="mx-auto my-8 w-full max-w-md rounded-lg shadow-md" />
        <p>Prosedur rekomendasi teknis (rekomtek) sumber daya air melibatkan</p>
        <ol className="list-decimal list-inside text-left mt-4 space-y-2 max-w-3xl mx-auto">
          <li>Permohonan izin/persetujuan kepada Menteri c.q Dirjen SDA,</li>
          <li>Pemerikasaan kelengkapan berkas permohonan,</li>
          <li>Verifikasi,</li>
          <li>Permintaan klarifikasi/rekomendasi teknis kepada B/BWS (jika diperlukan),</li>
          <li>Penetapan izin/persetujuan atau penolakan.</li>

          <p>
            Proses perizinan paling lama 14 hari kerja terhitung sejak permohonan dinyatakan lengkap.
          </p>
        </ol>
      </section>
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Informasi Tambahan
        </h2>
        <p className="text-gray-700 mb-4">
          Untuk informasi lebih lanjut mengenai layanan rekomtek dan konsultasi Rekomtek, silakan hubungi
          kami melalui via nomor WhatsApp di bawah ini :
        </p>
        <p className="text-gray-700 mb-2">Konsultasi cepat:</p>
        <ul className="space-y-1">
          {KONTAK_WA.map((kontak) => (
            <li key={kontak.nomor}>
              <a href={`https://wa.me/${kontak.nomor}?text=${encodeURIComponent(PESAN_WA)}`} target="_blank" rel="noopener noreferrer" className="text-green-600 font-medium hover:underline">
                Chat {kontak.nama}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default RekomtekPage;