import { searchControllerGetSuggestions } from "@/client";
import { pagination } from "@/constants";
import { useCallback, useState } from "react";

const useSearchSuggestions = () => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSuggestions = useCallback(
    async ({
      q,
      page = pagination.page,
      per_page = pagination.per_page,
    }: {
      q?: string;
      page?: number;
      per_page?: number;
    }) => {
      setLoading(true);
      setError(null);
      setSuggestions([]);
      try {
        const response = await searchControllerGetSuggestions({
          q,
          page,
          perPage: per_page,
        });
        if (response.data) {
          setSuggestions(response.data?.map((s) => String(s)) ?? []);
        } else {
          throw new Error("No data received");
        }
      } catch (err) {
        setError("Failed to fetch suggestions");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    suggestions,
    loading,
    error,
    fetchSuggestions,
  };
};

export default useSearchSuggestions;
