import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { ServicesPageView } from "@/components/services-page";
import { buildPageMetadata } from "@/lib/metadata";
import { servicesPage } from "@/lib/services";

export const metadata: Metadata = buildPageMetadata({
  title: servicesPage.title,
  description: servicesPage.body,
  path: "/services",
});

export default function ServicesRoute() {
  return (
    <>
      <ServicesPageView />
      <Footer />
    </>
  );
}
