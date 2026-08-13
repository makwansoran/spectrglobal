import { Footer } from "@/components/footer";
import { Hero } from "@/components/sections/hero";
import { SpectrOsSection } from "@/components/sections/spectr-os-section";

export default function HomePage() {
  return (
    <>
      <main id="main-content" className="flex-1">
        <Hero />
        <div className="theme-light">
          <SpectrOsSection />
        </div>
      </main>
      <Footer />
    </>
  );
}
