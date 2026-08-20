export function UseCases() {
  const useCases = [
    {
      number: "01",
      title: "Defense",
      description:
        "Situational awareness, intelligence, and operational decision-making.",
    },
    {
      number: "02",
      title: "Logistics",
      description:
        "Optimize complex supply chains, assets, and operational flows.",
    },
    {
      number: "03",
      title: "Energy",
      description:
        "Unify operational data across infrastructure, assets, and markets.",
    },
    {
      number: "04",
      title: "Shipping",
      description:
        "Connect fleet, cargo, routes, and operational intelligence.",
    },
    {
      number: "05",
      title: "Manufacturing",
      description:
        "Turn production data into real-time operational insight.",
    },
  ];

  return (
    <section className="bg-[#F1F1F1] px-6 pb-[140px] pt-[128px]">
      <div className="mx-auto w-full max-w-[1100px]">
        <div className="mb-16">
          <h2 className="m-0 text-[clamp(30px,4.4vw,46px)] font-semibold leading-[1.12] tracking-[-0.015em] text-[#0A0A0A]">
            Use Cases
          </h2>
        </div>

        <div className="border-t border-[#D2D2CE]">
          {useCases.map((useCase) => (
            <div
              key={useCase.number}
              className="group grid grid-cols-[48px_1fr] gap-6 border-b border-[#D2D2CE] py-8 sm:grid-cols-[64px_1fr_1.2fr] sm:gap-8"
            >
              <span className="pt-1 font-mono text-[11px] tracking-[0.08em] text-[#8A8A8F]">
                {useCase.number}
              </span>

              <h3 className="m-0 text-2xl font-medium tracking-[-0.02em] text-[#0A0A0A] sm:text-3xl">
                {useCase.title}
              </h3>

              <p className="col-start-2 m-0 max-w-[420px] text-sm leading-[1.6] text-[#6B6B72] sm:col-start-auto sm:text-[15px]">
                {useCase.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}