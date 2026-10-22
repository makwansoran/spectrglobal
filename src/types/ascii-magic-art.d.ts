declare module "ascii-magic-art/runtime/player.js" {
  export function play(
    pre: HTMLPreElement,
    mod: unknown,
    opts?: {
      speed?: number;
      still?: boolean;
      dom?: boolean;
      look?: Record<string, unknown>;
      maxFps?: number;
      t0?: number;
      onFrame?: (frame: unknown, t: number) => void;
    },
  ): () => void;
}

declare module "ascii-magic-art/pieces/northern-lights.js" {
  export const meta: {
    slug: string;
    name: string;
    cols: number;
    rows: number;
    fps: number;
    palette?: Record<string, string>;
  };

  export default function create(): (t: number) => unknown;
}
