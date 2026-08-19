"use client";

import { LinuxLogo, MacLogo, WindowsLogo } from "@/components/platform-logos";
import { downloads } from "@/lib/site";

const apps = [
  {
    id: "windows" as const,
    label: "Windows",
    file: "Spectr-Setup-x64.exe",
    href: downloads.windows,
    hint: "Windows 10 / 11 · x64",
    available: true,
    Logo: WindowsLogo,
  },
  {
    id: "mac" as const,
    label: "Mac",
    file: "Spectr-Setup.dmg",
    href: downloads.mac,
    hint: "macOS 13+",
    available: false,
    Logo: MacLogo,
  },
  {
    id: "linux" as const,
    label: "Linux",
    file: "Spectr-Setup.AppImage",
    href: downloads.linux,
    hint: "Ubuntu 22.04+",
    available: false,
    Logo: LinuxLogo,
  },
];

export function InstallerPanel() {
  return (
    <section>
      <p className="ops-kicker">Downloads</p>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {apps.map((app) => (
          <div
            key={app.id}
            className={`flex flex-col border border-black/10 p-6 ${
              app.available ? "bg-white" : "bg-[#fafafa]"
            }`}
          >
            <app.Logo className={`h-11 w-11 ${app.available ? "text-[#0a0a0a]" : "text-[#b0b0b0]"}`} />
            <p className={`mt-5 text-[16px] ${app.available ? "text-[#0a0a0a]" : "text-[#8a8a8a]"}`}>
              {app.label}
            </p>
            <p className="mt-1 font-mono text-[11px] text-[#6b6b6b]">{app.hint}</p>
            {app.available ? (
              <a href={app.href} className="ops-get mt-6 w-fit">
                Download
              </a>
            ) : (
              <span className="ops-unavailable mt-6">Unavailable</span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
