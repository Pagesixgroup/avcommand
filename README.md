# AVCommand — AV Integrator Control Assistant

Professional RS-232 / serial control assistant for AV integrators.

---

## Deploy to Vercel (10 minutes)

### Step 1 — Upload to GitHub
1. Go to github.com and create a free account if you don't have one
2. Click **New repository** → name it `avcommand` → click **Create repository**
3. Upload all these project files to the repository

### Step 2 — Deploy on Vercel
1. Go to vercel.com and sign up with your GitHub account
2. Click **Add New Project**
3. Select your `avcommand` repository
4. Click **Deploy** — Vercel auto-detects Next.js

### Step 3 — Add your API key (THE IMPORTANT PART)
1. In your Vercel project dashboard, go to **Settings → Environment Variables**
2. Add a new variable:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** your Anthropic API key (starts with `sk-ant-...`)
3. Click **Save**
4. Go to **Deployments** and click **Redeploy** to apply the variable

Your app is now live at `your-project-name.vercel.app` 🎉

---

## Run locally (optional)

```bash
npm install
cp .env.example .env.local
# Edit .env.local and add your API key
npm run dev
```

Open http://localhost:3000

---

## Project structure

```
avcommand/
├── pages/
│   ├── api/
│   │   └── chat.js        ← API route (API key lives here, server-side)
│   ├── _app.js
│   └── index.js           ← Main app UI
├── styles/
│   └── globals.css
├── .env.example            ← Template (safe to share)
├── .gitignore              ← Keeps .env.local out of git
├── next.config.js
└── package.json
```
