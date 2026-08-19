const STEP_COUNT = 4;

export function ProgressSteps({ current }: { current: number }) {
  return (
    <div className="mb-8 flex items-center justify-center gap-2" aria-hidden="true">
      {Array.from({ length: STEP_COUNT }, (_, index) => (
        <span
          key={index}
          className={`h-[3px] w-8 rounded-full ${
            index <= current ? "bg-[#635bff]" : "bg-[#e3e8ee]"
          }`}
        />
      ))}
    </div>
  );
}
