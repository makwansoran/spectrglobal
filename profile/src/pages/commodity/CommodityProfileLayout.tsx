import { useEffect, useMemo } from "react";
import { Navigate, Outlet, useLocation, useParams } from "react-router-dom";
import { CommodityHero } from "../../components/CommodityHero";
import { TabNav } from "../../components/TabNav";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { ProfileLoading } from "../../components/ProfileLoading";
import { CommodityProfileProvider } from "../../context/CommodityProfileContext";
import { useCommodity } from "../../hooks/useCommodity";
import { companyTabFromPath } from "../../lib/profileTabs";

export function CommodityProfileLayout() {
  const { commodityId } = useParams<{ commodityId: string }>();
  const location = useLocation();
  const { data, loading, error } = useCommodity(commodityId);

  const commodity = data?.profile ?? null;
  const tabs = useMemo(() => {
    if (!commodity) return [];
    const items = [{ id: "overview", label: "Overview" }];
    items.push({ id: "chat", label: "Chat" });
    return items;
  }, [commodity]);

  const tabIds = useMemo(() => new Set(tabs.map((t) => t.id)), [tabs]);
  const activeTab = commodityId ? companyTabFromPath(location.pathname, commodityId) : "overview";
  const basePath = commodityId ? `/${commodityId}` : "/";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

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

  if (activeTab !== "overview" && !tabIds.has(activeTab)) {
    return <Navigate to={basePath} replace />;
  }

  return (
    <CommodityProfileProvider commodity={commodity}>
      <div className="min-h-screen bg-white">
        <SiteHeader />
        <CommodityHero commodity={commodity} />
        <TabNav tabs={tabs} activeId={activeTab} basePath={basePath} chatTabId="chat" />
        <main className="mx-auto max-w-7xl px-4 md:px-6">
          <Outlet />
        </main>
        <SiteFooter />
      </div>
    </CommodityProfileProvider>
  );
}
