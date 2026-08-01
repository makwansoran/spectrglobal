import type {
  DashboardWidget,
  Dataset,
  DatasetPage,
  FeedConfig,
  FeedDef,
  PlatformSnapshot,
  PreviewResult,
  TransformConfig,
  TransformDef,
  WidgetOverride,
  ObjectTypeDef,
  LinkTypeDef,
  ObjectQuery,
  ObjectQueryResult,
  ObjectInstance,
  LinkedObjects
} from "@/os/shared/platform";

export type ChatTurn =
  | { role: "user"; content: string }
  | { role: "assistant"; content: string; toolCalls?: Array<{ id: string; name: string; args: Record<string, unknown> }> }
  | { role: "system"; content: string }
  | { role: "tool"; toolCallId: string; name?: string; content: string };

export type ToolSchema = {
  name: string;
  description: string;
  parameters: {
    type: "object";
    properties: Record<string, unknown>;
    required?: string[];
  };
};

export type CommandChatStreamEvent =
  | { type: "content"; text: string }
  | { type: "tool_call"; call: { id: string; name: string; args: Record<string, unknown> } }
  | { type: "done"; stop: "end" | "tools" }
  | { type: "error"; message: string };

export type SpectrApi = {
  ping: () => Promise<string>;
  window: {
    minimize: () => Promise<void>;
    maximize: () => Promise<boolean>;
    close: () => Promise<void>;
    isMaximized: () => Promise<boolean>;
    onMaximized: (cb: (maximized: boolean) => void) => () => void;
  };
  model: {
    getGraph: () => Promise<{ nodes: unknown[]; edges: unknown[] }>;
    ensureFixedEndpoints: () => Promise<{ nodes: unknown[]; edges: unknown[] }>;
    createNode: (input: unknown) => Promise<unknown>;
    updateNode: (input: unknown) => Promise<unknown>;
    deleteNode: (id: string) => Promise<boolean>;
    createEdge: (input: unknown) => Promise<unknown>;
    updateEdge: (input: unknown) => Promise<unknown>;
    deleteEdge: (id: string) => Promise<boolean>;
    updatePositions: (positions: Array<{ id: string; x: number; y: number }>) => Promise<boolean>;
  };
  data: {
    listTables: () => Promise<unknown[]>;
    getTable: (name: string) => Promise<unknown>;
    createTable: (input: unknown) => Promise<unknown>;
    ensureTable: (input: unknown) => Promise<unknown>;
    dropTable: (name: string) => Promise<boolean>;
    setColumns: (table: string, columns: unknown) => Promise<unknown>;
    ensureColumns: (table: string, columns: unknown) => Promise<unknown>;
    insertRow: (input: unknown) => Promise<unknown>;
    insertRows: (input: unknown) => Promise<unknown>;
    importTable: (input: unknown) => Promise<unknown>;
    updateRow: (input: unknown) => Promise<unknown>;
    deleteRow: (input: unknown) => Promise<boolean>;
    queryRows: (input: unknown) => Promise<unknown[]>;
    addEmployee: (input: unknown) => Promise<unknown>;
    brief: (sampleRows?: number) => Promise<string>;
    dedupeTable: (table: string, column?: string) => Promise<unknown>;
  };
  platform: {
    snapshot: () => Promise<PlatformSnapshot>;
    dashboard: () => Promise<DashboardWidget[]>;
    rows: (datasetId: string, limit?: number, offset?: number) => Promise<DatasetPage | null>;
    resolveCode: (code: string) => Promise<{ kind: string; id: string } | null>;
    previewFeed: (config: FeedConfig) => Promise<PreviewResult>;
    excelSheets: (base64: string) => Promise<string[]>;
    createFeed: (input: {
      label: string;
      config: FeedConfig;
      code?: string;
      description?: string;
    }) => Promise<FeedDef>;
    updateFeed: (
      id: string,
      patch: { label?: string; description?: string; config?: FeedConfig },
    ) => Promise<FeedDef | null>;
    deleteFeed: (id: string) => Promise<boolean>;
    reloadFeed: (id: string) => Promise<FeedDef | null>;
    pushRows: (feedId: string, records: Array<Record<string, unknown>>) => Promise<Dataset | null>;
    createTransform: (input: {
      label: string;
      config: TransformConfig;
      code?: string;
    }) => Promise<TransformDef>;
    updateTransform: (id: string, patch: unknown) => Promise<TransformDef | null>;
    deleteTransform: (id: string) => Promise<boolean>;
    createObjectType: (input: unknown) => Promise<ObjectTypeDef>;
    updateObjectType: (id: string, patch: unknown) => Promise<ObjectTypeDef | null>;
    deleteObjectType: (id: string) => Promise<boolean>;
    createLinkType: (input: unknown) => Promise<LinkTypeDef>;
    updateLinkType: (id: string, patch: unknown) => Promise<LinkTypeDef | null>;
    deleteLinkType: (id: string) => Promise<boolean>;
    searchObjects: (query: ObjectQuery) => Promise<ObjectQueryResult>;
    instance: (id: string) => Promise<ObjectInstance | null>;
    instanceContext: (
      id: string,
    ) => Promise<{ instance: ObjectInstance; links: LinkedObjects[] } | null>;
    followLink: (
      instanceId: string,
      linkTypeId: string,
      direction?: string,
      limit?: number,
    ) => Promise<LinkedObjects | null>;
    datasetWritable: (datasetId: string) => Promise<boolean>;
    setWidgetOverride: (override: WidgetOverride) => Promise<WidgetOverride>;
    resetWidgetOverride: (widgetId: string) => Promise<boolean>;
    onChanged: (cb: (snapshot: PlatformSnapshot) => void) => () => void;
  };
  commandChat: {
    status: () => Promise<{
      configured: boolean;
      provider: string;
      model: string;
      baseUrl: string;
    }>;
    send: (requestId: string, turns: ChatTurn[], tools?: ToolSchema[]) => Promise<boolean>;
    abort: (requestId: string) => Promise<boolean>;
    onDelta: (cb: (requestId: string, event: CommandChatStreamEvent) => void) => () => void;
  };
};

declare global {
  interface Window {
    spectr: SpectrApi;
  }
}

export {};
