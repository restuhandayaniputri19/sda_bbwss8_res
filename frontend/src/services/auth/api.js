import api from "../api"; // Instance Axios tunggal yang mengarah ke Hono

export const postLogin = async (credentials) => {
  const { username, password, provider } = credentials;
  
  // Tentukan endpoint berdasarkan pilihan dropdown ('a' atau 'b')
  const endpoint = provider === "a" ? "/api/auth/login/a" : "/api/auth/login/b";

  const response = await api.post(endpoint, { username, password });
  return response.data; // Mengembalikan { token }
};