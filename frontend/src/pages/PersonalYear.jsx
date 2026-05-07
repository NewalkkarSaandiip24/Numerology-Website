import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, CalendarHeart, Sparkles, Hash } from "lucide-react";
import Logo from "../components/Logo";
import useSEO from "../hooks/useSEO";
import WhatsAppIcon from "../components/WhatsAppIcon";

const reduceToSingle = (n) => {
  while (n > 9) {
    n = String(n)
      .split("")
      .reduce((a, c) => a + parseInt(c, 10), 0);
  }
  return n;
};

const YEAR_INFO = {
  1: {
    title: "Year of New Beginnings",
    lord: "Sun (Surya)",
    color: "#F4A742",
    positives: [
      "A fresh chapter — perfect for starting something of your own.",
      "Leadership, courage and clarity walk with you this year.",
      "Long-pending decisions finally find their answer.",
    ],
    careful: [
      "Avoid haste in big financial commitments — take a wise second view.",
      "Loneliness may visit at times; stay close to trusted family.",
    ],
  },
  2: {
    title: "Year of Patience & Partnership",
    lord: "Moon (Chandra)",
    color: "#9EC8E8",
    positives: [
      "Relationships, marriage talks and peaceful collaborations bloom.",
      "Your intuition becomes your greatest advisor.",
      "Behind-the-scenes effort quietly builds your future strength.",
    ],
    careful: [
      "Mood swings or over-sensitivity could cloud good days — watch your inner balance.",
      "Avoid major fights or sudden decisions; this is a year of softness.",
    ],
  },
  3: {
    title: "Year of Expression & Joy",
    lord: "Jupiter (Guru)",
    color: "#F3D060",
    positives: [
      "Creativity, communication and social charm are at their peak.",
      "Travel, learning and recognition come naturally.",
      "Children, art, writing and teaching bring quiet rewards.",
    ],
    careful: [
      "Beware of over-spending and over-promising in the excitement.",
      "Stay focused — too many directions may scatter your energy.",
    ],
  },
  4: {
    title: "Year of Foundation & Hard Work",
    lord: "Rahu",
    color: "#9370DB",
    positives: [
      "A year to lay strong foundations — home, business, savings.",
      "Discipline and effort give long-term, lasting rewards.",
      "Property, land and family matters can be settled well.",
    ],
    careful: [
      "Progress feels slow at times — patience is your friend.",
      "Health needs care; don't ignore small signals from the body.",
    ],
  },
  5: {
    title: "Year of Change & Freedom",
    lord: "Mercury (Budh)",
    color: "#7CD0C7",
    positives: [
      "Travel, transfer, new offers and exciting opportunities.",
      "Sales, marketing, and quick deals favour you.",
      "Old shackles fall away — life feels lighter and faster.",
    ],
    careful: [
      "Restlessness may push you to leave good things too early.",
      "Avoid impulsive choices in money and relationships.",
    ],
  },
  6: {
    title: "Year of Family, Love & Beauty",
    lord: "Venus (Shukra)",
    color: "#F08FA8",
    positives: [
      "Love, marriage, home, and family are blessed.",
      "Income from beauty, design, food, fashion or hospitality grows.",
      "Healing and harmony return where there was friction.",
    ],
    careful: [
      "Don't take responsibilities of the whole family too heavily — share gently.",
      "Avoid getting caught in others' emotional drama.",
    ],
  },
  7: {
    title: "Year of Reflection & Wisdom",
    lord: "Ketu",
    color: "#B8A4DB",
    positives: [
      "Deep insight, study, spirituality and self-discovery flourish.",
      "Old questions of life finally find quiet answers.",
      "Research, healing arts, and writing receive blessings.",
    ],
    careful: [
      "Don't rush into big public moves — this is a year of inner work.",
      "Avoid loneliness becoming over-thinking; keep light routines.",
    ],
  },
  8: {
    title: "Year of Power & Reward",
    lord: "Saturn (Shani)",
    color: "#C9A66B",
    positives: [
      "Long-pending money, status and authority come to you.",
      "Business, real-estate, court and government matters favour you.",
      "Hard work of past years finally pays back in full.",
    ],
    careful: [
      "Stay honest in every dealing — Shani rewards truth and tests shortcuts.",
      "Don't over-stress your body; rest is part of your strategy.",
    ],
  },
  9: {
    title: "Year of Completion & Release",
    lord: "Mars (Mangal)",
    color: "#E26B6B",
    positives: [
      "What is meant to leave will leave; what is meant to bless you will stay.",
      "A wonderful year for charity, service and forgiving old wounds.",
      "Travel, especially abroad or pilgrimage, is favoured.",
    ],
    careful: [
      "Avoid starting brand-new ventures — save them for the next 1 year.",
      "Don't hold on too tightly to what's clearly ending.",
    ],
  },
};

