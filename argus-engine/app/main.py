from __future__ import annotations

import logging
import time
from contextlib import asynccontextmanager
from typing import Any

from fastapi import FastAPI

from app.config_sync import ConfigSync
from app.models.detector import load_detector
from app.oci_storage import EvidenceQueue
from app.settings import get_settings
from app.supabase_client import SupabaseStore
from app.worker import WorkerPool

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
logger = logging.getLogger("argus")

_state: dict[str, Any] = {}


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = get_settings()
    store = SupabaseStore(settings)
    config_sync = ConfigSync(store, settings)
    cfg = config_sync.refresh()

    detector = load_detector(
        settings.model_weights,
        settings.infer_device,
        allowed_labels=cfg.allowed_labels(),
    )
    evidence = EvidenceQueue(settings, store)
    workers = WorkerPool(store, config_sync, detector, evidence)

    config_sync.start()
    evidence.start()
    workers.start()

    _state.update(
        {
            "settings": settings,
            "store": store,
            "config_sync": config_sync,
            "workers": workers,
            "started_at": time.time(),
        }
    )
    logger.info("argus-engine started (device=%s)", settings.infer_device)
    yield
    logger.info("argus-engine shutting down")


app = FastAPI(title="argus-engine", version="0.1.0", lifespan=lifespan)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/status")
def status() -> dict[str, Any]:
    workers: WorkerPool | None = _state.get("workers")
    config_sync: ConfigSync | None = _state.get("config_sync")
    store: SupabaseStore | None = _state.get("store")
    started = _state.get("started_at", time.time())

    cams = []
    if workers:
        for key, rt in workers.state.cameras.items():
            age = time.time() - rt.last_frame_ts if rt.last_frame_ts else None
            cams.append(
                {
                    "key": key,
                    "name": rt.name,
                    "camera_id": rt.camera_id,
                    "fps": round(rt.fps, 2),
                    "last_frame_age_s": round(age, 2) if age is not None else None,
                    "last_error": rt.last_error,
                }
            )

    snap = config_sync.snapshot if config_sync else None
    return {
        "uptime_s": round(time.time() - started, 1),
        "supabase": bool(store and store.enabled),
        "config_version": snap.version if snap else 0,
        "camera_count": len(snap.cameras) if snap else 0,
        "model_backend": workers.state.model_backend if workers else None,
        "pending_uploads": workers.state.pending_uploads if workers else 0,
        "cameras": cams,
    }
