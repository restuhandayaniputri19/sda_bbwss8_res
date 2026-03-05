import { useState } from 'react';
import { X } from 'lucide-react';

// Import gambar
import fotoKabalai from '../../assets/pejabat/ka_balai.webp'; 
import fotoPejabat2 from '../../assets/pejabat/kabid_kpisda.webp';
import fotoPejabat3 from '../../assets/pejabat/kabid_op2.webp';
import fotoPejabat4 from '../../assets/pejabat/kabid_pjpa.webp';
import fotoPejabat5 from '../../assets/pejabat/kabid_pjsa.webp';

const ProfilePejabat = () => {
  const [pejabatDipilih, setPejabatDipilih] = useState(null);

  const daftarPejabat = [
    {
      id: 1,
      nama: "Agus Safari ST., MT.",
      jabatan: "Kepala Balai",
      foto: fotoKabalai,
      isKabalai: true,
      biodata: {
        nip: "19700101 199703 1 001",
        pendidikan: "S2 Teknik Sipil - Institut Teknologi Bandung",
        riwayatJabatan: [
          "Kepala Balai Besar Wilayah Sungai Sumatera VIII (2022 - Sekarang)",
          "Kepala Bidang Pelaksanaan Jaringan SDA (2019 - 2022)",
          "Kepala Seksi Perencanaan (2015 - 2019)",
        ],
        kontak: "agus.safari@pu.go.id",
      },
    },
    {
      id: 2,
      nama: "Rifki Maulana ST., MT.",
      jabatan: "KaBid Keterpaduan Pembangunan Infrastruktur SDA",
      foto: fotoPejabat2,
      biodata: {
        nip: "19800202 200501 1 002",
        pendidikan: "S2 Teknik Sumber Daya Air - Universitas Gadjah Mada",
        riwayatJabatan: [
          "Kabid Keterpaduan Pembangunan Infrastruktur SDA (2021 - Sekarang)",
          "Kepala Seksi Perencanaan Teknis (2017 - 2021)",
        ],
        kontak: "rifki.maulana@pu.go.id",
      },
    },
    {
      id: 3,
      nama: "Antonius Suryono S.H., ST., M.Mt.",
      jabatan: "Kabid Operasi dan Pemeliharaan",
      foto: fotoPejabat3,
      biodata: {
        nip: "19750303 200003 1 003",
        pendidikan: "S2 Manajemen Teknik - Universitas Indonesia",
        riwayatJabatan: [
          "Kabid Operasi dan Pemeliharaan (2020 - Sekarang)",
          "Kepala Seksi Operasi (2016 - 2020)",
        ],
        kontak: "antonius.suryono@pu.go.id",
      },
    },
    {
      id: 4,
      nama: "Hendra Yuldi ST. MT.",
      jabatan: "Kabid Pelaksanaan Jaringan Pemanfaatan Air",
      foto: fotoPejabat4,
      biodata: {
        nip: "19820404 200604 1 004",
        pendidikan: "S2 Teknik Sipil - Universitas Diponegoro",
        riwayatJabatan: [
          "Kabid Pelaksanaan Jaringan Pemanfaatan Air (2021 - Sekarang)",
          "Kepala Seksi Jaringan Irigasi (2017 - 2021)",
        ],
        kontak: "hendra.yuldi@pu.go.id",
      },
    },
    {
      id: 5,
      nama: "Danwismai ST. MPSDA",
      jabatan: "Kabid Pelaksanaan Jaringan Sumber Air",
      foto: fotoPejabat5,
      biodata: {
        nip: "19830505 200705 1 005",
        pendidikan: "S2 Pengelolaan Sumber Daya Air - Institut Teknologi Bandung",
        riwayatJabatan: [
          "Kabid Pelaksanaan Jaringan Sumber Air (2022 - Sekarang)",
          "Kepala Seksi Sungai dan Pantai (2018 - 2022)",
        ],
        kontak: "danwismai@pu.go.id",
      },
    },
  ];

  const kabalai = daftarPejabat.find((p) => p.isKabalai);
  const pejabatLain = daftarPejabat.filter((p) => !p.isKabalai);

  const KartuPejabat = ({ pejabat, ukuranFoto = "" }) => (
    <div
      className={`group cursor-pointer ${ukuranFoto}`}
      onClick={() => setPejabatDipilih(pejabat)}
    >
      <div className="relative overflow-hidden rounded-2xl bg-gray-200 shadow-lg aspect-[3/4]">
        <img
          src={pejabat.foto}
          alt={pejabat.nama}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-blue-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
          <span className="text-white font-semibold text-sm border border-white px-4 py-2 rounded-full">
            Lihat Profil
          </span>
        </div>
      </div>
      <div className="mt-6 text-center">
        <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">
          {pejabat.jabatan}
        </p>
        <h3 className="text-xl font-bold text-gray-800 leading-tight">
          {pejabat.nama}
        </h3>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 bg-white">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
          Profil Pejabat
        </h1>
        <div className="h-1 w-20 bg-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-500 text-lg">
          Balai Besar Wilayah Sungai Sumatera VIII
        </p>
      </div>

      {/* Kepala Balai */}
      <div className="flex justify-center mb-20">
        <KartuPejabat pejabat={kabalai} ukuranFoto="w-full md:w-1/2 lg:w-1/4" />
      </div>

      {/* Pejabat Lainnya */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {pejabatLain.map((pejabat) => (
          <KartuPejabat key={pejabat.id} pejabat={pejabat} />
        ))}
      </div>

      {/* POP-UP MODAL */}
      {pejabatDipilih && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={() => setPejabatDipilih(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Tombol Tutup */}
            <button
              onClick={() => setPejabatDipilih(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
            >
              <X size={24} />
            </button>

            {/* Isi Modal */}
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              {/* Foto */}
              <div className="w-40 h-52 flex-shrink-0 rounded-xl overflow-hidden shadow-md mx-auto sm:mx-0">
                <img
                  src={pejabatDipilih.foto}
                  alt={pejabatDipilih.nama}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">
                  {pejabatDipilih.jabatan}
                </p>
                <h2 className="text-2xl font-extrabold text-gray-900 mb-4">
                  {pejabatDipilih.nama}
                </h2>

                <div className="space-y-4 text-sm text-gray-700">
                  {/* NIP */}
                  <div>
                    <p className="font-semibold text-gray-500 uppercase text-xs tracking-wider mb-1">NIP</p>
                    <p>{pejabatDipilih.biodata.nip}</p>
                  </div>

                  {/* Pendidikan */}
                  <div>
                    <p className="font-semibold text-gray-500 uppercase text-xs tracking-wider mb-1">Pendidikan Terakhir</p>
                    <p>{pejabatDipilih.biodata.pendidikan}</p>
                  </div>

                  {/* Riwayat Jabatan */}
                  <div>
                    <p className="font-semibold text-gray-500 uppercase text-xs tracking-wider mb-1">Riwayat Jabatan</p>
                    <ul className="list-disc list-inside space-y-1">
                      {pejabatDipilih.biodata.riwayatJabatan.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Kontak */}
                  <div>
                    <p className="font-semibold text-gray-500 uppercase text-xs tracking-wider mb-1">Kontak / Email</p>
                    <a
                      href={"mailto:" + pejabatDipilih.biodata.kontak}
                      className="text-blue-600 hover:underline">
                      {pejabatDipilih.biodata.kontak}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePejabat;