import { useState, useEffect } from "react";
import { getPrediksiCuaca } from "../services/prediksi-cuaca/api";

export const usePrediksiCuacaData = () => {
  const [prediksiCuaca, setPrediksiCuaca] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshData = async () => {
    setLoading(true);
    try {
      const response = await getPrediksiCuaca();
      console.log("Hasil API getPrediksiCuaca:", response); // Debug log untuk melihat hasil API
      // Pastikan mengambil .data jika menggunakan Axios
      const result = response.data?.data ? response.data.data : response.data;
      console.log("Data yang akan disimpan di state:", result); // Debug log untuk melihat data yang akan disimpan
      setPrediksiCuaca(result);
    } catch (error) {
      console.error("Gagal load cuaca:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  return { prediksiCuaca, loading, refreshData };
};