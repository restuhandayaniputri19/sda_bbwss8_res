import { useState } from 'react';
import { API } from '../../services';

const initialFormState = {
    nama: '',
    instansi: '',
    jenisData: '',
    periodeDari: '',
    periodeSampai: '',
    email: '',
    telepon: '',
    tujuan: '',
    file: null
  };

const PermintaanDataPage = () => {
  const [formData, setFormData] = useState(initialFormState);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Mencegah reload halaman khas React
    
    // Gunakan FormData jika ada upload file
    const dataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      dataToSend.append(key, formData[key]);
    });

    try {
      console.log("Mengirim data:", dataToSend);
      const response = await API.post('/api/permintaan-data', dataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (response.status === 201) {
        alert('Permintaan berhasil dikirim!');
        setFormData(initialFormState); // Reset form setelah submit sukses
      }
    } catch (error) {
      console.error('Gagal mengirim data:', error);
      alert('Terjadi kesalahan saat mengirim permintaan.');
    }
  };

  // Helper untuk update state secara dinamis
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 bg-white">
      {/* Header Halaman */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
          Permintaan Data
        </h1>
        <div className="h-1 w-20 bg-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-500 text-lg">
          Layanan permintaan data hidrologi, klimatologi, dan sumber daya air wilayah BBWS Sumatera VIII
        </p>
      </div>

      {/* Bagian Card Utama */}
<div className="grid grid-cols-1 md:grid-cols-10 gap-8 items-stretch">
  
  {/* Sisi Kiri: Tentang Layanan (Lebar 70% / 7 kolom) */}
  <div className="md:col-span-7 flex flex-col border border-gray-200 rounded-xl overflow-hidden shadow-sm">
    <div className="bg-[#1e3a8a] py-4 px-6">
      <h2 className="text-xl font-bold text-white">Tentang Layanan</h2>
    </div>
    <div className="p-8 flex-grow bg-gray-50">
      <p className="text-gray-700 leading-relaxed mb-4 text-lg">
        Masyarakat, akademisi, dan instansi dapat mengajukan permohonan data. Setiap permohonan wajib disertai surat resmi dan tujuan penggunaan yang jelas.
      </p>
      <p className="text-[#1e3a8a] leading-relaxed font-bold text-lg">
        Data akan dikirimkan dalam waktu 5 - 10 hari kerja.
      </p>
    </div>
  </div>

  {/* Sisi Kanan: Cek Status Permintaan (Lebar 30% / 3 kolom) */}
  <div className="md:col-span-3 flex flex-col border border-gray-200 rounded-xl overflow-hidden shadow-sm">
    <div className="bg-[#ffbe0b] py-4 px-6">
      <h2 className="text-xl font-bold text-gray-900">Cek Status</h2>
    </div>
    <div className="p-6 flex-grow bg-gray-50 flex flex-col justify-center">
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-3">
          <div className="flex-[1.5] flex flex-col gap-1">
            <label className="text-gray-500">Telepon (4 digit akhir)</label>
            <input 
              name="telepon"
              type="text" 
              inputMode="numeric"
              maxLength="4"
              placeholder="4321"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
            />
          </div>

          <div className="flex-1 flex flex-col gap-1">
            <label className="uppercase tracking-wider text-gray-500">PIN</label>
            <input 
              name="pin"
              type="password" 
              inputMode="numeric"
              maxLength="6"
              placeholder="****"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
            />
          </div>
        </div>
        <p className="text-sm text-gray-500">
          Nomor telepon yang anda pergunakan saat mengajukan permohonan data.
        </p>
        <button 
          type="submit" 
          className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-md transition-colors"
        >
          Periksa Status
        </button>
      </form>
    </div>
  </div>
</div>
      
      {/* Bagian Form Permintaan Data */}
      <div className="mt-16 border border-gray-200 rounded-xl overflow-hidden shadow-md">
        <div className="bg-[#1e3a8a] py-4 px-6">
          <h2 className="text-xl font-bold text-white uppercase tracking-wider">Form Permintaan Data</h2>
        </div>
        
        <form className="p-8 bg-white space-y-6" onSubmit={handleSubmit}>
          {/* Baris 1: Nama & Instansi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-semibold text-gray-700">Nama Lengkap:</label>
              <input 
                name="nama"
                onChange={handleChange}
                type="text" 
                className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-600 outline-none" 
                required 
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-semibold text-gray-700">Instansi/Universitas:</label>
              <input
                name="instansi"
                onChange={handleChange}
                type="text" 
                className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-600 outline-none" 
                required 
              />
            </div>
          </div>

          {/* Baris 2: Jenis Data, Dari, Sampai */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-semibold text-gray-700">Jenis Data:</label>
              <select 
                name="jenisData"
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-600 bg-white outline-none"
              >
                <option value="">Pilih Jenis Data</option>
                <option value="debit">Data Debit</option>
                <option value="curahhujan">Data Curah Hujan</option>
                <option value="kualitasair">Data Kualitas Air</option>
                <option value="spasial">Data Spasial</option>
              </select>
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-semibold text-gray-700">Periode Dari:</label>
              <input type="date" name="periodeDari" onChange={handleChange} className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-600 outline-none" />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-semibold text-gray-700">Periode Sampai:</label>
              <input type="date" name="periodeSampai" onChange={handleChange} className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-600 outline-none" />
            </div>
          </div>

          {/* Baris 3: Email & No Telepon */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-semibold text-gray-700">Email:</label>
              <input type="email" name="email" onChange={handleChange} className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-600 outline-none" placeholder="alamat@email.com" />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-semibold text-gray-700">No Telepon:</label>
              <input type="tel" name="telepon" onChange={handleChange} className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-600 outline-none" placeholder="0812xxxx" />
            </div>
          </div>

          {/* Baris 4: Tujuan Penggunaan */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-semibold text-gray-700">Tujuan Penggunaan Data:</label>
            <textarea name="tujuan" onChange={handleChange} rows="4" className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-600 outline-none" placeholder="Jelaskan secara singkat tujuan permohonan data..."></textarea>
          </div>

          {/* Baris 5: Upload File */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-semibold text-gray-700">Upload Surat Permohonan (PDF/JPG):</label>
            <input name="file" type="file" onChange={handleChange} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
          </div>

          {/* Tombol Submit di Sisi Kanan */}
          <div className="flex justify-end pt-4">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-10 rounded shadow-lg transition-colors">
              Kirim Permohonan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PermintaanDataPage;
