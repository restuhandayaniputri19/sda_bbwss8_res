import axios from "axios";

// Default fallback jika environment variable tidak ditemukan
const baseSubPath2 = "/balai/bbwssumatera8/api2";

const axiosWithConfig2 = axios.create();

export const setAxiosConfig2 = (token) => {
  localStorage.setItem("token", token); // Simpan token di localStorage
};

axiosWithConfig2.interceptors.request.use((axiosConfig) => {
  // Menggunakan VITE_API2_BASE_URL untuk memisahkan jalur dengan api pertama
  axiosConfig.baseURL = import.meta.env.VITE_API2_BASE_URL || baseSubPath2;
  const token = localStorage.getItem("token");

  if (token) {
    axiosConfig.headers.Authorization = `Bearer ${token}`;
  } else {
    // Jika tidak ada token, sebaiknya hapus header Authorization 
    // agar tidak mengirim "Bearer undefined" atau "Bearer null"
    delete axiosConfig.headers.Authorization;
  }
  return axiosConfig;
});

axiosWithConfig2.interceptors.response.use(
  (response) => response, // Jika request sukses, teruskan response
  (error) => {
    // Cek apakah error berasal dari server dan statusnya 401 (Unauthorized)
    if (error.response && error.response.status === 401) {
      console.warn("Sesi habis atau token tidak valid. Mengalihkan ke Login...");
      
      // 1. Hapus token yang sudah 'basi' dari penyimpanan
      localStorage.removeItem("token");

      // 2. Redirect ke halaman login
      // window.location.href digunakan agar aplikasi melakukan reload total
      // dan membersihkan sisa-sisa state lama.
      window.location.href = "/balai/bbwssumatera8/login";
    }
    
    return Promise.reject(error);
  }
);

export default axiosWithConfig2;