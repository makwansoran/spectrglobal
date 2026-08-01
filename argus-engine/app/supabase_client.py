from __future__ import annotations

import logging
from typing import Any

from app.settings import Settings

logger = logging.getLogger(__name__)


class SupabaseStore:
    """Thin service-role wrapper. No-ops gracefully if URL/key missing (local demo)."""

    def __init__(self, settings: Settings) -> None:
        self._client = None
        if settings.supabase_url and settings.supabase_service_role_key:
            from supabase import create_client

            self._client = create_client(settings.supabase_url, settings.supabase_service_role_key)
        else:
            logger.warning("Supabase not configured — DB reads/writes disabled")

    @property
    def enabled(self) -> bool:
        return self._client is not None

    def fetch_cameras(self) -> list[dict[str, Any]]:
        if not self._client:
            return []
        res = self._client.table("argus_cameras").select("*").eq("enabled", True).execute()
        return list(res.data or [])

    def fetch_config(self) -> dict[str, Any]:
        if not self._client:
            return {}
        res = self._client.table("argus_config").select("*").execute()
        out: dict[str, Any] = {}
        for row in res.data or []:
            out[row["key"]] = row["value"]
        return out

    def insert_incident(self, row: dict[str, Any]) -> str | None:
        if not self._client:
            logger.info("incident (no DB): %s", row)
            return None
        res = self._client.table("argus_incidents").insert(row).execute()
        if res.data:
            return res.data[0]["id"]
        return None

    def update_incident_paths(self, incident_id: str, clip_path: str, thumb_path: str) -> None:
        if not self._client or not incident_id:
            return
        self._client.table("argus_incidents").update(
            {"clip_path": clip_path, "thumb_path": thumb_path}
        ).eq("id", incident_id).execute()
