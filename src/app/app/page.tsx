"use client";

import dynamic from "next/dynamic";

const SpectrOsApp = dynamic(() => import("@/os/App"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center text-sm text-[#5b6470]">
      Loading Spectr OS…
    </div>
  ),
});

export default function SpectrAppPage() {
  return <SpectrOsApp />;
}
