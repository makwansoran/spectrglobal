import { Footer } from "@/components/footer";
import { CapabilityStack } from "@/components/sections/capability-stack";
import { ClosingCta } from "@/components/sections/closing-cta";
import { Hero } from "@/components/sections/hero";
import { IndustryStories } from "@/components/sections/industry-stories";
import { LogoMarquee } from "@/components/sections/logo-marquee";
import { ProductSuite } from "@/components/sections/product-suite";

export default function HomePage() {
  return (
    <>
      <main id="main-content" className="flex-1">
        <Hero />
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
