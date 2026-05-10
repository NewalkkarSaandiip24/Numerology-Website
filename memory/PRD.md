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
- **Regression suite**: `/app/backend/tests/test_mobile_compat.py` (11 cases). Iteration_3 = 100% pass.

## Backlog (Next Action Items)
- **P0**: Deploy to Emergent and hook up the custom domain `newalkkarsaandiip.in` (requires user to update DNS at their registrar after Emergent deployment)
- **P1**: Hardening (per code review): rate-limit admin login, move DEFAULT_PASSWORD to env, strict ISO date validation on `expires_on`, migrate from on_event → lifespan, consider httpOnly cookie for JWT
- **P1**: Email-based password reset for admin (deferred per user request)
- **P1**: Add blog/articles section for SEO (numerology insights)
- **P2**: Add favicon + OG image using the gold logo
- **P2**: Add Hindi language toggle
- **P2**: Gallery of past consultations / before-after name-correction cases
