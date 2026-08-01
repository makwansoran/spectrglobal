import type { JSX } from 'react'

/** Full-width Map top bar. Controls will be added later. */
export default function MapNavbar(): JSX.Element {
  return (
    <header className="relative z-20 flex h-12 shrink-0 items-center gap-1 border-b border-white/10 bg-[#0a1628]/90 backdrop-blur-sm px-3">
      <span className="text-[13px] font-medium text-white/90">Map</span>
    </header>
  )
}
