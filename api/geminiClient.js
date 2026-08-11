const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const MODEL_FALLBACKS = [
  GEMINI_MODEL,
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-flash-latest",
  "gemini-2.0-flash",
];

function permissionMessage() {
  return "Gemini blocked this API key (permission denied). Create a new key at https://aistudio.google.com/apikey — prefer “Restrict to Gemini API” — paste it into .env as GEMINI_API_KEY, then restart npm start.";
}

function extractJson(text) {
  const trimmed = String(text || "").trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start === -1 || end === -1) throw new Error("Model did not return JSON");
    return JSON.parse(trimmed.slice(start, end + 1));
  }
}

/**
 * Calls Gemini generateContent and returns parsed JSON.
 */
async function generateJson({ apiKey, prompt, temperature = 0.4 }) {
  if (!apiKey) {
    const err = new Error(
      "Missing Gemini API key. Add GEMINI_API_KEY to your .env file (see .env.example)."
    );
    err.code = "MISSING_API_KEY";
    throw err;
  }

  const requestBody = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature,
      responseMimeType: "application/json",
    },
  };

  const tried = new Set();
  let response;
  let payload = {};
  let models = [...MODEL_FALLBACKS];

  const isModelMissing = (status, message = "") =>
    status === 404 || /not found|unknown model|not supported/i.test(message);

  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    if (tried.has(model)) continue;
    tried.add(model);

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });
    payload = await response.json().catch(() => ({}));

    if (response.ok) break;

    const message = payload?.error?.message || "";
    if (!isModelMissing(response.status, message)) break;

    if (i === models.length - 1) {
      try {
        const listRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey)}`
        );
        const listPayload = await listRes.json().catch(() => ({}));
        const discovered = (listPayload.models || [])
          .filter((m) =>
            (m.supportedGenerationMethods || []).includes("generateContent")
          )
          .map((m) => String(m.name || "").replace(/^models\//, ""))
          .filter((name) => /flash/i.test(name) && !tried.has(name));
        models = models.concat(discovered.slice(0, 5));
      } catch {
        /* ignore */
      }
    }
  }

  if (!response?.ok) {
    let message =
      payload?.error?.message ||
      `Gemini request failed (${response?.status || "unknown"})`;

    if (
      response?.status === 403 ||
      /permission|PERMISSION_DENIED|forbidden/i.test(message)
    ) {
      message = permissionMessage();
    }

    const err = new Error(message);
    err.code = "GEMINI_ERROR";
    err.status = response?.status;
    throw err;
  }

  const text = payload?.candidates?.[0]?.content?.parts
    ?.map((p) => p.text || "")
    .join("")
    .trim();

  if (!text) {
    const err = new Error("Gemini returned an empty response. Try again.");
    err.code = "EMPTY_RESPONSE";
    throw err;
  }

  return extractJson(text);
}

module.exports = { generateJson, extractJson };
