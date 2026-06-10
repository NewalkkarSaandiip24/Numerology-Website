# Newalkkarsaandiip — Numerology & Vastu Website

## Original Problem Statement
Build an elegant business website for Newalkkarsaandiip (Mobile Numerologist, Name Numerologist, Vastu Consultant).
- Provide a logo that gives astrological/numerological business vibes
- Write an introduction
- Contact form collects name & mobile, opens WhatsApp to +91 9929059153 with details
- Deploy live on newalkkarsaandiip.in

## User Choices (confirmed)
- Name spelling: **Newalkkarsaandiip**
- Logo style: **Classic gold + deep purple elegance**
- WhatsApp notification: **Open WhatsApp chat link (client-side)**
- Services: Mobile Numerology, Name Numerology, Vastu Consultation, Business Name Correction + Testimonials

## Architecture
- **Frontend only** single-page marketing site (React + Tailwind + Shadcn primitives).
- **No backend integration required** — contact form builds a `wa.me` URL and opens it in a new tab, pre-filling name/mobile/message.
- **Design**: Dark aubergine (#0F0518) + classic gold (#D4AF37) palette. Cormorant Garamond headings, Outfit body, Azeret Mono labels.
- **Logo**: Custom SVG — compass ring + Sri Yantra–style interlocking triangles + central "N9" monogram (9 = master completion number).

## Core Sections (implemented)
1. Sticky glass nav with brand logo + links + CTA
2. Hero — immersive cosmic background, sacred-geometry logo (slow rotating), stats, dual CTAs
3. About / Introduction — portrait + written intro as Mobile Numerologist, Name Numerologist, Vastu Consultant; lineage chips (Chaldean, Pythagorean, Vastu Purush)
4. Services — 4 bento-style glass cards with Lucide icons (Mobile Numerology, Name Numerology, Vastu Consultation, Business Name Correction)
5. Testimonials — 3 glass cards with 5-star ratings
6. Contact — glass form (Name, Mobile, optional Message) → opens WhatsApp (+91 9929059153) with a Namaste message pre-filled
7. Footer — brand, nav, reach info
8. Floating WhatsApp button (bottom-left) for quick contact

## What's Been Implemented (Dec 2025 → Feb 2026)
- Full single-page site with 7 sections
- Custom SVG sacred-geometry logo
- WhatsApp deep-link contact form with validation (name required, 10-digit mobile required)
- Reveal-on-scroll animations, slow-spin sacred geometry, gold shimmer text
- Responsive layout (mobile + desktop)
- All data-testid attributes present for testing
- SEO meta description & custom title
- **Name Numerology Calculator** (`/name-numerology`) and **Personal Year Calculator** (`/personal-year`)
- Performance: WebP images, async fonts, _headers cache rules
- Advanced SEO: JSON-LD, sitemap.xml, optimized meta + canonical
- **(Feb 10, 2026) Mobile Number Compatibility — full-stack feature**
  - FastAPI + MongoDB backend with JWT-auth admin panel
  - Endpoints: `/api/admin/login`, `/api/admin/users` (CRUD + history), `/api/check-authorized/{mobile}`
  - Admin mobiles + password seeded from env vars `ADMIN_MOBILES` / `ADMIN_DEFAULT_PASSWORD` (deployment-ready)
  - `/admin` dashboard: login, add/remove authorized clients, active + removed history tabs
  - `/mobile-compatibility` public page: form gated by authorization check
    - Restricted-access notice on entry (data-testid `mc-restricted-notice`)
    - Mobile field placeholder: "Enter mobile number without country Code"
    - Unauthorized → "Contact the Administrator" card with Newalkkar Saandiip name + +91 99290 59153 (no WhatsApp request-access button)
    - Authorized → digit-sum, zero-modification, 9-pair analysis, Kaal Sarp / Pitra dosh + repeat alerts
  - "Mobile Compatibility" link visible in main desktop Nav
- **(Feb 10, 2026) Site-wide readability upgrade**
  - `.v-label` font-size 0.7rem → 0.82rem, color `#D4AF37` → brighter `#F3D060`, weight 500, tighter spacing
  - Contact form labels (Home), table headers (`/admin`, `/mobile-compatibility`) all bumped to bigger, brighter gold
  - Verified at 13.12px / rgb(243,208,96) / weight 500 by automated regression
- **(Feb 10, 2026) Click-to-Call mobile float** — `tel:+919929059153` button with gold pulse ring, mobile-only (`md:hidden`), stacked above WhatsApp float
- **(Feb 10, 2026) /mobile-compatibility refinement**
  - Removed "Modified Number for Pair Analysis" section entirely (logic kept internal)
  - Added responsive mobile-card layout (`mc-card-0..8`) for viewports <640px; desktop table (`mc-row-0..8`) at 640px+
  - SEO: bigger title, expanded description+keywords, og:image, JSON-LD WebApplication node, sitemap entry
  - Owner mobiles `9929059153` & `9829312193` authorized as compatibility clients until 2030-12-31
- **(Feb 10, 2026) Speed**: deferred third-party `emergent-main.js` script in `index.html`
- **Regression suite**: `/app/backend/tests/test_mobile_compat.py` (11 cases). Iteration_4 = 100% pass.
- **(Feb 11, 2026) Blog CMS** — Admin CRUD + public SEO-optimized `/blogs` & `/blogs/:slug`
- **(Feb 11, 2026) Dynamic Course Landing Pages** `/learn/:course` with WhatsApp lead capture, red shaky CTAs, countdown timer, fear-based copy. `course_leads` collection. `robots.txt` disallows `/learn`.
- **(Feb 11, 2026) Privacy Policy page** `/privacy-policy`
- **(Feb 11, 2026) PDF report cleanup** — duplicate "27/72" fix, direct download, footer, Lakshmi-Ganesh cover imagery
- **(Feb 11, 2026) Recorded Sessions feature — full-stack** (`/recordings`)
  - Backend: `video_sections` + `videos` collections; admin CRUD at `/api/admin/recordings/sections|videos`; mobile-gated public endpoint `POST /api/recordings/access`
  - Public page: `/recordings` — mobile gate using same `authorized_users` collection as Mobile Compatibility; YouTube Unlisted iframe player; auto-restore via `localStorage` (`ns_recordings_mobile`); per-video access via `allowed_mobiles` whitelist (empty = ALL authorized clients can watch)
  - Admin: "Manage Recorded Sessions" section in `/admin` — create/delete sections, add/edit/delete videos with title/URL/description/allowed mobiles
  - Nav: "Recordings" link added to desktop + mobile nav and footer
  - Regression: `/app/backend/tests/test_recordings.py` (11 cases). Iteration_5 = 100% pass (frontend + backend).

## Backlog (Next Action Items)
- **P0**: User to click **Deploy** to push the new `/recordings` feature to production `newalkkarsaandiip.in`
- **P1**: Hardening (per code review): rate-limit admin login, move DEFAULT_PASSWORD to env, strict ISO date validation on `expires_on`, migrate from on_event → lifespan, consider httpOnly cookie for JWT
- **P1**: Refactor `/app/backend/server.py` into routers (recordings_router.py, blogs_router.py, admin_router.py) — now 533 lines
- **P1**: Replace `window.confirm()` in Admin RecordingsManager with shadcn AlertDialog (`rec-delete-confirm` testid) for flaky-free deletes
- **P1**: Add Pydantic date validation for `expires_on` at write time
- **P2**: Add favicon + OG image using the gold logo
- **P2**: Add Hindi language toggle
- **P2**: Gallery of past consultations / before-after name-correction cases
- **P2**: Per-user video view counts / last-viewed timestamp on `/recordings`
