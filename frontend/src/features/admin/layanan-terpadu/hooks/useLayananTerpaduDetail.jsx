import { useEffect, useState } from "react";

import { getLayananTerpaduDetail } from "../../../../services/layanan-terpadu";

export const useLayananTerpaduDetail = (id) => {
  const [layananTerpaduDetail, setLayananTerpaduDetail] = useState();
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setLayananTerpaduDetail(undefined);
      setLoading(false);
      setError(null);
      return undefined;
    }

    let isActive = true;
    setLoading(true);
    setError(null);

    const fetchLayananTerpaduDetail = async () => {
      try {
        const response = await getLayananTerpaduDetail(id);
        const record = response?.data?.data ?? response?.data ?? response;

        if (isActive) {
          setLayananTerpaduDetail(record?.id ? record : undefined);
          if (!record?.id) setError("Data layanan tidak ditemukan dalam respons API.");
        }
      } catch (fetchError) {
        console.error("Error fetching layanan terpadu detail:", fetchError);
        if (isActive) setError(fetchError.message || "Gagal memuat data layanan.");
      } finally {
        if (isActive) setLoading(false);
      }
    };

    fetchLayananTerpaduDetail();
    return () => {
      isActive = false;
    };
  }, [id]);

  return { layananTerpaduDetail, loading, error };
};
