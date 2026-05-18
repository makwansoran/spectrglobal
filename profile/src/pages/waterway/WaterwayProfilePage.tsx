import { useParams } from "react-router-dom";
import { SiteHeader } from "../../components/SiteHeader";
import { MaritimeTrafficMap } from "../../components/maps/MaritimeTrafficMap";
import { useWaterway } from "../../hooks/useWaterway";

export function WaterwayProfilePage() {
  const { waterwayId } = useParams<{ waterwayId: string }>();
  const { data, loading, error } = useWaterway(waterwayId);

  if (loading) {
    return (
      <div className="maritime-page">
        <SiteHeader />
        <div className="maritime-page-body maritime-page-loading">
          <p>Loading waterway…</p>
        </div>
      </div>
    );
  }

  if (error === "not_found" || !data?.profile) {
    return (
      <div className="maritime-page">
        <SiteHeader />
        <div className="maritime-page-body maritime-page-error">
          <h1>Waterway not found</h1>
          <p>Try searching for Strait of Hormuz, Suez Canal, or Panama Canal.</p>
          <a href="/" className="maritime-back-link">
            Back to home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="maritime-page">
      <SiteHeader />
      <div className="maritime-page-body">
        <MaritimeTrafficMap waterway={data.profile} />
      </div>
    </div>
  );
}
