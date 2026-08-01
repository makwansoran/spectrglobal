import Image from "next/image";
import { Button } from "@/components/button";

export function TrySpectr() {
  return (
    <section className="scroll-mt-24 py-10 sm:py-12">
      <div className="container-x">
        <div className="relative aspect-[16/9] overflow-hidden bg-black sm:aspect-[21/9]">
          <Image
            src="/images/products/spectr-os-laptop.png"
            alt="Spectr warehouse intelligence on a laptop"
            fill
            sizes="(max-width: 1280px) 100vw, 80rem"
            className="object-cover object-center"
            priority
          />
        </div>

        <div className="mt-6 flex justify-center sm:mt-8">
          <Button href="/login" size="lg">
            Try Spectr Now
          </Button>
        </div>
      </div>
    </section>
  );
}
