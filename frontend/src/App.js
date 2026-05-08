import React, { useEffect, useRef, useState } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import {
  Phone,
  Hash,
  Compass,
  Building2,
  User,
  Sparkles,
  ArrowRight,
  Quote,
  Star,
  Mail,
  MapPin,
  Calculator,
  CalendarHeart,
  Menu,
  X,
  Flame,
  HeartHandshake,
  ShieldCheck,
} from "lucide-react";
import Logo from "./components/Logo";
import WhatsAppIcon from "./components/WhatsAppIcon";
import BookingModal from "./components/BookingModal";
import useSEO from "./hooks/useSEO";
const NameNumerology = React.lazy(() => import("./pages/NameNumerology"));
const PersonalYear = React.lazy(() => import("./pages/PersonalYear"));

const WHATSAPP_NUMBER = "919929059153"; // +91 9929059153

/* ---------- Booking Modal Context (global open/close) ---------- */
const BookingContext = React.createContext({ openBooking: () => {}, closeBooking: () => {} });
export const useBooking = () => React.useContext(BookingContext);
const BookingProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const value = React.useMemo(
    () => ({ openBooking: () => setOpen(true), closeBooking: () => setOpen(false) }),
    []
  );
  return (
    <BookingContext.Provider value={value}>
      {children}
      <BookingModal open={open} onClose={() => setOpen(false)} />
    </BookingContext.Provider>
  );
};

/* ---------- Scroll to top on route change ---------- */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" in window ? "instant" : "auto" });
  }, [pathname]);
  return null;
};

/* ---------- Reveal-on-scroll hook ---------- */
const useReveal = () => {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
};

