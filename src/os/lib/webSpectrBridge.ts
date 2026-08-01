/**
 * Browser stand-in for the Electron preload `window.spectr` bridge.
 * Platform/data/model degrade gracefully; command chat proxies via Next API.
 */

import type { PlatformSnapshot } from "@/os/shared/platform";
import type {
  ChatTurn,
  CommandChatStreamEvent,
  SpectrApi,
  ToolSchema,
} from "@/os/lib/spectrApi";

const EMPTY_SNAPSHOT: PlatformSnapshot = {
  feeds: [],
  datasets: [],
  transforms: [],
  objectTypes: [],
  linkTypes: [],
  widgetOverrides: [],
};

const platformListeners = new Set<(snapshot: PlatformSnapshot) => void>();

function emitPlatform(snapshot: PlatformSnapshot): void {
  platformListeners.forEach((cb) => cb(snapshot));
}

async function commandChatStatus() {
  try {
    const res = await fetch("/api/command-chat/status");
    if (!res.ok) {
      return {
        configured: false,
        provider: "none",
        model: "",
        baseUrl: "",
      };
    }
    return (await res.json()) as {
      configured: boolean;
      provider: string;
      model: string;
      baseUrl: string;
    };
  } catch {
    return { configured: false, provider: "none", model: "", baseUrl: "" };
  }
}

const commandChatDeltaListeners = new Set<
  (requestId: string, event: CommandChatStreamEvent) => void
>();

export const webSpectrApi: SpectrApi = {
  ping: async (): Promise<string> => "pong-web",

  window: {
    minimize: async (): Promise<void> => undefined,
    maximize: async (): Promise<boolean> => false,
    close: async (): Promise<void> => undefined,
    isMaximized: async (): Promise<boolean> => false,
    onMaximized: (_cb: (maximized: boolean) => void): (() => void) => () => undefined,
  },

  model: {
    getGraph: async () => ({ nodes: [], edges: [] }),
    ensureFixedEndpoints: async () => ({ nodes: [], edges: [] }),
    createNode: async () => {
      throw new Error("Model graph API is not available in the web demo yet.");
    },
    updateNode: async () => null,
    deleteNode: async () => false,
    createEdge: async () => null,
    updateEdge: async () => null,
    deleteEdge: async () => false,
    updatePositions: async () => true,
  },

  data: {
    listTables: async () => [],
    getTable: async () => null,
    createTable: async () => {
      throw new Error("Local data plane is not available in the web demo yet.");
    },
    ensureTable: async () => {
      throw new Error("Local data plane is not available in the web demo yet.");
    },
    dropTable: async () => false,
    setColumns: async () => {
      throw new Error("Local data plane is not available in the web demo yet.");
    },
    ensureColumns: async () => {
      throw new Error("Local data plane is not available in the web demo yet.");
    },
    insertRow: async () => {
      throw new Error("Local data plane is not available in the web demo yet.");
    },
    insertRows: async () => {
      throw new Error("Local data plane is not available in the web demo yet.");
    },
    importTable: async () => {
      throw new Error("Local data plane is not available in the web demo yet.");
    },
    updateRow: async () => {
      throw new Error("Local data plane is not available in the web demo yet.");
    },
    deleteRow: async () => false,
    queryRows: async () => [],
    addEmployee: async () => {
      throw new Error("Local data plane is not available in the web demo yet.");
    },
    brief: async () => "No local tables in the web demo.",
    dedupeTable: async () => ({ removed: 0 }),
  },

  platform: {
    snapshot: async () => EMPTY_SNAPSHOT,
    dashboard: async () => [],
    rows: async () => null,
    resolveCode: async () => null,
    previewFeed: async () => {
      throw new Error("Platform feeds are not available in the web demo yet.");
    },
    excelSheets: async () => [],
    createFeed: async () => {
      throw new Error("Platform feeds are not available in the web demo yet.");
    },
    updateFeed: async () => null,
    deleteFeed: async () => false,
    reloadFeed: async () => null,
    pushRows: async () => {
      throw new Error("Platform feeds are not available in the web demo yet.");
    },
    createTransform: async () => {
      throw new Error("Platform transforms are not available in the web demo yet.");
    },
    updateTransform: async () => null,
    deleteTransform: async () => false,
    createObjectType: async () => {
      throw new Error("Ontology edits are not available in the web demo yet.");
    },
    updateObjectType: async () => null,
    deleteObjectType: async () => false,
    createLinkType: async () => {
      throw new Error("Ontology edits are not available in the web demo yet.");
    },
    updateLinkType: async () => null,
    deleteLinkType: async () => false,
    searchObjects: async (query) => ({
      objectTypeId: query.objectTypeId,
      instances: [],
      total: 0,
    }),
    instance: async () => null,
    instanceContext: async () => null,
    followLink: async (_instanceId, linkTypeId, direction = "forward") => ({
      linkTypeId,
      linkCode: "",
      direction: direction === "reverse" ? "reverse" : "forward",
      label: "",
      targetObjectTypeId: "",
      instances: [],
      total: 0,
    }),
    datasetWritable: async () => false,
    setWidgetOverride: async () => {
      throw new Error("Dashboard overrides are not available in the web demo yet.");
    },
    resetWidgetOverride: async () => false,
    onChanged: (cb): (() => void) => {
      platformListeners.add(cb);
      return () => platformListeners.delete(cb);
    },
  },

  commandChat: {
    status: commandChatStatus,
    send: async (
      requestId: string,
      turns: ChatTurn[],
      tools?: ToolSchema[]
    ): Promise<boolean> => {
      const res = await fetch("/api/command-chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, turns, tools }),
      });
      if (!res.ok || !res.body) {
        const message = (await res.text().catch(() => "")) || "Command chat request failed.";
        commandChatDeltaListeners.forEach((cb) =>
          cb(requestId, { type: "error", message })
        );
        return false;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const chunks = buffer.split("\n");
        buffer = chunks.pop() ?? "";
        for (const line of chunks) {
          const trimmed = line.trim();
          if (!trimmed) continue;
          try {
            const raw = JSON.parse(trimmed) as Record<string, unknown>;
            // Normalize API `{ type: "text" }` → Spectr `{ type: "content" }`
            const event: CommandChatStreamEvent =
              raw.type === "text" && typeof raw.text === "string"
                ? { type: "content", text: raw.text }
                : (raw as CommandChatStreamEvent);
            commandChatDeltaListeners.forEach((cb) => cb(requestId, event));
          } catch {
            // ignore malformed stream lines
          }
        }
      }
      return true;
    },
    abort: async (requestId: string): Promise<boolean> => {
      try {
        const res = await fetch("/api/command-chat/abort", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ requestId }),
        });
        return res.ok;
      } catch {
        return false;
      }
    },
    onDelta: (
      cb: (requestId: string, event: CommandChatStreamEvent) => void
    ): (() => void) => {
      commandChatDeltaListeners.add(cb);
      return () => commandChatDeltaListeners.delete(cb);
    },
  },
};

export function installWebSpectrBridge(): void {
  if (typeof window === "undefined") return;
  window.spectr = webSpectrApi;
  emitPlatform(EMPTY_SNAPSHOT);
}
