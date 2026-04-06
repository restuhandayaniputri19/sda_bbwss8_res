const WhistleblowingPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 bg-white">

      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
          Whistleblowing System
        </h1>
        <div className="h-1 w-20 bg-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-500 text-lg">
          Saluran pelaporan pelanggaran di lingkungan Kementerian Pekerjaan Umum
        </p>
      </div>

      {/* Card Utama */}
      <div className="grid grid-cols-1 md:grid-cols-10 gap-8 items-stretch">

        {/* Kiri: Tentang WBS */}
        <div className="md:col-span-7 flex flex-col border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="bg-[#1e3a8a] py-4 px-6">
            <h2 className="text-xl font-bold text-white">Tentang Whistleblowing System</h2>
          </div>
          <div className="p-8 flex-grow bg-gray-50 space-y-4">
            <p className="text-gray-700 leading-relaxed text-lg">
              Whistleblowing System (WBS) disediakan oleh Kementerian Pekerjaan Umum
              bagi Anda yang ingin melaporkan suatu perbuatan berindikasi pelanggaran
              yang terjadi di lingkungan Kementerian PU, termasuk BBWS Sumatera VIII.
            </p>
            <p className="text-[#1e3a8a] font-bold text-lg">
              🔒 Identitas pelapor dijaga kerahasiaannya sepenuhnya.
            </p>
            <div className="space-y-2 text-gray-700 text-base">
              <p className="font-semibold">Laporan yang disampaikan wajib memuat:</p>
              <ol className="list-decimal list-inside space-y-1 text-gray-600">
                <li>Siapa, melakukan apa, kapan, di mana, mengapa, dan bagaimana.</li>
                <li>Bukti permulaan (dokumen, gambar, atau rekaman) yang mendukung laporan.</li>
                <li>Data sumber informasi untuk pendalaman lebih lanjut (jika ada).</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Kanan: Jaminan */}
        <div className="md:col-span-3 flex flex-col border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="bg-[#ffbe0b] py-4 px-6">
            <h2 className="text-xl font-bold text-gray-900">Jaminan Pelapor</h2>
          </div>
          <div className="p-6 flex-grow bg-gray-50 flex flex-col gap-3 text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <span className="text-lg">🛡️</span>
              <p>Identitas pelapor <strong>tidak akan diungkapkan</strong> kepada pihak manapun.</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-lg">⚖️</span>
              <p>Pelapor <strong>dilindungi dari pembalasan</strong> sesuai peraturan yang berlaku.</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-lg">🔍</span>
              <p>Setiap laporan ditangani secara <strong>independen dan profesional</strong>.</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-lg">📋</span>
              <p>Laporan dapat dipantau menggunakan <strong>nomor referensi</strong> tanpa membuka identitas.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tombol Utama */}
      <div className="mt-12 border border-gray-200 rounded-xl overflow-hidden shadow-md">
        <div className="bg-[#1e3a8a] py-4 px-6">
          <h2 className="text-xl font-bold text-white uppercase tracking-wider">
            Laporkan Pelanggaran
          </h2>
        </div>
        <div className="p-8 bg-white flex flex-col items-center text-center gap-6">
          <p className="text-gray-600 text-lg max-w-xl">
            Untuk membuat laporan, Anda akan diarahkan ke portal resmi
            Whistleblowing System Kementerian Pekerjaan Umum.
          </p>
          <a
            href="https://wispu.pu.go.id"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-12 rounded-lg shadow-lg transition-colors text-lg"
          >
            🚨 Buka Portal Whistleblowing
          </a>
          
        </div>
      </div>

    </div>
  );
};

export default WhistleblowingPage;
