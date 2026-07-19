"use client";

import { useState, type ReactNode } from "react";
import { LazyBackgroundVideo } from "@/components/lazy-background-video";

type EngineConsoleProps = {
  flyLabel: string;
  configureLabel: string;
  flyTitle: string;
  flyDescription: string;
  configureTitle: string;
  configureDescription: string;
};

export function EngineConsole({
  flyLabel,
  configureLabel,
  flyTitle,
  flyDescription,
  configureTitle,
  configureDescription,
}: EngineConsoleProps) {
  const [mode, setMode] = useState<"fly" | "configure">("fly");

  return (
    <div className="border border-white/10 bg-black">
      <div className="flex border-b border-white/10">
        <TabButton active={mode === "fly"} onClick={() => setMode("fly")}>
          {flyLabel}
        </TabButton>
        <TabButton active={mode === "configure"} onClick={() => setMode("configure")}>
          {configureLabel}
        </TabButton>
      </div>

      {mode === "fly" ? (
        <div className="relative aspect-video bg-black">
          <LazyBackgroundVideo src="/autonomous-engine.mp4" />
          <div className="absolute inset-0 bg-black/35" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-5 pb-6 pt-16 sm:px-8">
            <h3 className="text-2xl font-semibold tracking-[-0.04em] text-white sm:text-3xl">{flyTitle}</h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">{flyDescription}</p>
          </div>
        </div>
      ) : (
        <div className="px-5 py-10 sm:px-8 sm:py-12">
          <h3 className="text-2xl font-semibold tracking-[-0.04em] text-white sm:text-3xl">{configureTitle}</h3>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">{configureDescription}</p>
        </div>
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 px-4 py-4 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors sm:px-6 ${
        active ? "bg-white text-black" : "text-white/55 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}
