import React, { useState, useEffect } from "react";
import { X, Lock, ArrowRight, Heart, CheckCircle2 } from "lucide-react";
import WhatsAppIcon from "./WhatsAppIcon";

const WHATSAPP_NUMBER = "919929059153";

export default function BookingModal({ open, onClose }) {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [dob, setDob] = useState("");
  const [time, setTime] = useState("");
  const [problem, setProblem] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on Esc
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Reset state when closed
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setName("");
        setMobile("");
        setDob("");
        setTime("");
        setProblem("");
        setError("");
        setSent(false);
      }, 300);
    }
  }, [open]);

  if (!open) return null;

  const formatDob = (iso) => {
    if (!iso) return "";
    const [y, m, d] = iso.split("-");
    return `${d}/${m}/${y}`;
  };

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
    if (!dob) {
      setError("Please share your date of birth.");
      return;
    }

    const lines = [
      "🙏 Namaste Newalkkar Saandiip ji,",
      "",
      "I would like to book a consultation. My details are:",
      "",
      `• Name: ${trimmedName}`,
      `• Mobile: ${digits}`,
      `• Date of Birth: ${formatDob(dob)}`,
    ];
    if (time.trim()) lines.push(`• Birth Time: ${time.trim()}`);
    if (problem.trim()) {
      lines.push("");
      lines.push("Problem I am facing:");
      lines.push(problem.trim());
    }
    lines.push("");
    lines.push("Kindly guide me. Dhanyavaad.");

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      lines.join("\n")
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setSent(true);
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6"
      data-testid="booking-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
    >
      <div
        className="absolute inset-0 bg-[#0F0518]/85 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-2xl border border-[#D4AF37]/35 bg-[#1A0B2E] shadow-2xl shadow-[#D4AF37]/10">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          data-testid="booking-modal-close"
          className="absolute top-3 right-3 h-9 w-9 rounded-full border border-[#D4AF37]/30 text-[#C8BED6] hover:text-[#F3D060] hover:border-[#F3D060] flex items-center justify-center transition-colors z-10 bg-[#0F0518]/60"
        >
          <X size={18} />
        </button>

        {!sent ? (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8" noValidate>
            <div className="flex items-center gap-3 mb-2">
              <span className="h-[1px] w-8 bg-[#D4AF37]" />
              <span className="v-label">Request a Consultation</span>
            </div>
            <h2
              id="booking-modal-title"
              className="font-serif text-2xl sm:text-3xl text-[#F8F5F0]"
              style={{ fontWeight: 400 }}
            >
              Share a few details
            </h2>
            <p className="mt-2 text-sm text-[#C8BED6]/85 font-light">
              Newalkkar Saandiip ji will personally connect with you on WhatsApp.
            </p>

            <div className="space-y-4 mt-6">
              <Field label="Full Name" hint="As written on your records" required>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ananya Sharma"
                  className="field-input"
                  data-testid="booking-name-input"
                  autoComplete="name"
                />
              </Field>

              <Field label="Mobile Number" required>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="10-digit mobile"
                  className="field-input"
                  data-testid="booking-mobile-input"
                  inputMode="tel"
                  autoComplete="tel"
                />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Date of Birth" required>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="field-input"
                    data-testid="booking-dob-input"
                  />
                </Field>
                <Field label="Birth Time" hint="Optional">
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="field-input"
                    data-testid="booking-time-input"
                  />
                </Field>
              </div>

              <Field
                label="What is troubling you?"
                hint="Optional — share if you wish"
              >
                <textarea
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  placeholder="Briefly tell us what you'd like guidance on…"
                  rows={3}
                  className="field-input resize-none"
                  data-testid="booking-problem-input"
                />
                <div className="mt-2 flex items-start gap-2 text-[11px] text-[#C8BED6]/80 font-light leading-relaxed">
                  <Lock size={12} className="text-[#D4AF37] mt-0.5 shrink-0" />
                  <span>
                    Your problem is held in <span className="text-[#F3D060]">complete
                    confidence</span>. Sharing it helps Saandiip ji prepare for you in
                    advance — but you may skip this if you prefer.
                  </span>
                </div>
              </Field>

              {error && (
                <div
                  data-testid="booking-error"
                  className="font-mono text-xs uppercase tracking-[0.2em] text-red-300/90 border-l-2 border-red-400/60 pl-3 py-1"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                data-testid="booking-submit-btn"
                className="btn-whatsapp w-full justify-center"
              >
                <WhatsAppIcon size={20} /> Send on WhatsApp <ArrowRight size={16} />
              </button>
              <p className="text-[11px] text-center text-[#C8BED6]/60 font-mono uppercase tracking-[0.18em]">
                Free first reply · No spam, ever
              </p>
            </div>
          </form>
        ) : (
          <div className="p-8 sm:p-12 text-center" data-testid="booking-thank-you">
            <div className="mx-auto w-20 h-20 rounded-full bg-[#25D366]/15 border-2 border-[#25D366]/50 flex items-center justify-center mb-6">
              <CheckCircle2 size={42} className="text-[#25D366]" strokeWidth={1.5} />
            </div>
            <h3
              className="font-serif text-3xl text-[#F8F5F0]"
              style={{ fontWeight: 400 }}
            >
              Thank you, <span className="gold-shimmer">{name.split(" ")[0]}</span>!
            </h3>
            <div className="gold-divider w-20 mx-auto my-5" />
            <p className="text-[#C8BED6] font-light leading-relaxed mb-6">
              Your details are now with Newalkkar Saandiip ji on WhatsApp. He personally
              replies to every consultation request — usually within a few hours.
            </p>
            <p className="text-sm text-[#F3D060] font-light flex items-center justify-center gap-2">
              <Heart size={14} className="fill-[#F3D060]" /> May the numbers favour you.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="btn-ghost mt-8"
              data-testid="booking-thank-you-close"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const Field = ({ label, hint, required, children }) => (
  <div>
    <label className="font-serif text-sm sm:text-base italic text-[#F3D060] block mb-1.5" style={{ fontWeight: 500 }}>
      {label}
      {required && <span className="text-[#D4AF37] not-italic"> *</span>}
      {hint && (
        <span className="ml-2 text-[#C8BED6]/60 not-italic font-light text-xs">
          ({hint})
        </span>
      )}
    </label>
    {children}
  </div>
);
