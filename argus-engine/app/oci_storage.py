from __future__ import annotations

import asyncio
import logging
import uuid
from pathlib import Path

import cv2
import numpy as np

from app.settings import Settings
from app.supabase_client import SupabaseStore

logger = logging.getLogger(__name__)


class EvidenceQueue:
    """Write clip/thumb locally, optionally upload to OCI, then patch incident paths."""

    def __init__(self, settings: Settings, store: SupabaseStore) -> None:
        self.settings = settings
        self.store = store
        self._q: asyncio.Queue = asyncio.Queue()
        self._task: asyncio.Task | None = None
        Path(settings.local_evidence_dir).mkdir(parents=True, exist_ok=True)

    @property
    def pending(self) -> int:
        return self._q.qsize()

    def enqueue(self, incident_id: str | None, frames: list[np.ndarray], label: str) -> None:
        if not frames:
            return
        self._q.put_nowait((incident_id, frames, label))

    def start(self) -> asyncio.Task:
        self._task = asyncio.create_task(self._run(), name="evidence")
        return self._task

    async def _run(self) -> None:
        while True:
            incident_id, frames, label = await self._q.get()
            try:
                clip, thumb = await asyncio.to_thread(self._write_local, frames, label)
                remote_clip, remote_thumb = await asyncio.to_thread(self._maybe_upload, clip, thumb)
                if incident_id:
                    await asyncio.to_thread(
                        self.store.update_incident_paths,
                        incident_id,
                        remote_clip or clip,
                        remote_thumb or thumb,
                    )
            except Exception:
                logger.exception("evidence job failed")
            finally:
                self._q.task_done()

    def _write_local(self, frames: list[np.ndarray], label: str) -> tuple[str, str]:
        base = Path(self.settings.local_evidence_dir)
        uid = uuid.uuid4().hex[:12]
        safe = "".join(c if c.isalnum() else "_" for c in label)[:32]
        thumb_path = base / f"{uid}_{safe}.jpg"
        clip_path = base / f"{uid}_{safe}.mp4"

        cv2.imwrite(str(thumb_path), frames[-1])

        h, w = frames[0].shape[:2]
        fourcc = cv2.VideoWriter_fourcc(*"mp4v")
        writer = cv2.VideoWriter(str(clip_path), fourcc, 5.0, (w, h))
        for f in frames:
            if f.shape[1] != w or f.shape[0] != h:
                f = cv2.resize(f, (w, h))
            writer.write(f)
        writer.release()
        return str(clip_path), str(thumb_path)

    def _maybe_upload(self, clip: str, thumb: str) -> tuple[str | None, str | None]:
        s = self.settings
        if not (s.oci_namespace and s.oci_bucket):
            return None, None
        try:
            import oci  # type: ignore
        except ImportError:
            logger.warning("oci SDK not installed — keeping local evidence paths")
            return None, None

        try:
            if s.oci_config_file:
                config = oci.config.from_file(s.oci_config_file)
            else:
                config = oci.config.from_file()
            client = oci.object_storage.ObjectStorageClient(config)
            ns = s.oci_namespace
            bucket = s.oci_bucket

            def put(local: str) -> str:
                name = Path(local).name
                with open(local, "rb") as fh:
                    client.put_object(ns, bucket, name, fh)
                return f"oci://{ns}/{bucket}/{name}"

            return put(clip), put(thumb)
        except Exception:
            logger.exception("OCI upload failed — keeping local paths")
            return None, None
