import { useState } from 'react';
import VerificationModal from '../../components/VerificationModal';
import rekomtekFlow from '../../assets/rekomtek_flow.png';

const RekomtekPage = () => {
  const [isVerifying, setIsVerifying] = useState(false);

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
        <button onClick={() => setIsVerifying(true)} className="mt-6 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition duration-300">
          Ajukan Rekomtek
        </button>
        <VerificationModal isOpen={isVerifying} setIsOpen={setIsVerifying} />
      </div>
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Prosedur Rekomtek
        </h2>
        <img src={rekomtekFlow} alt="Rekomtek" className="mx-auto my-8 w-full max-w-md rounded-lg shadow-md" />
        <p>Prosedur rekomendasi teknis (rekomtek) sumber daya air melibatkan</p>
        <ol className="list-decimal list-inside text-left mt-4 space-y-2 max-w-3xl mx-auto">
          <li>pengajuan permohonan rekomtek,</li>
          <li>pemeriksaan administrasi,</li>
          <li>Paparan/expose dan peninjauan lapangan,</li>
          <li>Penerbitan Surat Rekomtek,</li>
        </ol>
        </section>
        <section className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Informasi Tambahan
        </h2>
        <p className="text-gray-700 mb-4">
          Untuk informasi lebih lanjut mengenai layanan rekomtek, silakan hubungi
          kami melalui email di <a href="mailto:info@bbwss8.go.id" className="text-blue-600 hover:underline">info@bbwss8.go.id</a>
        </p>
      </section>
      </div>
    
  );
};

export default RekomtekPage;