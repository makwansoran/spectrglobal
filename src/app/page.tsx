import { Footer } from "@/components/footer";
import { CapabilityStack } from "@/components/sections/capability-stack";
import { ClosingCta } from "@/components/sections/closing-cta";
import { IndustryStories } from "@/components/sections/industry-stories";
import { IndustryPreview } from "@/components/sections/industry-preview";
import { LogoMarquee } from "@/components/sections/logo-marquee";
import { ProductSuite } from "@/components/sections/product-suite";
import { WaitlistSection } from "@/components/sections/waitlist-section";
import { UseCases } from "@/components/sections/usecases";
import { CareersPageFrontPage } from "./careers/page";

export default function HomePage() {
  return (
    <>
      <main id="main-content" className="flex-1">
        <IndustryPreview />
        <WaitlistSection />
        <LogoMarquee />
        <UseCases />
        <CareersPageFrontPage />
      </main>
      <Footer />
    </>
  );
}

/*
 <IndustryStories />
  <ProductSuite />
  <CapabilityStack />
  <ClosingCta />
*/
