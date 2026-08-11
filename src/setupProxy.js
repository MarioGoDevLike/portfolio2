/**
 * Local dev proxy for AI Site Concierge.
 * GEMINI_API_KEY in project-root .env (restart npm start after changes).
 */
module.exports = function setupProxy(app) {
  const readJsonBody = (req) =>
    new Promise((resolve, reject) => {
      let raw = "";
      req.on("data", (chunk) => {
        raw += chunk;
        if (raw.length > 200_000) {
          req.destroy();
          reject(new Error("Payload too large"));
        }
      });
      req.on("end", () => {
        try {
          resolve(raw ? JSON.parse(raw) : {});
        } catch (error) {
          reject(error);
        }
      });
      req.on("error", reject);
    });

  const sendJson = (res, status, payload) => {
    res.setHeader("Content-Type", "application/json");
    res.statusCode = status;
    res.end(JSON.stringify(payload));
  };

  const reload = (relativePath) => {
    const full = require.resolve(relativePath);
    delete require.cache[full];
    return require(full);
  };

  const statusFor = (error) =>
    error.code === "MISSING_API_KEY" || error.code === "INVALID_INPUT"
      ? 400
      : error.status && error.status >= 400 && error.status < 600
        ? error.status
        : 500;

  app.post("/api/tour", async (req, res) => {
    try {
      reload("../api/tourStops");
      reload("../api/portfolioKnowledge");
      reload("../api/geminiClient");
      const { planTour } = reload("../api/planTour");
      const body = await readJsonBody(req);
      const apiKey = process.env.GEMINI_API_KEY || body.apiKey || "";
      const tour = await planTour({
        prompt: body.prompt,
        apiKey,
      });
      sendJson(res, 200, { ok: true, tour });
    } catch (error) {
      sendJson(res, statusFor(error), {
        ok: false,
        code: error.code || "UNKNOWN",
        error: error.message || "Tour planning failed",
      });
    }
  });

  app.post("/api/ask", async (req, res) => {
    try {
      reload("../api/portfolioKnowledge");
      reload("../api/geminiClient");
      const { askPortfolio } = reload("../api/askPortfolio");
      const body = await readJsonBody(req);
      const apiKey = process.env.GEMINI_API_KEY || body.apiKey || "";
      const result = await askPortfolio({
        question: body.question,
        apiKey,
      });
      sendJson(res, 200, { ok: true, result });
    } catch (error) {
      sendJson(res, statusFor(error), {
        ok: false,
        code: error.code || "UNKNOWN",
        error: error.message || "Ask failed",
      });
    }
  });
};
