import { useMemo } from "react";
import { Navigate, useParams } from "react-router-dom";
import { CommodityHero } from "../components/CommodityHero";
import { TabNav } from "../components/TabNav";
import { Section } from "../components/Section";
import { CommoditySidebar } from "../components/sidebar/CommoditySidebar";
import { CommodityAboutSection } from "../components/sections/CommodityAboutSection";
import { useScrollSpy } from "../hooks/useScrollSpy";
import { useCommodity } from "../hooks/useCommodity";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { ProfileLoading } from "../components/ProfileLoading";

export function CommodityProfilePage() {
  const { commodityId } = useParams<{ commodityId: string }>();
  const { data, loading, error } = useCommodity(commodityId);

  const commodity = data?.profile ?? null;

  const tabs = useMemo(() => {
    if (!commodity) return [];
    const items: { id: string; label: string }[] = [];
    if (commodity.about?.trim()) items.push({ id: "overview", label: "Overview" });
    return items;
  }, [commodity]);

  const activeTab = useScrollSpy(
    tabs.map((t) => t.id),
    110
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <SiteHeader />
        <ProfileLoading />
      </div>
    );
  }

  if (error === "not_found" || !commodity) {
    return <Navigate to="/gold" replace />;
  }

  const showAbout = Boolean(commodity.about?.trim());

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <CommodityHero commodity={commodity} />
      <TabNav tabs={tabs} activeId={activeTab} />

      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-8">
          <div className="min-w-0 space-y-14 lg:w-[70%] lg:flex-[7]">
            {showAbout && (
              <Section id="overview" title="About">
                <CommodityAboutSection commodity={commodity} />
              </Section>
            )}
          </div>

          <aside className="lg:w-[30%] lg:flex-[3]">
            <CommoditySidebar commodity={commodity} />
          </aside>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}


