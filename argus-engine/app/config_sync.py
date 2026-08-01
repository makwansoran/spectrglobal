from __future__ import annotations

import asyncio
import logging
import threading
from dataclasses import dataclass, field
from typing import Any

from app.settings import Settings
from app.supabase_client import SupabaseStore

logger = logging.getLogger(__name__)


@dataclass
class EngineConfig:
    cameras: list[dict[str, Any]] = field(default_factory=list)
    globals: dict[str, Any] = field(default_factory=dict)
    version: int = 0

    def motion_threshold(self) -> float:
        v = self.globals.get("motion_threshold", 0.02)
        return float(v) if not isinstance(v, dict) else 0.02

    def cooldown_seconds(self) -> float:
        v = self.globals.get("cooldown_seconds", 30)
        return float(v) if not isinstance(v, dict) else 30.0

    def default_confidence(self) -> float:
        v = self.globals.get("default_confidence", 0.5)
        return float(v) if not isinstance(v, dict) else 0.5

    def allowed_labels(self) -> list[str] | None:
        v = self.globals.get("allowed_labels")
        if isinstance(v, list):
            return [str(x) for x in v]
        return ["person"]


class ConfigSync:
    """Poll Supabase ≤5s and swap an in-memory snapshot."""

    def __init__(self, store: SupabaseStore, settings: Settings) -> None:
        self._store = store
        self._settings = settings
        self._lock = threading.Lock()
        self._cfg = EngineConfig()
        self._task: asyncio.Task | None = None

    @property
    def snapshot(self) -> EngineConfig:
        with self._lock:
            return self._cfg

    def refresh(self) -> EngineConfig:
        cameras = self._store.fetch_cameras()
        globals_ = self._store.fetch_config()

        # Demo file source when DB empty
        if not cameras and self._settings.demo_source:
            cameras = [
                {
                    "id": None,
                    "name": "demo",
                    "rtsp_url": None,
                    "source_path": self._settings.demo_source,
                    "enabled": True,
                    "zones": [],
                    "schedule": {},
                    "confidence": 0.5,
                    "subsample_fps": 3.0,
                }
            ]

        with self._lock:
            self._cfg = EngineConfig(
                cameras=cameras,
                globals=globals_,
                version=self._cfg.version + 1,
            )
            return self._cfg

    async def run(self) -> None:
        self.refresh()
        interval = self._settings.config_poll_seconds
        while True:
            await asyncio.sleep(interval)
            try:
                await asyncio.to_thread(self.refresh)
            except Exception:
                logger.exception("config refresh failed")

    def start(self) -> asyncio.Task:
        self._task = asyncio.create_task(self.run(), name="config_sync")
        return self._task
