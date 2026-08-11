const { planTour } = require("./planTour");

/**
 * Vercel serverless: POST /api/tour
 * Body: { prompt?: string, apiKey?: string }
 */
module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const { prompt, apiKey: bodyKey } = req.body || {};
    const apiKey = process.env.GEMINI_API_KEY || bodyKey || "";
    const tour = await planTour({ prompt, apiKey });
    res.status(200).json({ ok: true, tour });
  } catch (error) {
    const status =
      error.code === "MISSING_API_KEY" || error.code === "INVALID_INPUT"
        ? 400
        : error.status && error.status >= 400 && error.status < 600
          ? error.status
          : 500;

    res.status(status).json({
      ok: false,
      code: error.code || "UNKNOWN",
      error: error.message || "Tour planning failed",
    });
  }
};
