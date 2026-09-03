import Image from "next/image";
import Link from "next/link";
import { GetStartedButton } from "@/components/get-started-button";

export function ClosingCta() {
  return (
    <section className="py-16 sm:py-24">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-[1.75rem]">
          <div className="relative min-h-[28rem] sm:min-h-[34rem]">
            <Image
              src="/images/offerings/spectr-os.jpg"
              alt="Spectr OS running industrial operations"
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-black/45" />
            <div className="relative z-10 flex min-h-[28rem] flex-col justify-end p-8 sm:min-h-[34rem] sm:p-12 lg:p-16">
              <h2 className="display max-w-3xl text-[clamp(2.4rem,6vw,5.5rem)] text-white">
                Own your own operational future.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-white/80 sm:text-lg">
                Build, customize, and deploy Spectr OS with complete control.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <GetStartedButton label="Get started" size="lg">
                  Get started
                </GetStartedButton>
                <Link href="/contact" className="btn btn-lg border-white/30 bg-white/10 text-white hover:bg-white/20">
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
