# Bhavya Gupta — Interactive Personal Portfolio

An illustrated personal workspace, engineering laboratory, and interactive portfolio built for **Bhavya Gupta** (B.E. Computer Science Engineering, BITS Pilani '27).

Designed around a warm sketchbook-desk visual language—featuring a hand-drawn interactive SVG workspace with Day / Study-Lamp Night modes, verified case studies pulled from public GitHub repositories (`github.com/okBhavya`) with dedicated shareable routes (`/projects/[slug]`), animated experience counters, an interactive SU App product cohort explorer, a skill-to-proof workbench, and **Tetris**, an isolated customizable Canvas puzzle mini-game.

---

## Tech Stack

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript (`strict: true`)
- **Styling:** Tailwind CSS v4 + custom editorial CSS design tokens
- **Motion & Icons:** CSS animations + `usePrefersReducedMotion` (`prefers-reduced-motion` aware) + `lucide-react`
- **Game Engine:** Pure HTML5 Canvas 2D + optional Web Audio API SFX (no autoplay)
- **Observability:** `@vercel/analytics` + `@vercel/speed-insights`
- **Testing:** Vitest + React Testing Library + jsdom

---

## Project Structure

```text
src/
├── app/
│   ├── apple-icon.tsx         # 180x180 Apple touch icon route
│   ├── error.tsx              # Branded runtime error fallback boundary
│   ├── favicon.ico            # Root /favicon.ico fallback
│   ├── globals.css            # Warm paper & night-lamp design tokens, desk interactions
│   ├── icon.svg               # Custom editorial monogram favicon
│   ├── layout.tsx             # Google fonts, Open Graph, Twitter Card, JSON-LD, early theme script
│   ├── manifest.ts            # PWA / web app manifest
│   ├── not-found.tsx          # Styled 404 fallback page
│   ├── opengraph-image.tsx    # Dynamic 1200x630 Open Graph preview image
│   ├── page.tsx               # Main portfolio entry page
│   ├── projects/[slug]/       # Shareable pre-rendered individual case study pages
│   ├── robots.ts              # /robots.txt metadata route
│   └── sitemap.ts             # /sitemap.xml metadata route
├── components/
│   ├── hero/                  # Interactive SVG polygon desk illustration (Day & Night maps)
│   ├── projects/              # Lab gallery, filter tabs, lazy videos, SVG sketches, accessible modal
│   ├── playground/            # Lazy-loaded Tetris Canvas mini-game (keyboard + touch + SFX)
│   ├── sections/              # About, Experience (+ SUTT cohort explorer), Skills, Contact
│   ├── AnimatedCounter.tsx    # Viewport-triggered counters respecting reduced-motion
│   ├── Footer.tsx             # Illustrated signature, social links, dynamic year
│   ├── Navbar.tsx             # Sticky section-tracking navigation & Day/Night lamp toggle
│   ├── PortfolioApp.tsx       # Top-level state coordinator & back-to-top button
│   ├── SectionReveal.tsx      # Scroll reveal wrapper
│   ├── SignatureSvg.tsx       # Animated handwritten signature
│   └── ThemeProvider.tsx      # Day / Night theme state + LazyMotion provider
└── data/
    ├── experience.ts          # Verified work, leadership, NSS & SusMafia records
    ├── profile.ts             # Bio, configurable availability status, verified socials/email
    ├── projects.ts            # 6 flagship GitHub projects + 2 field-note experiments
    └── skills.ts              # Verified technical skills linked to projects & experience
public/
├── hero/                      # Day & Night illustrated desk plates
└── projects/                  # Benchmark figures, posters & WebM/MP4 rollout videos from okBhavya repos
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
| `NEXT_PUBLIC_SITE_URL` | `https://bhavya-gupta-portfolio-eta.vercel.app` | Canonical URL for Open Graph, `sitemap.xml`, and `robots.txt` |
| `NEXT_PUBLIC_AVAILABILITY_MODE` | `building` | Controls hero status badge (`building` \| `seeking` \| `custom`) |

### 3. Run Development Server or Production Server
```bash
npm run dev
# Or build & serve production output locally:
npm run build
npm run start
```
Visit `http://localhost:3000`.

### 4. Quality, Bundle & Security Checks
```bash
npm run typecheck
npm run lint
npm run test
npm run build
npm run analyze
npm audit --omit=dev
```

---

## Public Deployment Guide (Vercel Recommended)

This Next.js App Router portfolio is configured with production image optimization (`avif` / `webp`) and strict security headers in both `next.config.ts` and `vercel.json`.

### Option A: Deploy to Vercel (Recommended — Zero-Config HTTPS)
1. Push this directory to a **public GitHub repository** (e.g. `okBhavya/portfolio`):
   ```bash
   git init
   git add .
   git commit -m "feat: interactive portfolio for Bhavya Gupta"
   git branch -M main
   git remote add origin https://github.com/okBhavya/<repo-name>.git
   git push -u origin main
   ```
2. Go to [vercel.com/new](https://vercel.com/new), sign in with GitHub, and import the repository.
3. Keep the default **Next.js** build settings (`npm run build`).
4. Add environment variables in **Project Settings → Environment Variables**:
   - `NEXT_PUBLIC_SITE_URL` = your Vercel URL (e.g. `https://bhavya-gupta-portfolio-eta.vercel.app`, or your own custom domain)
   - `NEXT_PUBLIC_AVAILABILITY_MODE` = `building` (or `seeking` when actively interviewing)
5. Click **Deploy**. Vercel automatically provisions HTTPS on `*.vercel.app`.

### Option B: Connect a Custom Domain
1. Open **Vercel Dashboard → Project → Settings → Domains** and add your custom domain (plus `www`).
2. At your DNS registrar (Namecheap, Cloudflare, Porkbun, etc.), add the DNS records Vercel displays:
   - Apex (`@`): `A` record pointing to `76.76.21.21` (or `ALIAS`/`ANAME` if supported)
   - `www`: `CNAME` record pointing to `cname.vercel-dns.com`
3. Wait for DNS propagation (usually 5–30 minutes); Vercel automatically issues and renews the TLS/HTTPS certificate.
4. Update `NEXT_PUBLIC_SITE_URL` in Vercel to `https://your-custom-domain.com` and redeploy so `sitemap.xml`, `robots.txt`, canonical links, and Open Graph URLs match your live domain.

---

## Security Posture

- Read-only portfolio with **zero backend database**, **zero exposed secrets**, and privacy-first Vercel Analytics & Speed Insights.
- Strict security headers configured in `next.config.ts` and `vercel.json`:
  - `Content-Security-Policy` blocking `object-src 'none'`, `frame-ancestors 'none'`, `unsafe-eval`, and restricting scripts/telemetry strictly to `'self'`, `https://va.vercel-scripts.com`, and `https://vitals.vercel-insights.com`.
  - `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`, and `Strict-Transport-Security`.
- External links enforce `rel="noopener noreferrer"`.
- Client-side mailto composer sanitizes control characters and enforces length limits before opening the user's native mail client.
