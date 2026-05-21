import { API2 } from "..";
import axios from "axios";

export const getGallery = async (params) => {
  try {
    const response = await API2.get("/gallery", {
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
    const response = await API2.delete(`/gallery/${id}`);

    return response.data;
  } catch (error) {
    console.error("Error in delete berita API call:", error);
  }
};

export const postGallery = async (formData) => {
  try {
    const response = await API2.post(`/gallery/upload`, formData, {
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
    const response = await API2.put(`/gallery/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating the form:", error);
    throw error;
  }
};

export const getGalleryDetail = async (id) => {
  try {
    const response = await API2.get(`/gallery/${id}`);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error("An unexpected error occurred.");
    }
  }
};
