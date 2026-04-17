import React, { useState } from 'react';

const TugasFungsi = () => {
  const [activeTab, setActiveTab] = useState('tugas');

  const daftarTugas = [
    "Berdasarkan Peraturan Menteri Pekerjaan Umum Nomor 1 Tahun 2025 tentang Organisasi dan Tata Kerja Unit Pelaksana Teknis di Kementerian Pekerjaan Umum: Balai Besar Wilayah Sungai mempunyai tugas melaksanakan pengelolaan sumber daya air di wilayah sungai.",
  ];

  const daftarFungsi = [
    "Penyusunan, pemantauan dan evaluasi, penyelenggaraan pola pengelolaan sumber daya air dan rencana pengelolaan sumber daya air pada wilayah sungai.",
    "Penyusunan program pengelolaan sumber daya air dan rencana kegiatan pengelolaan sumber daya air pada wilayah sungai.",
    "Penyusunan studi kelayakan, perencanaan dan fasilitasi pengadaan tanah, dan perencanaan teknis atau desain pengembangan sumber daya air.",
    "Pelaksanaan pengadaan barang/jasa sesuai dengan ketentuan peraturan perundang-undangan.",
    "Pelaksanaan sistem manajemen keselamatan dan kesehatan kerja.",
    "Pengelolaan sumber daya air yang meliputi konservasi sumber daya air, pendayagunaan sumber daya air, dan pengendalian daya rusak air pada wilayah sungai.",
    "Pengelolaan drainase utama perkotaan.",
    "Pengelolaan sistem hidrologi.",
    "Pengelolaan sistem informasi sumber daya air.",
    "Pelaksanaan operasi dan pemeliharaan sumber daya air pada wilayah sungai.",
    "Pelaksanaan pemberian bimbingan teknis pengelolaan sumber daya air yang menjadi kewenangan provinsi dan kabupaten/kota.",
    "Penyusunan dan penyiapan klarifikasi teknis dan rekomendasi teknis dalam perizinan dan persetujuan penggunaan sumber daya air pada wilayah sungai.",
    "Penyusunan dan penyiapan rekomendasi teknis untuk pemanfaatan irigasi dan pengalihan alur sungai.",
    "Penyusunan dan pelaksanaan kajian dan fasilitasi penetapan garis sempadan sungai, danau, situ, jaringan irigasi, mata air, waduk, embung, dan rawa.",
    "Fasilitasi kegiatan tim koordinasi pengelolaan sumber daya air pada wilayah sungai.",
    "Pemberdayaan masyarakat dalam pengelolaan sumber daya air.",
    "Pelaksanaan penyusunan laporan akuntansi keuangan dan akuntansi barang milik/kekayaan negara selaku unit akuntansi wilayah serta pengamanan barang milik/kekayaan negara.",
    "Pelaksanaan pemungutan, penerimaan, dan penggunaan biaya jasa pengelolaan sumber daya air sesuai dengan ketentuan peraturan perundang-undangan.",
    "Penyusunan perjanjian kinerja, laporan kinerja balai, dan penilaian mandiri River Basin Organization.",
    "Pelaksanaan pemantauan dan pengawasan penggunaan sumber daya air dan penyidikan tindak pidana bidang sumber daya air.",
    "Pelaksanaan dan koordinasi pembangunan zona integritas, pelaksanaan fungsi kepatuhan intern dan manajemen risiko sesuai dengan kewenangannya, serta koordinasi administrasi penerapan sistem pengendalian intern balai.",
    "Pelaksanaan urusan tata usaha dan rumah tangga balai serta komunikasi publik dan layanan hukum.",
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      {/* Header Halaman */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
          Tugas Pokok &amp; Fungsi
        </h1>
        <div className="h-1 w-20 bg-blue-600 mx-auto mb-4"></div>
      </div>
      {/* Tombol Switcher */}
      <div className="flex justify-center mb-12">
        <div className="inline-flex p-1 bg-gray-100 rounded-xl shadow-inner">
          <button
            onClick={() => setActiveTab('tugas')}
            className={`px-8 py-3 rounded-lg font-bold transition-all duration-300 ${
              activeTab === 'tugas' ? 'bg-white text-blue-600 shadow-md' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            TUGAS
          </button>
          <button
            onClick={() => setActiveTab('fungsi')}
            className={`px-8 py-3 rounded-lg font-bold transition-all duration-300 ${
              activeTab === 'fungsi' ? 'bg-white text-blue-600 shadow-md' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            FUNGSI
          </button>
        </div>
      </div>

      {/* Konten Daftar */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-500">
        <div className="p-8 md:p-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
            <span className="w-2 h-8 bg-blue-600 rounded-full mr-4"></span>
            {activeTab === 'tugas' ? 'Tugas Utama Balai' : 'Fungsi Strategis Balai'}
          </h2>
          
          <ul className="grid grid-cols-1 gap-4">
            {(activeTab === 'tugas' ? daftarTugas : daftarFungsi).map((item, index) => (
              <li 
  key={index}
  className="flex items-start p-4 rounded-xl hover:bg-blue-50 transition-colors duration-300 border border-transparent hover:border-blue-100 group"
>
  {(activeTab === 'fungsi' || daftarTugas.length > 1) && (
    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold mr-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
      {index + 1}
    </span>
  )}
  <p className="text-gray-700 leading-relaxed pt-1 text-center">
    {item}
  </p>
</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TugasFungsi;