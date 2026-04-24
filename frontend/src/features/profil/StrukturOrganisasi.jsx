import strukturorganisasi from '../../assets/BALAI.jpg'; 

const StrukturOrganisasi = () => { 
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 bg-white">
      {/* Header Halaman */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
          Struktur Organisasi
        </h1>
        <div className="h-1 w-20 bg-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-500 text-lg">
          Balai Besar Wilayah Sungai Sumatera VIII
        </p>
      </div>

      {/* Kontainer Gambar Struktur */}
      <div className="flex justify-center">
        <div className="w-full lg:w-11/12 bg-gray-50 p-4 rounded-3xl shadow-inner border border-gray-100 group">
          <a 
            href={strukturorganisasi} 
            target="_blank" 
            rel="noopener noreferrer"
            title="Klik untuk memperbesar"
            className="block cursor-zoom-in overflow-hidden rounded-2xl bg-white shadow-lg"
          >
            <img 
              src={strukturorganisasi} 
              alt="Struktur Organisasi BBWS Sumatera VIII" 
              className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-[1.02]"
              loading="lazy"
            />
          </a>
          <p className="mt-4 text-center text-sm text-gray-400 italic">
            * Klik gambar untuk melihat dalam ukuran penuh
          </p>
        </div>
      </div>
    </div>
  );
};

export default StrukturOrganisasi;