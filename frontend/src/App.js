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
  MessageCircle,
  Calculator,
  Menu,
  X,
} from "lucide-react";
import Logo from "./components/Logo";
const NameNumerology = React.lazy(() => import("./pages/NameNumerology"));

const WHATSAPP_NUMBER = "919929059153"; // +91 9929059153

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
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
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
              "font-mono text-[10px] xl:text-[11px] uppercase tracking-[0.24em] xl:tracking-[0.28em] text-[#C8BED6] hover:text-[#D4AF37] transition-colors duration-300 whitespace-nowrap";
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

        <a
          href="#contact"
          data-testid="nav-book-btn"
          className="hidden lg:inline-flex btn-gold text-sm shrink-0"
        >
          Book Consultation <ArrowRight size={16} />
        </a>

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
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            data-testid="nav-book-btn-mobile"
            className="btn-gold mt-6 self-start"
          >
            Book Consultation <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </header>
  );
};

/* ---------- Hero ---------- */
const Hero = () => {
  return (
    <section
      id="home"
      data-testid="hero-section"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1767727239273-5ed97a1986b4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzJ8MHwxfHNlYXJjaHw0fHxhYnN0cmFjdCUyMGNvc21pYyUyMGdvbGRlbiUyMGdlb21ldHJ5fGVufDB8fHx8MTc3NzgxMjE0MHww&ixlib=rb-4.1.0&q=85"
          alt=""
          loading="eager"
          fetchpriority="high"
          className="w-full h-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F0518]/75 via-[#0F0518]/55 to-[#0F0518]" />
        <div className="radial-glow w-[620px] h-[620px] -top-40 -left-40 bg-[#9370DB]/25" />
        <div className="radial-glow w-[520px] h-[520px] bottom-0 right-0 bg-[#D4AF37]/15" />
      </div>

      {/* Rotating sacred geometry */}
      <div className="absolute right-[-120px] top-1/2 -translate-y-1/2 z-[1] slow-spin opacity-70 hidden lg:block">
        <Logo size={560} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 md:px-10 pt-32 sm:pt-40 pb-20 sm:pb-24 w-full">
        <div className="max-w-3xl fade-up">
          <div className="flex items-center gap-3 mb-8">
            <span className="h-[1px] w-10 bg-[#D4AF37]" />
            <span className="v-label">Since 2010 · Vedic Sciences</span>
          </div>
          <h1
            className="font-serif text-[2.6rem] sm:text-6xl md:text-7xl lg:text-8xl leading-[1.05] tracking-tight text-[#F8F5F0]"
            style={{ fontWeight: 300 }}
          >
            The science of <em className="gold-shimmer not-italic font-medium">name</em>,
            <br />
            the rhythm of <em className="gold-shimmer not-italic font-medium">number</em>,
            <br />
            the harmony of <em className="gold-shimmer not-italic font-medium">space</em>.
          </h1>

          <p className="mt-10 text-lg md:text-xl text-[#C8BED6] font-light leading-relaxed max-w-2xl">
            I am <span className="text-[#F8F5F0]">Newalkkar Saandiip</span> — Mobile
            Numerologist, Name Numerologist and Vastu Consultant. Aligning the vibrations of
            your mobile, identity and surroundings with cosmic intent, so your life flows in
            its natural order of prosperity.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <a href="#contact" data-testid="hero-cta-primary" className="btn-gold">
              Book a Consultation <ArrowRight size={18} />
            </a>
            <Link to="/name-numerology" data-testid="hero-cta-calculator" className="btn-ghost">
              <Calculator size={16} /> Free Name Calculator
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-8 max-w-xl">
            {[
              ["15+", "Years of Practice"],
              ["10K+", "Lives Aligned"],
              ["4.9★", "Client Rating"],
            ].map(([k, v]) => (
              <div key={v}>
                <div
                  className="font-serif text-3xl md:text-4xl text-[#D4AF37]"
                  style={{ fontWeight: 500 }}
                >
                  {k}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#C8BED6]/80 mt-1">
                  {v}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-[#C8BED6]/60">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <div className="w-[1px] h-10 bg-gradient-to-b from-[#D4AF37] to-transparent" />
      </div>
    </section>
  );
};

/* ---------- About ---------- */
const About = () => {
  return (
    <section id="about" data-testid="about-section" className="relative py-28 md:py-36">
      <div className="max-w-7xl mx-auto px-6 md:px-10 grid lg:grid-cols-12 gap-14 items-center">
        {/* Portrait / Visual */}
        <div className="lg:col-span-5 reveal">
          <div className="relative">
            <div className="absolute -inset-6 border border-[#D4AF37]/25 rounded-2xl" />
            <img
              src="https://images.unsplash.com/photo-1585240975858-7264fd020798?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzJ8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBlbGVnYW50JTIwY29uc3VsdGFudCUyMHBvcnRyYWl0fGVufDB8fHx8MTc3NzgxMjEzMHww&ixlib=rb-4.1.0&q=85"
              alt="Newalkkar Saandiip"
              loading="lazy"
              decoding="async"
              className="relative rounded-2xl w-full object-cover aspect-[4/5] grayscale-[15%]"
            />
            <div className="absolute -bottom-6 -right-6 bg-[#1A0B2E] border border-[#D4AF37]/25 rounded-2xl px-6 py-5 backdrop-blur-md">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#D4AF37]">
                Master Number
              </div>
              <div
                className="font-serif text-5xl text-[#F8F5F0] mt-1"
                style={{ fontWeight: 400 }}
              >
                9
              </div>
            </div>
          </div>
        </div>

        {/* Copy */}
        <div className="lg:col-span-7 reveal">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-[1px] w-10 bg-[#D4AF37]" />
            <span className="v-label">The Practitioner</span>
          </div>
          <h2
            className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.05] text-[#F8F5F0] tracking-tight"
            style={{ fontWeight: 300 }}
          >
            A quiet art of <em className="gold-shimmer not-italic font-medium">alignment</em>,
            practised with devotion.
          </h2>
          <div className="mt-8 gold-divider w-24" />

          <div className="mt-8 space-y-5 text-[#C8BED6] text-base md:text-lg leading-relaxed font-light">
            <p>
              For over fifteen years I have studied the silent language that numbers speak —
              in our names, in the ten digits we carry on our phone, in the four walls we
              call home. My work sits at the crossing of three sciences — <span className="text-[#F8F5F0]">Mobile
              Numerology</span>, <span className="text-[#F8F5F0]">Name &amp; Business
              Numerology</span>, and <span className="text-[#F8F5F0]">Vastu Shastra</span>.
            </p>
            <p>
              I do not believe in superstition. I believe in <em className="text-[#D4AF37] not-italic">vibration</em>
              — that every syllable, every digit, every direction carries a frequency, and
              that when these frequencies agree, life becomes gentler, clearer, more
              prosperous. My consultations are personal, data-driven and rooted in the
              Chaldean, Pythagorean and Vastu Purush Mandala traditions.
            </p>
            <p>
              Whether you are correcting a name, choosing a lucky mobile number, or planning
              the energy flow of a new home or business — you will find here an honest,
              patient, and deeply considered perspective.
            </p>
          </div>

          <div className="mt-10 grid sm:grid-cols-3 gap-6">
            {[
              ["Chaldean", "School of Name"],
              ["Pythagorean", "School of Number"],
              ["Vastu Purush", "School of Space"],
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
    title: "Mobile Numerology",
    tag: "01 / Frequency",
    desc: "The ten digits you carry everywhere vibrate with every call, message and transaction. I analyse your number against your birth chart and suggest corrections that quietly shift your luck, clarity and opportunities.",
  },
  {
    icon: User,
    title: "Name Numerology",
    tag: "02 / Identity",
    desc: "Your name is called into existence a thousand times a day. Through Chaldean and Pythagorean systems I decode its present vibration, and if needed propose a corrected spelling that aligns with your soul and destiny numbers.",
  },
  {
    icon: Compass,
    title: "Vastu Consultation",
    tag: "03 / Space",
    desc: "Homes, offices, showrooms, plots — space carries memory. Using the Vastu Purush Mandala I audit your directions, entrances, zones and elements, and prescribe non-invasive remedies that restore the flow of prana.",
  },
  {
    icon: Building2,
    title: "Business Name Correction",
    tag: "04 / Prosperity",
    desc: "A business name is a living mantra. I align your brand, trade name, logo and signage date with the numerological pulse of its founders — so growth stops feeling like a fight.",
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
              <span className="v-label">Services Offered</span>
            </div>
            <h2
              className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.05] text-[#F8F5F0] tracking-tight"
              style={{ fontWeight: 300 }}
            >
              Four disciplines.
              <br />
              One <em className="gold-shimmer not-italic font-medium">coherent life</em>.
            </h2>
          </div>
          <p className="md:max-w-sm text-[#C8BED6] leading-relaxed font-light">
            Each consultation is bespoke — never a template. Findings are delivered in a
            quiet, written report, followed by an unhurried conversation.
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
                <div className="h-11 w-11 rounded-full border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0">
                  <MessageCircle size={18} strokeWidth={1.2} />
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
                    className="btn-gold"
                  >
                    Send on WhatsApp <ArrowRight size={18} />
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
    className="fixed bottom-6 left-6 z-40 h-14 w-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg shadow-[#25D366]/30 hover:scale-110 transition-transform duration-300"
  >
    <MessageCircle size={24} strokeWidth={1.5} />
  </a>
);

/* ---------- Home (single-page) ---------- */
function Home() {
  useReveal();
  return (
    <div className="App grain relative min-h-screen bg-[#0F0518] text-[#F8F5F0]">
      <Nav />
      <main>
        <Hero />
        <About />
        <Services />
        <Testimonials />
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
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  );
}

export default App;
