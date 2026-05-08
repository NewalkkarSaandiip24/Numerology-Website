import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles, Calculator, ArrowRight, MessageCircle, CalendarHeart } from "lucide-react";
import Logo from "../components/Logo";
import useSEO from "../hooks/useSEO";
import WhatsAppIcon from "../components/WhatsAppIcon";

/* ---------- Chaldean Numerology ---------- */
const CHART = {
  A: 1, I: 1, J: 1, Q: 1, Y: 1,
  B: 2, K: 2, R: 2,
  C: 3, G: 3, L: 3, S: 3,
  D: 4, M: 4, T: 4,
  E: 5, H: 5, N: 5, X: 5,
  U: 6, V: 6, W: 6,
  O: 7, Z: 7,
  F: 8, P: 8,
};

const VOWELS = new Set(["A", "E", "I", "O", "U", "Y"]);

const reduceToSingleDigit = (n) => {
  // Always reduce to a single digit 1-9 (no master-number preservation per user preference)
  while (n > 9) {
    n = String(n).split("").reduce((a, c) => a + parseInt(c, 10), 0);
  }
  return n;
};

const MEANINGS = {
  1: { title: "The Leader", desc: "Independence, originality, ambition. Natural-born leader with strong willpower and pioneering spirit." },
  2: { title: "The Diplomat", desc: "Harmony, partnership, sensitivity. Gifted mediator who thrives in cooperative, balanced relationships." },
  3: { title: "The Creator", desc: "Expression, creativity, joy. Communicative and artistic soul who inspires those around them." },
  4: { title: "The Builder", desc: "Stability, discipline, hard work. Reliable and methodical; creates lasting foundations in life." },
  5: { title: "The Explorer", desc: "Freedom, change, adventure. Versatile and curious; thrives with variety and new experiences." },
  6: { title: "The Nurturer", desc: "Responsibility, care, love. Devoted to family and community with a generous, healing heart." },
  7: { title: "The Seeker", desc: "Wisdom, intuition, spirituality. Deep thinker who searches for truth and inner knowledge." },
  8: { title: "The Achiever", desc: "Power, success, abundance. Driven and authoritative; capable of manifesting material success." },
  9: { title: "The Humanitarian", desc: "Compassion, wisdom, completion. Universal love and service; the most selfless of all numbers." },
};

const CHALDEAN_TABLE = [
  ["1", "A", "I", "J", "Q", "Y"],
  ["2", "B", "K", "R", "", ""],
  ["3", "C", "G", "L", "S", ""],
  ["4", "D", "M", "T", "", ""],
  ["5", "E", "H", "N", "X", ""],
  ["6", "U", "V", "W", "", ""],
  ["7", "O", "Z", "", "", ""],
  ["8", "F", "P", "", "", ""],
];

