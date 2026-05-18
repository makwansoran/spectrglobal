/**
 * AIS Stream (https://aisstream.io) — free tier, server-side only.
 * Browser WebSocket + CORS are not supported; keep AISSTREAM_API_KEY on the server.
 */
const AISSTREAM_URL = "wss://stream.aisstream.io/v0/stream";

const CACHE_TTL_MS = 20_000;
const cache = new Map();
const inflight = new Map();

function isEnabled() {
  return Boolean(String(process.env.AISSTREAM_API_KEY || "").trim());
}

function normalizeBounds(bounds) {
  if (!bounds) return null;
  let b = bounds;
  if (typeof b === "string") {
    try {
      b = JSON.parse(b);
    } catch {
      return null;
    }
  }
  if (!Array.isArray(b) || b.length !== 4) return null;
  const nums = b.map(Number);
  if (nums.some((n) => Number.isNaN(n))) return null;
  return nums;
}

function boundsKey(bounds) {
  return normalizeBounds(bounds)?.map((n) => n.toFixed(3)).join(",") || "";
}

function expandBounds(bounds, pad = 0.06) {
  const [south, west, north, east] = bounds;
  return [
    Math.max(-90, south - pad),
    west - pad,
    Math.min(90, north + pad),
    east + pad,
  ];
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

function connectWebSocket(url) {
  if (typeof globalThis.WebSocket !== "undefined") {
    return new globalThis.WebSocket(url);
  }
  return new (require("ws"))(url);
}

function subscriptionPayload(apiKey, boundingBoxes) {
  return {
    APIKey: apiKey,
    BoundingBoxes: boundingBoxes,
    FilterMessageTypes: ["PositionReport", "ShipStaticData"],
  };
}

function isErrorMessage(msg) {
  if (!msg || typeof msg !== "object") return false;
  if (msg.error || msg.Error) return true;
  if (typeof msg.message === "string" && /invalid|error|denied|auth/i.test(msg.message)) return true;
  return false;
}

function ingestMessage(msg, vessels) {
  if (isErrorMessage(msg)) return;

  const meta = msg.Metadata || {};
  const type = msg.MessageType;

  if (type === "PositionReport") {
    const pr = msg.Message?.PositionReport;
    if (!pr) return;
    const lat = Number(pr.Latitude ?? meta.Latitude);
    const lng = Number(pr.Longitude ?? meta.Longitude);
    if (Number.isNaN(lat) || Number.isNaN(lng)) return;

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
      name: prev.name || cleanName(meta.ShipName) || cleanName(pr.Name) || `MMSI ${id}`,
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

    const lat = Number(sd.Latitude ?? meta.Latitude);
    const lng = Number(sd.Longitude ?? meta.Longitude);
    const prev = vessels.get(id) || { id, mmsi: id };
    vessels.set(id, {
      ...prev,
      name: cleanName(sd.Name) || prev.name || cleanName(meta.ShipName) || `MMSI ${id}`,
      destination: cleanName(sd.Destination) || prev.destination || "—",
      type: shipTypeFromAis(sd.Type),
      flag: flagFromMeta(meta, sd),
      lat: Number.isNaN(lat) ? prev.lat : lat,
      lng: Number.isNaN(lng) ? prev.lng : lng,
      speed: prev.speed ?? 0,
      heading: prev.heading ?? 0,
      progress: 0,
    });
  }
}

function fetchAisVessels(bounds, options = {}) {
  const apiKey = String(process.env.AISSTREAM_API_KEY || "").trim();
  const normalized = normalizeBounds(bounds);
  if (!apiKey || !normalized) return Promise.resolve(null);

  const collectMs = options.collectMs ?? 6500;
  const maxVessels = options.maxVessels ?? 120;
  const [south, west, north, east] = expandBounds(normalized);
  const boundingBoxes = [[[south, west], [north, east]]];

  const vessels = new Map();
  let lastError = null;

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
      if (lastError && !value?.length) {
        console.warn("[aisstream]", lastError);
      }
      resolve(value);
    };

    const timer = setTimeout(() => {
      const list = [...vessels.values()].filter(
        (v) => typeof v.lat === "number" && typeof v.lng === "number" && !Number.isNaN(v.lat)
      );
      finish(list.length ? list.slice(0, maxVessels) : null);
    }, collectMs);

    try {
      ws = connectWebSocket(AISSTREAM_URL);
    } catch (err) {
      lastError = err.message;
      finish(null);
      return;
    }

    ws.addEventListener("open", () => {
      try {
        ws.send(JSON.stringify(subscriptionPayload(apiKey, boundingBoxes)));
      } catch (err) {
        lastError = err.message;
        finish(null);
      }
    });

    ws.addEventListener("message", (event) => {
      try {
        const msg = JSON.parse(String(event.data));
        if (isErrorMessage(msg)) {
          lastError =
            typeof msg.error === "string"
              ? msg.error
              : typeof msg.Error === "string"
                ? msg.Error
                : "AIS subscription error";
          return;
        }
        ingestMessage(msg, vessels);
      } catch {
        /* ignore malformed */
      }
    });

    ws.addEventListener("error", () => {
      lastError = "WebSocket error";
      finish(null);
    });

    ws.addEventListener("close", () => {
      if (!settled) {
        const list = [...vessels.values()].filter((v) => v.lat != null && v.lng != null);
        finish(list.length ? list.slice(0, maxVessels) : null);
      }
    });
  });
}

async function getAisVesselsForBounds(bounds, options = {}) {
  if (!isEnabled()) return null;

  const normalized = normalizeBounds(bounds);
  if (!normalized) return null;

  const key = boundsKey(normalized);
  const cached = cache.get(key);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.vessels;
  }

  if (inflight.has(key)) {
    return inflight.get(key);
  }

  const promise = fetchAisVessels(normalized, options)
    .then((vessels) => {
      inflight.delete(key);
      if (vessels?.length) {
        cache.set(key, { vessels, expiresAt: Date.now() + CACHE_TTL_MS });
      }
      return vessels;
    })
    .catch((err) => {
      inflight.delete(key);
      console.warn("[aisstream] fetch failed:", err.message);
      return null;
    });

  inflight.set(key, promise);
  return promise;
}

module.exports = {
  isEnabled,
  normalizeBounds,
  getAisVesselsForBounds,
  fetchAisVessels,
};
