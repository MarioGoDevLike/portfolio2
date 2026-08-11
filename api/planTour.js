const tourStops = require("./tourStops");
const knowledge = require("./portfolioKnowledge");
const { generateJson } = require("./geminiClient");

const TOUR = {
  title: "Website tour",
  vibe: "Craft · work · first impression",
  stopIds: ["home", "about", "services", "work", "work-featured", "contact"],
};

function stopsById() {
  return Object.fromEntries(tourStops.map((s) => [s.id, s]));
}

function buildFallbackTour() {
  const map = stopsById();

  return {
    title: TOUR.title,
    vibe: TOUR.vibe,
    source: "fallback",
    mode: "website",
    steps: TOUR.stopIds
      .map((id) => {
        const stop = map[id];
        if (!stop) return null;
        return {
          id: stop.id,
          label: stop.label,
          narration: stop.line || "",
          dwellMs: 5200,
        };
      })
      .filter(Boolean),
  };
}

/** Gemini may rewrite lines only — path stays fixed. */
function applyNarrationOverrides(baseTour, overrides = []) {
  const byId = Object.fromEntries(
    (Array.isArray(overrides) ? overrides : []).map((s) => [
      String(s.id || "").trim(),
      String(s.narration || "").trim(),
    ])
  );

  return {
    ...baseTour,
    source: "gemini",
    steps: baseTour.steps.map((step) => {
      const rewritten = byId[step.id];
      if (!rewritten) return step;
      return {
        ...step,
        narration: rewritten.slice(0, 280),
        dwellMs: Math.max(4400, Math.min(6800, Number(step.dwellMs) || 5200)),
      };
    }),
  };
}

async function planTour({ prompt, apiKey }) {
  const userPrompt = String(prompt || "").trim();
  const base = buildFallbackTour();

  if (!apiKey) {
    if (userPrompt) base.vibe = `${base.vibe} · tailored offline`;
    return base;
  }

  const catalog = base.steps.map((s) => ({
    id: s.id,
    label: s.label,
    defaultLine: s.narration,
  }));

  const systemPrompt = `You rewrite guided-tour lines for Mario Nassar's portfolio.

This is ONE website tour. Walk the site and speak well about Mario — skilled, professional, reliable — without sounding fake or over-the-top.

Fixed stops (do NOT add, remove, or reorder):
${JSON.stringify(catalog, null, 2)}

Facts you may use (do not invent more):
${JSON.stringify(
    {
      role: knowledge.candidate.role,
      skills: knowledge.candidate.skills.slice(0, 8),
      strengths: knowledge.candidate.strengths.slice(0, 4),
      projects: knowledge.projects.map((p) => p.title),
    },
    null,
    2
  )}

Visitor note: ${userPrompt || "(none)"}

Rules for each narration:
- 1 to 2 sentences
- Medium length (about 25–40 words) — not tiny, not a paragraph
- Easy, human words; warm and professional
- Mix the section you’re on with why Mario is strong at that kind of work
- No hype, no buzzword soup, no markdown

Return ONLY JSON:
{
  "title": string,
  "vibe": string,
  "steps": [ { "id": string, "narration": string } ]
}`;

  try {
    const raw = await generateJson({
      apiKey,
      prompt: systemPrompt,
      temperature: 0.55,
    });

    const tour = applyNarrationOverrides(base, raw?.steps);
    if (raw?.title) tour.title = String(raw.title).trim().slice(0, 48) || tour.title;
    if (raw?.vibe) tour.vibe = String(raw.vibe).trim().slice(0, 64) || tour.vibe;
    return tour;
  } catch (error) {
    if (error.code === "MISSING_API_KEY") throw error;
    base.source = "fallback";
    base.vibe = `${base.vibe} · offline`;
    base.warning = error.message;
    return base;
  }
}

module.exports = {
  planTour,
  buildFallbackTour,
  TOUR,
  tourStops,
};
