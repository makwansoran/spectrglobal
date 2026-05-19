import { useCallback, useEffect, useState } from "react";
import { enrichCompany, fetchCompanyFilings } from "../api/companies";
import type { Filing } from "../types/company";

export function useCompanyFilings(slug: string | undefined, canLoad: boolean) {
  const [filings, setFilings] = useState<Filing[]>([]);
  const [sources, setSources] = useState<string[]>([]);
  const [loading, setLoading] = useState(Boolean(slug && canLoad));
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (refresh = false) => {
      if (!slug || !canLoad) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        if (refresh) await enrichCompany(slug, true);
        const data = await fetchCompanyFilings(slug, { refresh });
        setFilings(data.filings ?? []);
        setSources(data.sources ?? []);
      } catch {
        setError("load_failed");
      } finally {
        setLoading(false);
      }
    },
    [slug, canLoad]
  );

  useEffect(() => {
    load(false);
  }, [load]);

  return { filings, sources, loading, error, reload: () => load(true) };
}
