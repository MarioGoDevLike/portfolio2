const { askPortfolio } = require("./askPortfolio");

/**
 * POST /api/ask — portfolio assistant.
 * Body: { question: string, history?: Array<{ role: "user"|"assistant", text: string }> }
 * Same-origin only (no CORS headers). The Gemini key comes from the server env.
 */

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 12;
const hits = new Map();

/** Best-effort per-instance limiter; keeps a single visitor from draining the quota. */
function isRateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_REQUESTS_PER_WINDOW;
}

function clientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  return (typeof forwarded === "string" && forwarded.split(",")[0].trim()) || req.socket?.remoteAddress || "unknown";
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ ok: false, error: "Method not allowed" });
    return;
  }

  if (isRateLimited(clientIp(req))) {
    res.status(429).json({ ok: false, code: "RATE_LIMITED", error: "Too many questions at once — try again in a minute." });
    return;
  }

  try {
    const { question, history } = req.body || {};
    const result = await askPortfolio({ question, history, apiKey: process.env.GEMINI_API_KEY });
    res.status(200).json({ ok: true, result });
  } catch (error) {
    if (error.code === "INVALID_INPUT") {
      res.status(400).json({ ok: false, code: error.code, error: error.message });
      return;
    }
    console.error("[ask]", error);
    res.status(500).json({ ok: false, code: "UNKNOWN", error: "Something went wrong. Please try again." });
  }
};
