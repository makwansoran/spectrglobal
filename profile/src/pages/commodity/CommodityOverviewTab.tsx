import { CommodityAboutSection } from "../../components/sections/CommodityAboutSection";
import { CommoditySidebar } from "../../components/sidebar/CommoditySidebar";
import { ProfileTabPanel } from "../../components/ProfileTabPanel";
import { useCommodityProfile } from "../../context/CommodityProfileContext";

export function CommodityOverviewTab() {
  const commodity = useCommodityProfile();

  return (
    <ProfileTabPanel>
      {commodity.about?.trim() ? (
        <CommodityAboutSection commodity={commodity} />
      ) : (
        <p className="text-sm text-muted">No overview text is available for this contract yet.</p>
      )}
      <div className="mt-6 border-t border-line pt-5">
        <p className="section-label">Details</p>
        <CommoditySidebar commodity={commodity} layout="grid" />
      </div>
    </ProfileTabPanel>
  );
}
