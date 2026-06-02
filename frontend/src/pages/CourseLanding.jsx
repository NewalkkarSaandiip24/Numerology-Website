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
    hero_kicker: "Live 1-Day Intensive",
    hero_h1: "Your Mobile Number Is Either Multiplying Your Money — Or Quietly Blocking It. Find Out Which One in 1 Day.",
    hero_sub: "Master the complete Mobile Numerology system in a single intensive session — pair-by-pair analysis, Kaal Sarp / Pitra dosh detection, lucky totals, and how to pick the perfect number for your Birth Number.",
    cta: "Yes, Teach Me Mobile Numerology",
    cta_short: "Reserve My Seat",
    price: 49,
    original_price: 2999,
    date: "Coming Sunday",
    language: "English + Hindi",
    time: "9:00 PM IST",
    platform: "Live On Zoom",
    pains: [
      "Income looks decent — but savings just don't build.",
      "Career growth slowed down right after a SIM change.",
      "Relationship friction increased — unexplained.",
      "Sleep disturbed, mood swings, restless mind.",
      "You sense your number is 'off' but don't know how to verify it.",
      "Family member's number — you suspect dosh but cannot prove.",
    ],
    why_blocks: [
      { icon: Phone, h: "Wrong Total", t: "Your mobile-total digit should be friendly with your Birth Number and Destiny Number. Most people don't even know theirs." },
      { icon: AlertTriangle, h: "Bad Pair Combinations", t: "39 specific 2-digit pairs (14, 16, 27, 28, 38, 45, 48 …) create silent damage when present in your number." },
      { icon: Zap, h: "Kaal Sarp / Pitra Dosh", t: "Certain digit triplets inside a number create karmic blocks. You'll learn to spot them in any 10-digit number." },
      { icon: Trophy, h: "Profession Mismatch", t: "Lucky internal numbers differ for doctors, businessmen, students, artists, govt-job seekers. Learn the table." },
      { icon: Sparkles, h: "Repetition Patterns", t: "Why 1-3 repeats of 1,3,5,6,9 are good — and why 4 or more times of any digit can flip results to negative." },
      { icon: Heart, h: "Family & Spouse", t: "Read the numbers of everyone close to you — spouse, parents, children — and protect their abundance." },
    ],
    modules: [
      ["Mobile Total Calculation & Selection", [
        "How to calculate the total digit-sum of any 10-digit number.",
        "Why 1, 3, 5, 6 and 7 are recommended totals — and when 7 is not.",
        "Friendly compounds for each total (37, 46, 55, 64 for total 1 etc.)",
      ]],
      ["The Zero-Modification Rule", [
        "Why 0 needs to be replaced before pair-analysis.",
        "When 10/30/50/60/90 patterns are auspicious in last digits.",
      ]],
      ["Bad Pair Combinations (Complete List)", [
        "All 39 bad pairs explained with health, money and relationship effects.",
        "How to avoid them when buying a new SIM.",
      ]],
      ["Neutral & Good Pair Combinations", [
        "8 neutral pairs and how surrounding digits flip them.",
        "30+ good pairs that actively support growth.",
      ]],
      ["Kaal Sarp Dosh in Numbers (3, 4, 7)", [
        "Identifying the dosh inside any mobile number.",
        "Practical remedies and replacement strategy.",
      ]],
      ["Pitra Dosh in Numbers (2, 7, 9)", [
        "Detecting Pitra Dosh patterns.",
        "Why your family's contact list may be hiding it."
      ]],
      ["Profession Lucky Numbers Table", [
        "Doctor / Engineer / Lawyer / Business / Govt-Job / Sportsperson lucky internals.",
        "How to pick a number that matches your career path.",
      ]],
      ["Repetition Rules & Danger Patterns", [
        "Why 11, 33, 55, 66, 99 are powerful — and when they over-fire.",
        "Why 11111, 2222, 4444, 8888 are dangerous patterns.",
      ]],
    ],
    for_whom: [
      "You're about to buy a new SIM and want to choose wisely.",
      "You want to verify the current number you've been using for years.",
      "You want to read the numbers of family, friends and business partners.",
      "You want a practical skill to add to your consulting or astrology practice.",
    ],
    testimonials: [
      ["Priya Khurana", "Gurgaon",
       "I had no idea my mobile number had a Pitra Dosh pattern. Changed it after the workshop. Within 6 weeks two old clients returned and paid pending invoices."],
      ["Manish Doshi", "Mumbai",
       "Saandiip ji's pair-by-pair method is so clear that I caught a 27 in my brother's number and we replaced his SIM the next day. His back pain reduced noticeably."],
      ["Riya Singh", "Lucknow",
       "Best ₹99 I've spent. I now run a small WhatsApp service evaluating numbers for friends, charging ₹500 each. Already paid back 10x."],
      ["Anuj Verma", "Hyderabad",
       "I'm an astrologer and this added a powerful new layer to my consultations. Clients love getting their mobile read in the same session."],
    ],
    faqs: [
      ["Do I need to know numerology before this?",
       "No prior knowledge needed. Mobile Numerology is taught from absolute basics in this 1-day intensive."],
      ["Will I be able to analyse any number after this?",
       "Yes — by end of Day 1 you'll evaluate any 10-digit number in under 60 seconds."],
      ["Will I get a recording?",
       "Yes, available for 7 days after the workshop."],
      ["Can this become a side income?",
       "Many students charge ₹300–₹2,000 per mobile-number consultation. Even 2 per week can cover your monthly course investment many times over."],
      ["Will the bad pairs hurt me if I just keep using the same number?",
       "The vibrations continue to influence — but you'll learn practical remedies you can apply even without changing the SIM."],
      ["Refund?",
       "Non-refundable due to limited live seats. Please confirm availability before registering."],
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
function FaqItem({ q, a, i }) {
  const [open, setOpen] = useState(i === 0);
  return (
    <div
      data-testid={`faq-item-${i}`}
      className="border-b border-[#D4AF37]/15"
    >
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full text-left py-5 flex items-start justify-between gap-4"
      >
        <span className="font-serif text-base sm:text-lg text-[#F8F5F0]" style={{ fontWeight: 500 }}>
          {q}
        </span>
        <ChevronDown
          size={20}
          className={`text-[#D4AF37] shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <p className="pb-5 text-[#C8BED6] font-light leading-relaxed text-[15px]">
          {a}
        </p>
      )}
    </div>
  );
}

/* ===== Registration form ===== */
function RegisterForm({ course, onSuccess }) {
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
      // Save lead (silent — non-blocking)
      try { await publicApi.submitCourseLead({ course: course.slug, name, email, mobile: m }); } catch {}
      // Open WhatsApp with prefilled enrollment
      const msg = encodeURIComponent(
        `Namaste Newalkkar Saandiip ji,%0A%0AI would like to register for the ${course.label} workshop.%0A%0AName: ${name}%0AEmail: ${email}%0AMobile: ${m}%0A%0AKindly share the joining details.`
      );
      window.open(`https://wa.me/919929059153?text=${msg}`, "_blank", "noopener");
      onSuccess && onSuccess({ name, email, mobile: m });
    } catch (e) {
      setErr(formatErr(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} data-testid="course-form" className="space-y-3">
      <input
        data-testid="course-name"
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-4 py-3 rounded-lg bg-[#1A0B2E] border border-[#D4AF37]/30 focus:border-[#D4AF37] outline-none text-[#F8F5F0] placeholder-[#C8BED6]/50"
      />
      <input
        data-testid="course-email"
        type="email"
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-3 rounded-lg bg-[#1A0B2E] border border-[#D4AF37]/30 focus:border-[#D4AF37] outline-none text-[#F8F5F0] placeholder-[#C8BED6]/50"
      />
      <input
        data-testid="course-mobile"
        type="tel"
        inputMode="tel"
        placeholder="WhatsApp number (10 digits, no country code)"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
        className="w-full px-4 py-3 rounded-lg bg-[#1A0B2E] border border-[#D4AF37]/30 focus:border-[#D4AF37] outline-none text-[#F8F5F0] placeholder-[#C8BED6]/50"
      />
      {err && <div data-testid="course-form-error" className="text-sm text-red-300">{err}</div>}
      <button
        type="submit"
        disabled={busy}
        data-testid="course-form-submit"
        className="w-full mt-2 px-5 py-4 rounded-full text-white font-bold text-base sm:text-lg shadow-lg disabled:opacity-60"
        style={{ background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)" }}
      >
        {busy ? "Processing…" : `🟢 ${course.cta_short} — ₹${course.price}`}
      </button>
      <p className="text-xs text-[#C8BED6]/70 text-center">
        ⏳ Limited seats — pay ₹{course.price} on WhatsApp after submitting
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

  useSEO({
    title: `${course.label} Workshop with Newalkkar Saandiip — Live Online Course at ₹${course.price}`,
    description: `Join the live ${course.label} workshop by Newalkkar Saandiip — Best Numerologist & Vastu Consultant in India. Learn ${course.label.toLowerCase()} step-by-step, ${course.platform}. Limited seats at ₹${course.price}.`,
    keywords: `${course.label} Workshop, ${course.label} Course Online, Online ${course.label} Class, Newalkkar Saandiip ${course.label}, Live ${course.label} Workshop India, ${course.label} certification, Numerology Course, Vastu Workshop, Mobile Numerology Course, Best Numerologist in India, Vastu Consultant Workshop`,
    canonical: `https://newalkkarsaandiip.in/learn/${course.slug}`,
    ogImage: "https://newalkkarsaandiip.in/saandiip-namaste.webp",
  });

  // No-index meta — keep ad-only
  useEffect(() => {
    const m = document.createElement("meta");
    m.name = "robots";
    m.content = "noindex,nofollow";
    document.head.appendChild(m);
    return () => { document.head.removeChild(m); };
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0F0518] text-[#F8F5F0]" data-testid="course-landing">
      {/* Top urgency bar */}
      <div className="bg-gradient-to-r from-[#5B0B1F] via-[#7A0E29] to-[#5B0B1F] py-2 text-center text-xs sm:text-sm font-medium tracking-wide">
        ⚡ <span className="text-[#F3D060]">Special Launch Price ₹{course.price}</span> — Expires in <span className="text-[#F3D060] font-mono">{time}</span> ⚡
      </div>

      {/* Minimal header */}
      <header className="border-b border-[#D4AF37]/15">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <Logo size={34} />
            <div>
              <div className="font-serif text-sm sm:text-base text-[#F8F5F0]" style={{ fontWeight: 500 }}>Newalkkar Saandiip</div>
              <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-[#D4AF37] font-mono">Numerologist · Vaastu · Life Coach</div>
            </div>
          </a>
          <a
            href="https://wa.me/919929059153"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 text-sm text-[#F3D060] hover:text-white transition-colors"
            data-testid="header-whatsapp"
          >
            <WhatsAppIcon size={16} /> +91 99290 59153
          </a>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section className="relative px-4 sm:px-6 pt-10 sm:pt-14 pb-14">
        <div className="absolute inset-0 -z-0 opacity-40 pointer-events-none"
             style={{ background: "radial-gradient(ellipse at top, rgba(212,175,55,0.18), transparent 60%)" }} />
        <div className="max-w-6xl mx-auto relative z-10 grid lg:grid-cols-[1.15fr_1fr] gap-10 items-start">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#D4AF37]/45 bg-[#D4AF37]/8 mb-5">
              <Sparkles size={13} className="text-[#F3D060]" />
              <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#F3D060]" style={{ fontWeight: 600 }}>
                {course.hero_kicker}
              </span>
            </div>
            <h1
              className="font-serif text-3xl sm:text-4xl lg:text-[44px] leading-[1.1] tracking-tight text-[#F8F5F0]"
              style={{ fontWeight: 500 }}
              data-testid="hero-h1"
            >
              {course.hero_h1}
            </h1>
            <p className="mt-5 text-base sm:text-lg text-[#C8BED6] font-light leading-relaxed max-w-[58ch]">
              {course.hero_sub}
            </p>

            {/* Date / lang / time / platform pills */}
            <div className="mt-7 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                [Calendar, course.date],
                [Languages, course.language],
                [Clock, course.time],
                [Video, course.platform],
              ].map(([Icon, label], i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-[#D4AF37]/25 bg-[#1A0B2E]/60">
                  <Icon size={15} className="text-[#D4AF37] shrink-0" />
                  <span className="text-xs sm:text-sm text-[#F8F5F0] font-light">{label}</span>
                </div>
              ))}
            </div>

            {/* Pain bullets */}
            <ul className="mt-7 space-y-2.5 max-w-[60ch]">
              {course.pains.map((p, i) => (
                <li key={i} className="flex items-start gap-2 text-[15px] sm:text-base text-[#F8F5F0]/95 font-light">
                  <span className="text-[#F4A742] mt-0.5">●</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Form card */}
          <div className="lg:sticky lg:top-6 self-start w-full">
            <div className="rounded-2xl border-2 p-6 sm:p-7 shadow-2xl"
                 style={{
                   borderColor: "rgba(212,175,55,0.55)",
                   background: "linear-gradient(160deg, rgba(91,11,31,0.85) 0%, rgba(26,11,46,0.95) 100%)"
                 }}>
              <div className="text-center mb-5">
                <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#F3D060] mb-2">Reserve Your Seat</div>
                <div className="font-serif text-2xl sm:text-3xl text-[#F8F5F0] leading-tight" style={{ fontWeight: 500 }}>
                  Join The Live <span className="gold-shimmer">{course.label}</span> Workshop
                </div>
                <div className="mt-3 flex items-center justify-center gap-3">
                  <span className="text-2xl sm:text-3xl font-bold text-[#F3D060]" data-testid="course-price">₹{course.price}</span>
                  <span className="text-lg text-[#C8BED6] line-through">₹{course.original_price}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider bg-[#7ED99B]/20 border border-[#7ED99B]/50 text-[#7ED99B] font-bold">
                    Save {Math.round((1 - course.price/course.original_price) * 100)}%
                  </span>
                </div>
              </div>

              {submitted ? (
                <div data-testid="course-thankyou" className="text-center py-6">
                  <CheckCircle2 size={48} className="text-[#7ED99B] mx-auto mb-3" />
                  <div className="font-serif text-xl text-[#F8F5F0]" style={{ fontWeight: 500 }}>Thank you!</div>
                  <p className="mt-2 text-sm text-[#C8BED6] font-light">
                    WhatsApp is opening — please send the prefilled message to confirm your seat
                    with Newalkkar Saandiip ji.
                  </p>
                </div>
              ) : (
                <RegisterForm course={course} onSuccess={() => setSubmitted(true)} />
              )}

              <div className="mt-5 flex items-center justify-center gap-2 text-xs text-[#C8BED6]/70">
                <ShieldCheck size={14} className="text-[#7ED99B]" />
                100% Live · Recording for 7 days · Certificate included
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== WHY YOU NEED THIS ===== */}
      <section className="px-4 sm:px-6 py-14 bg-[#0F0518]/80 border-y border-[#D4AF37]/15">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-center text-[#F8F5F0] leading-tight" style={{ fontWeight: 500 }}>
            If any of this feels familiar… <br className="hidden sm:block" />
            it's time to understand <span className="gold-shimmer">{course.label}</span> properly.
          </h2>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {course.why_blocks.map((b, i) => {
              const Icon = b.icon;
              return (
                <div key={i} className="glass-card p-6 hover:border-[#D4AF37]/45 transition-all">
                  <div className="h-11 w-11 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/45 flex items-center justify-center text-[#D4AF37] mb-4">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-serif text-lg text-[#F8F5F0]" style={{ fontWeight: 500 }}>{b.h}</h3>
                  <p className="mt-2 text-[14px] sm:text-[15px] text-[#C8BED6] font-light leading-relaxed">{b.t}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== MODULES ===== */}
      <section className="px-4 sm:px-6 py-14">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#F3D060] mb-2">CURRICULUM</div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#F8F5F0]" style={{ fontWeight: 500 }}>
              What You'll Master In These Sessions
            </h2>
            <p className="mt-3 text-[#C8BED6] font-light max-w-2xl mx-auto">
              Not random tips. A structured, practical foundation you can apply the same day.
            </p>
          </div>
          <div className="space-y-3">
            {course.modules.map(([title, lines], i) => (
              <div
                key={i}
                data-testid={`module-${i}`}
                className="glass-card p-5 sm:p-6 flex gap-4"
              >
                <div className="h-10 w-10 rounded-full bg-[#5B0B1F] border-2 border-[#D4AF37] text-[#F3D060] font-serif font-bold text-base flex items-center justify-center shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-lg sm:text-xl text-[#F8F5F0]" style={{ fontWeight: 500 }}>{title}</h3>
                  <ul className="mt-2 space-y-1.5">
                    {lines.map((ln, j) => (
                      <li key={j} className="flex items-start gap-2 text-[14px] sm:text-[15px] text-[#C8BED6] font-light leading-relaxed">
                        <CheckCircle2 size={14} className="text-[#7ED99B] mt-1 shrink-0" />
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
              className="inline-flex items-center gap-3 px-7 py-4 rounded-full text-white font-bold text-base sm:text-lg shadow-xl"
              style={{ background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)" }}
              data-testid="cta-modules"
            >
              {course.cta} <ArrowRight size={18} />
            </a>
            <div className="mt-3 text-xs text-[#C8BED6]/70 uppercase tracking-wider">Hurry up — seats are filling fast</div>
          </div>
        </div>
      </section>

      {/* ===== MENTOR ===== */}
      <section className="px-4 sm:px-6 py-14 bg-gradient-to-b from-transparent to-[#0F0518]">
        <div className="max-w-5xl mx-auto grid md:grid-cols-[1fr_1.4fr] gap-10 items-center">
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden border-2 border-[#D4AF37]/55 shadow-2xl">
              <img
                src="/saandiip-namaste.webp"
                alt="Newalkkar Saandiip"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-[#5B0B1F] border border-[#D4AF37] text-[#F3D060] font-mono text-[10px] uppercase tracking-[0.22em] whitespace-nowrap">
              Your Mentor
            </div>
          </div>
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#F3D060] mb-2">MEET YOUR MENTOR</div>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#F8F5F0] leading-tight" style={{ fontWeight: 500 }}>
              Newalkkar Saandiip
            </h2>
            <p className="mt-1 text-[#D4AF37] italic">Numerologist · Vaastu Consultant · Life Coach</p>
            <div className="mt-5 grid grid-cols-3 gap-4 max-w-lg">
              {[["20+", "Years"], ["10k+", "Lives Touched"], ["5,000+", "Consultations"]].map(([n, l], i) => (
                <div key={i} className="text-center">
                  <div className="font-serif text-2xl sm:text-3xl text-[#F3D060]" style={{ fontWeight: 700 }}>{n}</div>
                  <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-[#C8BED6] mt-1">{l}</div>
                </div>
              ))}
            </div>
            <p className="mt-6 text-[#C8BED6] font-light leading-relaxed">
              For over two decades, Newalkkar Saandiip ji has helped families across India align
              their name, mobile number, business and home with the right energies — using a
              structured logic-first approach rooted in Chaldean numerology and classical Vastu.
              No fear-based remedies, no expensive rituals — just clarity and practical action.
            </p>
            <p className="mt-4 text-[#C8BED6] font-light leading-relaxed">
              His mission: make this knowledge accessible to every Indian family — so you can
              read the numbers yourself, protect your loved ones, and even build a respected
              side income as a consultant.
            </p>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="px-4 sm:px-6 py-14 border-y border-[#D4AF37]/15">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#F3D060] mb-2">SUCCESS STORIES</div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#F8F5F0]" style={{ fontWeight: 500 }}>
              From our previous students
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {course.testimonials.map(([name, city, quote], i) => (
              <div key={i} className="glass-card p-6 sm:p-7">
                <div className="flex gap-0.5 mb-3">
                  {Array(5).fill(0).map((_,k) => <Star key={k} size={14} fill="#F3D060" stroke="#F3D060" />)}
                </div>
                <p className="text-[15px] sm:text-base text-[#F8F5F0] font-light leading-relaxed italic">
                  "{quote}"
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/45 flex items-center justify-center text-[#D4AF37] font-serif font-bold">
                    {name[0]}
                  </div>
                  <div>
                    <div className="font-serif text-[#F8F5F0]" style={{ fontWeight: 500 }}>{name}</div>
                    <div className="text-xs text-[#C8BED6]/70">{city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FOR WHOM ===== */}
      <section className="px-4 sm:px-6 py-14">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#F3D060] mb-2">IS THIS FOR YOU?</div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#F8F5F0]" style={{ fontWeight: 500 }}>
              This workshop is for you if…
            </h2>
          </div>
          <ul className="grid sm:grid-cols-2 gap-3 max-w-3xl mx-auto">
            {course.for_whom.map((it, i) => (
              <li key={i} className="flex items-start gap-3 glass-card p-5">
                <CheckCircle2 size={20} className="text-[#7ED99B] shrink-0 mt-0.5" />
                <span className="text-[15px] sm:text-base text-[#F8F5F0] font-light leading-relaxed">{it}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="px-4 sm:px-6 py-14 bg-[#0F0518]/80 border-y border-[#D4AF37]/15">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#F3D060] mb-2">FAQ</div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#F8F5F0]" style={{ fontWeight: 500 }}>
              Frequently Asked Questions
            </h2>
          </div>
          <div className="rounded-2xl border border-[#D4AF37]/25 bg-[#1A0B2E]/40 px-5 sm:px-7">
            {course.faqs.map(([q, a], i) => (
              <FaqItem key={i} q={q} a={a} i={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="px-4 sm:px-6 py-14">
        <div className="max-w-3xl mx-auto text-center">
          <div className="rounded-3xl p-8 sm:p-12 border-2"
               style={{
                 borderColor: "rgba(212,175,55,0.55)",
                 background: "linear-gradient(135deg, rgba(91,11,31,0.85) 0%, rgba(26,11,46,0.95) 100%)"
               }}>
            <Sparkles size={28} className="text-[#F3D060] mx-auto mb-4" />
            <h2 className="font-serif text-3xl sm:text-4xl text-[#F8F5F0] leading-tight" style={{ fontWeight: 500 }}>
              Your life is too important to leave to chance.
            </h2>
            <p className="mt-3 text-[#C8BED6] font-light">
              Take 2 days, learn the system, and start making informed choices about your name,
              mobile, business and family.
            </p>
            <div className="mt-7 flex items-center justify-center gap-3">
              <span className="text-3xl sm:text-4xl font-bold text-[#F3D060]">₹{course.price}</span>
              <span className="text-xl text-[#C8BED6] line-through">₹{course.original_price}</span>
            </div>
            <a
              href="#register"
              onClick={(e) => { e.preventDefault(); document.querySelector('[data-testid="course-form"]')?.scrollIntoView({behavior:"smooth", block:"center"}); }}
              data-testid="final-cta"
              className="inline-flex items-center gap-3 mt-6 px-8 py-4 rounded-full text-white font-bold text-base sm:text-lg shadow-xl"
              style={{ background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)" }}
            >
              {course.cta} <ArrowRight size={18} />
            </a>
            <div className="mt-4 text-xs text-[#C8BED6]/70 uppercase tracking-wider">
              ⏳ Offer expires in <span className="text-[#F3D060] font-mono">{time}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 sm:px-6 py-8 bg-[#0F0518] border-t border-[#D4AF37]/15">
        <div className="max-w-6xl mx-auto text-center">
          <div className="font-serif text-base text-[#F3D060]" style={{ fontWeight: 500 }}>Newalkkar Saandiip</div>
          <div className="mt-1 text-xs text-[#C8BED6]/70">
            Numerologist · Vaastu Consultant · Life Coach · +91 99290 59153 · newalkkarsaandiip.in
          </div>
          <div className="mt-3 text-[10px] text-[#C8BED6]/45">
            © {new Date().getFullYear()} Newalkkar Saandiip. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Sticky mobile CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 p-3 bg-[#0F0518]/95 border-t border-[#D4AF37]/30 backdrop-blur">
        <a
          href="#register"
          onClick={(e) => { e.preventDefault(); document.querySelector('[data-testid="course-form"]')?.scrollIntoView({behavior:"smooth", block:"center"}); }}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-full text-white font-bold shadow-lg"
          style={{ background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)" }}
          data-testid="sticky-cta"
        >
          🟢 {course.cta_short} — ₹{course.price}
        </a>
      </div>
    </div>
  );
}
