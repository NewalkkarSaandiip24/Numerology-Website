import React from "react";
import {
  Smartphone,
  Calculator,
  PlayCircle,
  Home,
  Sparkles,
  Wand2,
  Hash,
  CalendarHeart,
  Phone,
  Printer,
  QrCode,
  CheckCircle2,
} from "lucide-react";
import Logo from "../components/Logo";
import useSEO from "../hooks/useSEO";

const BONUSES = [
  {
    icon: Calculator,
    title: "Free Mobile Numerology Software",
    sub: "Lifetime access · Calculate any number instantly",
    worth: "₹9,999",
  },
  {
    icon: PlayCircle,
    title: "Free Recording — Lifetime Access",
    sub: "Re-watch every session anytime, forever",
    worth: "₹7,999",
  },
  {
    icon: Home,
    title: "Tried & Tested Vaastu Remedies",
    sub: "For Money · Health · Relationships",
    worth: "₹4,999",
  },
  {
    icon: Sparkles,
    title: "Tried & Tested Numerology Remedies",
    sub: "Personal mantras & rituals from 14+ yrs practice",
    worth: "₹4,999",
  },
  {
    icon: Wand2,
    title: "Switch Words Pack",
    sub: "Hand-picked words to attract abundance & calm",
    worth: "₹2,999",
  },
  {
    icon: Hash,
    title: "Name Numerology Calculator",
    sub: "Premium calculator — unlimited usage",
    worth: "₹2,999",
  },
  {
    icon: CalendarHeart,
    title: "Personal Year Calculator",
    sub: "Year-by-year forecast tool with insights",
    worth: "₹2,999",
  },
];

const PHONE = "9929059153";
const WHATSAPP_URL = "https://wa.me/919929059153";