export default function PersonalYear() {
  useSEO({
    title:
      "Personal Year Calculator (Free) | Newalkkar Saandiip — Numerology",
    description:
      "Free Personal Year Calculator. Find your numerological Personal Year, ruling lord, opportunities and gentle cautions for the year ahead. By Newalkkar Saandiip — Mobile Numerologist & Vastu Consultant.",
    keywords:
      "personal year calculator, numerology personal year, personal year 2026, personal year number, life cycle numerology, ruling planet year, Newalkkar Saandiip",
    canonical: "https://newalkkarsaandiip.in/personal-year",
    ogImage: "https://newalkkarsaandiip.in/logo.png",
  });

  const [dob, setDob] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(null);

  const result = useMemo(() => {
    if (!submitted) return null;
    const { dd, mm } = submitted;
    const currentYear = new Date().getFullYear();
    const sum = dd + mm + currentYear;
    const personalYear = reduceToSingle(sum);
    return { dd, mm, currentYear, sum, personalYear };
  }, [submitted]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!dob) {
      setError("Please enter your date of birth.");
      return;
    }
    const [y, m, d] = dob.split("-").map((v) => parseInt(v, 10));
    if (!d || !m || !y) {
      setError("Please enter a valid date.");
      return;
    }
    setSubmitted({ dd: d, mm: m });
    setTimeout(() => {
      const el = document.getElementById("py-result");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  };

  const info = result ? YEAR_INFO[result.personalYear] : null;

  const bookHref = result
    ? `https://wa.me/919929059153?text=${encodeURIComponent(
        `Namaste Newalkkar Saandiip ji,\n\nI calculated my Personal Year and got ${result.personalYear} (${info?.title}).\n\nI would like a detailed reading. My DOB: ${String(
          result.dd
        ).padStart(2, "0")}/${String(result.mm).padStart(2, "0")}/—.\n\nKindly guide me.`
      )}`
    : "https://wa.me/919929059153";

  return (
    <div className="grain relative min-h-screen bg-[#0F0518] text-[#F8F5F0]">
      <div className="radial-glow w-[560px] h-[560px] -top-40 -left-40 bg-[#9370DB]/25" />
      <div className="radial-glow w-[480px] h-[480px] top-[20%] right-[-160px] bg-[#D4AF37]/15" />

      {/* Mini Nav */}
      <header className="fixed top-0 inset-x-0 z-40 bg-[#0F0518]/80 backdrop-blur-xl border-b border-[#D4AF37]/10">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-10 py-3 flex items-center justify-between gap-3">
          <Link
            to="/"
            className="flex items-center"
            data-testid="py-home-link"
            onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "smooth" })}
          >
            <Logo size={48} />
          </Link>
          <Link
            to="/"
            data-testid="py-back-link"
            className="inline-flex items-center gap-2 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.22em] sm:tracking-[0.28em] text-[#C8BED6] hover:text-[#D4AF37] transition-colors"
          >
            <ArrowLeft size={14} /> Back to Home
          </Link>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-5 sm:px-6 md:px-10 pt-24 sm:pt-28 md:pt-32 pb-20">
        {/* Intro */}
        <div className="max-w-3xl fade-up">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-[1px] w-10 bg-[#D4AF37]" />
            <span className="v-label">Personal Year · Free Tool</span>
          </div>
          <h1
            className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight"
            style={{ fontWeight: 300 }}
          >
            Personal Year <em className="gold-shimmer not-italic font-medium">Calculator</em>
          </h1>
          <p className="mt-4 text-base text-[#C8BED6] font-light leading-relaxed">
            Each year of life carries its own number, its own ruling lord and its own
            unique flavour. Enter your date of birth to discover the energy of your
            <span className="text-[#F8F5F0]"> current year</span> — the doors that open
            for you, and where to walk gently.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          data-testid="py-form"
          className="glass-card mt-8 sm:mt-10 p-6 sm:p-8 md:p-10"
          noValidate
        >
          <div className="flex items-center gap-3 mb-6">
            <CalendarHeart className="text-[#D4AF37]" size={20} strokeWidth={1.2} />
            <h2 className="font-serif text-xl sm:text-2xl md:text-3xl" style={{ fontWeight: 400 }}>
              Find Your Personal Year
            </h2>
          </div>

          <label
            htmlFor="dob-input"
            className="font-serif text-base sm:text-lg italic text-[#F3D060] block mb-2"
            style={{ fontWeight: 500 }}
          >
            Date of Birth
          </label>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              id="dob-input"
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="field-input flex-1"
              data-testid="py-dob-input"
              max={new Date().toISOString().split("T")[0]}
            />
            <button type="submit" data-testid="py-submit-btn" className="btn-gold">
              Calculate <ArrowRight size={18} />
            </button>
          </div>
          {error && (
            <div
              data-testid="py-error"
              className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-red-300/90 border-l-2 border-red-400/60 pl-3 py-1"
            >
              {error}
            </div>
          )}
        </form>

        {/* Result */}
        {result && info && (
          <section id="py-result" className="mt-12">
            <div
              className="glass-card p-8 sm:p-12 text-center"
              data-testid="py-result-card"
              style={{ borderColor: `${info.color}66` }}
            >
              <div className="v-label" style={{ color: info.color }}>
                {result.currentYear} · Your Personal Year
              </div>
              <div
                className="mt-4 mx-auto leading-none"
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: "clamp(8rem, 22vw, 14rem)",
                  fontWeight: 700,
                  color: info.color,
                  textShadow: `0 0 60px ${info.color}55`,
                }}
                data-testid="py-result-number"
              >
                {result.personalYear}
              </div>
              <h3
                className="font-serif text-2xl sm:text-3xl md:text-4xl mt-2"
                style={{ fontWeight: 500 }}
              >
                {info.title}
              </h3>
              <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border" style={{ borderColor: `${info.color}66`, background: `${info.color}15` }}>
                <Sparkles size={14} style={{ color: info.color }} />
                <span className="font-mono text-[11px] uppercase tracking-[0.22em]" style={{ color: info.color }}>
                  Ruling Lord · {info.lord}
                </span>
              </div>

              <div className="gold-divider w-24 mx-auto my-8" />

              <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 text-left max-w-3xl mx-auto">
                <div>
                  <div className="v-label mb-3 text-[#7ed99b]">✨ Smiles for you</div>
                  <ul className="space-y-2.5 text-[#F8F5F0]/90 text-sm sm:text-base font-light leading-relaxed">
                    {info.positives.map((p, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-[#7ed99b] shrink-0">•</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="v-label mb-3 text-[#F4A742]">🪔 Walk gently here</div>
                  <ul className="space-y-2.5 text-[#C8BED6]/90 text-sm sm:text-base font-light leading-relaxed">
                    {info.careful.map((p, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-[#F4A742] shrink-0">•</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Booking CTA banner */}
            <div className="mt-10 rounded-2xl border border-[#D4AF37]/35 bg-gradient-to-r from-[#1A0B2E]/70 to-[#25123E]/70 backdrop-blur-md p-6 sm:p-10">
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-10">
                <div className="flex-1">
                  <div className="v-label mb-2">A deeper look awaits</div>
                  <h3 className="font-serif text-xl sm:text-2xl md:text-3xl" style={{ fontWeight: 400 }}>
                    Want the full month-by-month roadmap of your year?
                  </h3>
                  <p className="mt-3 text-[#C8BED6] font-light leading-relaxed text-sm sm:text-base">
                    For a precise reading of <em>this year's challenges, opportunities and
                    monthly micro-cycles</em> — book a consultation with{" "}
                    <span className="text-[#F3D060]">Newalkkar Saandiip ji</span>, a
                    renowned <span className="text-[#F8F5F0]">Numerologist, Vastu Consultant
                    and Mobile Numerologist</span> trusted by hundreds of families and
                    business owners across India.
                  </p>
                </div>
                <a
                  href={bookHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="py-book-btn"
                  className="btn-whatsapp whitespace-nowrap shrink-0"
                >
                  <WhatsAppIcon size={20} /> Book Consultation
                </a>
              </div>
            </div>
          </section>
        )}

        {/* Cross-link to Name Numerology */}
        <div className="mt-16 sm:mt-20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-t border-[#D4AF37]/15 pt-10">
          <div>
            <div className="v-label mb-1">Continue your reading</div>
            <p className="font-serif text-xl text-[#F8F5F0]" style={{ fontWeight: 400 }}>
              Now check your <span className="gold-shimmer">Name Number</span> too.
            </p>
          </div>
          <Link
            to="/name-numerology"
            className="btn-ghost whitespace-nowrap"
            data-testid="py-to-name-link"
          >
            <Hash size={16} /> Open Name Numerology Calculator <ArrowRight size={16} />
          </Link>
        </div>
      </main>
    </div>
  );
}
