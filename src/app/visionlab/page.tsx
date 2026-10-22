import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { VisionlabPageView } from "@/components/visionlab-page";
import { buildPageMetadata } from "@/lib/metadata";
import { visionlabPage } from "@/lib/visionlab-page";

export const metadata: Metadata = buildPageMetadata({
  title: visionlabPage.name,
  description: visionlabPage.heroBody,
  path: "/visionlab",
});

export default function VisionLabRoute() {
  return (
    <>
      <VisionlabPageView />
      <Footer />
    </>
  );
}
