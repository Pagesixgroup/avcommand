export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body;

  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Valid email required" });
  }

  try {
    const response = await fetch(
      `https://api.beehiiv.com/v2/publications/${process.env.BEEHIIV_PUB_ID}/subscriptions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.BEEHIIV_API_KEY}`,
        },
        body: JSON.stringify({
          email,
          reactivate_existing: false,
          send_welcome_email: true,
          utm_source: "av-command.com",
          utm_medium: "landing_page",
        }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      return res.status(200).json({ success: true });
    } else {
      console.error("Beehiiv error:", data);
      return res.status(400).json({ error: data.message || "Signup failed" });
    }
  } catch (err) {
    console.error("Newsletter signup error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
