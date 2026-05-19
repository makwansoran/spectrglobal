import { useEffect, useState } from "react";
import { fetchPolitician } from "../api/politicians";
import type { PoliticianProfile } from "../types/politician";

export function usePolitician(slug: string | undefined) {
  const [data, setData] = useState<PoliticianProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      setError("not_found");
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchPolitician(slug)
      .then((profile) => {
        if (!cancelled) setData(profile);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "error");
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
