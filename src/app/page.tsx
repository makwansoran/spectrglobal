import { Footer } from "@/components/footer";
import { HomeProductField } from "@/components/sections/home-product-field";
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
        <HomeProductField
          id="spectr-edge-compute"
          headingId="spectr-edge-compute-heading"
          title="Spectr Edge compute"
          lede="Compute for AI vision on site. A fraction of the cost of hosting large models."
          image="/images/products/spectr-edge.jpg"
          imageAlt="Spectr Edge compute enclosure"
          ctaHref="/waitlist"
          ctaLabel="Join waitlist"
        />
        <UseCases />
        <OfferingsCeoQuote />
      </main>
      <Footer />
    </>
  );
}
