import { useCallback, useEffect, useState } from "react";
import { enrichCompany } from "../api/companies";
import { fetchCompanyAssets } from "../api/assets";
import type { CompanyAircraft, CompanyVessel } from "../types/company";

export function useCompanyAssets(slug: string | undefined, enabled: boolean) {
  const [vessels, setVessels] = useState<CompanyVessel[]>([]);
  const [aircraft, setAircraft] = useState<CompanyAircraft[]>([]);
  const [mapGeojson, setMapGeojson] = useState<GeoJSON.GeoJsonObject | null>(null);
  const [sources, setSources] = useState<string[]>([]);
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
        if (refresh) await enrichCompany(slug, true);
        const data = await fetchCompanyAssets(slug);
        setVessels(data.vessels ?? []);
        setAircraft(data.aircraft ?? []);
        setMapGeojson(data.mapGeojson ?? null);
        setSources(data.sources ?? []);
      } catch {
        setError("load_failed");
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
    loading,
    error,
    reload: () => load(true),
  };
}
