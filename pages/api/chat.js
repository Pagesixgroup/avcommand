export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid request body" });
  }
  const SYSTEM_PROMPT = `You are AVCommand, an expert AV systems control assistant for professional AV integrators and IT staff.`;
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages,
      }),
    });
    if (!response.ok) {
      const error = await response.json();
      return res.status(response.status).json({ error: error.error?.message || "API error" });
    }
    const data = await response.json();
    const reply = data.content?.find((b) => b.type === "text")?.text || "No response received.";
    return res.status(200).json({ reply });
  } catch (err) {
    console.error("API route error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
