import { API2 } from "..";
import axios from "axios";

export const postLogin = async (payload) => {
  try {
    const response = await API2.post(`/auth/login`, payload);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Login failed");
    } else {
      throw new Error("An unexpected error occurred.");
    }
  }
};
