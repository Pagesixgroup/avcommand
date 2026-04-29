export default async function handler(req, res) {
  const body = req.body;
  const key = body && body.licenseKey;
  
  if (!key) {
    return res.status(400).json({ 
      error: "License key required",
      received: JSON.stringify(body),
      method: req.method,
      contentType: req.headers['content-type']
    });
  }

  return res.status(200).json({ valid: true, email: "test@test.com" });
}
