/**
 * Local dev bridge for the serverless API: runs api/ask.js (the same handler
 * Vercel deploys) inside the CRA dev server.
 * Put GEMINI_API_KEY in the project-root .env and restart npm start.
 */
const path = require("path");

const MAX_BODY = 50_000;
const API_DIR = path.resolve(__dirname, "../api");

const readJsonBody = (req) =>
  new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > MAX_BODY) {
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

/** Adds the Vercel-style res.status().json() helpers the handler uses. */
const withVercelHelpers = (res) => {
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (payload) => {
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(payload));
  };
  return res;
};

/** Re-require api/* on every call so edits apply without restarting. */
const loadHandler = () => {
  Object.keys(require.cache)
    .filter((key) => key.startsWith(API_DIR))
    .forEach((key) => delete require.cache[key]);
  return require(path.join(API_DIR, "ask"));
};

module.exports = function setupProxy(app) {
  app.all("/api/ask", async (req, res) => {
    withVercelHelpers(res);
    try {
      req.body = req.method === "POST" ? await readJsonBody(req) : {};
    } catch {
      res.status(400).json({ ok: false, error: "Invalid request body" });
      return;
    }
    await loadHandler()(req, res);
  });
};
