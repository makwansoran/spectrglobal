import { Footer } from "@/components/footer";
import { HomeCtaSection } from "@/components/sections/home-cta-section";
import { HomeHero } from "@/components/sections/home-hero";
import { IndustrialSmartSystem } from "@/components/sections/industrial-smart-system";
import { UseCases } from "@/components/sections/usecases";

export default function HomePage() {
  return (
    <>
      <main id="main-content" className="flex-1 bg-white">
        <HomeHero />
        <IndustrialSmartSystem />
        <UseCases />
        <HomeCtaSection />
      </main>
      <Footer />
    </>
  );
}
