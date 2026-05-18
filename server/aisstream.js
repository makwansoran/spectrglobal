/**
 * AIS Stream (https://aisstream.io) — free tier, server-side only.
 * Browser WebSocket + CORS are not supported; keep AISSTREAM_API_KEY on the server.
 */
const AISSTREAM_URL = "wss://stream.aisstream.io/v0/stream";

const CACHE_TTL_MS = 15_000;
const cache = new Map();
const inflight = new Map();

function isEnabled() {
  return Boolean(String(process.env.AISSTREAM_API_KEY || "").trim());
}

function boundsKey(bounds) {
  return (bounds || []).map((n) => Number(n).toFixed(3)).join(",");
}

function expandBounds(bounds, pad = 0.12) {
  const [south, west, north, east] = bounds;
  return [
    Math.max(-90, south - pad),
    west - pad,
    Math.min(90, north + pad),
    east + pad,
  ];
}

function inBounds(lat, lng, bounds) {
  if (lat == null || lng == null) return false;
  const [south, west, north, east] = bounds;
  if (lat < south || lat > north) return false;
  if (west <= east) return lng >= west && lng <= east;
  return lng >= west || lng <= east;
}

function cleanName(name) {
  const s = String(name || "")
    .replace(/@+$/g, "")
    .trim();
  return s || null;
}

function shipTypeFromAis(typeCode) {
  const t = Number(typeCode);
  if (Number.isNaN(t)) return "general";
  if (t >= 80 && t <= 89) return "tanker";
  if (t >= 70 && t <= 79) return "cargo";
  if (t >= 60 && t <= 69) return "passenger";
  if (t >= 40 && t <= 49) return "passenger";
  return "general";
}

function flagFromMeta(meta, staticData) {
  return (
    cleanName(meta?.Country) ||
    cleanName(staticData?.Flag) ||
    cleanName(meta?.Flag) ||
    "—"
  );
}

function ingestMessage(msg, vessels, bounds) {
  if (!msg || msg.error || msg.Error) return;

  const meta = msg.Metadata || {};
  const type = msg.MessageType;

  if (type === "PositionReport") {
    const pr = msg.Message?.PositionReport;
    if (!pr) return;
    const lat = pr.Latitude ?? meta.Latitude;
    const lng = pr.Longitude ?? meta.Longitude;
    if (!inBounds(lat, lng, bounds)) return;

    const id = String(pr.UserID || meta.MMSI || meta.ShipId || "");
    if (!id) return;

    const prev = vessels.get(id) || { id, mmsi: id };
    vessels.set(id, {
      ...prev,
      lat,
      lng,
      speed: typeof pr.Sog === "number" ? Math.round(pr.Sog * 10) / 10 : prev.speed ?? 0,
      heading:
        typeof pr.Cog === "number"
          ? Math.round(pr.Cog)
          : typeof pr.TrueHeading === "number"
            ? Math.round(pr.TrueHeading)
            : prev.heading ?? 0,
      name: prev.name || cleanName(meta.ShipName) || `MMSI ${id}`,
      flag: prev.flag || flagFromMeta(meta),
      type: prev.type || "general",
      destination: prev.destination || "—",
      progress: 0,
    });
    return;
  }

  if (type === "ShipStaticData") {
    const sd = msg.Message?.ShipStaticData;
    if (!sd) return;

    const id = String(sd.UserID || meta.MMSI || meta.ShipId || "");
    if (!id) return;

    const prev = vessels.get(id) || { id, mmsi: id };
    vessels.set(id, {
      ...prev,
      name: cleanName(sd.Name) || prev.name || cleanName(meta.ShipName) || `MMSI ${id}`,
      destination: cleanName(sd.Destination) || prev.destination || "—",
      type: shipTypeFromAis(sd.Type),
      flag: flagFromMeta(meta, sd),
      lat: prev.lat ?? meta.Latitude,
      lng: prev.lng ?? meta.Longitude,
      speed: prev.speed ?? 0,
      heading: prev.heading ?? 0,
      progress: 0,
    });
  }
}

function fetchAisVessels(bounds, options = {}) {
  const apiKey = String(process.env.AISSTREAM_API_KEY || "").trim();
  if (!apiKey) return Promise.resolve(null);

  const collectMs = options.collectMs ?? 4000;
  const maxVessels = options.maxVessels ?? 100;
  const [south, west, north, east] = expandBounds(bounds);
  const filterBounds = [south, west, north, east];
  const boundingBoxes = [[[south, west], [north, east]]];

  const vessels = new Map();

  return new Promise((resolve) => {
    let settled = false;
    let ws;

    const finish = (value) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      try {
        ws?.close();
      } catch {
        /* ignore */
      }
      resolve(value);
    };

    const timer = setTimeout(() => {
      const list = [...vessels.values()].filter((v) => v.lat != null && v.lng != null);
      finish(list.length ? list.slice(0, maxVessels) : null);
    }, collectMs);

    try {
      ws = new WebSocket(AISSTREAM_URL);
    } catch {
      finish(null);
      return;
    }

    ws.addEventListener("open", () => {
      try {
        ws.send(
          JSON.stringify({
            APIKey: apiKey,
            BoundingBoxes: boundingBoxes,
            FilterMessageTypes: ["PositionReport", "ShipStaticData"],
          })
        );
      } catch {
        finish(null);
      }
    });

    ws.addEventListener("message", (event) => {
      try {
        const msg = JSON.parse(String(event.data));
        ingestMessage(msg, vessels, filterBounds);
      } catch {
        /* ignore malformed */
      }
    });

    ws.addEventListener("error", () => finish(null));
    ws.addEventListener("close", () => {
      if (!settled) {
        const list = [...vessels.values()].filter((v) => v.lat != null && v.lng != null);
        finish(list.length ? list.slice(0, maxVessels) : null);
      }
    });
  });
}

async function getAisVesselsForBounds(bounds, options = {}) {
  if (!isEnabled() || !bounds?.length) return null;

  const key = boundsKey(bounds);
  const cached = cache.get(key);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.vessels;
  }

  if (inflight.has(key)) {
    return inflight.get(key);
  }

  const promise = fetchAisVessels(bounds, options)
    .then((vessels) => {
      inflight.delete(key);
      if (vessels?.length) {
        cache.set(key, { vessels, expiresAt: Date.now() + CACHE_TTL_MS });
      }
      return vessels;
    })
    .catch(() => {
      inflight.delete(key);
      return null;
    });

  inflight.set(key, promise);
  return promise;
}

module.exports = {
  isEnabled,
  getAisVesselsForBounds,
  fetchAisVessels,
};
