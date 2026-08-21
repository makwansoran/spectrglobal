import Image from "next/image";
import Link from "next/link";
import { ArrowIcon } from "@/components/button";
import { WaitlistForm } from "@/components/sections/waitlist-form";
import "./waitlist-section.css";

export function WaitlistSection() {
  return (
    <section id="spectros" className="spectros-waitlist" aria-labelledby="spectros-waitlist-heading">
      <div className="spectros-waitlist__copy">
        <div>
          <p className="spectros-waitlist__index">01 / 01</p>
          <h2 id="spectros-waitlist-heading" className="spectros-waitlist__title">
            Be one of the first
            <br />
            to use <span>spectrOs</span>
          </h2>
        </div>
        <div className="spectros-waitlist__cta">
          <p className="spectros-waitlist__lede">
            We&apos;re soon releasing. Join the waitlist and we&apos;ll email you when it&apos;s ready.
          </p>
          <WaitlistForm />
          <Link href="/platforms/spectr-os" className="spectros-waitlist__more">
            Learn more
            <ArrowIcon />
          </Link>
        </div>
      </div>

      <div className="spectros-waitlist__stage">
        <Image
          src="/images/products/spectros-laptop.png"
          alt="spectrOs on a laptop"
          width={1533}
          height={1209}
          className="spectros-waitlist__laptop"
          sizes="(max-width: 1024px) 140vw, 70vw"
          quality={90}
        />
      </div>
    </section>
  );
}