export default function SalesPitchMobileNumerology() {
  useSEO({
    title: "Mobile Numerology Complete Course — Sales Flyer | Newalkkar Saandiip",
    description:
      "One-page sales pitch for Newalkkar Saandiip ji's Mobile Numerology Complete Course with all free bonuses worth ₹36,993+.",
    noindex: true,
  });

  const printNow = () => {
    if (typeof window !== "undefined") window.print();
  };

  return (
    <div className="bg-[#F6EFE2] min-h-screen w-full pitch-root">
      {/* Floating print bar — hidden on print */}
      <div className="pitch-noprint sticky top-0 z-30 bg-[#0F0518]/95 backdrop-blur text-white py-2.5 px-4 flex items-center justify-between border-b border-[#D4AF37]/30">
        <div className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.22em] text-[#F3D060]">
          Sales Flyer · Mobile Numerology
        </div>
        <button
          type="button"
          onClick={printNow}
          data-testid="pitch-print-btn"
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37] hover:bg-[#F3D060] text-[#0F0518] text-xs sm:text-sm font-bold transition-colors"
        >
          <Printer size={14} /> Print / Save as PDF
        </button>
      </div>

      {/* A4 sheet */}
      <div className="mx-auto pitch-sheet bg-[#FFF8EC] shadow-2xl my-6">
        {/* Decorative corner ornaments */}
        <div className="pitch-corner pitch-corner-tl" />
        <div className="pitch-corner pitch-corner-tr" />
        <div className="pitch-corner pitch-corner-bl" />
        <div className="pitch-corner pitch-corner-br" />

        {/* ====== HEADER ====== */}
        <header className="px-7 sm:px-10 pt-8 pb-3 border-b-2 border-[#5B0B1F]/15 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Logo size={44} />
            <div>
              <div className="font-serif text-lg sm:text-xl text-[#5B0B1F]" style={{ fontWeight: 700 }}>
                Newalkkar Saandiip
              </div>
              <div className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.22em] text-[#8B6B14]">
                Numerologist · Vaastu Consultant · Life Coach
              </div>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#8B6B14]">
              Limited-Time Offer
            </div>
            <div className="font-serif text-base text-[#5B0B1F]" style={{ fontWeight: 600 }}>
              Lifetime Access
            </div>
          </div>
        </header>

        {/* ====== COURSE TITLE ====== */}
        <section className="px-7 sm:px-10 pt-5 pb-4">
          <div className="flex items-start gap-4">
            <div className="shrink-0 h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-gradient-to-br from-[#5B0B1F] to-[#3A0613] text-[#F3D060] flex items-center justify-center border-2 border-[#D4AF37]/55 shadow-md">
              <Smartphone size={28} strokeWidth={1.8} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="inline-block font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.24em] text-white bg-[#5B0B1F] px-2.5 py-1 rounded-full">
                Flagship Course
              </div>
              <h1
                className="mt-1.5 font-serif text-2xl sm:text-3xl md:text-4xl text-[#5B0B1F] leading-[1.1]"
                style={{ fontWeight: 800 }}
              >
                Mobile Numerology <span className="text-[#8B6B14]">Complete Course</span>
              </h1>
              <p className="mt-1.5 text-[13px] sm:text-sm text-[#2A1A2C] leading-snug">
                Decode the hidden vibration in your mobile number — and learn how a
                single number change can unlock <span className="font-semibold text-[#5B0B1F]">money, health & relationships</span>.
                Step-by-step training from <span className="font-semibold">14+ years of practice</span> with <span className="font-semibold">100,000+ analyses</span>.
              </p>
            </div>
          </div>
        </section>

        {/* ====== BONUSES BANNER ====== */}
        <section className="px-7 sm:px-10 mt-1">
          <div
            className="rounded-xl px-4 py-3 text-center text-white shadow-lg"
            style={{
              background: "linear-gradient(135deg, #C00020 0%, #FF1F3D 55%, #C00020 100%)",
            }}
          >
            <div className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-white/85">
              🎁 Enroll Today &amp; Unlock
            </div>
            <div className="font-serif text-xl sm:text-2xl md:text-3xl mt-0.5" style={{ fontWeight: 800 }}>
              FREE BONUSES Worth <span className="underline decoration-[#FFE9B0] decoration-2 underline-offset-2">₹36,993+</span>
            </div>
          </div>
        </section>

        {/* ====== BONUS GRID ====== */}
        <section className="px-7 sm:px-10 mt-4">
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {BONUSES.map((b, i) => {
              const Icon = b.icon;
              return (
                <li
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-lg bg-white border-2 border-[#5B0B1F]/12 hover:border-[#5B0B1F]/40 shadow-sm"
                >
                  <div className="shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-[#5B0B1F] to-[#3A0613] text-[#F3D060] flex items-center justify-center border border-[#D4AF37]/55">
                    <Icon size={18} strokeWidth={1.8} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white bg-[#C00020] px-1.5 py-0.5 rounded">
                        Free
                      </span>
                      <span className="font-serif text-[13px] sm:text-sm text-[#5B0B1F] leading-tight" style={{ fontWeight: 700 }}>
                        {b.title}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[11px] sm:text-[12px] text-[#2A1A2C] leading-snug">
                      {b.sub}
                    </p>
                    <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[#8B6B14]">
                      Value: <span className="text-[#C00020] font-bold">{b.worth}</span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        {/* ====== CTA + QR ====== */}
        <section className="px-7 sm:px-10 mt-4 mb-6">
          <div
            className="rounded-xl px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center gap-5"
            style={{
              background:
                "linear-gradient(135deg, #0F0518 0%, #2A0E45 60%, #0F0518 100%)",
              border: "1.5px solid rgba(212,175,55,0.55)",
            }}
          >
            {/* QR placeholder */}
            <div className="flex flex-col items-center">
              <div
                data-testid="pitch-qr-placeholder"
                className="h-32 w-32 sm:h-36 sm:w-36 bg-white border-2 border-dashed border-[#D4AF37] rounded-lg flex flex-col items-center justify-center text-center p-2"
              >
                <QrCode size={36} className="text-[#5B0B1F]/55 mb-1.5" strokeWidth={1.5} />
                <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-[#5B0B1F]/65 leading-tight">
                  Paste your<br />payment QR<br />here
                </span>
              </div>
              <div className="mt-2 font-mono text-[8px] uppercase tracking-[0.22em] text-[#F3D060]/85">
                Scan to Pay
              </div>
            </div>

            {/* Right side: phone + CTA */}
            <div className="flex-1 min-w-0 text-center sm:text-left">
              <div className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.26em] text-[#F3D060]">
                Reserve Your Seat Now
              </div>
              <a
                href={`tel:+91${PHONE}`}
                className="mt-1 inline-flex items-center gap-2 text-white font-serif text-2xl sm:text-3xl"
                style={{ fontWeight: 800 }}
                data-testid="pitch-phone"
              >
                <Phone size={20} className="text-[#F3D060]" />
                +91 {PHONE.slice(0, 5)} {PHONE.slice(5)}
              </a>
              <p className="mt-2 text-[12px] sm:text-[13px] text-[#E8DCC4] leading-snug">
                Call or WhatsApp Newalkkar Saandiip ji directly — quote{" "}
                <span className="font-bold text-[#F3D060]">"Mobile Numerology Course"</span> to receive
                today's launch price and lock-in all bonuses listed above.
              </p>
              <div className="mt-2.5 flex flex-wrap gap-2 justify-center sm:justify-start">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#25D366] hover:bg-[#1ebe5a] text-white font-bold text-xs"
                >
                  WhatsApp Now
                </a>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#C00020] text-white font-bold text-xs">
                  Only 200 Seats
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ====== TRUST + FOOTER ====== */}
        <footer className="px-7 sm:px-10 pb-7 pt-1 border-t-2 border-[#5B0B1F]/15">
          <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-2">
            <div className="flex items-center gap-2 text-[#5B0B1F]">
              <CheckCircle2 size={14} className="text-[#1F8C3F]" />
              <span className="font-mono text-[10px] uppercase tracking-[0.22em]">
                100,000+ Analyses · 14+ Years Practice
              </span>
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#8B6B14]">
              newalkkarsaandiip.in
            </div>
          </div>
        </footer>
      </div>

      {/* Print styles */}
      <style>{`
        .pitch-sheet {
          width: 794px;            /* A4 width @ 96 dpi */
          max-width: 100%;
          min-height: 1123px;      /* A4 height */
          position: relative;
          border-radius: 6px;
        }
        .pitch-corner {
          position: absolute;
          width: 60px;
          height: 60px;
          background-image:
            linear-gradient(#D4AF37, #D4AF37),
            linear-gradient(#D4AF37, #D4AF37);
          background-size: 60px 1.5px, 1.5px 60px;
          background-repeat: no-repeat;
        }
        .pitch-corner-tl { top: 14px; left: 14px; background-position: top left, top left; }
        .pitch-corner-tr { top: 14px; right: 14px; background-position: top right, top right; }
        .pitch-corner-bl { bottom: 14px; left: 14px; background-position: bottom left, bottom left; }
        .pitch-corner-br { bottom: 14px; right: 14px; background-position: bottom right, bottom right; }

        @media print {
          @page { size: A4; margin: 0; }
          html, body { background: #FFF8EC !important; }
          .pitch-noprint { display: none !important; }
          .pitch-sheet { box-shadow: none !important; margin: 0 auto !important; border-radius: 0 !important; }
        }
      `}</style>
    </div>
  );
}
