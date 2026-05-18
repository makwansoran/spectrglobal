import { useEffect, useState } from "react";
import { fetchCommodity, type CommodityPayload } from "../api/commodities";

export function useCommodity(slug: string | undefined) {
  const [data, setData] = useState<CommodityPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      setData(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchCommodity(slug)
      .then((payload) => {
        if (!cancelled) setData(payload);
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setData(null);
          setError(err.message === "not_found" ? "not_found" : "load_failed");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { data, loading, error };
}
