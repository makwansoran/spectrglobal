import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { Benefits } from "@/components/sections/benefits";
import { ClosingCta } from "@/components/sections/closing-cta";
import { Destinations } from "@/components/sections/destinations";
import { Faq } from "@/components/sections/faq";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Marquee } from "@/components/sections/marquee";
import { PartnerQuotes } from "@/components/sections/partner-quotes";
import { Pricing } from "@/components/sections/pricing";
import { Principles } from "@/components/sections/principles";
import { SoftwareProducts } from "@/components/sections/software-products";
import { UseCases } from "@/components/sections/use-cases";

export default function HomePage() {
  return (
    <>
      <Nav />
      <main id="main-content" className="flex-1">
        <Hero />
        <Marquee />
        <Destinations />
        <SoftwareProducts />
        <PartnerQuotes />
        <UseCases />
        <Benefits />
        <HowItWorks />
        <Principles />
        <Pricing />
        <Faq />
        <ClosingCta />
      </main>
      <Footer />
    </>
  );
}
