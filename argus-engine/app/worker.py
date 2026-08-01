from __future__ import annotations

import asyncio
import logging
import time
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import cv2
import numpy as np

from app.config_sync import ConfigSync, EngineConfig
from app.models.detector import YoloDetector
from app.motion import MotionGate
from app import rules
from app.oci_storage import EvidenceQueue
from app.supabase_client import SupabaseStore

logger = logging.getLogger(__name__)


@dataclass
class CameraRuntime:
    camera_id: str | None
    name: str
    last_frame_ts: float = 0.0
    fps: float = 0.0
    frames: int = 0
    last_error: str | None = None


@dataclass
class WorkerState:
    cameras: dict[str, CameraRuntime] = field(default_factory=dict)
    model_backend: str = "yolo11n"
    pending_uploads: int = 0


class WorkerPool:
    def __init__(
        self,
        store: SupabaseStore,
        config_sync: ConfigSync,
        detector: YoloDetector,
        evidence: EvidenceQueue,
    ) -> None:
        self.store = store
        self.config_sync = config_sync
        self.detector = detector
        self.evidence = evidence
        self.state = WorkerState(model_backend=f"yolo:{detector.device}")
        self._tasks: dict[str, asyncio.Task] = {}
        self._cooldowns: dict[str, float] = {}
        self._supervisor: asyncio.Task | None = None

    def start(self) -> asyncio.Task:
        self._supervisor = asyncio.create_task(self._supervise(), name="worker_supervisor")
        return self._supervisor

    async def _supervise(self) -> None:
        while True:
            cfg = self.config_sync.snapshot
            wanted = {self._cam_key(c): c for c in cfg.cameras if c.get("enabled", True)}

            for key in list(self._tasks):
                if key not in wanted:
                    self._tasks[key].cancel()
                    self._tasks.pop(key, None)
                    self.state.cameras.pop(key, None)

            for key, cam in wanted.items():
                t = self._tasks.get(key)
                if t is None or t.done():
                    self._tasks[key] = asyncio.create_task(
                        self._camera_loop(key, cam), name=f"cam:{key}"
                    )
            self.state.pending_uploads = self.evidence.pending
            await asyncio.sleep(1.0)

    @staticmethod
    def _cam_key(cam: dict[str, Any]) -> str:
        return str(cam.get("id") or cam.get("name") or "demo")

    async def _camera_loop(self, key: str, cam_initial: dict[str, Any]) -> None:
        name = cam_initial.get("name") or key
        runtime = CameraRuntime(camera_id=cam_initial.get("id"), name=name)
        self.state.cameras[key] = runtime
        source = cam_initial.get("rtsp_url") or cam_initial.get("source_path")
        if not source:
            runtime.last_error = "no source"
            return

        motion = MotionGate()
        buffer: list[np.ndarray] = []
        buf_max = 30
        t0 = time.perf_counter()
        n = 0

        while True:
            cfg = self.config_sync.snapshot
            cam = next((c for c in cfg.cameras if self._cam_key(c) == key), cam_initial)
            if not cam.get("enabled", True):
                break

            motion.update_threshold(cfg.motion_threshold())
            fps_target = float(cam.get("subsample_fps") or 3.0)
            interval = 1.0 / max(fps_target, 0.1)
            conf = float(cam.get("confidence") or cfg.default_confidence())

            try:
                frame = await asyncio.to_thread(self._read_one_frame, source)
            except Exception as e:
                runtime.last_error = str(e)
                logger.warning("[%s] capture error: %s", name, e)
                await asyncio.sleep(2.0)
                continue

            if frame is None:
                runtime.last_error = "end of stream / open failed"
                await asyncio.sleep(1.0)
                # reopen loop for files: sleep then retry
                continue

            runtime.last_error = None
            runtime.last_frame_ts = time.time()
            n += 1
            elapsed = time.perf_counter() - t0
            if elapsed >= 1.0:
                runtime.fps = n / elapsed
                n = 0
                t0 = time.perf_counter()

            buffer.append(frame.copy())
            if len(buffer) > buf_max:
                buffer.pop(0)

            try:
                moved = await asyncio.to_thread(motion.has_motion, frame)
                if not moved:
                    await asyncio.sleep(interval)
                    continue
                dets = await asyncio.to_thread(self.detector.infer, frame)
                hits = rules.evaluate(
                    dets,
                    cam.get("zones") or [],
                    cam.get("schedule") or {},
                    conf,
                )
                for hit in hits:
                    await self._emit(key, cam, hit, buffer, cfg)
            except Exception:
                logger.exception("[%s] infer failed", name)

            await asyncio.sleep(interval)

    def _read_one_frame(self, source: str) -> np.ndarray | None:
        # Open per read is slow for RTSP but simple; keep open would need per-cam state.
        # Use a module-level cache of captures keyed by source.
        cap = _capture_pool.get(source)
        if cap is None or not cap.isOpened():
            cap = cv2.VideoCapture(source)
            _capture_pool[source] = cap
        ok, frame = cap.read()
        if not ok:
            # rewind files for demo loops
            if not str(source).lower().startswith("rtsp"):
                cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
                ok, frame = cap.read()
            if not ok:
                return None
        return frame

    async def _emit(
        self,
        key: str,
        cam: dict[str, Any],
        hit: dict[str, Any],
        buffer: list[np.ndarray],
        cfg: EngineConfig,
    ) -> None:
        cd_key = f"{key}:{hit['label']}"
        now = time.time()
        if now - self._cooldowns.get(cd_key, 0) < cfg.cooldown_seconds():
            return
        self._cooldowns[cd_key] = now

        row = {
            "camera_id": cam.get("id"),
            "ts": datetime.now(timezone.utc).isoformat(),
            "label": hit["label"],
            "score": hit["score"],
            "status": "open",
            "meta": {
                "zone": hit["zone"],
                "bbox": hit["bbox"],
                "camera": cam.get("name"),
            },
        }
        # camera_id must be uuid or null
        if not row["camera_id"]:
            row.pop("camera_id")

        incident_id = await asyncio.to_thread(self.store.insert_incident, row)
        frames = list(buffer)
        self.evidence.enqueue(incident_id, frames, hit["label"])


_capture_pool: dict[str, cv2.VideoCapture] = {}
