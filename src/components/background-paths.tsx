"use client";

import { motion } from "framer-motion";

const GRADIENT_ID = "spectr-paths-gradient";

function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 116 }, (_, i) => ({
    id: i,
    d: `M-${420 - i * 2.35 * position} -${230 + i * 2.7}C-${
      390 - i * 2.35 * position
    } -${210 + i * 2.7} -${330 - i * 2.35 * position} ${170 - i * 2.7} ${
      138 - i * 2.35 * position
    } ${318 - i * 2.7}C${612 - i * 2.35 * position} ${456 - i * 2.7} ${
      742 - i * 2.35 * position
    } ${828 - i * 2.7} ${742 - i * 2.35 * position} ${828 - i * 2.7}`,
    width: 0.24 + (i % 10) * 0.024,
  }));

  return (
    <div className="pointer-events-none absolute inset-0">
      <svg
        className="h-full w-full"
        viewBox="0 0 696 316"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <title>Background Paths</title>
        <defs>
          <linearGradient id={GRADIENT_ID} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#635bff" />
            <stop offset="22%" stopColor="#7a5cff" />
            <stop offset="43%" stopColor="#00d4ff" />
            <stop offset="62%" stopColor="#00d924" />
            <stop offset="78%" stopColor="#ffb000" />
            <stop offset="100%" stopColor="#ff4fd8" />
          </linearGradient>
        </defs>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke={`url(#${GRADIENT_ID})`}
            strokeWidth={path.width}
            strokeOpacity={0.18 + (path.id % 18) * 0.025}
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={{
              pathLength: 1,
              opacity: [0.2, 0.78, 0.2],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 18 + path.id * 0.08,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

export function BackgroundPaths() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-white">
      <FloatingPaths position={1} />
      <FloatingPaths position={-1} />
    </div>
  );
}
