import Image from "next/image";
import { WaitlistForm } from "@/components/sections/waitlist-form";
import "./waitlist-section.css";

export function WaitlistSection() {
  return (
    <section id="spectros" className="spectros-waitlist" aria-labelledby="spectros-waitlist-heading">
      <div className="spectros-waitlist__stage">
        <Image
          src="/images/products/spectros-waitlist.png"
          alt="spectrOs running on a laptop"
          fill
          className="spectros-waitlist__photo"
          sizes="100vw"
          quality={90}
        />
      </div>

      <div className="spectros-waitlist__copy">
        <h2 id="spectros-waitlist-heading" className="spectros-waitlist__title">
          Be one of the first
          <br />
          to use spectrOs
        </h2>
        <div className="spectros-waitlist__cta">
          <p className="spectros-waitlist__lede">
            We&apos;re soon releasing. Join the waitlist and we&apos;ll email you when it&apos;s ready.
          </p>
          <WaitlistForm />
        </div>
      </div>
    </section>
  );
}
