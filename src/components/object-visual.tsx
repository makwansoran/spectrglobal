type ObjectVisualProps = {
  visual: string;
  className?: string;
};

export function ObjectVisual({ visual, className }: ObjectVisualProps) {
  return (
    <svg
      aria-hidden="true"
      className={className ?? "h-full w-full"}
      fill="none"
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="400" height="300" fill="#f0f0f0" />

      {visual === "arc" && (
        <>
          <path d="M 60 260 A 180 180 0 0 1 340 260" stroke="#111" strokeWidth="1.5" fill="none" />
          <path d="M 90 260 A 150 150 0 0 1 310 260" stroke="#111" strokeWidth="1" fill="none" opacity="0.4" />
          <path d="M 120 260 A 120 120 0 0 1 280 260" stroke="#111" strokeWidth="1" fill="none" opacity="0.25" />
          <line x1="200" y1="80" x2="200" y2="260" stroke="#111" strokeWidth="1" opacity="0.2" />
        </>
      )}

      {visual === "grid" && (
        <>
          {[0,1,2,3,4,5,6].map((i) => (
            <line key={`v${i}`} x1={60 + i * 47} y1="50" x2={60 + i * 47} y2="250" stroke="#111" strokeWidth="0.75" opacity="0.3" />
          ))}
          {[0,1,2,3,4,5].map((i) => (
            <line key={`h${i}`} x1="60" y1={50 + i * 40} x2="340" y2={50 + i * 40} stroke="#111" strokeWidth="0.75" opacity="0.3" />
          ))}
          <rect x="107" y="90" width="47" height="80" fill="#111" opacity="0.8" />
          <rect x="154" y="130" width="47" height="40" fill="#111" opacity="0.5" />
          <rect x="201" y="50" width="47" height="120" fill="#111" opacity="0.35" />
          <rect x="248" y="110" width="47" height="60" fill="#111" opacity="0.6" />
        </>
      )}

      {visual === "wave" && (
        <>
          <path d="M 40 150 Q 100 100 160 150 Q 220 200 280 150 Q 340 100 400 150" stroke="#111" strokeWidth="1.5" fill="none" />
          <path d="M 40 170 Q 100 120 160 170 Q 220 220 280 170 Q 340 120 400 170" stroke="#111" strokeWidth="1" fill="none" opacity="0.4" />
          <path d="M 40 190 Q 100 140 160 190 Q 220 240 280 190 Q 340 140 400 190" stroke="#111" strokeWidth="0.75" fill="none" opacity="0.2" />
          <path d="M 40 130 Q 100 80 160 130 Q 220 180 280 130 Q 340 80 400 130" stroke="#111" strokeWidth="1" fill="none" opacity="0.3" />
        </>
      )}

      {visual === "dot" && (
        <>
          {Array.from({ length: 8 }, (_, row) =>
            Array.from({ length: 10 }, (_, col) => (
              <circle
                key={`${row}-${col}`}
                cx={60 + col * 30}
                cy={60 + row * 26}
                r={(row + col) % 3 === 0 ? 3 : 1.5}
                fill="#111"
                opacity={(row + col) % 3 === 0 ? 0.8 : 0.2}
              />
            ))
          )}
        </>
      )}

      {visual === "ring" && (
        <>
          <circle cx="200" cy="150" r="110" stroke="#111" strokeWidth="1" fill="none" opacity="0.15" />
          <circle cx="200" cy="150" r="80" stroke="#111" strokeWidth="1" fill="none" opacity="0.3" />
          <circle cx="200" cy="150" r="50" stroke="#111" strokeWidth="1.5" fill="none" opacity="0.6" />
          <circle cx="200" cy="150" r="20" fill="#111" opacity="0.9" />
          <circle cx="310" cy="150" r="5" fill="#111" />
          <circle cx="200" cy="40" r="5" fill="#111" />
        </>
      )}

      {visual === "bar" && (
        <>
          {[70, 110, 50, 90, 130, 60, 100, 80, 120, 45].map((h, i) => (
            <rect key={i} x={40 + i * 33} y={250 - h} width="22" height={h} fill="#111" opacity={0.15 + i * 0.08} />
          ))}
          <line x1="40" y1="250" x2="360" y2="250" stroke="#111" strokeWidth="1" opacity="0.3" />
        </>
      )}

      {visual === "helix" && (
        <>
          <path d="M 200 40 C 260 80 260 120 200 150 C 140 180 140 220 200 260" stroke="#111" strokeWidth="1.5" fill="none" />
          <path d="M 200 40 C 140 80 140 120 200 150 C 260 180 260 220 200 260" stroke="#111" strokeWidth="1" fill="none" opacity="0.4" />
          {[60, 90, 120, 150, 180, 210, 240].map((y, i) => (
            <line key={i} x1="155" y1={y} x2="245" y2={y} stroke="#111" strokeWidth="0.75" opacity="0.2" />
          ))}
        </>
      )}

      {visual === "prism" && (
        <>
          <polygon points="200,50 320,240 80,240" stroke="#111" strokeWidth="1.5" fill="none" />
          <polygon points="200,80 300,230 100,230" stroke="#111" strokeWidth="1" fill="none" opacity="0.35" />
          <polygon points="200,110 280,220 120,220" stroke="#111" strokeWidth="0.75" fill="none" opacity="0.2" />
          <line x1="200" y1="50" x2="200" y2="240" stroke="#111" strokeWidth="0.75" opacity="0.15" />
        </>
      )}

      {visual === "mesh" && (
        <>
          {[[80,80],[200,60],[320,80],[360,150],[320,220],[200,240],[80,220],[40,150]].map(([x,y], i, arr) => {
            const next = arr[(i+1) % arr.length];
            return <line key={i} x1={x} y1={y} x2={next[0]} y2={next[1]} stroke="#111" strokeWidth="1" opacity="0.3" />;
          })}
          {[[80,80],[200,60],[320,80],[360,150],[320,220],[200,240],[80,220],[40,150]].map(([x,y], i) => (
            <line key={`c${i}`} x1={x} y1={y} x2="200" y2="150" stroke="#111" strokeWidth="0.5" opacity="0.15" />
          ))}
          <circle cx="200" cy="150" r="4" fill="#111" />
        </>
      )}

      {visual === "orbit" && (
        <>
          <ellipse cx="200" cy="150" rx="150" ry="50" stroke="#111" strokeWidth="1" fill="none" opacity="0.3" />
          <ellipse cx="200" cy="150" rx="100" ry="80" stroke="#111" strokeWidth="1" fill="none" opacity="0.2" transform="rotate(60 200 150)" />
          <ellipse cx="200" cy="150" rx="120" ry="35" stroke="#111" strokeWidth="1" fill="none" opacity="0.2" transform="rotate(-40 200 150)" />
          <circle cx="200" cy="150" r="12" fill="#111" opacity="0.9" />
          <circle cx="350" cy="150" r="5" fill="#111" opacity="0.6" />
          <circle cx="144" cy="83" r="4" fill="#111" opacity="0.5" />
        </>
      )}

      {visual === "field" && (
        <>
          {Array.from({ length: 6 }, (_, row) =>
            Array.from({ length: 9 }, (_, col) => {
              const x = 50 + col * 34;
              const y = 60 + row * 36;
              const angle = (row * 30 + col * 20) * (Math.PI / 180);
              return (
                <line
                  key={`${row}-${col}`}
                  x1={x}
                  y1={y}
                  x2={x + Math.cos(angle) * 12}
                  y2={y + Math.sin(angle) * 12}
                  stroke="#111"
                  strokeWidth="1"
                  opacity="0.4"
                />
              );
            })
          )}
        </>
      )}

      {visual === "pulse" && (
        <>
          <polyline
            points="40,150 80,150 100,90 120,210 140,120 160,180 180,150 220,150 240,70 260,230 280,120 300,170 320,150 360,150"
            stroke="#111"
            strokeWidth="1.5"
            fill="none"
          />
          <line x1="40" y1="150" x2="360" y2="150" stroke="#111" strokeWidth="0.5" opacity="0.2" strokeDasharray="4 4" />
        </>
      )}
    </svg>
  );
}
