# Argus Engine

> Product brief (read first): **[ARGUS_ENGINE_MVP.md](ARGUS_ENGINE_MVP.md)**  
> Wire Spectr / spectrglobal later: **[INTEGRATION.md](INTEGRATION.md)**

Standalone real-time video detection service for Veolia Pet / Spectr OS Argus.  
Spectr configures + displays; this process detects and writes incidents.

## Quick start (local CPU)

```bash
cd argus-engine
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

1. Apply [`migrations/001_argus_schema.sql`](migrations/001_argus_schema.sql) in your Supabase SQL editor (optional for pure file demo).
2. Put a short clip at `samples/demo.mp4` **or** set `DEMO_SOURCE` / insert an `argus_cameras` row.
3. Fill `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` in `.env` when you want real inserts.

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8080
```

- Health: http://localhost:8080/health  
- Status: http://localhost:8080/status  

Docker:

```bash
docker compose up --build
```

## How it works

1. Grab frames (RTSP or file), subsample ~2–5 FPS  
2. Motion gate (skip quiet frames)  
3. YOLO11n → zone + schedule + confidence rules  
4. **INSERT** `argus_incidents` immediately (SLA path)  
5. Async clip/thumb to local disk (and OCI if configured)

Config hot-reloads from Supabase every `CONFIG_POLL_SECONDS` (default 5). No Spectr restart needed.

## OCI A10 (eu-amsterdam-1)

1. Provision `VM.GPU.A10.1` in Amsterdam; install NVIDIA drivers + Docker GPU toolkit.  
2. Point cameras over VPN/SRT to this host.  
3. Run with `INFER_DEVICE=cuda` (and later swap in `models/trt_detector.py` for TensorRT).  
4. Create an Object Storage bucket; set `OCI_NAMESPACE`, `OCI_BUCKET`, `OCI_CONFIG_FILE` (or instance principal later).  
5. Keep detect path free of uploads — only patch `clip_path` / `thumb_path` after alert.

## Env

See [`.env.example`](.env.example). Service role stays on this host only — never in the browser.
