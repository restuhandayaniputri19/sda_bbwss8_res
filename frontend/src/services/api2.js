import axios from "axios";

let bearerToken = "";
// Default fallback jika environment variable tidak ditemukan
const baseSubPath2 = "/balai/bbwssumatera8/api2";

const axiosWithConfig2 = axios.create();

export const setAxiosConfig2 = (token) => {
  bearerToken = token;
};

axiosWithConfig2.interceptors.request.use((axiosConfig) => {
  // Menggunakan VITE_API2_BASE_URL untuk memisahkan jalur dengan api pertama
  axiosConfig.baseURL = import.meta.env.VITE_API2_BASE_URL || baseSubPath2;
  axiosConfig.headers.Authorization = `Bearer ${bearerToken}`;

  return axiosConfig;
});

export default axiosWithConfig2;