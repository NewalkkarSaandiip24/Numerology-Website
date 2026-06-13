import React, { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import {
  CheckCircle2, ChevronDown, Star, Clock, Users, Award, Phone,
  Sparkles, Calendar, Languages, Video, Zap, ShieldCheck, Trophy,
  BookOpen, AlertTriangle, Heart, IndianRupee, ArrowRight
} from "lucide-react";
import Logo from "../components/Logo";
import WhatsAppIcon from "../components/WhatsAppIcon";
import useSEO from "../hooks/useSEO";
import { publicApi, formatErr } from "../lib/api";

// Format YYYY-MM-DD → "Saturday · 15 March 2026"
function formatScheduleDate(yyyy_mm_dd) {
  if (!yyyy_mm_dd) return "";
  try {
    const [y, m, d] = yyyy_mm_dd.split("-").map((n) => parseInt(n, 10));
    if (!y || !m || !d) return "";
    const dt = new Date(Date.UTC(y, m - 1, d));
    const opts = { weekday: "long", day: "2-digit", month: "long", year: "numeric", timeZone: "UTC" };
    return dt.toLocaleDateString("en-IN", opts);
  } catch {
    return "";
  }
}

/* ===== Course catalogue (dynamic — extend any time) ===== */
const COURSES = {
  numerology: {
    slug: "numerology",
    label: "Numerology",
    hero_kicker: "Live 2-Day Workshop",
    hero_h1: "The Hidden Numbers Running Your Life — Learn To Decode Them in Just 2 Days.",
    hero_sub: "Discover how your Birth Number, Destiny Number, Name vibration & Mobile Number are silently shaping your money, health, marriage and career — and how to align them in your favour.",
    cta: "Yes, Teach Me Numerology",
    cta_short: "Reserve My Seat",
    price: 99,
    original_price: 4999,
    date: "Coming Saturday & Sunday",
    language: "English + Hindi",
    time: "9:00 PM IST",
    platform: "Live On Zoom",
    pains: [
      "Hard work brings money in — but it never stays or grows.",
      "Your name looks fine on paper, but life keeps testing you.",
      "Mobile number changed many times — same struggles continue.",
      "Marriage / career / business stuck for no clear reason.",
      "Tried remedies before — nothing actually shifted.",
      "Something feels off — you just can't name it.",
    ],
    why_blocks: [
      { icon: Heart, h: "Wrong Name Vibration", t: "Your birth name may be carrying numbers that fight your destiny — small spelling tweaks can change everything." },
      { icon: Phone, h: "Wrong Mobile Number", t: "The number you carry 24/7 is vibrating into every call, transaction and message. A wrong total blocks abundance." },
      { icon: AlertTriangle, h: "Kaal Sarp / Pitra Dosh", t: "Certain digit combinations create silent karmic blocks. Learn to spot them in any number — yours, spouse, child, business." },
      { icon: Zap, h: "Year-Energy Mismatch", t: "Personal Year governs the kind of opportunities the universe sends you. Most people miss them because they don't know what year they're in." },
      { icon: Trophy, h: "Wrong Business Name", t: "Brand names carry their own vibration. The wrong total = slow growth, partner disputes, cashflow blocks." },
      { icon: Sparkles, h: "Make This A Career", t: "Once you understand the system, you can read for family, friends, and clients — building a respected side income." },
    ],
    modules: [
      ["Foundations of Numerology", [
        "Origin, Chaldean vs Pythagorean systems, and why one works better in India.",
        "The 1-9 vibrations, ruling planets and their personality blueprint.",
      ]],
      ["Birth Number (Mulank) & Destiny Number (Bhagyank)", [
        "Calculate your BN & DN in seconds — and what each says about you.",
        "How BN and DN interact — your inner driver vs outer purpose.",
      ]],
      ["Name Numerology & Name Correction", [
        "How letters carry numbers; the Chaldean letter-to-number chart.",
        "Diagnose name vibration; minimal spelling correction with maximum impact.",
      ]],
      ["Mobile Number Numerology", [
        "Mobile total, modifying zeros, pair-by-pair analysis (good / neutral / bad).",
        "How to pick the perfect mobile number for your BN-DN and profession.",
      ]],
      ["Kaal Sarp Dosh & Pitra Dosh in Numbers", [
        "Spot dosh patterns inside any 10-digit number instantly.",
        "Practical remedies — no expensive rituals.",
      ]],
      ["Business Name & Brand Numerology", [
        "Choose / correct a brand, shop or company name for maximum prosperity.",
        "Cashflow numbers, partnership numbers, logo numbers — the full toolkit.",
      ]],
      ["Personal Year, Month & Day", [
        "Find your current Personal Year and the energy theme it brings.",
        "Best months and days for marriage, deals, launches and signing.",
      ]],
      ["Career / Marriage / Health Numbers", [
        "Lucky profession numbers, marriage compatibility, health-supportive vibrations.",
        "How to use these on bank accounts, vehicle numbers, even home addresses.",
      ]],
      ["Build A Numerology Consultation Practice", [
        "How to read a client's full chart in 20 minutes.",
        "Ethics, pricing, and how Newalkkar Saandiip ji built his practice.",
      ]],
    ],
    for_whom: [
      "You want clarity on why life isn't moving — and what to actually fix.",
      "You want to correct your name / mobile / business name the right way.",
      "You want to read numbers for your family — and stop depending on others.",
      "You want a respected skill that can become a side income or full career.",
    ],
    testimonials: [
      ["Pooja Agrawal", "Jaipur",
       "I changed my name spelling after Saandiip ji's reading. Within 3 months I closed two stuck deals. I joined this course to learn it myself — and the clarity was unmatched."],
      ["Rakesh Mittal", "Delhi",
       "I always thought numerology was just superstition. After day one I understood it's pure pattern logic. My business name is now corrected and team morale shifted noticeably."],
      ["Neha Kapoor", "Mumbai",
       "Worth 100x the fee. Newalkkar Saandiip ji explained Kaal Sarp dosh in mobile numbers so simply that I caught it in my sister's number — and we changed it the next day."],
      ["Ankit Sharma", "Bangalore",
       "Practical, no fluff, no scary rituals. I started reading numbers for friends within a week and they were amazed. Considering this as a part-time practice now."],
    ],
    faqs: [
      ["I have zero numerology background. Will I follow along?",
       "Absolutely. The course starts from absolute basics. Every formula is broken into small steps you can apply within the same session."],
      ["Is it live or recorded?",
       "100% LIVE on Zoom — you can ask questions, share your name and mobile number, and get instant guidance from Newalkkar Saandiip ji."],
      ["Will I get a recording if I miss?",
       "Yes. All registered students receive a recording for 7 days after the workshop."],
      ["Can I really pick a lucky mobile number after this?",
       "Yes — you'll learn the complete pair-by-pair logic, dosh detection and total-selection method. By Day 2 you'll be able to evaluate any 10-digit number in under 60 seconds."],
      ["Does this work for business owners?",
       "Especially for business owners. You'll learn brand-name numerology, partner compatibility numbers and cashflow-friendly mobile totals."],
      ["What if I can't attend live?",
       "Watch the recording within 7 days. But live attendance is strongly recommended — Q&A is where most clarity happens."],
      ["Is there a certificate?",
       "Yes — a participation certificate from Newalkkar Saandiip after completion."],
      ["What's the refund policy?",
       "Due to the live nature of the course and limited seats, fees are non-refundable. Please ensure you can attend before registering."],
    ],
  },

  vastu: {
    slug: "vastu",
    label: "Vastu",
    hero_kicker: "Live 2-Day Workshop",
    hero_h1: "The Energy Blocking Your Money, Health & Peace Is Inside Your Home — Learn To Fix It Without Breaking a Single Wall.",
    hero_sub: "Discover practical Vastu principles based on directions, elements and energy flow — apply them immediately to your home, office or shop. No expensive rituals.",
    cta: "Yes, Teach Me Vastu",
    cta_short: "Reserve My Seat",
    price: 99,
    original_price: 4999,
    date: "Coming Saturday & Sunday",
    language: "English + Hindi",
    time: "9:00 PM IST",
    platform: "Live On Zoom",
    pains: [
      "Money comes in — but never stays or grows.",
      "You work hard but results stay stuck.",
      "Home feels heavy or disturbed for no clear reason.",
      "Tried Vastu before — nothing actually changed.",
      "Fights, stress and tension keep coming back.",
      "Something is wrong. You just can't name it.",
    ],
    why_blocks: [
      { icon: Heart, h: "Disturbed Home Energy", h2: "" , t: "Constant stress, health issues or arguments — even after doing everything 'right' on the surface." },
      { icon: IndianRupee, h: "Blocked Growth", t: "Income may be coming in, but stability, savings and expansion just don't move the way they should." },
      { icon: AlertTriangle, h: "Old Vastu Didn't Work", t: "You followed random tips, moved things around — results were unclear or temporary at best." },
      { icon: Sparkles, h: "Want To Understand The Energy", t: "No blind belief — you want to know WHY directions, elements and entrances behave the way they do." },
      { icon: Zap, h: "Sense Of Imbalance", t: "You feel something is off in your space but cannot diagnose the actual dosha by yourself." },
      { icon: Trophy, h: "Career In Vastu", t: "Curious whether you can learn this and create a side income / full career as a Vastu consultant." },
    ],
    modules: [
      ["Foundations of Vastu Shastra", [
        "The real meaning and logic of Vastu — not myths.",
        "How space and direction influence health, wealth and harmony.",
      ]],
      ["Vastu Purusha & Mandala", [
        "Vastu Purusha story and its scientific interpretation.",
        "How deity placements affect different areas of life.",
      ]],
      ["Pancha Bhootas — The 5 Elements", [
        "Earth, Water, Fire, Air, Space — how imbalance creates daily stress.",
        "Simple ways to correct elemental imbalance without breaking walls.",
      ]],
      ["16 Directions & Their Real Impact", [
        "Characteristics of all 16 zones and what each controls.",
        "Mapping which direction affects health, finance, relationships and career.",
      ]],
      ["Major Vastu Doshas Explained Clearly", [
        "Toilet in NE, wrong kitchen placement, bedroom issues, plot defects.",
        "Severity of each dosha and its actual impact on occupants.",
      ]],
      ["32 Vastu Entrances", [
        "How each entrance zone influences life differently.",
        "Which entrances bring growth — and which create hidden challenges.",
      ]],
      ["Practical, Non-Demolition Remedies", [
        "Use direction logic, element balancing, colours and placements.",
        "Real-home remedies that work without structural changes.",
      ]],
      ["Real Application & Case Studies", [
        "Step-by-step analysis of a residential property.",
        "Common mistakes and how to avoid them confidently.",
      ]],
      ["Career Scope in Vastu", [
        "How to approach Vastu as a professional consultation service.",
        "Ethical pricing and how to start your own practice.",
      ]],
    ],
    for_whom: [
      "You want peace at home but can't pinpoint the imbalance.",
      "You feel stuck financially and suspect your space is affecting growth.",
      "You want logical clarity, not superstition, behind Vastu rules.",
      "You want a respected skill that can become a part-time profession.",
    ],
    testimonials: [
      ["Sneha Jain", "Pune",
       "The course explained direction logic, energy flow and practical remedies without demolition — I now feel real clarity and positivity in my home."],
      ["Rahul Sharma", "Indore",
       "Helped me identify hidden Vastu imbalances in my office and home. I appreciated learning how to resolve issues without costly renovations."],
      ["Janvi Shah", "Surat",
       "At a nominal fee for a live 2-day session, I learned concepts about elements, entrances and direction energies — not typical superstitions. Highly recommended."],
      ["Dinesh Patel", "Ahmedabad",
       "Good introduction with structured guidance. Easy to follow and easy to apply on the same day."],
    ],
    faqs: [
      ["I have zero knowledge of Vastu. Will I be able to understand this?",
       "Yes. The workshop starts from foundations — every concept (directions, elements, doshas, entrances) is explained in simple language."],
      ["Is this practical or just theory from scriptures?",
       "Highly practical. You will analyse a real house, find blockages, identify doshas and apply corrections logically."],
      ["Do I need to break walls after this?",
       "No. The entire focus is on non-demolition remedies — direction logic, element correction, and practical placements."],
      ["Can I use this for office or business space?",
       "Yes. While the focus is residential clarity, the same principles apply to offices and commercial spaces."],
      ["What are the 32 entrances?",
       "Every direction is divided into zones. Each entrance zone carries a different energy and influences wealth, stability and growth differently."],
      ["Can I build a career in Vastu after this?",
       "This workshop gives you strong foundational clarity. It also explains the scope and ethical path to becoming a professional consultant."],
      ["What if I miss live?",
       "Recording will be available for 7 days. But live attendance is recommended for live Q&A clarity."],
      ["Refund?",
       "Due to live workshop nature, fees are non-refundable. Please ensure attendance before registering."],
    ],
  },

  "mobile-numerology": {
    slug: "mobile-numerology",
    label: "Mobile Numerology",
    theme: "light",
    free: true,
    cta_url: "https://chat.whatsapp.com/Ecv8TS4W4qk8T5AyDYFBb0",
    hero_kicker: "Free Live Masterclass — Limited Seats",
    hero_h1: "Your Mobile Number Is Silently Blocking Your Success — And You're Carrying It With You Every Single Day.",
    hero_sub: "The number on your SIM is vibrating into every call, every transaction, every relationship. If it carries even ONE wrong pair — your money, health and peace are leaking without you knowing. In this free 1-day masterclass, learn exactly how to read it before it costs you another year.",
    cta: "Yes, Claim My Free Seat",
    cta_short: "Join FREE Masterclass",
    price: 0,
    original_price: 2999,
    date: "Coming Sunday",
    language: "English + Hindi",
    time: "9:00 PM IST",
    platform: "Live On Zoom",
    pains: [
      "Sudden financial losses, mounting loans or unexpected legal notices.",
      "Spouse / life-partner health going downhill, marriage friction at home.",
      "Repeated government, job or career obstacles — promotion stuck for years.",
      "Depression, mood swings, restless mind, self-destructive thoughts or addictions.",
      "Joint pain, muscle / knee / back / neck pain — no medical reason found.",
      "Skin diseases, urinary, kidney or prostate issues — quietly getting worse.",
      "Overthinking, decision paralysis, sleepless nights, hidden anxiety.",
    ],
    why_blocks: [
      { icon: AlertTriangle, h: "Your Number May Hold A 'Killer' Pair", t: "Pairs like 14, 27, 48 silently trigger loans, surgeries, joint pain and financial losses. One pair in your last 6 digits is enough." },
      { icon: Phone, h: "Wrong Total = Blocked Abundance", t: "If your mobile-total digit fights your Birth Number, every transaction through that SIM works against you." },
      { icon: Zap, h: "Kaal Sarp / Pitra Dosh Inside Numbers", t: "Most people don't know that digit-triplets like 3-4-7 or 2-7-9 create karmic blocks INSIDE a mobile number." },
      { icon: Heart, h: "Your Family Is At Risk Too", t: "Spouse, parents, children — if their numbers carry doshas, the whole household energy shifts. Learn to protect them all." },
      { icon: Trophy, h: "The Wrong Number Costs You Years", t: "Most people change SIM 3-4 times in 10 years — without checking even once. Imagine compounding that mistake." },
      { icon: Sparkles, h: "Hidden Bonuses Inside The Class", t: "We'll reveal lucky-mobile-totals for every profession AND a 'Quick-Check 3-Step Audit' you can use on any number in 60 seconds." },
    ],
    modules: [
      ["The 60-Second Mobile Number Audit", [
        "Saandiip ji's exact 3-step method to check any 10-digit number in under a minute.",
        "How to spot the deadliest pair the moment you see a new SIM.",
      ]],
      ["The Zero-Modification Rule (No One Teaches This)", [
        "Why 0 must be replaced before pair-analysis — and the exact rule.",
        "When 10/30/50/60/90 patterns are blessings — and when they aren't.",
      ]],
      ["39 Bad Pair Combinations (The Full List)", [
        "Every pair from 14 to 98 — what it does to health, money, relationships.",
        "The TOP 5 most dangerous pairs you must avoid at any cost.",
      ]],
      ["Kaal Sarp Dosh In Your Number", [
        "The 3-4-7 pattern: how to find it inside any 10-digit number.",
        "Practical remedies — no expensive pooja, no fear-mongering.",
      ]],
      ["Pitra Dosh In Your Number", [
        "The 2-7-9 pattern and what it means for your bloodline.",
        "Why your ancestors' karma may be vibrating through your SIM.",
      ]],
      ["Lucky Numbers by Profession", [
        "Doctor / Engineer / Lawyer / Business / Govt / Sports — the exact internals.",
        "The complete profession-lucky-number table revealed live.",
      ]],
      ["Repetition Patterns: Power vs Poison", [
        "Why 1, 3, 5, 6, 9 repeating 2-3 times is GOOD — and when it flips.",
        "The danger zone: 4444, 8888, 2222, 6666 patterns.",
      ]],
    ],
    bonuses: [
      ["BONUS 1", "Saandiip ji's Personal '60-Second Mobile Audit' Checklist", "A printable PDF you can use on any number for the rest of your life — worth ₹999."],
      ["BONUS 2", "The Lucky-Mobile-Total Table for 20 Professions", "Exact compound numbers (37, 46, 55, 64 …) recommended for doctors, businessmen, students, artists — worth ₹1,499."],
      ["BONUS 3", "Live Q&A: Saandiip ji Personally Reads 5 Mobile Numbers", "Random attendees get their actual mobile number analysed on screen — value priceless."],
    ],
    for_whom: [
      "You suspect your mobile number is hurting you — and want a way to verify.",
      "You're about to buy a new SIM and want to choose smartly the first time.",
      "You want to protect your spouse, parents and children's numbers too.",
      "You want a practical lifetime skill that can also become a side income.",
    ],
    testimonials: [
      ["Priya Khurana", "Gurgaon",
       "I had no idea my mobile number had a Pitra Dosh pattern. Changed it after the masterclass. Within 6 weeks two old clients returned and paid pending invoices."],
      ["Manish Doshi", "Mumbai",
       "Saandiip ji's pair-by-pair method is so clear that I caught a 27 in my brother's number and we replaced his SIM the next day. His back pain reduced noticeably."],
      ["Riya Singh", "Lucknow",
       "Best free masterclass I've ever attended. I now charge ₹500 per number consultation for friends and family. Already 10+ clients in one month."],
      ["Anuj Verma", "Hyderabad",
       "I'm an astrologer and this added a powerful new layer to my consultations. Clients love getting their mobile read in the same session."],
    ],
    faqs: [
      ["Is this really FREE?",
       "Yes — 100% free for the first 200 registrations only. After that the seat closes. We do not ask for any payment to attend."],
      ["What's the catch?",
       "There is none. Saandiip ji wants every Indian family to know whether their mobile number is hurting them. If after the class you wish to take a personal consultation, you may — but the masterclass itself is fully free."],
      ["Do I need to know numerology before this?",
       "No prior knowledge needed. Mobile Numerology is taught from absolute basics in this masterclass."],
      ["Will I be able to analyse any number after this?",
       "Yes — by end of the masterclass you'll evaluate any 10-digit number in under 60 seconds using Saandiip ji's checklist."],
      ["Will I get a recording?",
       "Recording is shared with attendees only — for 7 days. Cannot be re-shared publicly."],
      ["Will I get the 3 bonuses?",
       "Yes — all 3 bonuses (the 60-Second Audit Checklist PDF, the Profession Lucky-Total Table, and the live number reading) are included for every registered attendee."],
      ["Can this become a side income?",
       "Many past attendees charge ₹300–₹2,000 per mobile-number consultation. Two consultations per week can easily cover a month's grocery."],
      ["What if I can't attend live?",
       "Recording is shared with registered attendees. But live attendance is strongly recommended — Saandiip ji reads attendees' real numbers live, which is the most valuable part."],
    ],
  },
};

const DEFAULT_COURSE = "numerology";

/* ===== Countdown to next Saturday 9 PM IST ===== */
function useCountdown() {
  const [s, setS] = useState(15 * 60);
  useEffect(() => {
    const t = setInterval(() => setS(v => (v > 0 ? v - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

/* ===== FAQ Accordion ===== */
function FaqItem({ q, a, i, theme }) {
  const [open, setOpen] = useState(i === 0);
  const isLight = theme === "light";
  return (
    <div
      data-testid={`faq-item-${i}`}
      className={`border-b ${isLight ? 'border-[#5B0B1F]/15' : 'border-[#D4AF37]/15'} last:border-b-0`}
    >
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full text-left py-5 flex items-start justify-between gap-4"
      >
        <span className={`font-serif text-lg sm:text-xl ${isLight ? 'text-[#5B0B1F]' : 'text-[#F8F5F0]'}`} style={{ fontWeight: 600 }}>
          {q}
        </span>
        <ChevronDown
          size={22}
          className={`${isLight ? 'text-[#5B0B1F]' : 'text-[#D4AF37]'} shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <p className={`pb-5 font-normal leading-[1.6] text-base sm:text-lg ${isLight ? 'text-[#2A1A2C]' : 'text-[#C8BED6]'}`}>
          {a}
        </p>
      )}
    </div>
  );
}

/* ===== Registration form ===== */
function RegisterForm({ course, theme, countdown, onSuccess, autoFocusFirst }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    if (name.trim().length < 2) return setErr("Please enter your full name.");
    if (!/^\S+@\S+\.\S+$/.test(email)) return setErr("Please enter a valid email.");
    const m = mobile.replace(/\D/g, "");
    if (m.length !== 10) return setErr("Please enter a valid 10-digit mobile.");

    setBusy(true);
    try {
      try { await publicApi.submitCourseLead({ course: course.slug, name, email, mobile: m }); } catch {}
      // Hand off to the thank-you state; do NOT auto-open WhatsApp here so
      // the user can read the next-step message on the thank-you page and tap
      // the prominent CTA button themselves (works inside Meta in-app browser too).
      onSuccess && onSuccess({ name, email, mobile: m });
    } catch (e) {
      setErr(formatErr(e));
    } finally {
      setBusy(false);
    }
  };

  const inputCls = theme === "light"
    ? "w-full px-4 py-4 text-base sm:text-lg rounded-lg bg-white border-2 border-[#D4AF37]/35 focus:border-[#5B0B1F] outline-none text-[#2A1A2C] placeholder-[#6B5567]/70"
    : "w-full px-4 py-3 rounded-lg bg-[#1A0B2E] border border-[#D4AF37]/30 focus:border-[#D4AF37] outline-none text-[#F8F5F0] placeholder-[#C8BED6]/50";

  return (
    <form onSubmit={submit} data-testid="course-form" className="space-y-3" autoComplete="on">
      <input
        data-testid="course-name"
        type="text"
        name="name"
        id="course-lead-name"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={inputCls}
        autoComplete="name"
        autoCapitalize="words"
        spellCheck={false}
        required
        autoFocus={autoFocusFirst}
      />
      <input
        data-testid="course-email"
        type="email"
        name="email"
        id="course-lead-email"
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={inputCls}
        autoComplete="email"
        inputMode="email"
        spellCheck={false}
        required
      />
      <input
        data-testid="course-mobile"
        type="tel"
        name="phone"
        id="course-lead-mobile"
        inputMode="tel"
        placeholder="WhatsApp number (10 digits, no country code)"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
        className={inputCls}
        autoComplete="tel-national"
        pattern="[0-9]{10}"
        maxLength={10}
        required
      />
      {err && <div data-testid="course-form-error" className={`text-sm ${theme === "light" ? "text-red-700" : "text-red-300"}`}>{err}</div>}
      <button
        type="submit"
        disabled={busy}
        data-testid="course-form-submit"
        className={`w-full mt-2 px-5 py-4 sm:py-5 rounded-full text-white font-extrabold text-base sm:text-xl shadow-2xl disabled:opacity-60 ${course.free ? 'cta-shake' : ''}`}
        style={{
          background: course.free
            ? "linear-gradient(135deg, #FF1F3D 0%, #C00020 100%)"
            : "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
          boxShadow: course.free ? "0 12px 28px -8px rgba(255,31,61,0.55)" : undefined,
        }}
      >
        {busy ? "Processing…" : (course.free
          ? `🎁 ${course.cta_short}  ·  Closes in ${countdown}`
          : `🟢 ${course.cta_short} — ₹${course.price}`)}
      </button>
      <p className={`text-xs sm:text-sm text-center font-medium ${theme === "light" ? "text-[#7A1E15]" : "text-[#C8BED6]/70"}`}>
        {course.free
          ? `⏳ Only a few seats left · Closes in ${countdown}`
          : `⏳ Limited seats — pay ₹${course.price} on WhatsApp after submitting`}
      </p>
    </form>
  );
}

/* ===== Main page ===== */
export default function CourseLanding() {
  const { course: courseParam } = useParams();
  const [search] = useSearchParams();
  const slug = (courseParam || search.get("course") || DEFAULT_COURSE).toLowerCase();
  const course = COURSES[slug] || COURSES[DEFAULT_COURSE];
  const time = useCountdown();
  const [submitted, setSubmitted] = useState(false);
  const [leadData, setLeadData] = useState(null);
  const [schedule, setSchedule] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const s = await publicApi.getSchedule(course.slug);
        if (!cancelled) setSchedule(s);
      } catch {}
    })();
    return () => { cancelled = true; };
  }, [course.slug]);

  useSEO({
    title: `${course.label} Workshop with Newalkkar Saandiip — Live Online Course at ₹${course.price}`,
    description: `Join the live ${course.label} workshop by Newalkkar Saandiip — Best Numerologist & Vastu Consultant in India. Learn ${course.label.toLowerCase()} step-by-step, ${course.platform}. Limited seats at ₹${course.price}.`,
    keywords: `${course.label} Workshop, ${course.label} Course Online, Online ${course.label} Class, Newalkkar Saandiip ${course.label}, Live ${course.label} Workshop India, ${course.label} certification, Numerology Course, Vastu Workshop, Mobile Numerology Course, Best Numerologist in India, Vastu Consultant Workshop`,
    canonical: `https://newalkkarsaandiip.in/learn/${course.slug}`,
    ogImage: "https://newalkkarsaandiip.in/saandiip-namaste.webp",
  });

  // No-index meta — keep ad-only + hide Emergent badge on this page
  useEffect(() => {
    const m = document.createElement("meta");
    m.name = "robots";
    m.content = "noindex,nofollow";
    document.head.appendChild(m);
    document.body.setAttribute("data-emergent-hide", "1");
    return () => {
      document.head.removeChild(m);
      document.body.removeAttribute("data-emergent-hide");
    };
  }, []);

  // ---- THEME tokens ----
  const isLight = course.theme === "light";
  const T = isLight ? {
    bg: "bg-[#FBF5EF]",
    bgAlt: "bg-[#F5EAD8]",
    bgCard: "bg-white",
    text: "text-[#2A1A2C]",
    textMuted: "text-[#6B5567]",
    textSoft: "text-[#5B0B1F]/85",
    h1Color: "text-[#5B0B1F]",
    h2Color: "text-[#3B0413]",
    accent: "text-[#5B0B1F]",
    accentGold: "text-[#B8881A]",
    border: "border-[#5B0B1F]/20",
    borderStrong: "border-[#5B0B1F]/45",
    cardBg: "bg-white",
    sectionAltBg: "bg-[#F5EAD8]/60",
    formCardStyle: { borderColor: "rgba(91,11,31,0.35)", background: "linear-gradient(160deg, #FFFFFF 0%, #FBF5EF 100%)" },
    finalCtaStyle: { borderColor: "rgba(91,11,31,0.35)", background: "linear-gradient(135deg, #FFFFFF 0%, #FBF5EF 100%)" },
  } : {
    bg: "bg-[#0F0518]",
    bgAlt: "bg-[#0F0518]/80",
    bgCard: "bg-[#1A0B2E]/60",
    text: "text-[#F8F5F0]",
    textMuted: "text-[#C8BED6]",
    textSoft: "text-[#C8BED6]",
    h1Color: "text-[#F8F5F0]",
    h2Color: "text-[#F8F5F0]",
    accent: "text-[#F3D060]",
    accentGold: "text-[#F3D060]",
    border: "border-[#D4AF37]/25",
    borderStrong: "border-[#D4AF37]/55",
    cardBg: "bg-[#1A0B2E]/60",
    sectionAltBg: "bg-[#0F0518]/80",
    formCardStyle: { borderColor: "rgba(212,175,55,0.55)", background: "linear-gradient(160deg, rgba(91,11,31,0.85) 0%, rgba(26,11,46,0.95) 100%)" },
    finalCtaStyle: { borderColor: "rgba(212,175,55,0.55)", background: "linear-gradient(135deg, rgba(91,11,31,0.85) 0%, rgba(26,11,46,0.95) 100%)" },
  };

  return (
    <div className={`min-h-screen overflow-x-hidden ${T.bg} ${T.text}`} data-testid="course-landing" data-theme={isLight ? "light" : "dark"}>
      {/* Top urgency bar */}
      <div className="bg-gradient-to-r from-[#5B0B1F] via-[#7A0E29] to-[#5B0B1F] py-2.5 text-center text-sm sm:text-base font-medium tracking-wide text-white">
        {course.free ? (
          <>⚡ <span className="text-[#F3D060] font-bold">100% FREE Masterclass</span> — Limited Seats · Closes in <span className="text-[#F3D060] font-mono">{time}</span> ⚡</>
        ) : (
          <>⚡ <span className="text-[#F3D060]">Special Launch Price ₹{course.price}</span> — Expires in <span className="text-[#F3D060] font-mono">{time}</span> ⚡</>
        )}
      </div>

      {/* Minimal header */}
      <header className={`border-b ${T.border}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <Logo size={36} />
            <div>
              <div className={`font-serif text-base sm:text-lg ${T.text}`} style={{ fontWeight: 600 }}>Newalkkar Saandiip</div>
              <div className={`text-[11px] sm:text-xs uppercase tracking-[0.18em] ${T.accentGold} font-mono`}>Numerologist · Vaastu · Life Coach</div>
            </div>
          </a>
          <a
            href="https://wa.me/919929059153"
            target="_blank"
            rel="noopener noreferrer"
            className={`hidden sm:inline-flex items-center gap-2 text-sm font-medium ${isLight ? 'text-[#5B0B1F] hover:text-[#3B0413]' : 'text-[#F3D060] hover:text-white'} transition-colors`}
            data-testid="header-whatsapp"
          >
            <WhatsAppIcon size={18} /> +91 99290 59153
          </a>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section className="relative px-4 sm:px-6 pt-10 sm:pt-14 pb-14">
        <div className="absolute inset-0 -z-0 opacity-50 pointer-events-none"
             style={{ background: isLight
               ? "radial-gradient(ellipse at top, rgba(212,175,55,0.18), transparent 60%)"
               : "radial-gradient(ellipse at top, rgba(212,175,55,0.18), transparent 60%)" }} />
        <div className="max-w-6xl mx-auto relative z-10 grid lg:grid-cols-[1.1fr_1fr] gap-10 items-start">
          <div>
            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full ${isLight ? 'border-2 border-[#5B0B1F]/45 bg-[#5B0B1F]/8' : 'border border-[#D4AF37]/45 bg-[#D4AF37]/8'} mb-5`}>
              <Sparkles size={14} className={isLight ? "text-[#5B0B1F]" : "text-[#F3D060]"} />
              <span className={`font-mono text-[11px] sm:text-xs uppercase tracking-[0.22em] ${isLight ? 'text-[#5B0B1F]' : 'text-[#F3D060]'}`} style={{ fontWeight: 700 }}>
                {course.hero_kicker}
              </span>
            </div>

            {/* Trust badge with author photo */}
            <div className={`mb-6 flex items-center gap-3 sm:gap-4 p-3 rounded-2xl ${isLight ? 'bg-white border-2 border-[#5B0B1F]/15' : 'bg-[#1A0B2E]/60 border border-[#D4AF37]/30'} shadow-lg w-fit`}>
              <img
                src="/saandiip-namaste.webp"
                alt="Newalkkar Saandiip — Numerologist & Vaastu Consultant"
                className={`h-14 w-14 sm:h-16 sm:w-16 rounded-full object-cover border-2 ${isLight ? 'border-[#5B0B1F]/40' : 'border-[#D4AF37]/60'}`}
                loading="eager"
              />
              <div>
                <div className={`font-serif text-base sm:text-lg ${isLight ? 'text-[#5B0B1F]' : 'text-[#F8F5F0]'}`} style={{ fontWeight: 700 }}>
                  Newalkkar Saandiip
                </div>
                <div className={`text-[11px] sm:text-xs font-mono uppercase tracking-[0.16em] ${isLight ? 'text-[#5B0B1F]/70' : 'text-[#D4AF37]'}`}>
                  Numerologist · Vaastu · Trusted Across India
                </div>
              </div>
            </div>

            <h1
              className={`font-serif text-[28px] sm:text-4xl lg:text-[52px] leading-[1.08] tracking-tight ${T.h1Color}`}
              style={{ fontWeight: 700 }}
              data-testid="hero-h1"
            >
              {course.hero_h1}
            </h1>

            {/* Pain bullets (fear-based) — moved ABOVE the sub-headline */}
            <div className={`mt-7 p-5 sm:p-6 rounded-2xl ${isLight ? 'bg-[#FBE7E5] border-2 border-[#C03A2B]/35' : 'bg-red-900/15 border border-red-400/30'}`}>
              <div className={`font-mono text-xs uppercase tracking-[0.2em] mb-3 ${isLight ? 'text-[#7A1E15]' : 'text-red-300'}`} style={{ fontWeight: 700 }}>
                ⚠️ Warning signs your mobile number is hurting you
              </div>
              <ul className="space-y-2.5">
                {course.pains.map((p, i) => (
                  <li key={i} className={`flex items-start gap-2.5 text-base sm:text-lg ${isLight ? 'text-[#3B0413]' : 'text-[#F8F5F0]'} font-medium leading-[1.5]`}>
                    <span className={isLight ? "text-[#C03A2B] mt-0.5" : "text-[#F4A742] mt-0.5"}>●</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sub-headline (moved below the warning box) */}
            <p className={`mt-7 text-lg sm:text-xl lg:text-[22px] ${isLight ? 'text-[#3B0413]' : T.textMuted} font-light leading-[1.55] max-w-[58ch]`}>
              {course.hero_sub}
            </p>

            {/* Date / lang / time / platform pills — only Language & Platform shown */}
            <div className="mt-7 grid grid-cols-2 gap-3 max-w-md">
              {[
                [Languages, course.language],
                [Video, course.platform],
              ].map(([Icon, label], i) => (
                <div key={i} className={`flex items-center gap-2 px-3 py-3 rounded-lg ${isLight ? 'bg-white border-2 border-[#5B0B1F]/15' : 'bg-[#1A0B2E]/60 border border-[#D4AF37]/25'}`}>
                  <Icon size={16} className={isLight ? "text-[#5B0B1F] shrink-0" : "text-[#D4AF37] shrink-0"} />
                  <span className={`text-sm sm:text-base ${T.text} font-medium`}>{label}</span>
                </div>
              ))}
            </div>

            {/* Additional Bonus callout — drives FOMO + extra value */}
            <div className={`mt-6 relative overflow-hidden rounded-2xl p-5 sm:p-6 border-2 ${isLight ? 'bg-gradient-to-br from-[#FFF7E6] to-[#FFE5A8] border-[#B8881A]' : 'bg-gradient-to-br from-[#5B0B1F]/40 to-[#D4AF37]/15 border-[#D4AF37]/55'} shadow-lg`}>
              <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-[#D4AF37]/25 blur-2xl pointer-events-none" />
              <div className="flex items-start gap-3">
                <span className="text-3xl sm:text-4xl shrink-0">🎁</span>
                <div>
                  <div className={`font-mono text-[11px] sm:text-xs uppercase tracking-[0.22em] mb-1 ${isLight ? 'text-[#7A1E15]' : 'text-[#F3D060]'}`} style={{ fontWeight: 700 }}>
                    SPECIAL BONUS · UNLOCKED AT THE END
                  </div>
                  <div className={`font-serif text-lg sm:text-2xl leading-tight ${isLight ? 'text-[#3B0413]' : 'text-[#F8F5F0]'}`} style={{ fontWeight: 700 }}>
                    Get 100% Trial-&-Tested{" "}
                    <span className={isLight ? "text-[#B8881A]" : "text-[#F3D060]"}>Vaastu &amp; Numerology Remedies</span>
                    {" "}+ Powerful{" "}
                    <span className={isLight ? "text-[#B8881A]" : "text-[#F3D060]"}>Switch-Word</span>
                    {" "}Combinations
                  </div>
                  <p className={`mt-2 text-sm sm:text-base ${isLight ? 'text-[#3B0413]' : 'text-[#C8BED6]'} font-medium leading-snug`}>
                    Saandiip ji will personally share simple, proven remedies and instant switch-word activators
                    you can apply <em>the same evening</em> — for money, health, marriage and peace.
                    Only attendees who stay till the end will receive this.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form card */}
          <div className="lg:sticky lg:top-6 self-start w-full">
            <div className="rounded-2xl border-2 p-6 sm:p-8 shadow-2xl"
                 style={T.formCardStyle}>
              {course.free && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white text-xs font-bold uppercase tracking-wider shadow-lg"
                     style={{ position: "relative", marginTop: "-3rem", marginBottom: "1rem", width: "fit-content", marginLeft: "auto", marginRight: "auto" }}>
                  ⚡ 100% FREE — Limited Seats
                </div>
              )}
              <div className="text-center mb-5">
                <div className={`font-mono text-[11px] sm:text-xs uppercase tracking-[0.22em] mb-2 ${isLight ? 'text-[#5B0B1F]' : 'text-[#F3D060]'}`} style={{ fontWeight: 700 }}>
                  {course.free ? "Claim Your Free Seat" : "Reserve Your Seat"}
                </div>
                <div className={`font-serif text-2xl sm:text-[28px] leading-tight ${isLight ? 'text-[#5B0B1F]' : 'text-[#F8F5F0]'}`} style={{ fontWeight: 700 }}>
                  Join The Live{" "}
                  <span className={isLight ? "text-[#B8881A]" : "gold-shimmer"}>{course.label}</span>
                  {" "}Masterclass
                </div>
                {course.free ? (
                  <div className="mt-4 flex flex-col items-center gap-2">
                    <span className="text-5xl sm:text-6xl font-black" style={{ color: isLight ? "#1F4F2A" : "#7ED99B", fontFamily: "Times, serif" }} data-testid="course-price">FREE</span>
                    <span className="px-3 py-1 rounded-full text-[11px] uppercase tracking-wider bg-[#FFE5E5] border-2 border-[#C03A2B]/55 text-[#7A1E15] font-bold">
                      🎁 With Hidden Free Bonuses · Only 200 Seats
                    </span>
                  </div>
                ) : (
                  <div className="mt-3 flex items-center justify-center gap-3">
                    <span className={`text-3xl sm:text-4xl font-bold ${isLight ? 'text-[#5B0B1F]' : 'text-[#F3D060]'}`} data-testid="course-price">₹{course.price}</span>
                    <span className={`text-lg ${isLight ? 'text-[#6B5567]' : 'text-[#C8BED6]'} line-through`}>₹{course.original_price}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider bg-[#7ED99B]/20 border border-[#7ED99B]/50 text-[#1F4F2A] font-bold">
                      Save {Math.round((1 - course.price/course.original_price) * 100)}%
                    </span>
                  </div>
                )}
              </div>

              {/* === Live Schedule banner === */}
              {schedule && (schedule.event_date || schedule.event_time) && (
                <div
                  data-testid="course-schedule-banner"
                  className="mt-4 rounded-xl p-3 sm:p-4 border-2 flex flex-col sm:flex-row items-center gap-3 sm:gap-4"
                  style={
                    isLight
                      ? {
                          background:
                            "linear-gradient(135deg, #FFF4D6 0%, #FFE7A8 100%)",
                          borderColor: "rgba(212,175,55,0.65)",
                        }
                      : {
                          background:
                            "linear-gradient(135deg, rgba(212,175,55,0.16) 0%, rgba(91,11,31,0.55) 100%)",
                          borderColor: "rgba(212,175,55,0.55)",
                        }
                  }
                >
                  <div className="shrink-0 h-12 w-12 rounded-full bg-[#5B0B1F] text-[#F3D060] flex items-center justify-center border-2 border-[#D4AF37]">
                    <Calendar size={22} strokeWidth={1.8} />
                  </div>
                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    <div
                      className={`font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.22em] ${
                        isLight ? "text-[#7A1E15]" : "text-[#F3D060]"
                      }`}
                    >
                      🔴 Live Masterclass — {course.label}
                    </div>
                    <div
                      className={`mt-0.5 text-lg sm:text-xl ${
                        isLight ? "text-[#5B0B1F]" : "text-[#F8F5F0]"
                      }`}
                      style={{ fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif", fontWeight: 700, letterSpacing: "0.01em" }}
                    >
                      {schedule.event_date ? formatScheduleDate(schedule.event_date) : ""}
                      {schedule.event_date && schedule.event_time ? " · " : ""}
                      {schedule.event_time}{" "}
                      {schedule.timezone_label && (
                        <span
                          className={`text-sm sm:text-base font-bold ${
                            isLight ? "text-[#8B6B14]" : "text-[#F3D060]"
                          }`}
                        >
                          {schedule.timezone_label}
                        </span>
                      )}
                    </div>
                    {schedule.notes && (
                      <div
                        className={`mt-0.5 text-xs sm:text-sm ${
                          isLight ? "text-[#2A1A2C]" : "text-[#C8BED6]"
                        }`}
                      >
                        {schedule.notes}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {submitted ? (
                <div data-testid="course-thankyou" className="text-center py-4">
                  <CheckCircle2 size={56} className="text-[#7ED99B] mx-auto mb-3" />
                  <div className={`font-serif text-2xl sm:text-3xl ${isLight ? 'text-[#5B0B1F]' : 'text-[#F8F5F0]'}`} style={{ fontWeight: 700 }}>
                    {course.free ? "Your seat is locked-in! 🎉" : "Almost there! 🎉"}
                  </div>
                  <p className={`mt-3 text-base sm:text-lg ${isLight ? 'text-[#2A1A2C]' : 'text-[#C8BED6]'} font-medium leading-relaxed`}>
                    {course.free ? (
                      <>
                        One last step — <span className={isLight ? 'text-[#5B0B1F] font-bold' : 'text-[#F3D060] font-bold'}>join our FREE Master Class WhatsApp Community</span> to receive your joining link, study material and last-minute reminders from Newalkkar Saandiip ji.
                      </>
                    ) : (
                      <>
                        Tap the green button below to <span className={isLight ? 'text-[#5B0B1F] font-bold' : 'text-[#F3D060] font-bold'}>message Newalkkar Saandiip ji on WhatsApp</span> with your details — your seat will be confirmed after ₹{course.price} is paid.
                      </>
                    )}
                  </p>
                  {(() => {
                    const ld = leadData || {};
                    const dmIntro = course.free
                      ? `I'd like to claim my FREE seat for the ${course.label} Masterclass`
                      : `I would like to register for the ${course.label} workshop`;
                    const dmMsg = encodeURIComponent(
                      `Namaste Newalkkar Saandiip ji,\n\n${dmIntro}.\n\nName: ${ld.name || ""}\nEmail: ${ld.email || ""}\nMobile: ${ld.mobile || ""}\n\nKindly share the joining details.`
                    );
                    const href = course.free
                      ? (course.cta_url || "https://chat.whatsapp.com/Ecv8TS4W4qk8T5AyDYFBb0")
                      : `https://wa.me/919929059153?text=${dmMsg}`;
                    const label = course.free
                      ? "Join our Free Master Class WhatsApp Community"
                      : "Message on WhatsApp to Confirm Seat";
                    return (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-testid="course-join-whatsapp-group"
                        className="cta-shake mt-6 inline-flex items-center justify-center gap-2.5 w-full px-5 py-4 sm:py-5 rounded-full text-white font-extrabold text-base sm:text-xl shadow-2xl"
                        style={{
                          background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
                          boxShadow: "0 14px 32px -8px rgba(37,211,102,0.55)",
                        }}
                      >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                        </svg>
                        {label}
                      </a>
                    );
                  })()}
                  <p className={`mt-4 text-xs sm:text-sm ${isLight ? 'text-[#7A1E15]' : 'text-[#C8BED6]/70'} font-medium`}>
                    {course.free
                      ? <>⚠️ Without joining our Community you will <span className="font-bold">NOT</span> receive the master class link. This takes 5 seconds.</>
                      : <>⚠️ Your seat will be held for the next 15 minutes only. Please complete the WhatsApp step now.</>
                    }
                  </p>
                </div>
              ) : (
                <RegisterForm course={course} theme={course.theme} countdown={time} onSuccess={(d) => { setLeadData(d); setSubmitted(true); }} autoFocusFirst />
              )}

              <div className={`mt-5 flex items-center justify-center gap-2 text-xs sm:text-sm ${isLight ? 'text-[#5B0B1F]' : 'text-[#C8BED6]/70'}`}>
                <ShieldCheck size={16} className="text-[#7ED99B]" />
                100% Live · Recording for 7 days · Certificate included
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== WHY YOU NEED THIS ===== */}
      <section className={`px-4 sm:px-6 py-14 sm:py-16 ${T.sectionAltBg} border-y ${T.border}`}>
        <div className="max-w-6xl mx-auto">
          <h2 className={`font-serif text-3xl sm:text-4xl md:text-5xl text-center ${T.h2Color} leading-tight`} style={{ fontWeight: 700 }}>
            If any of this feels familiar… <br className="hidden sm:block" />
            it's time to understand <span className={isLight ? "text-[#B8881A]" : "gold-shimmer"}>{course.label}</span> properly.
          </h2>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {course.why_blocks.map((b, i) => {
              const Icon = b.icon;
              return (
                <div key={i} className={`${isLight ? 'bg-white border-2 border-[#5B0B1F]/15 hover:border-[#5B0B1F]/40' : 'glass-card hover:border-[#D4AF37]/45'} p-6 sm:p-7 rounded-2xl shadow-md transition-all`}>
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center mb-4 ${isLight ? 'bg-[#5B0B1F]/10 border-2 border-[#5B0B1F]/35 text-[#5B0B1F]' : 'bg-[#D4AF37]/15 border border-[#D4AF37]/45 text-[#D4AF37]'}`}>
                    <Icon size={22} />
                  </div>
                  <h3 className={`font-serif text-xl ${isLight ? 'text-[#5B0B1F]' : 'text-[#F8F5F0]'}`} style={{ fontWeight: 600 }}>{b.h}</h3>
                  <p className={`mt-2 text-base sm:text-lg ${isLight ? 'text-[#2A1A2C]' : 'text-[#C8BED6]'} font-normal leading-[1.55]`}>{b.t}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== HIDDEN BONUSES (free courses only) ===== */}
      {course.free && course.bonuses && (
        <section className={`px-4 sm:px-6 py-14 sm:py-16`}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <div className={`inline-block px-4 py-1.5 rounded-full mb-3 ${isLight ? 'bg-[#5B0B1F] text-[#F3D060]' : 'bg-[#D4AF37]/20 text-[#F3D060] border border-[#D4AF37]/40'}`}>
                <span className="font-mono text-xs uppercase tracking-[0.22em]" style={{ fontWeight: 700 }}>🎁 Hidden Free Bonuses</span>
              </div>
              <h2 className={`font-serif text-3xl sm:text-4xl md:text-5xl ${T.h2Color} leading-tight`} style={{ fontWeight: 700 }}>
                Plus, You Walk Away With{" "}
                <span className={isLight ? "text-[#B8881A]" : "gold-shimmer"}>3 Premium Bonuses</span>
                {" "}— Worth ₹{course.bonuses.reduce((a,b)=>a+(b[2].match(/₹([\d,]+)/)?parseInt(b[2].match(/₹([\d,]+)/)[1].replace(/,/g,'')):0),0).toLocaleString('en-IN')}+
              </h2>
              <p className={`mt-3 text-base sm:text-lg ${T.textMuted} max-w-2xl mx-auto`}>
                These are unlocked only for those who attend live — kept secret until the
                masterclass starts.
              </p>
            </div>
            <div className="grid sm:grid-cols-3 gap-5">
              {course.bonuses.map(([tag, title, desc], i) => (
                <div key={i}
                  data-testid={`bonus-${i}`}
                  className={`relative p-6 sm:p-7 rounded-2xl border-2 shadow-md ${isLight ? 'bg-white border-[#5B0B1F]/25 hover:border-[#5B0B1F]/55' : 'bg-[#1A0B2E]/60 border-[#D4AF37]/35 hover:border-[#D4AF37]/65'} transition-all`}>
                  <div className={`absolute -top-3 left-5 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-[0.2em] ${isLight ? 'bg-[#5B0B1F] text-[#F3D060]' : 'bg-[#F3D060] text-[#5B0B1F]'}`} style={{ fontWeight: 700 }}>
                    {tag}
                  </div>
                  <div className={`mt-2 inline-flex items-center gap-1.5 mb-3 px-2.5 py-1 rounded-full ${isLight ? 'bg-[#7ED99B]/20 border border-[#1F4F2A]/35' : 'bg-[#7ED99B]/20 border border-[#7ED99B]/55'}`}>
                    <span className={`text-[10px] font-mono uppercase tracking-wider ${isLight ? 'text-[#1F4F2A]' : 'text-[#7ED99B]'}`} style={{ fontWeight: 700 }}>FREE for attendees</span>
                  </div>
                  <h3 className={`font-serif text-lg sm:text-xl leading-tight ${isLight ? 'text-[#5B0B1F]' : 'text-[#F8F5F0]'}`} style={{ fontWeight: 600 }}>
                    {title}
                  </h3>
                  <p className={`mt-2 text-sm sm:text-base ${isLight ? 'text-[#2A1A2C]' : 'text-[#C8BED6]'} leading-relaxed font-normal`}>
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== MODULES ===== */}
      <section className={`px-4 sm:px-6 py-14 sm:py-16 ${T.bg}`}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className={`font-mono text-xs uppercase tracking-[0.22em] mb-2 ${isLight ? 'text-[#5B0B1F]' : 'text-[#F3D060]'}`} style={{ fontWeight: 700 }}>CURRICULUM</div>
            <h2 className={`font-serif text-3xl sm:text-4xl md:text-5xl ${T.h2Color}`} style={{ fontWeight: 700 }}>
              What You'll Master In These Sessions
            </h2>
            <p className={`mt-3 text-base sm:text-lg ${T.textMuted} font-light max-w-2xl mx-auto`}>
              Not random tips. A structured, practical foundation you can apply the same day.
            </p>
          </div>
          <div className="space-y-3">
            {course.modules.map(([title, lines], i) => (
              <div
                key={i}
                data-testid={`module-${i}`}
                className={`p-5 sm:p-7 flex gap-4 rounded-2xl shadow-sm ${isLight ? 'bg-white border-2 border-[#5B0B1F]/15' : 'glass-card'}`}
              >
                <div className={`h-12 w-12 rounded-full font-serif font-bold text-lg flex items-center justify-center shrink-0 ${isLight ? 'bg-[#5B0B1F] text-[#F3D060] border-2 border-[#B8881A]' : 'bg-[#5B0B1F] border-2 border-[#D4AF37] text-[#F3D060]'}`}>
                  {i + 1}
                </div>
                <div className="flex-1">
                  <h3 className={`font-serif text-xl sm:text-2xl ${isLight ? 'text-[#5B0B1F]' : 'text-[#F8F5F0]'}`} style={{ fontWeight: 600 }}>{title}</h3>
                  <ul className="mt-2 space-y-1.5">
                    {lines.map((ln, j) => (
                      <li key={j} className={`flex items-start gap-2 text-base sm:text-lg ${isLight ? 'text-[#2A1A2C]' : 'text-[#C8BED6]'} font-normal leading-[1.55]`}>
                        <CheckCircle2 size={16} className={isLight ? "text-[#1F4F2A] mt-1.5 shrink-0" : "text-[#7ED99B] mt-1.5 shrink-0"} />
                        <span>{ln}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <a
              href="#register"
              onClick={(e) => { e.preventDefault(); document.querySelector('[data-testid="course-form"]')?.scrollIntoView({behavior:"smooth", block:"center"}); }}
              className={`inline-flex items-center gap-3 px-7 py-4 sm:px-8 sm:py-5 rounded-full text-white font-extrabold text-base sm:text-lg shadow-2xl ${course.free ? 'cta-shake' : ''}`}
              style={{
                background: course.free
                  ? "linear-gradient(135deg, #FF1F3D 0%, #C00020 100%)"
                  : "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
              }}
              data-testid="cta-modules"
            >
              {course.cta} <ArrowRight size={18} />
            </a>
            <div className={`mt-3 text-sm uppercase tracking-wider font-bold ${isLight ? 'text-[#7A1E15]' : 'text-[#C8BED6]/70'}`}>
              ⏳ Seats closing in <span className={`font-mono ${isLight ? 'text-[#C03A2B]' : 'text-[#F3D060]'}`}>{time}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== MENTOR ===== */}
      <section className={`px-4 sm:px-6 py-14 sm:py-16 ${isLight ? 'bg-gradient-to-b from-[#FBF5EF] to-[#F5EAD8]/70' : 'bg-gradient-to-b from-transparent to-[#0F0518]'}`}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-[1fr_1.4fr] gap-10 items-center">
          <div className="relative">
            <div className={`aspect-square rounded-2xl overflow-hidden border-2 shadow-2xl ${isLight ? 'border-[#5B0B1F]/40' : 'border-[#D4AF37]/55'}`}>
              <img
                src="/saandiip-namaste.webp"
                alt="Newalkkar Saandiip"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className={`absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full font-mono text-[10px] uppercase tracking-[0.22em] whitespace-nowrap ${isLight ? 'bg-[#5B0B1F] text-[#F3D060]' : 'bg-[#5B0B1F] border border-[#D4AF37] text-[#F3D060]'}`} style={{ fontWeight: 700 }}>
              Your Mentor
            </div>
          </div>
          <div>
            <div className={`font-mono text-xs uppercase tracking-[0.22em] mb-2 ${isLight ? 'text-[#5B0B1F]' : 'text-[#F3D060]'}`} style={{ fontWeight: 700 }}>MEET YOUR MENTOR</div>
            <h2 className={`font-serif text-4xl sm:text-5xl leading-tight ${T.h2Color}`} style={{ fontWeight: 700 }}>
              Newalkkar Saandiip
            </h2>
            <p className={`mt-1 italic text-lg ${isLight ? 'text-[#B8881A]' : 'text-[#D4AF37]'}`}>Numerologist · Vaastu Consultant · Life Coach</p>
            <div className="mt-5 grid grid-cols-3 gap-4 max-w-lg">
              {[["20+", "Years"], ["10k+", "Lives Touched"], ["5,000+", "Consultations"]].map(([n, l], i) => (
                <div key={i} className="text-center">
                  <div className={`font-serif text-3xl sm:text-4xl ${isLight ? 'text-[#5B0B1F]' : 'text-[#F3D060]'}`} style={{ fontWeight: 800 }}>{n}</div>
                  <div className={`text-[11px] sm:text-xs uppercase tracking-[0.18em] mt-1 ${T.textMuted}`} style={{ fontWeight: 600 }}>{l}</div>
                </div>
              ))}
            </div>
            <p className={`mt-6 text-base sm:text-lg font-normal leading-[1.6] ${isLight ? 'text-[#2A1A2C]' : 'text-[#C8BED6]'}`}>
              For over two decades, Newalkkar Saandiip ji has helped families across India align
              their name, mobile number, business and home with the right energies — using a
              structured logic-first approach rooted in Chaldean numerology and classical Vastu.
              No fear-based remedies, no expensive rituals — just clarity and practical action.
            </p>
            <p className={`mt-4 text-base sm:text-lg font-normal leading-[1.6] ${isLight ? 'text-[#2A1A2C]' : 'text-[#C8BED6]'}`}>
              His mission: make this knowledge accessible to every Indian family — so you can
              read the numbers yourself, protect your loved ones, and even build a respected
              side income as a consultant.
            </p>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className={`px-4 sm:px-6 py-14 sm:py-16 border-y ${T.border} ${T.sectionAltBg}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div className={`font-mono text-xs uppercase tracking-[0.22em] mb-2 ${isLight ? 'text-[#5B0B1F]' : 'text-[#F3D060]'}`} style={{ fontWeight: 700 }}>SUCCESS STORIES</div>
            <h2 className={`font-serif text-3xl sm:text-4xl md:text-5xl ${T.h2Color}`} style={{ fontWeight: 700 }}>
              From our previous students
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {course.testimonials.map(([name, city, quote], i) => (
              <div key={i} className={`p-6 sm:p-7 rounded-2xl shadow-md ${isLight ? 'bg-white border-2 border-[#5B0B1F]/15' : 'glass-card'}`}>
                <div className="flex gap-0.5 mb-3">
                  {Array(5).fill(0).map((_,k) => <Star key={k} size={16} fill="#F3D060" stroke="#F3D060" />)}
                </div>
                <p className={`text-base sm:text-lg font-normal leading-[1.55] italic ${isLight ? 'text-[#2A1A2C]' : 'text-[#F8F5F0]'}`}>
                  "{quote}"
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-full font-serif font-bold flex items-center justify-center ${isLight ? 'bg-[#5B0B1F]/10 border-2 border-[#5B0B1F]/35 text-[#5B0B1F]' : 'bg-[#D4AF37]/15 border border-[#D4AF37]/45 text-[#D4AF37]'}`}>
                    {name[0]}
                  </div>
                  <div>
                    <div className={`font-serif text-base ${isLight ? 'text-[#5B0B1F]' : 'text-[#F8F5F0]'}`} style={{ fontWeight: 600 }}>{name}</div>
                    <div className={`text-xs ${T.textMuted}`}>{city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FOR WHOM ===== */}
      <section className={`px-4 sm:px-6 py-14 sm:py-16 ${T.bg}`}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className={`font-mono text-xs uppercase tracking-[0.22em] mb-2 ${isLight ? 'text-[#5B0B1F]' : 'text-[#F3D060]'}`} style={{ fontWeight: 700 }}>IS THIS FOR YOU?</div>
            <h2 className={`font-serif text-3xl sm:text-4xl md:text-5xl ${T.h2Color}`} style={{ fontWeight: 700 }}>
              This masterclass is for you if…
            </h2>
          </div>
          <ul className="grid sm:grid-cols-2 gap-3 max-w-3xl mx-auto">
            {course.for_whom.map((it, i) => (
              <li key={i} className={`flex items-start gap-3 p-5 rounded-2xl shadow-sm ${isLight ? 'bg-white border-2 border-[#5B0B1F]/15' : 'glass-card'}`}>
                <CheckCircle2 size={22} className={isLight ? "text-[#1F4F2A] shrink-0 mt-0.5" : "text-[#7ED99B] shrink-0 mt-0.5"} />
                <span className={`text-base sm:text-lg font-normal leading-[1.55] ${isLight ? 'text-[#2A1A2C]' : 'text-[#F8F5F0]'}`}>{it}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className={`px-4 sm:px-6 py-14 sm:py-16 ${T.sectionAltBg} border-y ${T.border}`}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className={`font-mono text-xs uppercase tracking-[0.22em] mb-2 ${isLight ? 'text-[#5B0B1F]' : 'text-[#F3D060]'}`} style={{ fontWeight: 700 }}>FAQ</div>
            <h2 className={`font-serif text-3xl sm:text-4xl md:text-5xl ${T.h2Color}`} style={{ fontWeight: 700 }}>
              Frequently Asked Questions
            </h2>
          </div>
          <div className={`rounded-2xl border-2 px-5 sm:px-7 shadow-md ${isLight ? 'bg-white border-[#5B0B1F]/25' : 'border-[#D4AF37]/25 bg-[#1A0B2E]/40'}`}>
            {course.faqs.map(([q, a], i) => (
              <FaqItem key={i} q={q} a={a} i={i} theme={course.theme} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className={`px-4 sm:px-6 py-14 sm:py-16 ${T.bg}`}>
        <div className="max-w-3xl mx-auto text-center">
          <div className="rounded-3xl p-8 sm:p-12 border-2 shadow-2xl"
               style={T.finalCtaStyle}>
            <Sparkles size={32} className={isLight ? "text-[#5B0B1F] mx-auto mb-4" : "text-[#F3D060] mx-auto mb-4"} />
            <h2 className={`font-serif text-3xl sm:text-4xl md:text-5xl leading-tight ${T.h2Color}`} style={{ fontWeight: 700 }}>
              {course.free
                ? "Don't keep guessing whether your number is hurting you."
                : "Your life is too important to leave to chance."}
            </h2>
            <p className={`mt-4 text-base sm:text-lg ${isLight ? 'text-[#2A1A2C]' : 'text-[#C8BED6]'} font-normal leading-[1.55]`}>
              {course.free
                ? "Spend one evening with Newalkkar Saandiip ji — and walk away knowing exactly what your mobile number is doing for or against your life."
                : "Take 2 days, learn the system, and start making informed choices about your name, mobile, business and family."}
            </p>
            {course.free ? (
              <div className="mt-7 flex flex-col items-center gap-3">
                <span className="text-5xl sm:text-7xl font-black" style={{ color: isLight ? "#1F4F2A" : "#7ED99B", fontFamily: "Times, serif" }}>FREE</span>
                <span className={`text-sm font-bold uppercase tracking-wider px-3 py-1 rounded-full ${isLight ? 'bg-[#FFE5E5] border-2 border-[#C03A2B]/55 text-[#7A1E15]' : 'bg-red-900/30 border border-red-400/40 text-red-200'}`}>
                  + 3 Hidden Bonuses Inside · Only 200 Seats
                </span>
              </div>
            ) : (
              <div className="mt-7 flex items-center justify-center gap-3">
                <span className={`text-4xl sm:text-5xl font-bold ${isLight ? 'text-[#5B0B1F]' : 'text-[#F3D060]'}`}>₹{course.price}</span>
                <span className={`text-xl ${isLight ? 'text-[#6B5567]' : 'text-[#C8BED6]'} line-through`}>₹{course.original_price}</span>
              </div>
            )}
            <a
              href="#register"
              onClick={(e) => { e.preventDefault(); document.querySelector('[data-testid="course-form"]')?.scrollIntoView({behavior:"smooth", block:"center"}); }}
              data-testid="final-cta"
              className={`inline-flex items-center gap-3 mt-7 px-8 py-4 sm:px-10 sm:py-5 rounded-full text-white font-extrabold text-base sm:text-xl shadow-2xl ${course.free ? 'cta-shake' : ''}`}
              style={{
                background: course.free
                  ? "linear-gradient(135deg, #FF1F3D 0%, #C00020 100%)"
                  : "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
                boxShadow: course.free ? "0 14px 32px -10px rgba(255,31,61,0.65)" : undefined,
              }}
            >
              {course.cta} <ArrowRight size={20} />
            </a>
            <div className={`mt-4 text-xs sm:text-sm uppercase tracking-wider ${isLight ? 'text-[#7A1E15]' : 'text-[#C8BED6]/70'} font-bold`}>
              ⏳ Seats closing in <span className={`font-mono text-base ${isLight ? 'text-[#C03A2B]' : 'text-[#F3D060]'}`}>{time}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`px-4 sm:px-6 py-8 ${isLight ? 'bg-[#F5EAD8]/60 border-t-2 border-[#5B0B1F]/15' : 'bg-[#0F0518] border-t border-[#D4AF37]/15'}`}>
        <div className="max-w-6xl mx-auto text-center">
          <div className={`font-serif text-lg ${isLight ? 'text-[#5B0B1F]' : 'text-[#F3D060]'}`} style={{ fontWeight: 700 }}>Newalkkar Saandiip</div>
          <div className={`mt-1 text-sm ${T.textMuted}`}>
            Numerologist · Vaastu Consultant · Life Coach · +91 99290 59153 · newalkkarsaandiip.in
          </div>
          <div className={`mt-3 text-[11px] ${isLight ? 'text-[#6B5567]/65' : 'text-[#C8BED6]/45'}`}>
            © {new Date().getFullYear()} Newalkkar Saandiip. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Sticky mobile CTA */}
      <div className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 p-3 backdrop-blur border-t ${isLight ? 'bg-white/95 border-[#5B0B1F]/30' : 'bg-[#0F0518]/95 border-[#D4AF37]/30'}`}>
        <a
          href="#register"
          onClick={(e) => { e.preventDefault(); document.querySelector('[data-testid="course-form"]')?.scrollIntoView({behavior:"smooth", block:"center"}); }}
          className={`flex items-center justify-center gap-2 w-full py-4 rounded-full text-white font-extrabold text-base shadow-2xl ${course.free ? 'cta-shake' : ''}`}
          style={{
            background: course.free
              ? "linear-gradient(135deg, #FF1F3D 0%, #C00020 100%)"
              : "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
            boxShadow: course.free ? "0 -6px 24px -6px rgba(255,31,61,0.55)" : undefined,
          }}
          data-testid="sticky-cta"
        >
          {course.free
            ? `🎁 Join FREE Masterclass · ${time}`
            : `🟢 ${course.cta_short} — ₹${course.price}`}
        </a>
      </div>
    </div>
  );
}
