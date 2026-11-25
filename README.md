# PhishGuard // Email Threat Triage & Security Audit Platform

An enterprise-grade, utilitarian phishing detection, heuristic inspection, and contextual AI analysis interface built on **Next.js (App Router)** and **Tailwind CSS**.

Deployable directly to **Vercel** as a unified serverless application without requiring any external Python or Node backend.

---

## Key Features

1. **Deterministic Heuristic Engine (`lib/detector.js`)**:
   - **Sender & Domain Reputation**: Detects brand spoofing, Levenshtein typosquatting (e.g. `micros0ft`, `paypa1`), suspicious top-level domains (`.xyz`, `.top`, `.tk`), free webmail abuse for corporate impersonation, and domain mismatch.
   - **Hyperlink & URL Inspector**: Analyzes raw URI syntax, flags unauthenticated raw IP destinations (`http://194.26.29.112`), identifies URL shorteners (`bit.ly`, `tinyurl`), and catches deceptive anchor text mismatches (e.g. text claims `chase.com` but href points to `phish-portal.com`).
   - **Psychological Trigger Analysis**: High-density regex analysis detecting manufactured urgency, artificial deadlines, fear coercion, and credential harvesting lures.
   - **Scoring & Classification**: Normalizes risk into **Likely Phishing** (Critical), **Suspicious** (Warning), or **Likely Legitimate** (Low Risk).

2. **Contextual AI Analysis (Google Gemini API)**:
   - Serverless route handler (`app/api/gemini/route.js`) with dynamic model discovery and fallback (`gemini-2.0-flash`, `gemini-1.5-flash`, `gemini-1.5-pro`, `gemini-pro`).
   - Handles Google API `404 Not Found` errors automatically by querying `ModelService.ListModels` to identify available models on your specific API key.
   - Interprets language intent, authority coercion, tone, and cognitive manipulation.

3. **Interactive Defensive Playbooks & SOPs (`components/VerificationPlaybooks.jsx`)**:
   - Out-of-band verification standard operating procedures for Banking, Enterprise SSO, Executive BEC wire transfers, Couriers, and Vendor Invoices.
   - Contrasts unsafe in-band reflexes against verified out-of-band channels.

4. **Threat Recognition Assessment Drill (`components/AwarenessQuiz.jsx`)**:
   - Practical 5-question scenario quiz testing user ability to spot typosquatting, display name spoofing, and social engineering manipulation with technical rationales.

5. **Utilitarian, High-Density Interface**:
   - Strict anti-AI-slop design: zero purple/indigo gradients, no neon glow borders, no circular gauges, no marketing fluff. Clean monochrome typography inspired by Cloudflare Zero Trust, Snyk, and GitHub Security.

---

## Local Development

### 1. Prerequisites
- Node.js (v18+) and npm.

### 2. Configure Environment Variables
Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```
Add your Google Gemini API key:
```env
GEMINI_API_KEY=AIzaSy...
```
*(Alternatively, you can leave it blank and configure your API key directly in the web UI settings modal at runtime).*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deploying to Vercel

1. Push this repository to GitHub / GitLab.
2. In the [Vercel Dashboard](https://vercel.com/new), import your repository.
3. In **Environment Variables**, add:
   - `GEMINI_API_KEY`: your Google Gemini API key.
4. Click **Deploy**. Vercel will build the Next.js project and deploy the App Router route handlers as serverless functions.
