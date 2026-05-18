import { useEffect, useState } from "react";
import { fetchPerson } from "../api/people";
import type { PersonProfile } from "../types/person";

export function usePerson(slug: string | undefined) {
  const [data, setData] = useState<PersonProfile | null>(null);
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

    fetchPerson(slug)
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
