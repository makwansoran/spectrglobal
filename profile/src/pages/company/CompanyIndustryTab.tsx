import { useParams } from "react-router-dom";
import { IndustryMap, hasIndustryAssets } from "../../components/maps/IndustryMap";
import { ProfileTabPanel } from "../../components/ProfileTabPanel";
import { useCompanyProfile } from "../../context/CompanyProfileContext";
import { useCompanyAssets } from "../../hooks/useCompanyAssets";
import { canonicalCompanySlug } from "../../lib/canonicalCompanySlugs";

const ASSET_INDUSTRIES = new Set(["oil_gas", "energy", "shipping", "aviation"]);

export function CompanyIndustryTab() {
  const { companyId } = useParams<{ companyId: string }>();
  const { company, mapGeojson: ctxGeo } = useCompanyProfile();
  const slug = canonicalCompanySlug(companyId) ?? companyId ?? company.id;
  const wantsAssets = ASSET_INDUSTRIES.has(company.industry);
  const { vessels, aircraft, mapGeojson, loading, error, reload, sources, aisMatched } =
    useCompanyAssets(slug, wantsAssets || slug === "frontline-plc-fro", {
      vessels: company.operatingAssets?.vessels,
      aircraft: company.operatingAssets?.aircraft,
      mapGeojson: ctxGeo ?? undefined,
    });

  const blocks = mapGeojson ?? ctxGeo;
  const show = hasIndustryAssets(company, blocks, vessels, aircraft);

  const label =
    company.industryTabLabel ||
    (company.industry === "shipping"
      ? "Fleet"
      : company.industry === "aviation"
        ? "Aircraft"
        : company.industry === "oil_gas" || company.industry === "energy"
          ? "Licences & fields"
          : "Operations");

  return (
    <ProfileTabPanel>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-semibold text-ink">{label}</h2>
          <p className="mt-1 text-sm text-muted">
            {company.industry === "oil_gas" || company.industry === "energy"
              ? "Production licences and fields on the map (Norwegian shelf data where available)."
              : company.industry === "shipping"
                ? "Vessels owned or operated — from fleet pages and our database."
                : company.industry === "aviation"
                  ? "Aircraft in the fleet — from airline fleet pages and our database."
                  : "Operating assets for this company."}
            {sources.length ? ` Sources: ${sources.join(", ")}.` : ""}
          </p>
        </div>
        <button
          type="button"
          className="rounded-lg border border-line px-3 py-1.5 text-sm text-ink hover:bg-canvas disabled:opacity-50"
          disabled={loading}
          onClick={reload}
        >
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {loading && !show ? (
        <p className="text-sm text-muted">Loading operating assets…</p>
      ) : null}

      {error && !show ? (
        <p className="text-sm text-muted">
          {error === "timeout"
            ? "Fleet data is taking longer than usual. Try Refresh again."
            : "Could not load assets. Try refresh."}
        </p>
      ) : null}

      {show ? (
        <IndustryMap
          company={company}
          mapGeojson={blocks}
          vessels={vessels}
          aircraft={aircraft}
          aisMatched={aisMatched}
        />
      ) : !loading ? (
        <p className="text-sm text-muted">
          No mapped assets yet. Open the company again after enrichment runs, or use Refresh to
          scrape fleet / field data from the company website.
        </p>
      ) : null}
    </ProfileTabPanel>
  );
}