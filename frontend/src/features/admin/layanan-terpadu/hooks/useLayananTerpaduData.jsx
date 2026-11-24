import { useCallback, useEffect, useState } from "react";

import { getLayananTerpadu } from "../../../../services/layanan-terpadu";

export const useLayananTerpaduData = () => {
  const [layananTerpaduData, setLayananTerpaduData] = useState([]);
  const [params, setParams] = useState({
    page: 0,
    sort: "displayOrder",
    search: "",
  });
  const [paginationInfo, setPaginationInfo] = useState({
    currentPage: 1,
    itemsPerPage: 0,
    totalItems: 0,
    totalPages: 0,
  });

  const fetchLayananTerpaduData = useCallback(async () => {
    try {
      const response = await getLayananTerpadu(params);

      if (response && response.data) {
        setLayananTerpaduData(response.data);
        setPaginationInfo({
          currentPage: response.meta.currentPage,
          itemsPerPage: response.meta.itemsPerPage,
          totalPages: response.meta.totalPages,
          totalItems: response.meta.totalItems,
        });
      }
    } catch (error) {
      console.error("Error fetching infografis data:", error);
    }
  }, [params]);

  useEffect(() => {
    fetchLayananTerpaduData();
  }, [fetchLayananTerpaduData]);

  return { layananTerpaduData, setParams, params, paginationInfo };
};
