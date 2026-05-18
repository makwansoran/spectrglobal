import { useMemo } from "react";
import { Marker } from "react-leaflet";
import { createVesselShipIcon, isValidVesselPosition } from "../../lib/vesselIcon";
import type { SimulatedVessel } from "../../types/waterway";

type Props = {
  vessel: SimulatedVessel;
  selected: boolean;
  onSelect: (v: SimulatedVessel) => void;
};

export function VesselShipMarker({ vessel, selected, onSelect }: Props) {
  const heading = typeof vessel.heading === "number" && !Number.isNaN(vessel.heading) ? vessel.heading : 0;
  const icon = useMemo(
    () => createVesselShipIcon(vessel.type, heading, selected),
    [vessel.type, heading, selected]
  );

  if (!isValidVesselPosition(vessel.lat, vessel.lng)) return null;

  return (
    <Marker
      position={[vessel.lat, vessel.lng]}
      icon={icon}
      zIndexOffset={selected ? 1000 : 0}
      eventHandlers={{
        click: () => onSelect(vessel),
      }}
    />
  );
}
