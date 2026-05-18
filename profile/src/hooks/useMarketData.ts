import { useEffect, useState } from "react";
import { fetchCompanyMarket, type CompanyMarketData } from "../api/market";

export function useMarketData(companySlug: string | undefined, hasTicker: boolean) {
  const [data, setData] = useState<CompanyMarketData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!companySlug || !hasTicker) {
      setData(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetchCompanyMarket(companySlug)
      .then((market) => {
        if (!cancelled) setData(market);
      })
      .catch(() => {
        if (!cancelled) setData(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [companySlug, hasTicker]);

  return { data, loading };
}
