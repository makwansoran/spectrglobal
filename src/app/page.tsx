import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { CeoQuote } from "@/components/sections/ceo-quote";
import { Hero } from "@/components/sections/hero";
import { Offerings } from "@/components/sections/offerings";
import { OfferingsCeoQuote } from "@/components/sections/offerings-ceo-quote";
import { PartnerQuotes } from "@/components/sections/partner-quotes";
import { SoftwareProducts } from "@/components/sections/software-products";
import { TrySpectr } from "@/components/sections/try-spectr";

export default function HomePage() {
  return (
    <>
      <Nav />
      <main id="main-content" className="flex-1">
        <Hero />
        <div className="theme-light">
          <TrySpectr />
          <Offerings />
          <OfferingsCeoQuote />
          <SoftwareProducts />
          <PartnerQuotes />
          <CeoQuote />
        </div>
      </main>
      <Footer />
    </>
  );
}
