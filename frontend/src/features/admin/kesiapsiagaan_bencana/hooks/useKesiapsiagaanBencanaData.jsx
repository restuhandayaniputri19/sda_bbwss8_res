import { useCallback, useEffect, useState } from "react";

import { getKesiapsiagaanBencana } from "../../../../services/kesiapsiagaan_bencana/api";

export const useKesiapsiagaanBencanaData = () => {
  const [kesiapsiagaanBencanaData, setKesiapsiagaanBencanaData] = useState([]);
  const [params, setParams] = useState({
    page: 0,
    sort: "newest",
    search: "",
  });
  const [paginationInfo, setPaginationInfo] = useState({
    currentPage: 1,
    itemsPerPage: 0,
    totalItems: 0,
    totalPages: 0,
  });

  const fetchKesiapsiagaanBencanaData = useCallback(async () => {
    try {
      const response = await getKesiapsiagaanBencana(params);

      if (response && response.data) {
        setKesiapsiagaanBencanaData(response.data);
        setPaginationInfo({
          currentPage: response.meta.currentPage,
          itemsPerPage: response.meta.itemsPerPage,
          totalPages: response.meta.totalPages,
          totalItems: response.meta.totalItems,
        });
      }
    } catch (error) {
      console.error("Error fetching kesiapsiagaan bencana data:", error);
    }
  }, [params]);

  useEffect(() => {
    fetchKesiapsiagaanBencanaData();
  }, [fetchKesiapsiagaanBencanaData]);

  return { kesiapsiagaanBencanaData, setParams, params, paginationInfo };
};
