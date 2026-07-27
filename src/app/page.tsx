import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { CeoQuote } from "@/components/sections/ceo-quote";
import { Hero } from "@/components/sections/hero";
import { News } from "@/components/sections/news";
import { Offerings } from "@/components/sections/offerings";
import { PartnerQuotes } from "@/components/sections/partner-quotes";
import { SoftwareProducts } from "@/components/sections/software-products";

export default function HomePage() {
  return (
    <>
      <Nav />
      <main id="main-content" className="flex-1">
        <Hero />
        <Offerings />
        <SoftwareProducts />
        <News />
        <PartnerQuotes />
        <CeoQuote />
      </main>
      <Footer />
    </>
  );
}
