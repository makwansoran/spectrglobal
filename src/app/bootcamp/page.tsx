import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { SpectrBootcamp } from "@/components/sections/spectr-bootcamp";
import { spectrBootcamp } from "@/lib/content";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "SPECTR BOOTCAMP",
  description: spectrBootcamp.body,
  path: spectrBootcamp.href,
});

export default function BootcampPage() {
  return (
    <>
      <main id="main-content" className="flex-1 bg-white">
        <SpectrBootcamp />
      </main>
      <Footer />
    </>
  );
}
