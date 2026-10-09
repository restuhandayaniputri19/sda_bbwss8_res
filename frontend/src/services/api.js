import axios from "axios";
import { API_BASE_URL } from "./apiBaseUrl";

const axiosWithConfig = axios.create({
  baseURL: API_BASE_URL,
});

export const setAxiosConfig = (token) => {
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
    localStorage.removeItem("auth_source");
  }
};

axiosWithConfig.interceptors.request.use((axiosConfig) => {
  const token = localStorage.getItem("token");
  if (token) {
    axiosConfig.headers.Authorization = `Bearer ${token}`;
  } else {
    delete axiosConfig.headers.Authorization;
  }
  return axiosConfig;
});

axiosWithConfig.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("auth_source");
      window.location.href = "/balai/bbwssumatera8/login";
    }
    return Promise.reject(error);
  }
);

export default axiosWithConfig;