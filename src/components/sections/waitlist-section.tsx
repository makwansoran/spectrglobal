import Image from "next/image";
import Link from "next/link";
import { LogoMark } from "@/components/logo";
import "./waitlist-section.css";

export function WaitlistSection() {
  return (
    <section
      id="spectros"
      className="bg-white px-4 pb-16 pt-6 sm:px-6 sm:pb-20 sm:pt-8 lg:pb-[140px]"
      aria-labelledby="industry-preview-title"
    >
      <div className="mx-auto grid w-full max-w-[1400px] items-start gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="spectros-waitlist__intro min-w-0 lg:self-center">
          <h1 id="industry-preview-title" className="home-display">
            AI system
            <br />
            for materials
          </h1>
          <p className="spectros-waitlist__logo">
            <LogoMark className="spectros-waitlist__logo-mark" title="" />
            Spectr
          </p>
        </div>

        <div className="spectros-waitlist__panel min-w-0">
          <Image
            src="/images/products/spectros-waitlist.png"
            alt="spectrOs running on a laptop"
            fill
            priority
            className="spectros-waitlist__image"
            sizes="(max-width: 1024px) 100vw, 44rem"
            quality={90}
          />
          <div className="spectros-waitlist__scrim" aria-hidden="true" />
          <div className="spectros-waitlist__content">
            <h2 id="spectros-waitlist-heading" className="home-display spectros-waitlist__title">
              Be one of the first
              <br />
              to use spectrOs
            </h2>
            <div className="spectros-waitlist__cta">
              <Link href="/waitlist" className="spectros-waitlist__join spectros-waitlist__join--on-media">
                Join waitlist
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
