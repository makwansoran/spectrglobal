import { Footer } from "@/components/footer";
import { HomeCtaSection } from "@/components/sections/home-cta-section";
import { LogoMarquee } from "@/components/sections/logo-marquee";
import { UseCases } from "@/components/sections/usecases";
import { WaitlistSection } from "@/components/sections/waitlist-section";

export default function HomePage() {
  return (
    <>
      <main id="main-content" className="flex-1 bg-white">
        <WaitlistSection />
        <LogoMarquee />
        <UseCases />
        <HomeCtaSection />
      </main>
      <Footer />
    </>
  );
}
