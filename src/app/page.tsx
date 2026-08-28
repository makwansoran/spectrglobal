import { Footer } from "@/components/footer";
import { LogoMarquee } from "@/components/sections/logo-marquee";
import { OfferingsCeoQuote } from "@/components/sections/offerings-ceo-quote";
import { UseCases } from "@/components/sections/usecases";
import { WaitlistSection } from "@/components/sections/waitlist-section";

export default function HomePage() {
  return (
    <>
      <main id="main-content" className="flex-1 bg-white">
        <WaitlistSection />
        <LogoMarquee />
        <UseCases />
        <OfferingsCeoQuote />
      </main>
      <Footer />
    </>
  );
}
