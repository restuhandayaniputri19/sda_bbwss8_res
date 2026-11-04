import { getBanner } from "../../../services/banner";
import { useEffect, useState } from "react";

export const useBannerData = () => {
  const [bannerData, setBannerData] = useState([]);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await getBanner();
        if (response) {
          setBannerData(response.data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchBanner();
  }, []);

  const banners = bannerData?.map((item) => (
    <img
      key={item.id ?? ""}
      src={item.url ?? ""}
      alt="Banner"
      loading="lazy"
      className="w-full object-cover h-auto" // Ensure full width
    />
  ));

  return { banners };
};
