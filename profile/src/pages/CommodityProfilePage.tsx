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
import { ChatRoom } from "../components/chat/ChatRoom";

export function CommodityProfilePage() {
  const { commodityId } = useParams<{ commodityId: string }>();
  const { data, loading, error } = useCommodity(commodityId);

  const commodity = data?.profile ?? null;

  const tabs = useMemo(() => {
    if (!commodity) return [];
    const items: { id: string; label: string }[] = [];
    if (commodity.about?.trim()) items.push({ id: "overview", label: "Overview" });
    items.push({ id: "chat", label: "Chat" });
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
      <TabNav tabs={tabs} activeId={activeTab} chatTabId="chat" />

      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="border-t border-line">
          {showAbout && (
            <Section id="overview" title="Overview" variant="profile">
              <CommodityAboutSection commodity={commodity} />
            </Section>
          )}

          <section
            id="chat"
            className="scroll-mt-28 border-b border-line py-12 md:py-14"
          >
            <h2 className="section-title mb-6">Chat</h2>
            <ChatRoom
              roomType="commodity"
              roomSlug={commodity.id}
              roomLabel={commodity.name}
            />
          </section>
        </div>

        <section className="border-t border-line py-12 md:py-14" aria-label="Contract details">
          <h2 className="section-title mb-6">Details</h2>
          <CommoditySidebar commodity={commodity} layout="grid" />
        </section>
      </div>

      <SiteFooter />
    </div>
  );
}
