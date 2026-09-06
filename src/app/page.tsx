import { Footer } from "@/components/footer";
import { HomeCtaSection } from "@/components/sections/home-cta-section";
import { HomeHero } from "@/components/sections/home-hero";
import { LogoMarquee } from "@/components/sections/logo-marquee";
import { UseCases } from "@/components/sections/usecases";

export default function HomePage() {
  return (
    <>
      <main id="main-content" className="flex-1 bg-white">
        <HomeHero />
        <LogoMarquee />
        <UseCases />
        <HomeCtaSection />
      </main>
      <Footer />
    </>
  );
}
