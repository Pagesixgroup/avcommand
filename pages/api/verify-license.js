export default async function handler(req, res) {
  const key = req.body?.licenseKey;

  if (!key) {
    return res.status(400).json({ 
      error: "License key required",
      hasBody: !!req.body,
      bodyKeys: req.body ? Object.keys(req.body) : [],
      rawBody: JSON.stringify(req.body)
    });
  }

  const hasToken = !!process.env.GUMROAD_ACCESS_TOKEN;

  try {
    const response = await fetch("https://api.gumroad.com/v2/licenses/verify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        product_id: "F7XiS1Na-qvjor9zRd2NNw==",
        license_key: key.trim(),
        access_token: process.env.GUMROAD_ACCESS_TOKEN,
        increment_uses_count: "false",
      }),
    });

    const data = await response.json();

    if (data.success) {
      return res.status(200).json({ valid: true, email: data.purchase?.email || "" });
    } else {
      return res.status(200).json({
        valid: false,
        error: data.message || "Invalid license key",
        hasToken,
      });
    }
  } catch (err) {
    return res.status(500).json({ error: "Verification failed: " + err.message });
  }
}
