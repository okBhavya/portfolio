# Bhavya Gupta — Interactive Personal Portfolio

An illustrated personal workspace, engineering laboratory, and interactive portfolio built for **Bhavya Gupta** (B.E. Computer Science Engineering, BITS Pilani '27).

Designed around a warm sketchbook-desk visual language—featuring a hand-drawn interactive SVG workspace with Day / Study-Lamp Night modes, verified case studies pulled from public GitHub repositories (`github.com/okBhavya`), animated experience counters, an interactive SU App product cohort explorer, a skill-to-proof workbench, and **Byte Runner**, an isolated Canvas survival game.

---

## Tech Stack

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript (`strict: true`)
- **Styling:** Tailwind CSS v4 + custom editorial CSS design tokens
- **Motion & Icons:** `motion` (`prefers-reduced-motion` aware) + `lucide-react`
- **Game Engine:** Pure HTML5 Canvas 2D + optional Web Audio API SFX (no autoplay)
- **Testing:** Vitest + React Testing Library + jsdom

---

## Project Structure

```text
src/
├── app/
│   ├── globals.css          # Warm paper & night-lamp design tokens, desk interactions
│   ├── icon.svg             # Custom editorial monogram favicon
│   ├── layout.tsx           # Google fonts, Open Graph, Twitter Card, JSON-LD schema
│   ├── opengraph-image.tsx  # Dynamic 1200x630 Open Graph preview image
│   ├── page.tsx             # Main entry page
│   ├── robots.ts            # /robots.txt metadata route
│   └── sitemap.ts           # /sitemap.xml metadata route
├── components/
│   ├── hero/                # Interactive SVG desk illustration + responsive quick-access strip
│   ├── projects/            # Lab gallery, filter tabs, SVG sketches, accessible case-study modal
│   ├── playground/          # Isolated Byte Runner Canvas mini-game (keyboard + touch + SFX)
│   ├── sections/            # About, Experience (+ SUTT cohort explorer), Skills, Contact
│   ├── AnimatedCounter.tsx  # Viewport-triggered counters respecting reduced-motion
│   ├── Footer.tsx           # Illustrated signature, social links, dynamic year, back-to-top
│   ├── Navbar.tsx           # Sticky section-tracking navigation & Day/Night lamp toggle
│   ├── PortfolioApp.tsx     # Top-level state coordinator
│   ├── SectionReveal.tsx    # Scroll reveal wrapper
│   ├── SignatureSvg.tsx     # Animated handwritten signature
│   └── ThemeProvider.tsx    # Day / Night theme state
└── data/
    ├── experience.ts        # Verified work, leadership, NSS & SusMafia records
    ├── profile.ts           # Bio, configurable availability status, verified socials/email
    ├── projects.ts          # 6 flagship GitHub projects + 2 field-note experiments
    └── skills.ts            # Verified technical skills linked to projects & experience
public/
└── projects/                # Real benchmark figures & demo GIFs from okBhavya repositories
```

---

## Local Setup & Verification

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (Optional)
Copy `.env.example` to `.env.local` and adjust if deploying to a custom domain:
```bash
cp .env.example .env.local
```

| Variable | Default | Purpose |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SITE_URL` | `https://bhavyagupta.dev` | Canonical URL for Open Graph, `sitemap.xml`, and `robots.txt` |
| `NEXT_PUBLIC_AVAILABILITY_MODE` | `building` | Controls hero status badge (`building` \| `seeking` \| `custom`) |

### 3. Run Development Server or Preview Static Build
```bash
npm run dev
# Or build the static production export (`out/`) and preview locally:
npm run build
npx serve out
```
Visit `http://localhost:3000`.

### 4. Quality & Security Checks
```bash
npm run typecheck
npm run lint
npm run test
npm run build
npm audit
```

---

## Public Deployment Guide (Vercel Recommended)

This portfolio is a static-friendly, database-free Next.js application configured with production security headers in both `next.config.ts` and `vercel.json`.

### Option A: Deploy to Vercel (Recommended — Zero-Config HTTPS)
1. Push this directory to a **public GitHub repository** (e.g. `okBhavya/portfolio`):
   ```bash
   git init
   git add .
   git commit -m "feat: initial interactive portfolio for Bhavya Gupta"
   git branch -M main
   git remote add origin https://github.com/okBhavya/<repo-name>.git
   git push -u origin main
   ```
2. Go to [vercel.com/new](https://vercel.com/new), sign in with GitHub, and import the repository.
3. Keep the default **Next.js** build settings (`npm run build`).
4. Add environment variables in **Project Settings → Environment Variables**:
   - `NEXT_PUBLIC_SITE_URL` = your Vercel URL (or custom domain like `https://bhavyagupta.dev`)
   - `NEXT_PUBLIC_AVAILABILITY_MODE` = `building` (or `seeking` when actively interviewing)
5. Click **Deploy**. Vercel automatically provisions HTTPS on `*.vercel.app`.

### Option B: Connect a Custom Domain (e.g. `bhavyagupta.dev` or `bhavyagupta.in`)
1. Open **Vercel Dashboard → Project → Settings → Domains** and add `bhavyagupta.dev` (plus `www.bhavyagupta.dev`).
2. At your DNS registrar (Namecheap, Cloudflare, Porkbun, etc.), add the DNS records Vercel displays:
   - Apex (`@`): `A` record pointing to `76.76.21.21` (or `ALIAS`/`ANAME` if supported)
   - `www`: `CNAME` record pointing to `cname.vercel-dns.com`
3. Wait for DNS propagation (usually 5–30 minutes); Vercel automatically issues and renews the TLS/HTTPS certificate.
4. Update `NEXT_PUBLIC_SITE_URL` in Vercel to `https://bhavyagupta.dev` and redeploy so `sitemap.xml`, `robots.txt`, canonical links, and Open Graph URLs match your live domain.

---

## Security Posture

- Read-only static portfolio with **zero backend database**, **zero exposed secrets**, and **zero third-party analytics/tracking scripts**.
- Strict security headers configured in `next.config.ts` and `vercel.json`:
  - `Content-Security-Policy` blocking `object-src 'none'`, `frame-ancestors 'none'`, third-party `script-src` / `connect-src`, and `unsafe-eval` in production.
  - `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`, and `Strict-Transport-Security`.
- External links enforce `rel="noopener noreferrer"`.
- Client-side mailto composer sanitizes control characters and enforces length limits before opening the user's native mail client.
