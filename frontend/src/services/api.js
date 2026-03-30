import axios from "axios";

let bearerToken = "";
const baseSubPath = "/balai/bbwssumatera8/api";

const axiosWithConfig = axios.create();

export const setAxiosConfig = (token) => {
  bearerToken = token;
};

axiosWithConfig.interceptors.request.use((axiosConfig) => {
  axiosConfig.baseURL = "";
  axiosConfig.headers.Authorization = `Bearer ${bearerToken}`;

  return axiosConfig;
});

export default axiosWithConfig;
