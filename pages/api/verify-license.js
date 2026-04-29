export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { licenseKey } = req.body;

  if (!licenseKey) {
    return res.status(400).json({ error: "License key required" });
  }

  try {
    const response = await fetch("https://api.gumroad.com/v2/licenses/verify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        product_permalink: "AVCommandPro",
        license_key: licenseKey.trim(),
        access_token: process.env.GUMROAD_ACCESS_TOKEN,
      }),
    });

    const data = await response.json();

    if (data.success) {
      return res.status(200).json({
        valid: true,
        email: data.purchase?.email || "",
      });
    } else {
      return res.status(200).json({
        valid: false,
        error: data.message || "Invalid license key",
      });
    }
  } catch (err) {
    console.error("License verify error:", err);
    return res.status(500).json({ error: "Verification failed" });
  }
}
