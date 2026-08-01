"use client";

import type { JSX } from "react";
import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import CommandView from "./components/CommandView";
import ModuleView from "./components/ModuleView";
import MetaphysicsView from "./components/metaphysics/MetaphysicsView";
import CatalogView from "./components/catalog/CatalogView";
import MapView from "./components/map/MapView";
import ArgusView from "./components/argus/ArgusView";
import type { ViewId } from "./lib/views";
import { onNavigateToCommand } from "./lib/commandNav";
import { installWebSpectrBridge } from "./lib/webSpectrBridge";

export default function SpectrOsApp(): JSX.Element {
  const [active, setActive] = useState<ViewId>("command");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    installWebSpectrBridge();
    setReady(true);
  }, []);

  useEffect(() => onNavigateToCommand(() => setActive("command")), []);

  if (!ready) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-base-900 text-sm text-ink-dim">
        Loading Spectr OS…
      </div>
    );
  }

  return (
    <div className="flex h-full w-full bg-base-900 text-ink">
      <Sidebar active={active} onNavigate={setActive} />
      <main className="flex min-h-0 min-w-0 flex-1 bg-base-900">
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
