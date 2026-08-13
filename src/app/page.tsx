import { Footer } from "@/components/footer";
import { Hero } from "@/components/sections/hero";

export default function HomePage() {
  return (
    <>
      <main id="main-content" className="flex-1">
        <Hero />
      </main>
      <Footer />
    </>
  );
}
