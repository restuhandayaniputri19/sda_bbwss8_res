import { API2 } from "..";

export const getInfoGrafis = async (params) => {
  try {
    const response = await API2.get("/infografis", {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching infografis:", error);
    throw error;
  }
};

export const deleteInfoGrafis = async (id) => {
  try {
    const response = await API2.delete(`/infografis/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error in delete infografis API call:", error);
    throw error;
  }
};

export const postInfoGrafis = async (formData) => {
  try {
    const response = await API2.post(`/infografis/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error submitting the form:", error);
    throw error;
  }
};

export const editInfoGrafis = async (id, formData) => {
  try {
    const response = await API2.put(`/infografis/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating the form:", error);
    throw error;
  }
};

export const getInfoGrafisDetail = async (id) => {
  try {
    const response = await API2.get(`/infografis/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching infografis detail:", error);
    throw error;
  }
};