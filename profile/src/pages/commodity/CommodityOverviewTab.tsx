import { CommodityAboutSection } from "../../components/sections/CommodityAboutSection";
import { CommoditySidebar } from "../../components/sidebar/CommoditySidebar";
import { ProfileTabPanel } from "../../components/ProfileTabPanel";
import { useCommodityProfile } from "../../context/CommodityProfileContext";

export function CommodityOverviewTab() {
  const commodity = useCommodityProfile();

  return (
    <>
      {commodity.about?.trim() ? (
        <ProfileTabPanel title="Overview">
          <CommodityAboutSection commodity={commodity} />
        </ProfileTabPanel>
      ) : (
        <ProfileTabPanel title="Overview">
          <p className="text-sm text-muted">No overview text is available for this contract yet.</p>
        </ProfileTabPanel>
      )}

      <ProfileTabPanel title="Details">
        <CommoditySidebar commodity={commodity} layout="grid" />
      </ProfileTabPanel>
    </>
  );
}
