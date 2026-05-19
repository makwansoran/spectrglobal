import { useEffect, useState } from "react";
import { fetchVessel } from "../api/vessels";
import type { VesselPayload } from "../types/vessel";

export function useVessel(slug: string | undefined) {
  const [data, setData] = useState<VesselPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      setError("not_found");
      return;
    }

    const ac = new AbortController();
    setLoading(true);
    setError(null);

    fetchVessel(slug, ac.signal)
      .then(setData)
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError(err.message === "not_found" ? "not_found" : "error");
        setData(null);
      })
      .finally(() => setLoading(false));

    return () => ac.abort();
  }, [slug]);

  return { data, loading, error };
}