/* ---------- Nav ---------- */
const Nav = () => {
  const { openBooking } = useBooking();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        setScrolled(window.scrollY > 20);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  const links = [
    ["About", "#about"],
    ["Services", "#services"],
    ["Name Numerology Calculator", "/name-numerology"],
    ["Personal Year", "/personal-year"],
    ["Contact", "#contact"],
  ];
  const sanitize = (label) =>
    `nav-${label.toLowerCase().replace(/\s+/g, "-")}-link`;
  return (
    <header
      data-testid="site-nav"
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-500 ${
        scrolled || open
          ? "bg-[#0F0518]/85 backdrop-blur-xl border-b border-[#D4AF37]/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-10 py-4 flex items-center justify-between gap-3">
        <Link
          to="/"
          className="flex items-center shrink-0"
          data-testid="nav-home-link"
          onClick={() => {
            setOpen(false);
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
          }}
        >
          <Logo size={40} showWordmark />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-7 xl:gap-9">
          {links.map(([label, href]) => {
            const isRoute = href.startsWith("/");
            const cls =
              "font-mono text-[10px] xl:text-[11px] uppercase tracking-[0.14em] xl:tracking-[0.16em] [word-spacing:-0.25em] text-[#C8BED6] hover:text-[#D4AF37] transition-colors duration-300 whitespace-nowrap";
            return isRoute ? (
              <Link key={href} to={href} data-testid={sanitize(label)} className={cls}>
                {label}
              </Link>
            ) : (
              <a key={href} href={href} data-testid={sanitize(label)} className={cls}>
                {label}
              </a>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={openBooking}
          data-testid="nav-book-btn"
          className="hidden lg:inline-flex btn-whatsapp text-sm shrink-0"
        >
          <WhatsAppIcon size={18} /> Book Consultation
        </button>

        {/* Mobile hamburger */}
        <button
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          data-testid="mobile-menu-toggle"
          className="lg:hidden h-11 w-11 rounded-full border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] hover:border-[#D4AF37] transition-colors"
        >
          {open ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
        </button>
      </div>

      {/* Mobile menu sheet */}
      <div
        data-testid="mobile-menu-panel"
        className={`lg:hidden overflow-hidden transition-all duration-500 ease-out ${
          open ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pb-8 pt-4 flex flex-col gap-1 border-t border-[#D4AF37]/10">
          {links.map(([label, href]) => {
            const isRoute = href.startsWith("/");
            const cls =
              "block py-4 font-serif text-2xl text-[#F8F5F0] hover:text-[#D4AF37] transition-colors border-b border-[#D4AF37]/10";
            return isRoute ? (
              <Link
                key={href}
                to={href}
                onClick={() => setOpen(false)}
                data-testid={sanitize(label) + "-mobile"}
                className={cls}
                style={{ fontWeight: 400 }}
              >
                {label}
              </Link>
            ) : (
              <a
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                data-testid={sanitize(label) + "-mobile"}
                className={cls}
                style={{ fontWeight: 400 }}
              >
                {label}
              </a>
            );
          })}
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              openBooking();
            }}
            data-testid="nav-book-btn-mobile"
            className="btn-whatsapp mt-6 self-start"
          >
            <WhatsAppIcon size={18} /> Book Consultation
          </button>
        </div>
      </div>
    </header>
  );
};

/* ---------- Hero ---------- */
const Hero = () => {
  const { openBooking } = useBooking();
  const problems = [
    { e: "💰", t: "Money not staying?" },
    { e: "💼", t: "Career or promotion stuck?" },
    { e: "🤔", t: "Confused between job or business?" },
    { e: "❤️", t: "Relationship or marriage issues?" },
    { e: "🏥", t: "Health or stress problems?" },
  ];

  return (
    <section
      id="home"
      data-testid="hero-section"
      className="relative min-h-screen flex items-center overflow-hidden pt-24 sm:pt-28 md:pt-24"
    >
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1767727239273-5ed97a1986b4?w=1600&q=60&auto=format&fm=webp"
          alt=""
          loading="lazy"
          decoding="async"
          aria-hidden="true"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F0518]/80 via-[#0F0518]/65 to-[#0F0518]" />
        <div className="radial-glow w-[620px] h-[620px] -top-40 -left-40 bg-[#9370DB]/25" />
        <div className="radial-glow w-[520px] h-[520px] bottom-0 right-0 bg-[#D4AF37]/12" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-10 pt-6 sm:pt-8 pb-16 sm:pb-20 w-full">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Copy */}
          <div className="lg:col-span-7 fade-up">
            {/* Services badge */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-5">
              <span className="px-3.5 py-1.5 rounded-full bg-[#D4AF37]/12 border border-[#D4AF37]/40 font-serif italic text-sm sm:text-base text-[#F3D060]" style={{ fontWeight: 500 }}>
                Numerology
              </span>
              <span className="text-[#D4AF37]/50">·</span>
              <span className="px-3.5 py-1.5 rounded-full bg-[#D4AF37]/12 border border-[#D4AF37]/40 font-serif italic text-sm sm:text-base text-[#F3D060]" style={{ fontWeight: 500 }}>
                Mobile Numerology
              </span>
              <span className="text-[#D4AF37]/50">·</span>
              <span className="px-3.5 py-1.5 rounded-full bg-[#D4AF37]/12 border border-[#D4AF37]/40 font-serif italic text-sm sm:text-base text-[#F3D060]" style={{ fontWeight: 500 }}>
                Vaastu
              </span>
            </div>

            {/* Hook */}
            <h1
              className="font-serif tracking-tight text-[#F8F5F0] leading-[1.06]"
              style={{
                fontWeight: 600,
                fontSize: "clamp(1.85rem, 4.6vw, 3.5rem)",
              }}
            >
              <span className="inline-flex items-center gap-2 sm:gap-3">
                <Flame className="text-[#F4A742] shrink-0" size={32} strokeWidth={1.6} />
                <span>Understand Yourself.</span>
              </span>
              <br />
              <span className="gold-shimmer">Change Your Life.</span>
            </h1>

            {/* SEO sub-line */}
            <p className="mt-3 text-sm sm:text-base text-[#C8BED6]/85 font-light leading-relaxed max-w-2xl">
              <span className="text-[#F3D060] font-medium">Numerologist in India</span> ·
              Online Numerology Consultation, Name Numerology, Mobile Number Numerology,
              Business Name Numerology, Vastu Consultant &amp; BNN Astrology guidance by
              <span className="text-[#F8F5F0]"> Newalkkar Saandiip</span>.
            </p>

            {/* Sub-question */}
            <p
              className="mt-5 text-lg sm:text-xl text-[#F8F5F0] font-light"
              style={{ fontWeight: 400 }}
            >
              Facing problems in life?
            </p>

            {/* Problems list */}
            <ul className="mt-4 grid sm:grid-cols-2 gap-x-5 gap-y-2.5">
              {problems.map((p) => (
                <li
                  key={p.t}
                  className="flex items-start gap-2.5 text-[#C8BED6] text-sm sm:text-base font-light"
                >
                  <span className="text-lg leading-none mt-0.5">{p.e}</span>
                  <span>{p.t}</span>
                </li>
              ))}
            </ul>

            {/* Pivot line */}
            <p className="mt-5 sm:mt-6 text-base sm:text-lg text-[#F8F5F0] font-light leading-relaxed">
              <span className="mr-1.5">👉</span>
              <span>There is always a reason behind it.</span>
            </p>
            <p className="mt-3 text-sm sm:text-base text-[#C8BED6] font-light leading-relaxed max-w-2xl">
              🔢 Discover the real cause of your problems through{" "}
              <span className="text-[#F3D060]">Numerology, Vaastu &amp; Mobile
              Numerology</span> — and get simple, practical solutions to improve your
              life.
            </p>

            {/* Trust marks */}
            <div className="mt-5 flex flex-wrap items-center gap-4 sm:gap-6 text-sm">
              <span className="inline-flex items-center gap-2 text-[#F8F5F0]/90">
                <ShieldCheck size={16} className="text-[#D4AF37]" /> Personal consultation
              </span>
              <span className="inline-flex items-center gap-2 text-[#F8F5F0]/90">
                <Sparkles size={16} className="text-[#D4AF37]" /> Easy remedies
              </span>
              <span className="inline-flex items-center gap-2 text-[#F8F5F0]/90">
                <HeartHandshake size={16} className="text-[#D4AF37]" /> Real results
              </span>
            </div>

            {/* Pricing reassurance */}
            <div
              className="mt-4 sm:mt-5 inline-flex items-start gap-3 px-4 sm:px-5 py-3 sm:py-4 rounded-xl bg-gradient-to-r from-[#D4AF37]/15 via-[#F3D060]/12 to-[#D4AF37]/15 border border-[#D4AF37]/45"
              style={{ boxShadow: "0 0 30px -10px rgba(212,175,55,0.3)" }}
            >
              <span className="text-[#F3D060] text-xl leading-none">✦</span>
              <p
                className="font-serif text-base sm:text-lg md:text-xl leading-snug text-[#F8F5F0]"
                style={{ fontWeight: 500 }}
              >
                At a{" "}
                <span className="gold-shimmer" style={{ fontWeight: 700 }}>
                  nominal &amp; minimum fee
                </span>
                <span className="text-[#C8BED6] font-light italic"> — accessible guidance for every family,</span>
                <span className="text-[#fff2c2]"> no hidden costs.</span>
              </p>
            </div>

            {/* Trust line + CTAs */}
            <div className="mt-6 sm:mt-7">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#F4A742] mb-3">
                🚀 Limited slots available today
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={openBooking}
                  data-testid="hero-cta-primary"
                  className="btn-whatsapp justify-center sm:justify-start text-base sm:text-lg"
                >
                  <WhatsAppIcon size={22} /> Book Your Consultation Now
                </button>
                <Link
                  to="/name-numerology"
                  data-testid="hero-cta-calculator"
                  className="btn-ghost justify-center sm:justify-start"
                >
                  <Calculator size={16} /> Free Name Calculator
                </Link>
              </div>
              <p className="mt-3 text-xs text-[#C8BED6]/65 font-light">
                Trusted guidance by{" "}
                <span className="text-[#F3D060]">Newalkkar Saandiip</span> —
                Numerologist, Vaastu Consultant &amp; Mobile Numerologist.
              </p>
            </div>
          </div>

          {/* Photo */}
          <div className="lg:col-span-5 fade-up">
            <div className="relative max-w-md mx-auto lg:mx-0 lg:ml-auto">
              <div className="absolute -inset-3 sm:-inset-5 rounded-2xl border border-[#D4AF37]/30" />
              <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-br from-[#D4AF37]/30 via-transparent to-[#9370DB]/20 blur-xl opacity-60" />
              <picture>
                <source
                  media="(max-width: 767px)"
                  srcSet="/saandiip-namaste-sm.webp"
                  type="image/webp"
                />
                <source
                  media="(max-width: 767px)"
                  srcSet="/saandiip-namaste-sm.jpg"
                  type="image/jpeg"
                />
                <source srcSet="/saandiip-namaste.webp" type="image/webp" />
                <img
                  src="/saandiip-namaste.jpg"
                  alt="Newalkkar Saandiip — Numerologist, Vaastu Consultant & Mobile Numerologist"
                  loading="eager"
                  fetchpriority="high"
                  decoding="async"
                  width={480}
                  height={600}
                  className="relative rounded-2xl w-full object-cover aspect-[4/5] border border-[#D4AF37]/40"
                  data-testid="hero-portrait"
                />
              </picture>
              {/* Caption card */}
              <div className="relative -mt-6 mx-3 sm:mx-5 bg-[#0F0518]/90 backdrop-blur-md border border-[#D4AF37]/40 rounded-xl px-5 py-4 sm:py-5 text-center">
                <div className="font-serif text-lg sm:text-xl text-[#F8F5F0]" style={{ fontWeight: 500 }}>
                  Newalkkar Saandiip
                </div>
                <div className="mt-2 flex flex-wrap justify-center gap-x-2 gap-y-1.5">
                  <span className="font-serif italic text-xs sm:text-sm text-[#F3D060]">Numerologist</span>
                  <span className="text-[#D4AF37]/50 text-xs sm:text-sm">·</span>
                  <span className="font-serif italic text-xs sm:text-sm text-[#F3D060]">Vaastu</span>
                  <span className="text-[#D4AF37]/50 text-xs sm:text-sm">·</span>
                  <span className="font-serif italic text-xs sm:text-sm text-[#F3D060]">Mobile Numerology</span>
                </div>
                <div className="gold-divider w-12 mx-auto my-3" />
                <div className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[#C8BED6]/85">
                  Trusted across India · Hundreds of families
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ---------- About ---------- */
const About = () => {
  return (
    <section id="about" data-testid="about-section" className="relative py-28 md:py-36">
      <div className="max-w-7xl mx-auto px-6 md:px-10 grid lg:grid-cols-12 gap-14 items-center">
        {/* Decorative panel (no duplicate photo) */}
        <div className="lg:col-span-5 reveal">
          <div className="relative">
            <div className="absolute -inset-6 border border-[#D4AF37]/25 rounded-2xl" />
            <div className="relative rounded-2xl aspect-[4/5] overflow-hidden border border-[#D4AF37]/30 bg-gradient-to-br from-[#1A0B2E] via-[#25123E] to-[#0F0518] flex flex-col items-center justify-center p-8 text-center">
              <div className="absolute inset-0 opacity-25">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] aspect-square rounded-full border border-[#D4AF37]/40 slow-spin" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] aspect-square rounded-full border border-[#D4AF37]/30 slow-spin-reverse" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] aspect-square rounded-full border border-[#D4AF37]/20 slow-spin" />
              </div>
              <div className="relative">
                <div className="v-label mb-6">Guiding Principle</div>
                <p
                  className="font-serif italic text-2xl sm:text-3xl text-[#F8F5F0] leading-snug"
                  style={{ fontWeight: 400 }}
                >
                  "Every name is a mantra.
                  <br />
                  Every number is a frequency.
                  <br />
                  Every space is a memory."
                </p>
                <div className="gold-divider w-16 mx-auto my-6" />
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#D4AF37]">
                  — Newalkkar Saandiip
                </p>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 bg-[#1A0B2E] border border-[#D4AF37]/25 rounded-2xl px-6 py-5 backdrop-blur-md">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#D4AF37]">
                Trusted Across India
              </div>
              <div
                className="font-serif text-2xl text-[#F8F5F0] mt-1"
                style={{ fontWeight: 500 }}
              >
                Hundreds of families
              </div>
            </div>
          </div>
        </div>

        {/* Copy */}
        <div className="lg:col-span-7 reveal">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-[1px] w-10 bg-[#D4AF37]" />
            <span className="v-label">About Newalkkar Saandiip</span>
          </div>
          <h2
            className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.05] text-[#F8F5F0] tracking-tight"
            style={{ fontWeight: 300 }}
          >
            India's trusted <em className="gold-shimmer not-italic font-medium">Numerologist &amp; Vastu Consultant</em> — practised with devotion.
          </h2>
          <div className="mt-8 gold-divider w-24" />

          <div className="mt-8 space-y-5 text-[#C8BED6] text-base md:text-lg leading-relaxed font-light">
            <p>
              I am <span className="text-[#F8F5F0]">Newalkkar Saandiip</span> — a
              <span className="text-[#F3D060]"> Numerologist in India</span> dedicated to
              the silent language that numbers speak: in our names, in the ten digits we
              carry on our phone, in the four walls we call home. My work sits at the
              crossing of three sciences — <span className="text-[#F8F5F0]">Mobile Number
              Numerology</span>, <span className="text-[#F8F5F0]">Name &amp; Business Name
              Numerology</span>, and <span className="text-[#F8F5F0]">Vaastu Shastra</span>
              — with BNN Astrology as a complementary lens.
            </p>
            <p>
              I do not believe in superstition. I believe in <em className="text-[#D4AF37] not-italic">vibration</em>
              — that every syllable, every digit, every direction carries a frequency, and
              that when these frequencies agree, life becomes gentler, clearer, more
              prosperous. Every <span className="text-[#F3D060]">Online Numerology
              Consultation</span> is personal, deeply considered and rooted in the
              Chaldean, Pythagorean and Vaastu Purush Mandala traditions.
            </p>
            <p>
              Whether you are looking for <span className="text-[#F8F5F0]">name
              correction</span>, choosing a <span className="text-[#F8F5F0]">lucky mobile
              number</span>, or planning the energy flow of a new home or business — you
              will find here an honest, patient and trustworthy guide.
            </p>
          </div>

          <div className="mt-10 grid sm:grid-cols-3 gap-6">
            {[
              ["Chaldean", "School of Name"],
              ["Pythagorean", "School of Number"],
              ["Vaastu Purush", "School of Space"],
            ].map(([a, b]) => (
              <div
                key={a}
                className="border-l border-[#D4AF37]/30 pl-4 py-1"
                data-testid={`lineage-${a.toLowerCase()}`}
              >
                <div
                  className="font-serif text-xl text-[#F8F5F0]"
                  style={{ fontWeight: 500 }}
                >
                  {a}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#C8BED6]/70 mt-1">
                  {b}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ---------- Services ---------- */
const services = [
  {
    icon: Phone,
    title: "Mobile Number Numerology",
    tag: "01 / Frequency",
    desc: "The ten digits you carry everywhere vibrate with every call, message and transaction. Through Mobile Number Numerology I analyse your number against your birth chart and recommend a lucky mobile number that quietly improves luck, clarity and opportunities.",
  },
  {
    icon: User,
    title: "Name Numerology & Name Correction",
    tag: "02 / Identity",
    desc: "Your name is called a thousand times a day. Using the Chaldean and Pythagorean systems of Name Numerology I decode its present vibration, and where needed propose a corrected spelling that aligns with your soul, destiny and personal year.",
  },
  {
    icon: Compass,
    title: "Vastu Consultant — Homes & Offices",
    tag: "03 / Space",
    desc: "Homes, offices, showrooms and plots — space carries memory. As a trusted Vastu Consultant in India I audit your directions, entrances, zones and elements via the Vaastu Purush Mandala, and prescribe simple, non-invasive remedies that restore the flow of prana.",
  },
  {
    icon: Building2,
    title: "Business Name Numerology",
    tag: "04 / Prosperity",
    desc: "A business name is a living mantra. Through Business Name Numerology I align your brand, trade name, logo and signage date with the numerological pulse of its founders — so growth stops feeling like a fight and prosperity flows naturally.",
  },
];

const Services = () => {
  return (
    <section
      id="services"
      data-testid="services-section"
      className="relative py-28 md:py-36 overflow-hidden"
    >
      <div className="radial-glow w-[540px] h-[540px] -top-20 right-[-120px] bg-[#D4AF37]/12 z-0" />
      <div className="max-w-7xl mx-auto px-6 md:px-10 relative">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 reveal">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-6">
                <span className="h-[1px] w-10 bg-[#D4AF37]" />
                <span className="v-label">Services Offered Across India</span>
              </div>
              <h2
                className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.05] text-[#F8F5F0] tracking-tight"
                style={{ fontWeight: 300 }}
              >
                Name Numerology, Vastu &amp; <em className="gold-shimmer not-italic font-medium">Mobile Number</em> Numerology
              </h2>
            </div>
            <p className="md:max-w-sm text-[#C8BED6] leading-relaxed font-light">
              Online Numerology Consultation, Vastu Consultant services and BNN Astrology
              guidance — bespoke, never templated. Each report is followed by an
              unhurried personal conversation.
            </p>
          </div>

        <div className="mt-16 grid md:grid-cols-2 gap-6 md:gap-8">
          {services.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={s.title}
                data-testid={`service-card-${i}`}
                className={`glass-card p-8 md:p-10 reveal ${
                  i % 3 === 1 ? "md:translate-y-10" : ""
                }`}
              >
                <div className="flex items-start justify-between mb-8">
                  <div className="h-14 w-14 rounded-full border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                    <Icon size={22} strokeWidth={1.2} />
                  </div>
                  <span className="v-label">{s.tag}</span>
                </div>
                <h3
                  className="font-serif text-3xl md:text-4xl text-[#F8F5F0] tracking-tight"
                  style={{ fontWeight: 400 }}
                >
                  {s.title}
                </h3>
                <p className="mt-5 text-[#C8BED6] leading-relaxed font-light">{s.desc}</p>
                <a
                  href="#contact"
                  data-testid={`service-enquire-${i}`}
                  className="mt-8 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.28em] text-[#D4AF37] hover:text-[#F3D060] transition-colors"
                >
                  Enquire <ArrowRight size={14} />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/* ---------- Testimonials ---------- */
const testimonials = [
  {
    quote:
      "Within a month of correcting my mobile number and business name, our enquiries doubled. Sir's approach is calm, precise and free of drama.",
    name: "Ritika Bansal",
    role: "Founder, Saffron Linen",
  },
  {
    quote:
      "We consulted him before shifting into our new flat. His Vastu reading was detailed to the inch — and every small remedy he suggested actually worked.",
    name: "Aniruddh & Sneha Mehta",
    role: "Homeowners, Jaipur",
  },
  {
    quote:
      "I've met many numerologists. Newalkkar Saandiip ji is rare — he explains the logic, shows the math, and never pushes anything. The name correction changed how I am received in meetings.",
    name: "Dr. Vivek Sharma",
    role: "Consulting Physician",
  },
];

const Testimonials = () => {
  return (
    <section
      id="testimonials"
      data-testid="testimonials-section"
      className="relative py-28 md:py-36"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="max-w-2xl reveal">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-[1px] w-10 bg-[#D4AF37]" />
            <span className="v-label">In their words</span>
          </div>
          <h2
            className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.05] text-[#F8F5F0] tracking-tight"
            style={{ fontWeight: 300 }}
          >
            Quiet changes,
            <br />
            <em className="gold-shimmer not-italic font-medium">lasting outcomes</em>.
          </h2>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              data-testid={`testimonial-${i}`}
              className="glass-card p-8 md:p-10 flex flex-col reveal"
            >
              <Quote className="text-[#D4AF37]" size={30} strokeWidth={1} />
              <p className="mt-6 text-[#F8F5F0]/90 font-light italic leading-relaxed font-serif text-xl md:text-2xl">
                "{t.quote}"
              </p>
              <div className="mt-auto pt-8">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star
                      key={j}
                      size={13}
                      className="fill-[#D4AF37] text-[#D4AF37]"
                      strokeWidth={0}
                    />
                  ))}
                </div>
                <div
                  className="font-serif text-lg text-[#F8F5F0]"
                  style={{ fontWeight: 500 }}
                >
                  {t.name}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.26em] text-[#C8BED6]/70 mt-1">
                  {t.role}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ---------- FAQ ---------- */
const FAQ_ITEMS = [
  {
    q: "Who is the best Numerologist in India for online consultation?",
    a: "Newalkkar Saandiip is a highly trusted Numerologist in India, offering Online Numerology Consultation across the country. He specialises in Name Numerology, Mobile Number Numerology, Business Name Numerology, Vastu Consultant services and BNN Astrology guidance — all at a nominal, family-friendly fee.",
  },
  {
    q: "What is Name Numerology and how does it help my life?",
    a: "Name Numerology decodes the vibrational frequency of your name. Each letter is mapped to a number using the Chaldean system; the totals reveal your Expression Number (destiny), Soul Urge Number (heart's desire) and Personality Number. Correcting a misaligned name can quietly improve career, relationships, money and clarity.",
  },
  {
    q: "How does Mobile Number Numerology work?",
    a: "Mobile Number Numerology analyses the vibrations of the ten digits you carry every day, against your birth chart. The right number quietly attracts opportunities, money flow and clarity, while a misaligned one can drain energy. We provide a personalised lucky mobile number recommendation as part of the consultation.",
  },
  {
    q: "Do you provide Business Name Numerology?",
    a: "Yes. Business Name Numerology aligns your brand name, trade name, logo and signage with the numerological pulse of the founders — so growth becomes natural rather than forced. We have helped startups, family businesses and shop owners across India and abroad.",
  },
  {
    q: "Is online Vastu Consultant service available?",
    a: "Yes. Online Vastu Consultant service is available — share your home, office or shop floor plan and we deliver a detailed Vaastu Purush Mandala audit, plus simple non-invasive remedies that restore the flow of prana, prosperity and harmony.",
  },
  {
    q: "How can I book an Online Numerology Consultation with Newalkkar Saandiip?",
    a: "Click the green 'Book Consultation' button anywhere on this site, or message +91 99290 59153 directly on WhatsApp. Newalkkar Saandiip personally replies to every request, usually within a few hours. The first reply is always free.",
  },
];

const FAQItem = ({ q, a, idx }) => {
  const [open, setOpen] = useState(idx === 0);
  return (
    <div
      className="glass-card overflow-hidden"
      data-testid={`faq-item-${idx}`}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left p-5 sm:p-6 flex items-start justify-between gap-4 hover:bg-[#D4AF37]/5 transition-colors"
        aria-expanded={open}
      >
        <span
          className="font-serif text-base sm:text-lg md:text-xl text-[#F8F5F0] leading-snug"
          style={{ fontWeight: 500 }}
        >
          {q}
        </span>
        <span
          className={`shrink-0 mt-1 h-7 w-7 rounded-full border border-[#D4AF37]/45 flex items-center justify-center text-[#D4AF37] transition-transform duration-300 ${
            open ? "rotate-45" : ""
          }`}
          aria-hidden="true"
        >
          +
        </span>
      </button>
      <div
        className={`grid transition-all duration-500 ease-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-5 sm:px-6 pb-5 sm:pb-6 -mt-1 text-[#C8BED6] font-light leading-relaxed text-sm sm:text-base">
            {a}
          </p>
        </div>
      </div>
    </div>
  );
};

const FAQ = () => (
  <section
    id="faq"
    data-testid="faq-section"
    className="relative py-24 md:py-32"
  >
    <div className="max-w-5xl mx-auto px-5 sm:px-6 md:px-10">
      <div className="text-center mb-12 reveal">
        <div className="flex items-center justify-center gap-3 mb-5">
          <span className="h-[1px] w-10 bg-[#D4AF37]" />
          <span className="v-label">Frequently Asked</span>
          <span className="h-[1px] w-10 bg-[#D4AF37]" />
        </div>
        <h2
          className="font-serif text-3xl sm:text-4xl md:text-5xl leading-[1.1] text-[#F8F5F0] tracking-tight"
          style={{ fontWeight: 300 }}
        >
          Numerology &amp; <em className="gold-shimmer not-italic font-medium">Vastu</em> Questions, Answered
        </h2>
        <p className="mt-4 text-[#C8BED6] font-light max-w-2xl mx-auto">
          Everything clients commonly ask about Online Numerology Consultation, Mobile
          Number Numerology, Business Name Numerology and Vastu Consultant services in
          India.
        </p>
      </div>

      <div className="space-y-3 sm:space-y-4 reveal">
        {FAQ_ITEMS.map((item, i) => (
          <FAQItem key={i} idx={i} q={item.q} a={item.a} />
        ))}
      </div>
    </div>
  </section>
);

/* ---------- Contact ---------- */
const Contact = () => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const trimmedName = name.trim();
    const digits = mobile.replace(/\D/g, "");

    if (!trimmedName) {
      setError("Please share your name.");
      return;
    }
    if (digits.length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    const message = `Namaste Newalkkar Saandiip ji,\n\nI would like to book a consultation.\n\nName: ${trimmedName}\nMobile: ${digits}${
      note.trim() ? `\nMessage: ${note.trim()}` : ""
    }\n\nKindly get in touch.`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setSent(true);
  };

  return (
    <section id="contact" data-testid="contact-section" className="relative py-28 md:py-36">
      <div className="radial-glow w-[500px] h-[500px] top-10 left-[-120px] bg-[#9370DB]/15 z-0" />
      <div className="max-w-7xl mx-auto px-6 md:px-10 relative">
        <div className="grid lg:grid-cols-12 gap-14">
          {/* Left column - info */}
          <div className="lg:col-span-5 reveal">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-[1px] w-10 bg-[#D4AF37]" />
              <span className="v-label">Begin Your Consultation</span>
            </div>
            <h2
              className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.05] text-[#F8F5F0] tracking-tight"
              style={{ fontWeight: 300 }}
            >
              Leave your name &amp; number.
              <br />
              <em className="gold-shimmer not-italic font-medium">I'll take it from there.</em>
            </h2>
            <p className="mt-6 text-[#C8BED6] leading-relaxed font-light">
              Every enquiry reaches me personally on WhatsApp. I respond within a few hours —
              usually with a short note, a calm conversation, and the right next step.
            </p>

            <div className="mt-12 space-y-6">
              <div className="flex items-start gap-4" data-testid="contact-info-whatsapp">
                <div className="h-11 w-11 rounded-full bg-[#25D366]/15 border border-[#25D366]/40 flex items-center justify-center text-[#25D366] shrink-0">
                  <WhatsAppIcon size={20} />
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#C8BED6]/70">
                    WhatsApp / Call
                  </div>
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-serif text-2xl text-[#F8F5F0] hover:text-[#D4AF37] transition-colors"
                    style={{ fontWeight: 400 }}
                  >
                    +91 99290 59153
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4" data-testid="contact-info-email">
                <div className="h-11 w-11 rounded-full border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0">
                  <Mail size={18} strokeWidth={1.2} />
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#C8BED6]/70">
                    Website
                  </div>
                  <div
                    className="font-serif text-2xl text-[#F8F5F0]"
                    style={{ fontWeight: 400 }}
                  >
                    newalkkarsaandiip.in
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4" data-testid="contact-info-location">
                <div className="h-11 w-11 rounded-full border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0">
                  <MapPin size={18} strokeWidth={1.2} />
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#C8BED6]/70">
                    Consultations
                  </div>
                  <div
                    className="font-serif text-2xl text-[#F8F5F0]"
                    style={{ fontWeight: 400 }}
                  >
                    In-person · Online · Worldwide
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - form */}
          <div className="lg:col-span-7 reveal">
            <form
              onSubmit={handleSubmit}
              data-testid="contact-form"
              className="glass-card p-8 md:p-12"
              noValidate
            >
              <div className="flex items-center justify-between mb-8">
                <h3
                  className="font-serif text-2xl md:text-3xl text-[#F8F5F0]"
                  style={{ fontWeight: 400 }}
                >
                  Request a Consultation
                </h3>
                <Sparkles className="text-[#D4AF37]" size={20} strokeWidth={1.2} />
              </div>

              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="c-name"
                    className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] block mb-2"
                  >
                    Your Name
                  </label>
                  <input
                    id="c-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ananya Sharma"
                    className="field-input"
                    data-testid="contact-name-input"
                    autoComplete="name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="c-mobile"
                    className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] block mb-2"
                  >
                    Mobile Number
                  </label>
                  <input
                    id="c-mobile"
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="10-digit mobile"
                    className="field-input"
                    data-testid="contact-mobile-input"
                    autoComplete="tel"
                    inputMode="tel"
                  />
                </div>

                <div>
                  <label
                    htmlFor="c-note"
                    className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] block mb-2"
                  >
                    Message <span className="text-[#C8BED6]/50 normal-case tracking-normal">(optional)</span>
                  </label>
                  <textarea
                    id="c-note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="What would you like to consult about?"
                    rows={4}
                    className="field-input resize-none"
                    data-testid="contact-note-input"
                  />
                </div>

                {error && (
                  <div
                    className="font-mono text-xs uppercase tracking-[0.2em] text-red-300/90 border-l-2 border-red-400/60 pl-3 py-1"
                    data-testid="contact-error"
                  >
                    {error}
                  </div>
                )}

                {sent && !error && (
                  <div
                    className="font-mono text-xs uppercase tracking-[0.2em] text-[#D4AF37] border-l-2 border-[#D4AF37] pl-3 py-1"
                    data-testid="contact-success"
                  >
                    WhatsApp opened — please press send to complete your request.
                  </div>
                )}

                <div className="pt-2 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#C8BED6]/60 max-w-xs">
                    Your details will be sent directly to Newalkkar Saandiip ji's WhatsApp.
                  </p>
                  <button
                    type="submit"
                    data-testid="contact-submit-btn"
                    className="btn-whatsapp"
                  >
                    <WhatsAppIcon size={20} /> Send on WhatsApp
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ---------- Footer ---------- */
const Footer = () => {
  return (
    <footer
      data-testid="site-footer"
      className="relative border-t border-[#D4AF37]/15 pt-16 pb-10 mt-8"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-3 gap-12 items-start">
          <div>
            <Logo size={56} showWordmark />
            <p className="mt-6 text-[#C8BED6] font-light leading-relaxed max-w-sm">
              A private practice in numerology and Vastu, rooted in classical science and
              delivered with modern care.
            </p>
          </div>

          <div>
            <div className="v-label mb-5">Navigate</div>
            <ul className="space-y-3">
              {[
                ["About", "#about", false],
                ["Services", "#services", false],
                ["Name Calculator", "/name-numerology", true],
                ["Personal Year", "/personal-year", true],
                ["Testimonials", "#testimonials", false],
                ["Contact", "#contact", false],
              ].map(([l, h, isRoute]) => (
                <li key={h}>
                  {isRoute ? (
                    <Link
                      to={h}
                      className="text-[#F8F5F0]/80 hover:text-[#D4AF37] transition-colors font-light"
                      data-testid={`footer-${l.toLowerCase().replace(/\s+/g, "-")}-link`}
                    >
                      {l}
                    </Link>
                  ) : (
                    <a
                      href={h}
                      className="text-[#F8F5F0]/80 hover:text-[#D4AF37] transition-colors font-light"
                      data-testid={`footer-${l.toLowerCase().replace(/\s+/g, "-")}-link`}
                    >
                      {l}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="v-label mb-5">Reach</div>
            <ul className="space-y-3 text-[#F8F5F0]/80 font-light">
              <li>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#D4AF37] transition-colors"
                  data-testid="footer-whatsapp-link"
                >
                  +91 99290 59153
                </a>
              </li>
              <li>newalkkarsaandiip.in</li>
              <li className="text-[#C8BED6]/70">Consultations worldwide</li>
            </ul>
          </div>
        </div>

        <div className="gold-divider mt-14 mb-6" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#C8BED6]/50 font-mono uppercase tracking-[0.24em]">
          <span>© {new Date().getFullYear()} Newalkkar Saandiip</span>
          <span>Crafted with devotion</span>
        </div>
      </div>
    </footer>
  );
};

/* ---------- Floating WhatsApp Button ---------- */
const WhatsAppFloat = () => (
  <a
    href={`https://wa.me/${WHATSAPP_NUMBER}`}
    target="_blank"
    rel="noopener noreferrer"
    data-testid="floating-whatsapp-btn"
    aria-label="Chat on WhatsApp"
    className="fixed bottom-5 left-5 sm:bottom-6 sm:left-6 z-40 h-14 w-14 rounded-full text-white flex items-center justify-center shadow-lg shadow-[#25D366]/40 hover:scale-110 transition-transform duration-300"
    style={{ background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)" }}
  >
    <WhatsAppIcon size={28} />
  </a>
);

/* ---------- Home (single-page) ---------- */
function Home() {
  useSEO({
    title:
      "Newalkkar Saandiip — Numerologist in India | Name Numerology, Mobile Number Numerology, Vastu Consultant",
    description:
      "Top-rated Numerologist in India offering Online Numerology Consultation, Name Numerology, Mobile Number Numerology, Business Name Numerology and Vastu Consultant services. BNN Astrology guidance by Newalkkar Saandiip. Book at a nominal fee.",
    keywords:
      "Name Numerology, Numerologist in India, Online Numerology Consultation, Mobile Number Numerology, Business Name Numerology, Vastu Consultant, BNN Astrology, Newalkkar Saandiip, lucky mobile number, name correction, numerology India, vastu shastra, chaldean numerology",
    canonical: "https://newalkkarsaandiip.in/",
    ogImage: "https://newalkkarsaandiip.in/saandiip-namaste.webp",
  });
  useReveal();
  return (
    <div className="App grain relative min-h-screen overflow-x-hidden bg-[#0F0518] text-[#F8F5F0]">
      <Nav />
      <main>
        <Hero />
        <About />
        <Services />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <BookingProvider>
        <ScrollToTop />
        <React.Suspense
          fallback={
            <div className="min-h-screen bg-[#0F0518] flex items-center justify-center">
              <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#D4AF37]">
                Aligning the cosmos…
              </div>
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/name-numerology" element={<NameNumerology />} />
            <Route path="/personal-year" element={<PersonalYear />} />
          </Routes>
        </React.Suspense>
      </BookingProvider>
    </BrowserRouter>
  );
}

export default App;
