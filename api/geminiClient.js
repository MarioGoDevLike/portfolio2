/**
 * Minimal Gemini generateContent client that returns parsed JSON.
 * Tries the configured model first, then falls back only when a model is
 * missing or overloaded. Error details stay server-side.
 */

/**
 * Aliases track Google's current models, so retirements don't break the site.
 * Flash-Lite with minimal thinking answers in ~1s and is plenty for grounded
 * short answers; full Flash is the fallback when Lite is overloaded.
 */
const MODELS = [
  { name: process.env.GEMINI_MODEL || "gemini-flash-lite-latest", thinking: { thinkingLevel: "minimal" } },
  { name: "gemini-flash-latest" },
];

const TIMEOUT_MS = 8000;
const TRY_NEXT_MODEL = new Set([404, 429, 500, 503]);

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

async function callModel(model, apiKey, body) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
        body: JSON.stringify(body),
        signal: controller.signal,
      }
    );
    const payload = await response.json().catch(() => ({}));
    return { response, payload };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * @param {object} options
 * @param {string} options.apiKey
 * @param {string} options.system    System instruction text.
 * @param {Array<{role: "user"|"model", text: string}>} options.turns  Conversation, oldest first.
 * @param {object} [options.schema]  Response schema (OpenAPI subset) the JSON must match.
 * @param {number} [options.temperature]
 */
async function generateJson({ apiKey, system, turns, schema, temperature = 0.4 }) {
  const body = {
    systemInstruction: { parts: [{ text: system }] },
    contents: turns.map((t) => ({ role: t.role, parts: [{ text: t.text }] })),
    generationConfig: {
      temperature,
      responseMimeType: "application/json",
      ...(schema ? { responseSchema: schema } : {}),
    },
  };

  let last;
  let networkError;
  for (const model of MODELS) {
    const generationConfig = model.thinking
      ? { ...body.generationConfig, thinkingConfig: model.thinking }
      : body.generationConfig;
    try {
      last = await callModel(model.name, apiKey, { ...body, generationConfig });
    } catch (error) {
      // Timeout or network failure — give the next model a chance.
      networkError = error;
      continue;
    }
    if (last.response.ok || !TRY_NEXT_MODEL.has(last.response.status)) break;
  }

  if (!last) {
    const err = new Error(`Gemini unreachable: ${networkError?.message || "unknown error"}`);
    err.code = "GEMINI_UNREACHABLE";
    throw err;
  }

  const { response, payload } = last;
  if (!response.ok) {
    const err = new Error(payload?.error?.message || `Gemini request failed (${response.status})`);
    err.code = "GEMINI_ERROR";
    err.status = response.status;
    throw err;
  }

  const candidate = payload?.candidates?.[0];
  const text = candidate?.content?.parts
    ?.filter((p) => !p.thought)
    .map((p) => p.text || "")
    .join("")
    .trim();
  if (!text) {
    const err = new Error(`Gemini returned no text (finishReason: ${candidate?.finishReason || "unknown"})`);
    err.code = "EMPTY_RESPONSE";
    throw err;
  }

  try {
    return extractJson(text);
  } catch (error) {
    error.message = `${error.message}: ${text.slice(0, 160)}`;
    throw error;
  }
}

module.exports = { generateJson, extractJson };
