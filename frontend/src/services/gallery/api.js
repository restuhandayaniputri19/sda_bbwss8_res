import { API2 } from "..";
import axios from "axios";

export const getGallery = async (params) => {
  try {
    const response = await API2.get("/galeri", {
      params: params,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error("An unexpected error occurred.");
    }
  }
};

export const deleteGallery = async (id) => {
  try {
    const response = await API2.delete(`/galeri/${id}`);

    return response.data;
  } catch (error) {
    console.error("Error in delete berita API call:", error);
  }
};

export const postGallery = async (formData) => {
  try {
    const response = await API2.post(`/galeri/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error submitting the form:", error);
    throw error;
  }
};

export const editGallery = async (id, formData) => {
  try {
    const response = await API2.put(`/galeri/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating the form:", error);
    throw error;
  }
};

export const getGalleryDetail = async (id) => {
  console.log("Fetching gallery detail for ID:", id);
  try {
    const response = await API2.get(`/galeri/${id}`);
    console.log("Gallery detail response:", response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error("An unexpected error occurred.");
    }
  }
};
