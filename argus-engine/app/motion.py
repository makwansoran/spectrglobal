from __future__ import annotations

import cv2
import numpy as np


class MotionGate:
    """Cheap frame-diff gate. Returns True when enough pixels changed."""

    def __init__(self, threshold: float = 0.02) -> None:
        self.threshold = threshold
        self._prev: np.ndarray | None = None

    def update_threshold(self, value: float) -> None:
        self.threshold = value

    def has_motion(self, frame: np.ndarray) -> bool:
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        gray = cv2.GaussianBlur(gray, (5, 5), 0)
        if self._prev is None:
            self._prev = gray
            return True  # first frame — allow detect
        diff = cv2.absdiff(self._prev, gray)
        self._prev = gray
        changed = float(np.count_nonzero(diff > 25)) / diff.size
        return changed >= self.threshold
