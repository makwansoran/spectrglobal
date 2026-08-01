import Image from "next/image";
import { Button } from "@/components/button";

export function TrySpectr() {
  return (
    <section className="scroll-mt-24 py-10 sm:py-12">
      <div className="container-x">
        <div
          className="bevel-panel-image relative aspect-[16/9] bg-surface sm:aspect-[21/9]"
          style={{ ["--bevel-cut" as string]: "16px" }}
        >
          <Image
            src="/images/products/spectr-os-ui-home.png"
            alt="Spectr warehouse intelligence interface"
            fill
            sizes="(max-width: 1280px) 100vw, 80rem"
            className="object-cover object-top"
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
