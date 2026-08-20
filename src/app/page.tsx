import { Footer } from "@/components/footer";
import { CapabilityStack } from "@/components/sections/capability-stack";
import { ClosingCta } from "@/components/sections/closing-cta";
import { IndustryStories } from "@/components/sections/industry-stories";
import { IndustryPreview } from "@/components/sections/industry-preview";
import { LogoMarquee } from "@/components/sections/logo-marquee";
import { ProductSuite } from "@/components/sections/product-suite";

export default function HomePage() {
  return (
    <>
      <main id="main-content" className="flex-1">
        <IndustryPreview />
        <LogoMarquee />
        <IndustryStories />
        <ProductSuite />
        <CapabilityStack />
        <ClosingCta />
      </main>
      <Footer />
    </>
  );
}
