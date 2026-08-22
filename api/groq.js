// api/groq.js (Vercel Serverless Function Proxy for Groq AI)
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed", success: false });
  }

  const apiKey = process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY;

  if (!apiKey) {
    return res.status(503).json({
      error: "Groq API key is not configured on the server",
      success: false,
    });
  }

  try {
    const payload = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await groqRes.json().catch(() => ({}));

    if (!groqRes.ok) {
      return res.status(groqRes.status).json({
        error: data?.error?.message || groqRes.statusText,
        success: false,
        status: groqRes.status,
      });
    }

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    console.error("[Groq Serverless Proxy Error]:", err);
    return res.status(500).json({ error: err.message, success: false });
  }
}
