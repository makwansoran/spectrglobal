import { useEffect, useState } from "react";
import { fetchCountry, fetchCountryPoliticians, type CountryPoliticianSummary } from "../api/countries";
import type { CountryProfile } from "../types/country";

export function useCountry(slug: string | undefined) {
  const [profile, setProfile] = useState<CountryProfile | null>(null);
  const [politicians, setPoliticians] = useState<CountryPoliticianSummary[]>([]);
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

    Promise.all([fetchCountry(slug), fetchCountryPoliticians(slug)])
      .then(([country, pols]) => {
        if (!cancelled) {
          setProfile(country.profile);
          setPoliticians(pols);
        }
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

  return { profile, politicians, loading, error };
}
