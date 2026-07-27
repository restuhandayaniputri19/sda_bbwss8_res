import { useEffect, useState } from "react";

import { getKesiapsiagaanBencanaDetail } from "../../../../services/kesiapsiagaan_bencana/api";

export const useKesiapsiagaanBencanaDetail = (id) => {
  const [kesiapsiagaanBencanaDetail, setKesiapsiagaanBencanaDetail] = useState();

  useEffect(() => {
    if (id) {
      const fetchKesiapsiagaanBencanaDetail = async () => {
        try {
          const response = await getKesiapsiagaanBencanaDetail(id);

          if (response) {
            setKesiapsiagaanBencanaDetail(response);
          }
        } catch (error) {
          console.error("Error fetching kesiapsiagaan bencana data:", error);
        }
      };

      fetchKesiapsiagaanBencanaDetail();
    }
  }, [id]);

  return kesiapsiagaanBencanaDetail;
};
