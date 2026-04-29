export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  let licenseKey;
  try {
    if (typeof req.body === "string") {
      const parsed = JSON.parse(req.body);
      licenseKey = parsed.licenseKey;
    } else {
      licenseKey = req.body?.licenseKey;
    }
  } catch {
    licenseKey = req.body?.licenseKey;
  }

  if (!licenseKey || !licenseKey.trim()) {
    return res.status(400).json({ error: "License key required" });
  }

  try {
    const response = await fetch("https://api.gumroad.com/v2/licenses/verify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        product_id: "F7XiS1Na-qvjor9zRd2NNw==",
        license_key: licenseKey.trim(),
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
        error: data.message || "Invalid license key. Check your key and try again.",
      });
    }
  } catch (err) {
    return res.status(500).json({ error: "Verification failed: " + err.message });
  }
}
