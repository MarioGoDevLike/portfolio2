const knowledge = require("./portfolioKnowledge");
const { generateJson } = require("./geminiClient");

function offlineAnswer(question) {
  const q = String(question || "").toLowerCase();
  const { candidate, projects } = knowledge;

  if (/experience|experiences|background|skill|skills|know|stack|technolog/.test(q)) {
    return {
      answer: `Mario is a ${candidate.role}. He works mainly with React, Flutter, and Firebase, and ships real client products.`,
      topic: "experience",
    };
  }

  if (/project|work|portfolio|built|build|case/.test(q)) {
    const names = projects.map((p) => p.title).slice(0, 4).join(", ");
    return {
      answer: `His key projects include ${names}. Each one was built for a real business need.`,
      topic: "projects",
    };
  }

  if (/flutter|mobile|app/.test(q)) {
    return {
      answer: `Mario builds mobile apps with Flutter and React Native. Top Speed is a strong example of that work.`,
      topic: "mobile",
    };
  }

  if (/react|web|website|frontend/.test(q)) {
    return {
      answer: `On the web, Mario focuses on React. Alter and Raffoul Motors show that polished, client-ready style.`,
      topic: "web",
    };
  }

  if (/contact|hire|available|email|reach|get in touch|talk to|message/.test(q)) {
    return {
      answer: `Sure — I’ll take you to the contact section. You can also email Mario at ${candidate.email}.`,
      topic: "contact",
      navigateTo: "contact",
    };
  }

  if (/who|mario|about|himself/.test(q)) {
    return {
      answer: `Mario Nassar is a mobile and web developer. He builds polished apps and sites for real clients.`,
      topic: "about",
    };
  }

  return {
    answer: `I can only answer questions about Mario and this portfolio — skills, projects, or how to contact him.`,
    topic: "fallback",
  };
}

async function askPortfolio({ question, apiKey }) {
  const cleaned = String(question || "").trim();
  if (cleaned.length < 2) {
    const err = new Error("Ask a short question about Mario or this portfolio.");
    err.code = "INVALID_INPUT";
    throw err;
  }

  if (!apiKey) {
    return { ...offlineAnswer(cleaned), source: "offline" };
  }

  const prompt = `You are Mario Nassar's voice concierge.
Answer ONLY from this knowledge. Stay on Mario / this portfolio.

KNOWLEDGE:
${JSON.stringify(
    {
      candidate: knowledge.candidate,
      projects: knowledge.projects.map((p) => ({
        title: p.title,
        category: p.category,
        impact: p.impact,
      })),
    },
    null,
    2
  )}

QUESTION:
"""
${cleaned}
"""

Style rules:
- 1 to 2 short sentences only
- Easy, natural words — professional but human
- No hype, no buzzwords, no markdown
- Do not invent facts
- If they want to contact/hire/email Mario, set navigateTo to "contact"
- Otherwise navigateTo is null

Return ONLY JSON:
{
  "answer": string,
  "topic": string,
  "navigateTo": "contact" | null
}`;

  try {
    const raw = await generateJson({
      apiKey,
      prompt,
      temperature: 0.4,
    });

    const answer = String(raw?.answer || "").trim();
    if (!answer) return { ...offlineAnswer(cleaned), source: "offline" };

    const topic = String(raw?.topic || "general").slice(0, 40);
    const navigateRaw = String(raw?.navigateTo || "").toLowerCase();
    const wantsContact =
      navigateRaw === "contact" ||
      topic === "contact" ||
      /contact|hire|email|reach|get in touch|talk to|message/i.test(cleaned);

    return {
      answer: answer.slice(0, 280),
      topic,
      navigateTo: wantsContact ? "contact" : null,
      source: "gemini",
    };
  } catch (error) {
    if (error.code === "MISSING_API_KEY") throw error;
    const fallback = offlineAnswer(cleaned);
    return { ...fallback, source: "offline", warning: error.message };
  }
}

module.exports = { askPortfolio, offlineAnswer };
