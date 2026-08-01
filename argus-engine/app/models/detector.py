from __future__ import annotations

from dataclasses import dataclass
from typing import Sequence

import numpy as np


@dataclass
class Detection:
    label: str
    score: float
    x1: float  # normalized 0–1
    y1: float
    x2: float
    y2: float


class YoloDetector:
    """Ultralytics YOLO11n. CPU or CUDA via device string."""

    def __init__(
        self,
        weights: str = "yolo11n.pt",
        device: str = "cpu",
        allowed_labels: Sequence[str] | None = None,
    ) -> None:
        from ultralytics import YOLO

        self._model = YOLO(weights)
        self.device = device
        self.allowed = set(allowed_labels) if allowed_labels else None

    def infer(self, frame: np.ndarray) -> list[Detection]:
        h, w = frame.shape[:2]
        results = self._model.predict(frame, device=self.device, verbose=False)
        out: list[Detection] = []
        if not results:
            return out
        r0 = results[0]
        if r0.boxes is None:
            return out
        names = r0.names or {}
        for box in r0.boxes:
            cls_id = int(box.cls.item())
            label = names.get(cls_id, str(cls_id))
            if self.allowed is not None and label not in self.allowed:
                continue
            score = float(box.conf.item())
            x1, y1, x2, y2 = box.xyxy[0].tolist()
            out.append(
                Detection(
                    label=label,
                    score=score,
                    x1=x1 / w,
                    y1=y1 / h,
                    x2=x2 / w,
                    y2=y2 / h,
                )
            )
        return out


def load_detector(
    weights: str,
    device: str,
    allowed_labels: Sequence[str] | None = None,
) -> YoloDetector:
    return YoloDetector(weights=weights, device=device, allowed_labels=allowed_labels)
