import { useEffect, useState } from "react";

import { getInfoGrafisDetail } from "../../../../services/infografis/api";

export const useInfografisDetail = (id) => {
  const [infografisDetail, setInfografisDetail] = useState();

  useEffect(() => {
    if (id) {
      const fetchInfografisDetail = async () => {
        try {
          const response = await getInfoGrafisDetail(id);

          if (response) {
            setInfografisDetail(response);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      fetchInfografisDetail();
    }
  }, [id]);

  return infografisDetail;
};
