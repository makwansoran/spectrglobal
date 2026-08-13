import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { Hero } from "@/components/sections/hero";
import { OfferingsCeoQuote } from "@/components/sections/offerings-ceo-quote";
import { SoftwareProducts } from "@/components/sections/software-products";

export default function HomePage() {
  return (
    <>
      <Nav />
      <main id="main-content" className="flex-1">
        <Hero />
        <div className="theme-light">
          <OfferingsCeoQuote />
          <SoftwareProducts />
        </div>
      </main>
      <Footer />
    </>
  );
}
