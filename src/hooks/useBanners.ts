import { BannerDto, bannersControllerFindAll } from "@/client";
import { useState } from "react";

const useBanners = () => {
  const [banners, setBanners] = useState<BannerDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const response = await bannersControllerFindAll({
        isShown: true,
      });
      const data = response.data;
      setBanners(data ?? []);
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  return {
    banners,
    loading,
    error,
    fetchBanners,
  };
};

export default useBanners;
