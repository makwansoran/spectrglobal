/**
 * Persist datafeed sync runs to Supabase for observability.
 */

const { getAdminClient, hasSupabaseWrites } = require("../supabase-client");
const { restGet } = require("../supabase-rest");

async function startRun(source, meta = {}) {
  if (!hasSupabaseWrites()) {
    return { id: null, source, startedAt: new Date().toISOString(), local: true };
  }

  const row = {
    source,
    status: "running",
    stats: { ...meta },
    started_at: new Date().toISOString(),
  };

  const { data, error } = await getAdminClient().from("datafeed_sync_runs").insert(row).select("id").single();
  if (error) {
    console.warn("[datafeed] run log insert failed:", error.message);
    return { id: null, source, startedAt: row.started_at, local: true };
  }
  return { id: data.id, source, startedAt: row.started_at };
}

async function finishRun(runId, { status = "success", stats = {}, errorMessage = null } = {}) {
  if (!runId || !hasSupabaseWrites()) return;

  const { error } = await getAdminClient()
    .from("datafeed_sync_runs")
    .update({
      status,
      stats,
      error_message: errorMessage,
      finished_at: new Date().toISOString(),
    })
    .eq("id", runId);

  if (error) console.warn("[datafeed] run log update failed:", error.message);
}

async function getRecentRuns(limit = 20) {
  try {
    return (
      (await restGet("datafeed_sync_runs", {
        select: "id,source,status,stats,error_message,started_at,finished_at",
        order: "started_at.desc",
        limit: String(limit),
      })) || []
    );
  } catch {
    return [];
  }
}

async function getListingCounts() {
  try {
    const rows = await restGet("euronext_listings", {
      select: "mic",
      limit: "1",
    });
    if (!rows) return { total: null };
    const countRes = await getAdminClient().from("euronext_listings").select("*", { count: "exact", head: true });
    return { total: countRes.count ?? null };
  } catch {
    return { total: null };
  }
}

module.exports = { startRun, finishRun, getRecentRuns, getListingCounts };
