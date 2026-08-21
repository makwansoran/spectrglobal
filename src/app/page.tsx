import { Footer } from "@/components/footer";
import { IndustryPreview } from "@/components/sections/industry-preview";
import { JoinTheTeam } from "@/components/sections/join-the-team";
import { LogoMarquee } from "@/components/sections/logo-marquee";
import { UseCases } from "@/components/sections/usecases";
import { WaitlistSection } from "@/components/sections/waitlist-section";

export default function HomePage() {
  return (
    <>
      <main id="main-content" className="flex-1">
        <IndustryPreview />
        <WaitlistSection />
        <LogoMarquee />
        <UseCases />
        <JoinTheTeam />
      </main>
      <Footer />
    </>
  );
}
