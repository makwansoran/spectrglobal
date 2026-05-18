import { useEffect, useState } from "react";
import { fetchCompanyFinancials, type CompanyFinancialsPayload } from "../api/financials";

export function useCompanyFinancials(slug: string | undefined) {
  const [data, setData] = useState<CompanyFinancialsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setData(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchCompanyFinancials(slug)
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
