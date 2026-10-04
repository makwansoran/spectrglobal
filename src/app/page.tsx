import { Footer } from "@/components/footer";
import { VisionHome } from "@/components/sections/vision-home";

export default function HomePage() {
  return (
    <>
      <main id="main-content" className="flex-1">
        <VisionHome />
      </main>
      <Footer />
    </>
  );
}
