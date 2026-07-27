import { API2 } from "..";
import axios from "axios";

export const getKesiapsiagaanBencana = async (params) => {
  try {
    const response = await API2.get("/kesiapsiagaan-bencana", {
      params: params,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error("An unexpected error occurred.");
    }
  }
};

export const deleteKesiapsiagaanBencana = async (id) => {
  try {
    const response = await API2.delete(`/kesiapsiagaan-bencana/${id}`);

    return response.data;
  } catch (error) {
    console.error("Error in delete kesiapsiagaan bencana API call:", error);
  }
};

export const postKesiapsiagaanBencana = async (formData) => {
  try {
    const response = await API2.post(`/kesiapsiagaan-bencana/upload`, formData);
    return response.data;
  } catch (error) {
    console.error("Error submitting the form:", error);
    throw error;
  }
};

export const editKesiapsiagaanBencana = async (id, formData) => {
  try {
    const response = await API2.put(`/kesiapsiagaan-bencana/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating the form:", error);
    throw error;
  }
};

export const getKesiapsiagaanBencanaDetail = async (id) => {
  try {
    const response = await API2.get(`/kesiapsiagaan-bencana/${id}`);
    console.log("Response from getKesiapsiagaanBencanaDetail:", response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error("An unexpected error occurred.");
    }
  }
};
