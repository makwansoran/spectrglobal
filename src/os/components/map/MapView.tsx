import { useEffect, useRef, type JSX } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import MapNavbar from './MapNavbar'

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? ''

/** Deep navy used for chrome + map land fill. */
const NAVY = '#0a1628'
const NAVY_WATER = '#0d2847'
const NAVY_LAND = '#12263f'

function tintDarkBlue(map: mapboxgl.Map): void {
  const style = map.getStyle()
  if (!style?.layers) return

  for (const layer of style.layers) {
    const id = layer.id
    try {
      if (layer.type === 'background') {
        map.setPaintProperty(id, 'background-color', NAVY)
      } else if (layer.type === 'fill' && /water|ocean|sea/i.test(id)) {
        map.setPaintProperty(id, 'fill-color', NAVY_WATER)
      } else if (layer.type === 'fill' && /land|national-park|landcover|landuse/i.test(id)) {
        map.setPaintProperty(id, 'fill-color', NAVY_LAND)
      }
    } catch {
      // Some style layers reject paint overrides; skip those.
    }
  }
}

export default function MapView(): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return
    if (!MAPBOX_TOKEN) return

    mapboxgl.accessToken = MAPBOX_TOKEN

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      projection: 'mercator',
      center: [0, 20],
      zoom: 1.4,
      attributionControl: false,
      logoPosition: 'bottom-left',
      fadeDuration: 0,
      antialias: false,
      pitchWithRotate: false
    })

    map.setProjection('mercator')
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right')

    map.on('style.load', () => {
      map.setProjection('mercator')
      tintDarkBlue(map)
    })

    const ro = new ResizeObserver(() => {
      map.resize()
    })
    ro.observe(containerRef.current)

    mapRef.current = map

    return () => {
      ro.disconnect()
      map.remove()
      mapRef.current = null
    }
  }, [])

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#0a1628]">
      {MAPBOX_TOKEN ? (
        <div ref={containerRef} className="map-dark-blue absolute inset-0 h-full w-full" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center px-8">
          <p className="max-w-md text-center text-sm text-white/55">
              Set <code className="font-mono text-[12px] text-white/80">NEXT_PUBLIC_MAPBOX_TOKEN</code> in{' '}
              <code className="font-mono text-[12px] text-white/80">.env.local</code> to enable the map.
          </p>
        </div>
      )}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20">
        <div className="pointer-events-auto">
          <MapNavbar />
        </div>
      </div>
    </div>
  )
}