/* ---------- Page ---------- */
export default function NameNumerology() {
  useSEO({
    title:
      "Free Name Numerology Calculator (Chaldean) | Online Numerology Consultation — Newalkkar Saandiip",
    description:
      "Free online Name Numerology Calculator using the Chaldean system. Instantly find your Name Number, Soul Urge & Personality Number. Trusted by India's leading Numerologist Newalkkar Saandiip — also offering Mobile Number Numerology, Business Name Numerology and Vastu Consultation.",
    keywords:
      "Name Numerology, Name Numerology Calculator, free name numerology, chaldean numerology calculator, soul urge number, expression number, Online Numerology Consultation, Numerologist in India, Mobile Number Numerology, Business Name Numerology, Vastu Consultant, BNN Astrology, Newalkkar Saandiip",
    canonical: "https://newalkkarsaandiip.in/name-numerology",
    ogImage: "https://newalkkarsaandiip.in/saandiip-namaste.webp",
  });

  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [error, setError] = useState("");

  const result = useMemo(() => {
    if (!submitted) return null;
    const letters = submitted
      .toUpperCase()
      .split("")
      .filter((c) => CHART[c] !== undefined);

    if (letters.length === 0) return null;

    const nameSum = letters.reduce((a, c) => a + CHART[c], 0);
    const vowelLetters = letters.filter((c) => VOWELS.has(c));
    const consonantLetters = letters.filter((c) => !VOWELS.has(c));
    const soulSum = vowelLetters.reduce((a, c) => a + CHART[c], 0);
    const personalitySum = consonantLetters.reduce((a, c) => a + CHART[c], 0);

    return {
      letters,
      nameSum,
      nameNumber: reduceToSingleDigit(nameSum),
      vowelLetters,
      consonantLetters,
      soulSum,
      soulNumber: reduceToSingleDigit(soulSum),
      personalitySum,
      personalityNumber: reduceToSingleDigit(personalitySum),
    };
  }, [submitted]);

  const handleCalculate = (e) => {
    e.preventDefault();
    setError("");
    const trimmed = name.trim();
    if (!trimmed || trimmed.replace(/[^A-Za-z]/g, "").length < 2) {
      setError("Please enter your full name (letters only).");
      setSubmitted("");
      return;
    }
    setSubmitted(trimmed);
    setTimeout(() => {
      const el = document.getElementById("result");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  };

  return (
    <div className="grain relative min-h-screen overflow-x-hidden bg-[#0F0518] text-[#F8F5F0]">
      {/* Decorative glows */}
      <div className="radial-glow w-[560px] h-[560px] -top-40 -left-40 bg-[#9370DB]/25" />
      <div className="radial-glow w-[480px] h-[480px] top-[20%] right-[-160px] bg-[#D4AF37]/15" />

      {/* Mini Nav */}
      <header className="fixed top-0 inset-x-0 z-40 bg-[#0F0518]/75 backdrop-blur-xl border-b border-[#D4AF37]/10">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center"
            data-testid="calc-home-link"
            onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "smooth" })}
          >
            <Logo size={42} showWordmark />
          </Link>
          <Link
            to="/"
            data-testid="calc-back-link"
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.28em] text-[#C8BED6] hover:text-[#D4AF37] transition-colors"
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
            <span className="v-label">Chaldean System · Free Tool</span>
          </div>
          <h1
            className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight"
            style={{ fontWeight: 300 }}
          >
            Name <em className="gold-shimmer not-italic font-medium">Numerology</em> Calculator
          </h1>

          <p className="mt-4 sm:mt-5 text-base text-[#C8BED6] font-light leading-relaxed">
            Enter your full birth name to discover three guiding vibrations —
            <span className="text-[#F8F5F0]"> Expression</span> (destiny),
            <span className="text-[#F8F5F0]"> Soul Urge</span> (inner desire) and
            <span className="text-[#F8F5F0]"> Personality</span> (outer expression) — via the Chaldean system.
          </p>
        </div>

        {/* Calculator Card */}
        <form
          onSubmit={handleCalculate}
          data-testid="calc-form"
          className="glass-card mt-8 sm:mt-10 p-6 sm:p-8 md:p-10 reveal is-visible"
          noValidate
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Calculator className="text-[#D4AF37]" size={20} strokeWidth={1.2} />
              <h2 className="font-serif text-xl sm:text-2xl md:text-3xl" style={{ fontWeight: 400 }}>
                Calculate Your Name
              </h2>
            </div>
            <Sparkles className="text-[#D4AF37] hidden sm:block" size={20} strokeWidth={1.2} />
          </div>

          <label
            htmlFor="name-input"
            className="font-serif text-base sm:text-lg italic text-[#F3D060] block mb-2"
            style={{ fontWeight: 500, letterSpacing: "0.01em" }}
          >
            Full Name <span className="text-[#C8BED6]/70 not-italic font-light text-sm">(as on birth records)</span>
          </label>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              id="name-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Newalkkar Saandiip"
              className="field-input flex-1"
              data-testid="calc-name-input"
              autoComplete="name"
            />
            <button type="submit" data-testid="calc-submit-btn" className="btn-gold">
              Calculate <ArrowRight size={18} />
            </button>
          </div>
          {error && (
            <div
              data-testid="calc-error"
              className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-red-300/90 border-l-2 border-red-400/60 pl-3 py-1"
            >
              {error}
            </div>
          )}
        </form>

        {/* Personal Year cross-link — always visible, immediately below the form */}
        <Link
          to="/personal-year"
          data-testid="calc-to-personal-year"
          className="mt-5 sm:mt-6 glass-card p-5 sm:p-6 flex items-center gap-4 hover:border-[#D4AF37]/55 transition-all"
        >
          <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-full border border-[#D4AF37]/45 flex items-center justify-center text-[#D4AF37] shrink-0">
            <CalendarHeart size={20} strokeWidth={1.2} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="v-label mb-1">Free Tool · Next Step</div>
            <div className="font-serif text-base sm:text-lg md:text-xl text-[#F8F5F0]" style={{ fontWeight: 500 }}>
              Calculate your <span className="gold-shimmer">Personal Year</span> too
            </div>
            <p className="mt-1 text-xs sm:text-sm text-[#C8BED6] font-light">
              See what this year holds — ruling lord, opportunities & gentle guidance.
            </p>
          </div>
          <ArrowRight size={18} className="text-[#D4AF37] shrink-0" />
        </Link>

        {/* Result */}
        {result && (
          <section id="result" className="mt-10 sm:mt-14 reveal is-visible">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
              <div className="lg:col-span-2">
                <FeaturedCard
                  testid="result-name-number"
                  tag="01 / Expression"
                  label="Name Number"
                  sublabel="Destiny · how the world sees your path"
                  number={result.nameNumber}
                  sum={result.nameSum}
                />
              </div>
              <div className="flex flex-col gap-6">
                <SmallResultCard
                  testid="result-soul-number"
                  tag="02 / Soul Urge"
                  label="Soul Number"
                  sublabel="Heart's desire"
                  number={result.soulNumber}
                  sum={result.soulSum}
                />
                <SmallResultCard
                  testid="result-personality-number"
                  tag="03 / Personality"
                  label="Personality Number"
                  sublabel="Outer expression"
                  number={result.personalityNumber}
                  sum={result.personalitySum}
                />
              </div>
            </div>

            {/* Breakdown */}
            <div className="glass-card mt-10 p-8 md:p-10" data-testid="calc-breakdown">
              <div className="v-label mb-4">Calculation Breakdown</div>
              <div className="flex flex-wrap gap-2" data-testid="letter-chips">
                {result.letters.map((l, i) => (
                  <div
                    key={i}
                    className={`flex flex-col items-center justify-center min-w-[44px] h-14 rounded-lg border text-center px-2 ${
                      VOWELS.has(l)
                        ? "border-[#D4AF37]/60 bg-[#D4AF37]/10"
                        : "border-[#9370DB]/30 bg-[#9370DB]/5"
                    }`}
                  >
                    <span className="font-serif text-lg leading-none" style={{ fontWeight: 500 }}>
                      {l}
                    </span>
                    <span className="font-mono text-[10px] text-[#D4AF37] mt-1">
                      {CHART[l]}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-6 space-y-3 text-sm md:text-base text-[#C8BED6] leading-relaxed">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-2 font-mono">
                  <span className="text-[#D4AF37] uppercase tracking-[0.2em] text-xs">Name</span>
                  <span className="text-[#C8BED6]/70">→ sum of all letters</span>
                  <span className="px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#F3D060] font-semibold text-base" data-testid="breakdown-name-total">
                    Total = {result.nameSum}
                  </span>
                  <span className="text-[#C8BED6]/70">→ reduces to</span>
                  <span className="font-serif text-2xl text-[#F8F5F0]" style={{ fontWeight: 600 }}>
                    {result.nameNumber}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-2 gap-y-2 font-mono">
                  <span className="text-[#D4AF37] uppercase tracking-[0.2em] text-xs">Soul</span>
                  <span className="text-[#C8BED6]/70">→ sum of vowels ({result.vowelLetters.join(" + ") || "—"})</span>
                  <span className="px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#F3D060] font-semibold text-base" data-testid="breakdown-soul-total">
                    Total = {result.soulSum}
                  </span>
                  <span className="text-[#C8BED6]/70">→ reduces to</span>
                  <span className="font-serif text-2xl text-[#F8F5F0]" style={{ fontWeight: 600 }}>
                    {result.soulNumber}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-2 gap-y-2 font-mono">
                  <span className="text-[#D4AF37] uppercase tracking-[0.2em] text-xs">Personality</span>
                  <span className="text-[#C8BED6]/70">→ sum of consonants</span>
                  <span className="px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#F3D060] font-semibold text-base" data-testid="breakdown-personality-total">
                    Total = {result.personalitySum}
                  </span>
                  <span className="text-[#C8BED6]/70">→ reduces to</span>
                  <span className="font-serif text-2xl text-[#F8F5F0]" style={{ fontWeight: 600 }}>
                    {result.personalityNumber}
                  </span>
                </div>

                <div className="pt-4 mt-4 border-t border-[#D4AF37]/10 text-[#C8BED6]/70 font-mono text-xs">
                  All numbers reduce to a single digit (1–9) using the Chaldean system.
                </div>
              </div>
            </div>

            {/* CTA to book full consultation */}
            <div className="mt-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-8 md:p-10 rounded-2xl border border-[#D4AF37]/30 bg-gradient-to-r from-[#1A0B2E]/70 to-[#25123E]/70 backdrop-blur-md">
              <div>
                <div className="v-label mb-2">A deeper reading awaits</div>
                <h3
                  className="font-serif text-2xl md:text-3xl"
                  style={{ fontWeight: 400 }}
                >
                  This is the surface. Let's read the whole chart together.
                </h3>
                <p className="mt-3 text-[#C8BED6] font-light max-w-2xl">
                  A full consultation includes your driver &amp; conductor numbers, name
                  corrections, a mobile number audit and compatibility insight.
                </p>
              </div>
              <a
                href={`https://wa.me/919929059153?text=${encodeURIComponent(
                  `Namaste ji, I used the name numerology calculator for "${submitted}" and received Name ${result.nameNumber}, Soul ${result.soulNumber}, Personality ${result.personalityNumber}. I would like to book a full consultation.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="calc-book-consultation-btn"
                className="btn-whatsapp whitespace-nowrap"
              >
                <WhatsAppIcon size={20} /> Book Consultation
              </a>
            </div>
          </section>
        )}

        {/* Chaldean chart */}
        <section className="mt-12 sm:mt-20 reveal" data-testid="chaldean-chart">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-[1px] w-10 bg-[#D4AF37]" />
            <span className="v-label">Chaldean System · Letter Values</span>
          </div>
          <h2
            className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-tight"
            style={{ fontWeight: 300 }}
          >
            The <em className="gold-shimmer not-italic font-medium">alphabet</em>, translated to vibration.
          </h2>
          <p className="mt-4 text-[#C8BED6] font-light max-w-2xl">
            Chaldean numerology — the oldest of the name systems — maps letters to numbers
            1–8. The number 9 is considered sacred and never assigned to a letter.
          </p>

          <div className="mt-10 overflow-x-auto">
            <table className="w-full border-collapse min-w-[480px]">
              <thead>
                <tr>
                  {["Value", "", "", "", "", ""].map((h, i) => (
                    <th
                      key={i}
                      className={`font-mono text-[10px] uppercase tracking-[0.28em] text-[#D4AF37] border-b border-[#D4AF37]/25 py-3 px-2 ${
                        i === 0 ? "text-left" : "text-center"
                      }`}
                    >
                      {i === 0 ? h : ""}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CHALDEAN_TABLE.map((row) => (
                  <tr key={row[0]} className="border-b border-[#D4AF37]/10">
                    {row.map((cell, j) => {
                      if (j === 0) {
                        return (
                          <td
                            key={j}
                            className="font-serif text-2xl text-[#D4AF37] py-4 px-2"
                            style={{ fontWeight: 500 }}
                          >
                            {cell}
                          </td>
                        );
                      }
                      const isVowel = cell && VOWELS.has(cell);
                      return (
                        <td key={j} className="py-4 px-2 text-center">
                          {cell ? (
                            <span
                              className={`inline-flex items-center justify-center h-10 w-10 rounded-full font-serif text-lg ${
                                isVowel
                                  ? "bg-[#D4AF37]/15 text-[#F3D060] border border-[#D4AF37]/40"
                                  : "bg-[#9370DB]/10 text-[#F8F5F0] border border-[#9370DB]/25"
                              }`}
                              style={{ fontWeight: 500 }}
                            >
                              {cell}
                            </span>
                          ) : null}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.24em] text-[#C8BED6]/60">
            Gold ring = vowels (used for Soul Urge) · Purple = consonants (used for Personality)
          </p>
        </section>

        {/* Meanings */}
        <section className="mt-12 sm:mt-20 reveal">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-[1px] w-10 bg-[#D4AF37]" />
            <span className="v-label">The Meanings</span>
          </div>
          <h2
            className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-tight"
            style={{ fontWeight: 300 }}
          >
            What the numbers <em className="gold-shimmer not-italic font-medium">whisper</em>.
          </h2>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <div
                key={n}
                className="glass-card p-6"
                data-testid={`meaning-${n}`}
              >
                <div className="flex items-start justify-between">
                  <div
                    className="font-serif text-5xl text-[#D4AF37] leading-none"
                    style={{ fontWeight: 500 }}
                  >
                    {n}
                  </div>
                  <div
                    className="font-serif text-xl text-right text-[#F8F5F0]"
                    style={{ fontWeight: 400 }}
                  >
                    {MEANINGS[n].title}
                  </div>
                </div>
                <p className="mt-5 text-[#C8BED6] text-sm leading-relaxed font-light">
                  {MEANINGS[n].desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Return CTA */}
        <div className="mt-10 sm:mt-16 border-t border-[#D4AF37]/15 pt-8 sm:pt-10">
          <a
            href="https://wa.me/919929059153"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card p-6 sm:p-7 flex items-center gap-4 hover:border-[#25D366]/55 transition-all"
            data-testid="calc-return-contact"
          >
            <div className="h-12 w-12 rounded-full bg-[#25D366]/15 border border-[#25D366]/45 flex items-center justify-center text-[#25D366] shrink-0">
              <WhatsAppIcon size={22} />
            </div>
            <div className="flex-1">
              <div className="v-label mb-1" style={{ color: "#7ed99b" }}>Personal Reading</div>
              <div className="font-serif text-base sm:text-lg md:text-xl text-[#F8F5F0]" style={{ fontWeight: 500 }}>
                Speak with Newalkkar Saandiip ji →
              </div>
              <p className="mt-1 text-xs sm:text-sm text-[#C8BED6] font-light">
                A calculator hints at the music — only a human ear can read the song.
              </p>
            </div>
          </a>
        </div>
      </main>
    </div>
  );
}

/* ---------- Featured (Name Number) — large card ---------- */
const FeaturedCard = ({ testid, tag, label, sublabel, number, sum }) => {
  const meaning = MEANINGS[number];
  return (
    <div
      className="glass-card h-full p-7 sm:p-9 md:p-11 flex flex-col"
      data-testid={testid}
      style={{
        background:
          "linear-gradient(140deg, rgba(212,175,55,0.08) 0%, rgba(26,11,46,0.6) 50%)",
        borderColor: "rgba(212,175,55,0.45)",
      }}
    >
      <div className="flex items-center justify-between">
        <span className="v-label">{tag}</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-[#F3D060] bg-[#D4AF37]/15 px-3 py-1 rounded-full border border-[#D4AF37]/45">
          Primary
        </span>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-8 mt-6 sm:mt-8">
        <div
          className="leading-none gold-shimmer"
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: "clamp(7.5rem, 18vw, 13rem)",
            fontWeight: 700,
            letterSpacing: "-0.04em",
          }}
        >
          {number}
        </div>
        <div className="flex-1 pb-2 sm:pb-6">
          <div className="font-serif text-2xl sm:text-3xl text-[#F8F5F0]" style={{ fontWeight: 500 }}>
            {label}
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.26em] text-[#C8BED6]/70 mt-1">
            {sublabel}
          </div>
          <span
            className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/45 font-mono text-[12px] uppercase tracking-[0.22em] text-[#F3D060]"
            data-testid={`${testid}-sum`}
          >
            Sum: {sum} <span className="text-[#D4AF37]">→</span>{" "}
            <span className="text-[#F8F5F0] font-semibold">{number}</span>
          </span>
        </div>
      </div>
      {meaning && (
        <>
          <div className="gold-divider my-6" />
          <div className="font-serif text-xl text-[#D4AF37]" style={{ fontWeight: 500 }}>
            {meaning.title}
          </div>
          <p className="mt-2 text-sm sm:text-base text-[#C8BED6] leading-relaxed font-light">
            {meaning.desc}
          </p>
        </>
      )}
    </div>
  );
};

/* ---------- Small (Soul / Personality) cards ---------- */
const SmallResultCard = ({ testid, tag, label, sublabel, number, sum }) => {
  const meaning = MEANINGS[number];
  return (
    <div className="glass-card p-5 sm:p-6 flex flex-col" data-testid={testid}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="v-label">{tag}</div>
          <div className="font-serif text-base sm:text-lg text-[#F8F5F0] mt-1.5" style={{ fontWeight: 500 }}>
            {label}
          </div>
          <div className="font-mono text-[9px] uppercase tracking-[0.24em] text-[#C8BED6]/65 mt-0.5">
            {sublabel}
          </div>
        </div>
        <div
          className="leading-none text-[#F8F5F0]"
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: "3.25rem",
            fontWeight: 600,
            letterSpacing: "-0.03em",
          }}
        >
          {number}
        </div>
      </div>
      {meaning && (
        <p className="mt-3 text-xs sm:text-sm text-[#C8BED6] leading-relaxed font-light">
          <span className="text-[#D4AF37] font-medium">{meaning.title}.</span> {meaning.desc}
        </p>
      )}
      <span
        className="mt-3 self-start inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/35 font-mono text-[10px] uppercase tracking-[0.2em] text-[#F3D060]"
        data-testid={`${testid}-sum`}
      >
        {sum} → <span className="text-[#F8F5F0] font-semibold">{number}</span>
      </span>
    </div>
  );
};
