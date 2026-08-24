import Image from "next/image";
import Link from "next/link";
import { LogoMark } from "@/components/logo";
import "./waitlist-section.css";

export function WaitlistSection() {
  return (
    <>
      <section
        id="spectros"
        className="bg-white px-4 pb-16 pt-6 sm:px-6 sm:pb-20 sm:pt-8"
        aria-labelledby="industry-preview-title"
      >
        <div className="mx-auto grid w-full max-w-[1400px] items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="spectros-waitlist__intro min-w-0 lg:self-center">
            <h1 id="industry-preview-title" className="home-display spectros-waitlist__headline">
              <span className="spectros-waitlist__line">
                <span className="spectros-waitlist__word" data-i="1">
                  <span>AI</span>
                </span>
                <span className="spectros-waitlist__word" data-i="2">
                  <span>system</span>
                </span>
              </span>
              <span className="spectros-waitlist__line">
                <span className="spectros-waitlist__word" data-i="3">
                  <span>for</span>
                </span>
                <span className="spectros-waitlist__word" data-i="4">
                  <span>materials</span>
                </span>
              </span>
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

      <section
        id="spectr-os"
        className="bg-white px-4 pb-16 sm:px-6 sm:pb-20 lg:pb-[80px]"
        aria-labelledby="spectros-product-heading"
      >
        <Link
          href="/platforms/spectr-os"
          className="spectros-waitlist__panel spectros-waitlist__panel--product mx-auto block w-full max-w-[1400px] min-w-0"
          aria-label="Explore Spectr OS"
        >
          <Image
            src="/images/products/spectr-os-ui.png"
            alt=""
            fill
            className="spectros-waitlist__image"
            sizes="(max-width: 1400px) 100vw, 1400px"
            quality={90}
          />
          <div className="spectros-waitlist__scrim" aria-hidden="true" />
          <div className="spectros-waitlist__content spectros-waitlist__content--product">
            <h2 id="spectros-product-heading" className="home-display spectros-waitlist__title spectros-waitlist__title--product">
              Spectr OS
            </h2>
            <p className="spectros-waitlist__lede spectros-waitlist__lede--product">
              The operating system for the enterprise. Fuse data, decide, and act in one runtime.
            </p>
            <div className="spectros-waitlist__cta">
              <span className="spectros-waitlist__join spectros-waitlist__join--on-media">
                Explore Spectr OS
              </span>
            </div>
          </div>
        </Link>
      </section>
    </>
  );
}
