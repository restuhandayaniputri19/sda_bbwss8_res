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
        <img src="/assets/rekomtek_flow.png" alt="Rekomtek" className="mx-auto my-8 w-full max-w-md rounded-lg shadow-md" />
        <p>Prosedur rekomendasi teknis (rekomtek) sumber daya air melibatkan pengajuan surat permohonan ke kami, melengkapi dokumen teknis, paparan/ekspos, peninjauan lapangan, dan penerbitan <b>surat rekomtek</b>.</p>
        <p>Proses tersebut bertujuan memastikan konstruksi atau penggunaan sumber daya air aman</p>
      </div>
        {/* Konten Halaman */}
    </div>
  );
};

export default RekomtekPage;