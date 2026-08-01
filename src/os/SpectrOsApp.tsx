"use client";

import { useEffect, useState, type JSX } from "react";
import dynamic from "next/dynamic";
import Sidebar from "@/os/components/Sidebar";
import CommandView from "@/os/components/CommandView";
import ModuleView from "@/os/components/ModuleView";
import MetaphysicsView from "@/os/components/metaphysics/MetaphysicsView";
import CatalogView from "@/os/components/catalog/CatalogView";
import ArgusView from "@/os/components/argus/ArgusView";
import type { ViewId } from "@/os/lib/views";
import { onNavigateToCommand } from "@/os/lib/commandNav";
import { installWebSpectrBridge } from "@/os/lib/webSpectrBridge";

const MapView = dynamic(() => import("@/os/components/map/MapView"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-[#0a1628] text-sm text-white/55">
      Loading map…
    </div>
  ),
});

export function SpectrOsApp(): JSX.Element {
  const [active, setActive] = useState<ViewId>("command");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    installWebSpectrBridge();
    setReady(true);
  }, []);

  useEffect(() => onNavigateToCommand(() => setActive("command")), []);

  if (!ready) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-white text-sm text-[#5b6470]">
        Loading Spectr OS…
      </div>
    );
  }

  return (
    <div className="flex h-full w-full bg-base-900 text-ink">
      <Sidebar active={active} onNavigate={setActive} />
      <main id="main-content" className="flex min-h-0 min-w-0 flex-1 bg-base-900">
        {active === "command" ? (
          <CommandView />
        ) : active === "metaphysics" ? (
          <div className="min-w-0 flex-1">
            <MetaphysicsView />
          </div>
        ) : active === "catalog" ? (
          <div className="min-h-0 min-w-0 flex-1">
            <CatalogView />
          </div>
        ) : active === "map" ? (
          <div className="relative min-h-0 min-w-0 flex-1">
            <MapView />
          </div>
        ) : active === "argus" ? (
          <div className="min-h-0 min-w-0 flex-1">
            <ArgusView />
          </div>
        ) : (
          <div className="min-w-0 flex-1">
            <ModuleView id={active} />
          </div>
        )}
      </main>
    </div>
  );
}
