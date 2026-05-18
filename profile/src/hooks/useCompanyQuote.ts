import { useEffect, useState } from "react";
import { fetchCompanyQuote } from "../api/quote";
import type { StockQuote } from "../types/company";

const REFRESH_MS = 60_000;

export function useCompanyQuote(slug: string | undefined, initial?: StockQuote) {
  const [stock, setStock] = useState<StockQuote | undefined>(initial);

  useEffect(() => {
    setStock(initial);
  }, [initial, slug]);

  useEffect(() => {
    if (!slug || !initial?.ticker) return;

    let cancelled = false;

    const load = () => {
      fetchCompanyQuote(slug)
        .then((data) => {
          if (!cancelled && data.stock) setStock(data.stock);
        })
        .catch(() => {
          /* keep initial */
        });
    };

    load();
    const timer = window.setInterval(load, REFRESH_MS);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [slug, initial?.ticker]);

  return stock;
}
