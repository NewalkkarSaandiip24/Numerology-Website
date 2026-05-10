import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, AlertTriangle, ShieldAlert, Hash, CalendarHeart } from "lucide-react";
import Logo from "../components/Logo";
import useSEO from "../hooks/useSEO";
import {
  digitSumWithSteps,
  modifyZeros,
  buildPairs,
  pairStatus,
  detectAlerts,
} from "../lib/mobileCompat";
import { publicApi, formatErr } from "../lib/api";

const STATUS_COLOR = {
  good: { bg: "rgba(126, 217, 155, 0.13)", border: "rgba(126, 217, 155, 0.55)", text: "#7ed99b", label: "Good" },
  average: { bg: "rgba(155, 105, 195, 0.14)", border: "rgba(155, 105, 195, 0.55)", text: "#c8a9ee", label: "Neutral" },
  bad: { bg: "rgba(232, 91, 91, 0.14)", border: "rgba(232, 91, 91, 0.55)", text: "#ff9b9b", label: "Bad" },
};

export default function MobileCompatibility() {
  useSEO({
    title:
      "Mobile Number Compatibility Checker | Mobile Numerology by Newalkkar Saandiip",
    description:
      "Free Mobile Number Compatibility Checker for authorized clients — pair-by-pair Mobile Numerology analysis, Kaal Sarp Dosh & Pitra Dosh detection and total digit-sum vibration by Newalkkar Saandiip, India's trusted Numerologist & Vastu Consultant.",
    keywords:
      "Mobile Number Compatibility, Mobile Numerology, lucky mobile number, mobile number numerology calculator, Kaal Sarp Dosh, Pitra Dosh, Newalkkar Saandiip, Numerologist in India, Vastu Consultant, Online Numerology Consultation",
    canonical: "https://newalkkarsaandiip.in/mobile-compatibility",
    ogImage: "https://newalkkarsaandiip.in/saandiip-namaste.webp",
  });

  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");
  const [submittedMobile, setSubmittedMobile] = useState("");
  const [checking, setChecking] = useState(false);
  const [authError, setAuthError] = useState("");

  const result = useMemo(() => {
    if (!submittedMobile) return null;
    const digits = submittedMobile.split("").map(Number);
    const sum = digitSumWithSteps(digits);
    const modified = modifyZeros(digits);
    const pairs = buildPairs(modified);
    const rows = pairs.map((p) => ({ pair: p, ...pairStatus(p) }));
    const alerts = detectAlerts(modified);
    return { digits, sum, modified, pairs, rows, alerts };
  }, [submittedMobile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setAuthError("");
    setSubmittedMobile("");

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!dob) {
      setError("Please enter your date of birth.");
      return;
    }
    const m = mobile.replace(/\D/g, "");
    if (m.length !== 10) {
      setError("Mobile must be exactly 10 digits (without country code).");
      return;
    }

    setChecking(true);
    try {
      const r = await publicApi.checkAuthorized(m);
      if (!r.authorized) {
        setAuthError(
          r.reason === "expired"
            ? "Your access has expired. Please contact the administrator to renew it."
            : "This mobile number is not authorized yet. Please request access from the administrator — Newalkkar Saandiip ji will be happy to assist you."
        );
        return;
      }
      setSubmittedMobile(m);
      setTimeout(() => {
        const el = document.getElementById("mc-result");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    } catch (e) {
      setAuthError(formatErr(e));
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0F0518] text-[#F8F5F0]">
      <header className="border-b border-[#D4AF37]/15 bg-[#0F0518]/80 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-3" data-testid="mc-home-link">
            <Logo size={36} />
            <span className="font-serif text-base sm:text-lg" style={{ fontWeight: 500 }}>
              Mobile Compatibility
            </span>
          </Link>
          <Link
            to="/"
            data-testid="mc-back-link"
            className="inline-flex items-center gap-2 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[#C8BED6] hover:text-[#D4AF37] transition-colors"
          >
            <ArrowLeft size={14} /> Home
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-2xl">
          <div className="v-label mb-2">Authorized Clients · Mobile Number Numerology</div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl tracking-tight" style={{ fontWeight: 400 }}>
            Check your <span className="gold-shimmer">Mobile Number</span> compatibility with you
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#C8BED6] font-light">
            Discover the pair-by-pair vibration of your mobile number, special doshas
            (Kaal Sarp, Pitra) and the total digit sum — analysed instantly using
            Mobile Number Numerology.
          </p>

          {/* Restricted access notice */}
          <div
            data-testid="mc-restricted-notice"
            className="mt-6 flex gap-3 p-4 sm:p-5 rounded-xl border bg-[#D4AF37]/8"
            style={{ borderColor: "rgba(212,175,55,0.45)" }}
          >
            <ShieldAlert className="text-[#D4AF37] shrink-0 mt-0.5" size={20} />
            <div>
              <div className="font-serif text-base sm:text-lg text-[#F3D060]" style={{ fontWeight: 600 }}>
                Please enter the Authorized mobile number only to proceed
              </div>
              <p className="mt-1 text-sm text-[#C8BED6] font-light leading-relaxed">
                Access to this checker is restricted. If your mobile number has not been
                authorized, please contact the Administrator —
                <span className="text-[#F8F5F0]"> Newalkkar Saandiip</span> at
                <span className="text-[#F8F5F0]"> +91 99290 59153</span> — to register
                your details before using this tool.
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} data-testid="mc-form" className="glass-card mt-7 sm:mt-9 p-5 sm:p-7" noValidate>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="v-label block mb-1.5">Full Name</label>
              <input
                type="text"
                className="field-input"
                data-testid="mc-name"
                placeholder="e.g. Ananya Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>
            <div>
              <label className="v-label block mb-1.5">Date of Birth</label>
              <input
                type="date"
                className="field-input"
                data-testid="mc-dob"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div>
              <label className="v-label block mb-1.5">Mobile (no country code)</label>
              <input
                type="tel"
                inputMode="tel"
                className="field-input"
                data-testid="mc-mobile"
                placeholder="Enter mobile number without country Code"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                autoComplete="tel"
              />
            </div>
          </div>
          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            <button type="submit" disabled={checking} data-testid="mc-submit" className="btn-gold disabled:opacity-50">
              {checking ? "Checking…" : "Calculate Compatibility"} <ArrowRight size={16} />
            </button>
          </div>
          {error && (
            <div data-testid="mc-error" className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-red-300/90 border-l-2 border-red-400/60 pl-3 py-1">
              {error}
            </div>
          )}
        </form>

        {/* Auth error */}
        {authError && (
          <div data-testid="mc-auth-error" className="mt-6 glass-card p-6 sm:p-7 border-[#D4AF37]/45">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/45 flex items-center justify-center text-[#D4AF37] shrink-0">
                <ShieldAlert size={22} />
              </div>
              <div className="flex-1">
                <div className="font-serif text-lg sm:text-xl text-[#F8F5F0]" style={{ fontWeight: 500 }}>
                  Mobile number not authorized
                </div>
                <p className="mt-2 text-[#C8BED6] font-light leading-relaxed">{authError}</p>
                <div className="mt-4 p-4 rounded-lg border border-[#D4AF37]/25 bg-[#1A0B2E]/60">
                  <div className="v-label mb-2">Contact the Administrator</div>
                  <div className="font-serif text-lg text-[#F8F5F0]" style={{ fontWeight: 500 }}>
                    Newalkkar Saandiip
                  </div>
                  <div className="font-mono text-sm text-[#F3D060] mt-1" data-testid="mc-admin-phone">
                    +91 99290 59153
                  </div>
                  <p className="mt-2 text-xs sm:text-sm text-[#C8BED6]/80 font-light leading-relaxed">
                    Kindly share your full name, date of birth and mobile number with the
                    Administrator to get your number authorized for compatibility analysis.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Result */}
        {result && (
          <section id="mc-result" className="mt-8 sm:mt-10 space-y-6">
            {/* Total */}
            <div
              className="glass-card p-6 sm:p-8 text-center"
              data-testid="mc-total-card"
              style={{ borderColor: "rgba(212,175,55,0.45)" }}
            >
              <div className="v-label">Total · Mobile Number Energy</div>
              <div className="mt-3 font-mono text-sm text-[#C8BED6]/80">
                {result.digits.join(" + ")} = <span className="text-[#F3D060]">{result.sum.total}</span>
                {result.sum.steps.length > 1 && (
                  <span className="ml-1">
                    → {result.sum.steps.slice(1).join(" → ")}
                  </span>
                )}
              </div>
              <div
                className="mt-4 mx-auto leading-none gold-shimmer"
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: "clamp(5rem, 14vw, 8rem)",
                  fontWeight: 700,
                  letterSpacing: "-0.04em",
                }}
              >
                {result.sum.single}
              </div>
              <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.22em] text-[#D4AF37]">
                Single-digit total
              </div>
            </div>

            {/* Alerts */}
            {result.alerts.length > 0 && (
              <div className="space-y-3" data-testid="mc-alerts">
                {result.alerts.map((a, i) => (
                  <div
                    key={i}
                    className="flex gap-3 p-4 rounded-xl border bg-[#F4A742]/8"
                    style={{ borderColor: "rgba(244,167,66,0.45)" }}
                    data-testid={`mc-alert-${a.type}`}
                  >
                    <AlertTriangle className="text-[#F4A742] shrink-0" size={20} />
                    <div>
                      <div className="font-serif text-base sm:text-lg text-[#F4A742]" style={{ fontWeight: 600 }}>
                        {a.title}
                      </div>
                      <p className="mt-1 text-sm text-[#F8F5F0]/90 font-light leading-relaxed">{a.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pair Table */}
            <div className="glass-card overflow-hidden" data-testid="mc-pair-table">
              <div className="px-4 sm:px-6 pt-5 sm:pt-6 pb-3">
                <div className="v-label mb-1">Pair-by-Pair Analysis</div>
                <div className="font-serif text-lg sm:text-xl md:text-2xl text-[#F8F5F0]" style={{ fontWeight: 500 }}>
                  9 vibrations of your mobile number
                </div>
              </div>

              {/* Desktop / tablet table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#1A0B2E]/70">
                    <tr className="text-left">
                      <th className="p-3 font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] text-[#F3D060]">Combination</th>
                      <th className="p-3 font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] text-[#F3D060]">Status</th>
                      <th className="p-3 font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] text-[#F3D060]">Detail</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.rows.map((r, i) => {
                      const c = STATUS_COLOR[r.status];
                      return (
                        <tr key={i} className="border-t border-[#D4AF37]/10" data-testid={`mc-row-${i}`}>
                          <td className="p-3 align-top">
                            <span
                              className="inline-flex items-center justify-center min-w-[58px] h-10 px-2 rounded-lg font-mono font-semibold"
                              style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}`, fontSize: "1rem" }}
                            >
                              {r.pair}
                            </span>
                          </td>
                          <td className="p-3 align-top">
                            <span
                              className="px-2.5 py-1 rounded-full text-[11px] font-mono uppercase tracking-[0.2em]"
                              style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}
                            >
                              {c.label}
                            </span>
                          </td>
                          <td className="p-3 align-top text-[#F8F5F0]/90 leading-relaxed font-light text-sm">{r.detail}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile-only card list (below sm breakpoint) */}
              <div className="sm:hidden divide-y divide-[#D4AF37]/10">
                {result.rows.map((r, i) => {
                  const c = STATUS_COLOR[r.status];
                  return (
                    <div key={i} data-testid={`mc-card-${i}`} className="p-4">
                      <div className="flex items-center gap-3 mb-2.5">
                        <span
                          className="inline-flex items-center justify-center min-w-[52px] h-9 px-2 rounded-lg font-mono font-semibold text-base"
                          style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}
                        >
                          {r.pair}
                        </span>
                        <span
                          className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-[0.18em]"
                          style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}
                        >
                          {c.label}
                        </span>
                      </div>
                      <p className="text-[13px] leading-relaxed text-[#F8F5F0]/90 font-light">{r.detail}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Other tools cross-links */}
            <div className="grid sm:grid-cols-2 gap-4">
              <Link to="/name-numerology" className="glass-card p-5 flex items-center gap-3 hover:border-[#D4AF37]/45">
                <Hash size={18} className="text-[#D4AF37]" />
                <span className="font-serif text-sm sm:text-base text-[#F8F5F0]">Name Numerology Calculator</span>
                <ArrowRight size={14} className="ml-auto text-[#D4AF37]" />
              </Link>
              <Link to="/personal-year" className="glass-card p-5 flex items-center gap-3 hover:border-[#D4AF37]/45">
                <CalendarHeart size={18} className="text-[#D4AF37]" />
                <span className="font-serif text-sm sm:text-base text-[#F8F5F0]">Personal Year Calculator</span>
                <ArrowRight size={14} className="ml-auto text-[#D4AF37]" />
              </Link>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
