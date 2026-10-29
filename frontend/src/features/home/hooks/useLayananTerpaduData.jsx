import { useEffect, useState } from "react";

import { getLayananTerpadu } from "../../../services/layanan-terpadu";

export const useLayananTerpaduData = () => {
  const [layananTerpaduData, setLayananTerpaduData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLayananTerpadu = async () => {
      try {
        setLoading(true);
        const response = await getLayananTerpadu();

        if (response) {
          // Tangani jika response berbentuk { data: [...] } atau array langsung
          setLayananTerpaduData(response.data || response);
        }
      } catch (err) {
        console.error("Error fetching layanan terpadu data:", err);
        setError("Gagal memuat data Layanan Terpadu.");
      } finally {
        setLoading(false);
      }
    };

    fetchLayananTerpadu();
  }, []);

  return { layananTerpaduData, loading, error };
};