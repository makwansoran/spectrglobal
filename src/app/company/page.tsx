import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { HubPageView } from "@/components/hub-page";
import { companyHub } from "@/lib/hubs";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: companyHub.bannerTitle,
  description: companyHub.description,
  path: companyHub.path,
});

export default function CompanyPage() {
  return (
    <>
      <main id="main-content" className="flex-1 bg-white">
        <HubPageView page={companyHub} />
      </main>
      <Footer />
    </>
  );
}
