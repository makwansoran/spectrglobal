

export function WaitlistSection() {
   return (
    <section className="flex min-h-0 flex-col items-center overflow-hidden bg-[#F1F1F1] px-6 pb-[140px] pt-[128px] text-center">
      <div className="relative w-full max-w-[620px]">
        <h2 className="m-0 text-[clamp(30px,4.4vw,46px)] font-semibold leading-[1.12] tracking-[-0.015em] text-[#0A0A0A]">
          Be one of the first
          <br />
          to use spectrOs
        </h2>

        <p className="mx-auto mb-[40px] mt-[18px] max-w-[440px] text-base leading-[1.6] text-[#6B6B72]">
          We're soon releasing. Join the waitlist and
          we'll email you when it's ready.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-[28px]">
          <button
            type="button"
            className="rounded-full border border-[#0A0A0A] bg-[#0A0A0A] px-[26px] py-[13px] text-sm font-semibold text-white transition-[background,transform] duration-150 hover:bg-[#262626] active:translate-y-px"
          >
            Join the waitlist
          </button>

          <button
            type="button"
            className="group inline-flex items-center gap-[6px] border-0 bg-transparent px-[2px] py-1 text-sm font-medium text-[#0A0A0A]"
          >
            Learn more

            <svg
              width="14"
              height="10"
              viewBox="0 0 14 10"
              fill="none"
              aria-hidden="true"
              className="transition-transform duration-150 group-hover:translate-x-[3px]"
            >
              <path
                d="M8.5 1L13 5.5M13 5.5L8.5 10M13 5.5H1"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
