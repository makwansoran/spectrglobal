# Argus Engine MVP

**Read this first.** Canonical brief for this folder. Run notes: [README.md](README.md). Spectr wiring later: [INTEGRATION.md](INTEGRATION.md).

## What it is

`argus-engine` is the **detection brain** for Argus / Spectr OS. It pulls camera (or file) video, runs motion + YOLO, applies zone/time rules, and writes incidents to Supabase immediately. Short clips upload later (async).

It is **not** the website. It is **not** Spectr Electron. Those only configure cameras and show alerts.

## Who uses it later

| Piece | Role |
|-------|------|
| This folder | Ingest + infer + API on OCI GPU VM |
| [spectrglobal](https://github.com/makwansoran/spectrglobal) | Next.js web — not wired in this MVP |
| Spectr OS (Electron) | Operator UI — not in this repo |

**Shared contract = Supabase tables only.** Engine never imports web/Electron code. This milestone does **not** edit spectrglobal.

## Locked stack

- Cloud: Oracle OCI `eu-amsterdam-1`
- Compute: one `VM.GPU.A10.1` (ingest + infer + API on same box)
- Model v1: YOLO11n (CPU/CUDA for bring-up; TensorRT later)
- Gate: OpenCV motion before YOLO
- DB: Supabase Postgres (+ Realtime for UI later)
- Evidence: OCI Object Storage — upload **only after** an alert; never block detect
- No Redis / MediaMTX / PatchCore / VideoMAE in the hot path

## SLA

- p50 detect → incident visible in Supabase: ≤ 1s
- p95: ≤ 2s
- Pilot: 1–5 cameras, subsample ~2–5 FPS, motion-gate before YOLO

## Architecture (simple)

```
Camera / video file
  → worker.py (grab frames, subsample)
  → motion.py (cheap “did something move?”)
  → models/detector.py (YOLO11n)
  → rules.py (zone + schedule + confidence)
  → supabase_client.py INSERT argus_incidents  (fast path)
  → oci_storage.py upload clip later           (slow path)
```

Config: Spectr (later) writes `argus_cameras` / `argus_config` → `config_sync.py` polls ≤5s → workers pick up changes without restart.

One Python process: FastAPI (`/health`, `/status`) + background camera tasks. Heavy OpenCV/YOLO runs in threads.

## Folder map

```
argus-engine/
  ARGUS_ENGINE_MVP.md   ← you are here
  README.md             ← how to run
  INTEGRATION.md        ← next-agent Spectr handoff
  app/
    main.py             ← API + lifespan
    worker.py           ← per-camera loop
    config_sync.py      ← hot-reload from Supabase
    supabase_client.py  ← DB helper (service role)
    oci_storage.py      ← async evidence
    settings.py         ← env
    motion.py           ← motion gate
    rules.py            ← zone / schedule / score
    models/
      detector.py       ← YOLO11n
      trt_detector.py   ← TensorRT stub for A10
  migrations/
    001_argus_schema.sql
  samples/              ← put a demo.mp4 here
```

## Schema (summary)

- **argus_cameras** — id, name, rtsp_url, source_path, enabled, zones JSON, schedule JSON, confidence, subsample_fps, created_at
- **argus_config** — key / value JSON (motion_threshold, cooldown_seconds, default_confidence, allowed_labels)
- **argus_incidents** — id, camera_id, ts, label, score, status (open|acked|dismissed), clip_path, thumb_path, meta JSON, created_at

Engine uses **service role**. Browser/UI uses anon/authenticated + RLS later.

## MVP checklist

- [x] Health + status endpoints
- [x] One camera or video-file source
- [x] Motion + YOLO11n (CPU OK; TRT structured)
- [x] Detection in zone → INSERT incident
- [x] Config hot-reload from Supabase (poll)
- [x] Async evidence (local + optional OCI)
- [x] Docs for Spectr Realtime (no Spectr code here)

## Non-goals

- No YOLO inside Electron or Next.js
- No edits to spectrglobal in this milestone
- No Redis / Kafka / MediaMTX / PatchCore / VideoMAE
- No writing every frame to object storage before infer
- No multi-cloud / Pi+Hailo day one
- No full TensorRT engine build automation (stub only)

## Pointers

- Run: [README.md](README.md)
- Wire UI later: [INTEGRATION.md](INTEGRATION.md)
- SQL: [migrations/001_argus_schema.sql](migrations/001_argus_schema.sql)
