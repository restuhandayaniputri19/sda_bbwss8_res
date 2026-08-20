import { API2 } from "./";

const BASE_URL = "/users";

export const getUsers = async (page = 1, limit = 10) => {
  const response = await API2.get(`${BASE_URL}?page=${page}&limit=${limit}`);
  return response.data;
};

export const createUser = async (payload) => {
  const response = await API2.post(BASE_URL, payload);
  return response.data;
};

export const forceSetPassword = async (id, newPassword) => {
  const response = await API2.put(`${BASE_URL}/${id}/force-password`, {
    newPassword,
  });
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await API2.delete(`${BASE_URL}/${id}`);
  return response.data;
};