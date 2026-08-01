# Integration handoff (Spectr / spectrglobal)

**For a later agent.** Do not edit [spectrglobal](https://github.com/makwansoran/spectrglobal) as part of the argus-engine MVP.

1. Read **[ARGUS_ENGINE_MVP.md](ARGUS_ENGINE_MVP.md)** first.  
2. Apply **[migrations/001_argus_schema.sql](migrations/001_argus_schema.sql)** to the **shared** Supabase project.  
3. Engine `.env`: `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` only on the GPU/API host.  
4. Web / Electron UI: anon or authenticated key only. **Never** ship the service role to the browser.  
5. UI **subscribes** Supabase Realtime on `argus_incidents` (`INSERT` / `UPDATE`) and renders open incidents.  
6. UI **writes** `argus_cameras` (zones, schedule, enabled, confidence) and `argus_config`. Engine polls ≤5s — no engine or Spectr restart.  
7. Do **not** put YOLO, OpenCV, or TensorRT inside Next.js or Electron.  
8. Deploy engine on OCI `VM.GPU.A10.1` (`eu-amsterdam-1`). Keep spectrglobal on Vercel.  
9. Suggested UI later (out of scope here): incident list, ack/dismiss, camera toggles, zone polygon editor.  
10. Run commands and health checks: **[README.md](README.md)**.

## Contract

| Direction | What |
|-----------|------|
| UI → DB | upsert cameras / config |
| Engine → DB | INSERT incidents; UPDATE clip/thumb paths |
| UI ← DB | Realtime on incidents |
| Engine ← DB | poll cameras + config |

## Checklist for the Spectr agent

- [ ] Migration applied; Realtime publication includes `argus_incidents`  
- [ ] Argus page: list open incidents from Supabase  
- [ ] Ack / dismiss updates `status`  
- [ ] Camera admin writes `argus_cameras`  
- [ ] Confirm engine `/status` shows cameras after enable  
- [ ] Confirm new row appears in UI within ~1–2s of a detection  
