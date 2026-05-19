/**
 * Turn API / Supabase errors into a human-readable string for JSON responses.
 */
function errorText(err, fallback = "Something went wrong") {
  if (!err) return fallback;
  if (typeof err === "string") return err;

  const msg = err.message;
  if (typeof msg === "string" && msg && msg !== "[object Object]") return msg;

  if (typeof err.error === "string") return err.error;
  if (err.error && typeof err.error.message === "string") return err.error.message;

  if (typeof err.details === "string" && err.details) {
    return typeof msg === "string" && msg ? `${msg} (${err.details})` : err.details;
  }

  if (typeof err.hint === "string" && err.hint) return err.hint;

  try {
    return JSON.stringify(err);
  } catch {
    return fallback;
  }
}

module.exports = { errorText };
