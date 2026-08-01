"""TensorRT detector stub for OCI A10 — same interface as YoloDetector."""

from __future__ import annotations

import numpy as np

from app.models.detector import Detection


class TensorRTDetector:
    def __init__(self, engine_path: str) -> None:
        self.engine_path = engine_path
        raise NotImplementedError(
            "TensorRT path not built in MVP. Use YoloDetector on CUDA, "
            f"then swap to TRT engine at {engine_path} on A10."
        )

    def infer(self, frame: np.ndarray) -> list[Detection]:
        raise NotImplementedError
