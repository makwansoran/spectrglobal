from __future__ import annotations

from datetime import datetime, time
from typing import Any
from zoneinfo import ZoneInfo


def _point_in_poly(x: float, y: float, polygon: list[list[float]]) -> bool:
    """Ray casting. polygon = [[x,y], ...] in normalized 0–1 coords."""
    n = len(polygon)
    if n < 3:
        return False
    inside = False
    j = n - 1
    for i in range(n):
        xi, yi = polygon[i]
        xj, yj = polygon[j]
        if ((yi > y) != (yj > y)) and (x < (xj - xi) * (y - yi) / (yj - yi + 1e-12) + xi):
            inside = not inside
        j = i
    return inside


def _in_schedule(schedule: dict[str, Any] | None, now: datetime | None = None) -> bool:
    """Empty / missing schedule = always allow."""
    if not schedule or not schedule.get("windows"):
        return True
    tz_name = schedule.get("tz") or "UTC"
    try:
        tz = ZoneInfo(tz_name)
    except Exception:
        tz = ZoneInfo("UTC")
    now = now or datetime.now(tz)
    if now.tzinfo is None:
        now = now.replace(tzinfo=tz)
    else:
        now = now.astimezone(tz)
    dow = now.isoweekday()  # 1=Mon … 7=Sun
    t = now.time()
    for w in schedule["windows"]:
        days = w.get("dow") or list(range(1, 8))
        if dow not in days:
            continue
        start = time.fromisoformat(w.get("start", "00:00"))
        end = time.fromisoformat(w.get("end", "23:59"))
        if start <= t <= end:
            return True
    return False


def evaluate(
    detections: list[Any],
    zones: list[dict[str, Any]],
    schedule: dict[str, Any] | None,
    confidence: float,
) -> list[dict[str, Any]]:
    """Return alert candidates: detections that pass score + zone + schedule."""
    if not _in_schedule(schedule):
        return []

    hits: list[dict[str, Any]] = []
    for det in detections:
        if det.score < confidence:
            continue
        cx = (det.x1 + det.x2) / 2.0
        cy = (det.y1 + det.y2) / 2.0

        matched_zone = None
        if not zones:
            matched_zone = "full_frame"
        else:
            for z in zones:
                poly = z.get("polygon") or []
                if _point_in_poly(cx, cy, poly):
                    matched_zone = z.get("name") or "zone"
                    break
            if matched_zone is None:
                continue

        hits.append(
            {
                "label": det.label,
                "score": float(det.score),
                "zone": matched_zone,
                "bbox": [det.x1, det.y1, det.x2, det.y2],
            }
        )
    return hits
