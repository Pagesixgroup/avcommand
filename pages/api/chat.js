export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages, licenseKey } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  if (!licenseKey) {
    return res.status(401).json({ error: "License key required" });
  }

  try {
    const licenseRes = await fetch("https://api.gumroad.com/v2/licenses/verify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        product_id: "6MChWDSmBSv6z39ynQDJQA==",
        license_key: licenseKey.trim(),
        access_token: process.env.GUMROAD_ACCESS_TOKEN,
        increment_uses_count: "false",
      }),
    });

    const licenseData = await licenseRes.json();

    if (!licenseData.success) {
      return res.status(401).json({ error: "Invalid license key. Please re-enter your key." });
    }

    if (licenseData.purchase?.refunded || licenseData.purchase?.chargebacked) {
      return res.status(401).json({ error: "License has been refunded." });
    }

  } catch (err) {
    return res.status(500).json({ error: "License verification failed" });
  }

  const SYSTEM_PROMPT = `You are AVCommand, an expert AV systems control assistant for professional AV integrators and IT staff. You have deep knowledge of:

- RS-232 serial control protocols and command strings for professional AV equipment
- Manufacturers including Crestron, Extron, AMX, Biamp, QSC, Shure, Kramer, Atlona, Sony, Panasonic, Epson, NEC, Sharp, Christie, Barco, Cisco, Poly, Logitech, and many more
- Serial port settings (baud rate, data bits, parity, stop bits, flow control) for specific devices
- Generating Crestron SIMPL+, AMX NetLinx, and plain-text RS-232 command strings
- Telnet and IP control command equivalents
- Troubleshooting serial control issues

When asked about RS-232 commands:
1. Provide the exact HEX and/or ASCII command string
2. Include required serial port settings (baud, data bits, parity, stop bits)
3. Note any command terminator requirements (CR, LF, CR+LF, or none)
4. Mention expected response/acknowledgment if applicable
5. Flag any known quirks or gotchas for that device

When generating code snippets, format them clearly in code blocks and specify the platform (SIMPL+, NetLinx, Python, etc.)
When troubleshooting, ask clarifying questions and walk through systematically.
Be concise but thorough. Use technical language appropriate for professional AV integrators. Always note when a command is from memory vs. when the integrator should verify against the official protocol document.`;

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
    return res.status(500).json({ error: "Internal server error" });
  }
}
