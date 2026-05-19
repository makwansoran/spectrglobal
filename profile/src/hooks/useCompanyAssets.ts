import { useCallback, useEffect, useState } from "react";
import { enrichCompany } from "../api/companies";
import { fetchCompanyAssets } from "../api/assets";
import type { CompanyAircraft, CompanyVessel } from "../types/company";

export type CompanyAssetsInitial = {
  vessels?: CompanyVessel[];
  aircraft?: CompanyAircraft[];
  mapGeojson?: GeoJSON.GeoJsonObject | null;
};

export function useCompanyAssets(
  slug: string | undefined,
  enabled: boolean,
  initial?: CompanyAssetsInitial
) {
  const [vessels, setVessels] = useState<CompanyVessel[]>(initial?.vessels ?? []);
  const [aircraft, setAircraft] = useState<CompanyAircraft[]>(initial?.aircraft ?? []);
  const [mapGeojson, setMapGeojson] = useState<GeoJSON.GeoJsonObject | null>(
    initial?.mapGeojson ?? null
  );
  const [sources, setSources] = useState<string[]>([]);
  const [aisMatched, setAisMatched] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(Boolean(slug && enabled));
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (refresh = false) => {
      if (!slug || !enabled) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        if (refresh) {
          try {
            await enrichCompany(slug, true);
          } catch {
            /* still load cached / DB fleet after enrichment errors */
          }
        }
        const controller = new AbortController();
        const timer = window.setTimeout(() => controller.abort(), 25_000);
        try {
          const data = await fetchCompanyAssets(slug, controller.signal);
          setVessels(data.vessels ?? []);
          setAircraft(data.aircraft ?? []);
          setMapGeojson(data.mapGeojson ?? null);
          setSources(data.sources ?? []);
          setAisMatched(data.aisMatched);
        } finally {
          window.clearTimeout(timer);
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          setError("timeout");
        } else {
          setError("load_failed");
        }
      } finally {
        setLoading(false);
      }
    },
    [slug, enabled]
  );

  useEffect(() => {
    load(false);
  }, [load]);

  return {
    vessels,
    aircraft,
    mapGeojson,
    sources,
    aisMatched,
    loading,
    error,
    reload: () => load(true),
  };
}
