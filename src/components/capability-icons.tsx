type CapabilityIconProps = {
  name: string;
  className?: string;
};

const iconClass = "h-[90px] w-auto max-w-[153px] text-white";

export function CapabilityIcon({ name, className = iconClass }: CapabilityIconProps) {
  switch (name) {
    case "agents":
      return <AgentsIcon className={className} />;
    case "command":
      return <CommandIcon className={className} />;
    case "inspection":
      return <InspectionIcon className={className} />;
    case "ondemand":
      return <OnDemandIcon className={className} />;
    case "dynamic":
      return <DynamicIcon className={className} />;
    case "deploy":
      return <DeployIcon className={className} />;
    default:
      return null;
  }
}

function AgentsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 153 90" fill="none" className={className} aria-hidden="true">
      <circle cx="76.5" cy="28" r="10" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="40" cy="62" r="9" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="113" cy="62" r="9" stroke="currentColor" strokeWidth="1.75" />
      <path d="M68 34 48 54M85 34l20 20" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="76.5" cy="28" r="3.5" fill="currentColor" />
      <circle cx="40" cy="62" r="3" fill="currentColor" />
      <circle cx="113" cy="62" r="3" fill="currentColor" />
      <path d="M49 62h55" stroke="currentColor" strokeWidth="1.75" strokeDasharray="3 3" />
    </svg>
  );
}

function CommandIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 153 90" fill="none" className={className} aria-hidden="true">
      <circle cx="76.5" cy="45" r="28" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="76.5" cy="45" r="16" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="76.5" cy="45" r="4" fill="currentColor" />
      <path d="M76.5 12v10M76.5 68v10M41 45h10M102 45h10" stroke="currentColor" strokeWidth="1.75" />
      <path d="M76.5 45 98 28" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

function InspectionIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 153 90" fill="none" className={className} aria-hidden="true">
      <rect x="34" y="22" width="56" height="46" rx="3" stroke="currentColor" strokeWidth="1.75" />
      <path d="M42 34h40M42 45h28M42 56h34" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="108" cy="48" r="16" stroke="currentColor" strokeWidth="1.75" />
      <path d="M119.5 59.5 132 72" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" />
    </svg>
  );
}

function OnDemandIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 153 90" fill="none" className={className} aria-hidden="true">
      <circle cx="76.5" cy="45" r="28" stroke="currentColor" strokeWidth="1.75" />
      <path d="M68 32v26l24-13-24-13Z" fill="currentColor" />
    </svg>
  );
}

function DynamicIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 153 90" fill="none" className={className} aria-hidden="true">
      <path
        d="M42 58c12-22 28-30 48-24 14 4 24 14 28 24"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path d="M108 48l10 10 10-16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M111 32c-12 22-28 30-48 24-14-4-24-14-28-24"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path d="M45 42 35 32 25 48" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="76.5" cy="45" r="5" fill="currentColor" />
    </svg>
  );
}

function DeployIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 153 90" fill="none" className={className} aria-hidden="true">
      <path
        d="M76.5 18 108 36v28L76.5 82 45 64V36L76.5 18Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path d="M76.5 18v32M108 36 76.5 50 45 36" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="76.5" cy="58" r="5" fill="currentColor" />
    </svg>
  );
}
