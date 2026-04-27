import { useState, useEffect } from "react";
import { getPrakiraanCuaca } from "../services/prakiraan-cuaca";

export const usePrakiraanCuacaData = () => {
  const [prakiraanCuaca, setPrakiraanCuaca] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshData = async () => {
    setLoading(true);
    try {
      const response = await getPrakiraanCuaca();
      console.log("Hasil API getPrakiraanCuaca:", response); // Debug log untuk melihat hasil API
      // Pastikan mengambil .data jika menggunakan Axios
      const result = response.data?.data ? response.data.data : response.data;
      console.log("Data yang akan disimpan di state:", result); // Debug log untuk melihat data yang akan disimpan
      setPrakiraanCuaca(result);
    } catch (error) {
      console.error("Gagal load cuaca:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  return { prakiraanCuaca, loading, refreshData };
};