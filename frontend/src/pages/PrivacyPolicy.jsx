import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Mail, Phone } from "lucide-react";
import Logo from "../components/Logo";
import WhatsAppIcon from "../components/WhatsAppIcon";
import useSEO from "../hooks/useSEO";

export default function PrivacyPolicy() {
  useSEO({
    title: "Privacy Policy | Newalkkar Saandiip — Numerologist & Vaastu Consultant",
    description:
      "Privacy Policy for newalkkarsaandiip.in — how Newalkkar Saandiip collects, uses and protects your personal information submitted for numerology, astrology, vastu consultations and courses.",
    keywords:
      "Privacy Policy, Newalkkar Saandiip, Numerology, Vastu, Personal Data Protection",
    canonical: "https://newalkkarsaandiip.in/privacy-policy",
  });

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#FBF5EF] text-[#2A1A2C]">
      <header className="border-b-2 border-[#5B0B1F]/15 bg-white/80 backdrop-blur sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-3" data-testid="privacy-home-link">
            <Logo size={36} />
            <div>
              <div className="font-serif text-base sm:text-lg text-[#5B0B1F]" style={{ fontWeight: 700 }}>
                Newalkkar Saandiip
              </div>
              <div className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.18em] text-[#B8881A]">
                Numerologist · Vaastu · Life Coach
              </div>
            </div>
          </Link>
          <Link
            to="/"
            data-testid="privacy-back-link"
            className="inline-flex items-center gap-2 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[#5B0B1F] hover:text-[#3B0413]"
          >
            <ArrowLeft size={14} /> Home
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16" data-testid="privacy-content">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-12 w-12 rounded-full bg-[#5B0B1F]/10 border-2 border-[#5B0B1F]/35 flex items-center justify-center text-[#5B0B1F]">
            <Shield size={22} />
          </div>
          <div className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.22em] text-[#5B0B1F]" style={{ fontWeight: 700 }}>
            Legal · Last updated June 2026
          </div>
        </div>

        <h1
          className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#5B0B1F] leading-tight tracking-tight"
          style={{ fontWeight: 700 }}
        >
          Privacy Policy
        </h1>
        <p className="mt-5 text-lg sm:text-xl text-[#3B0413] font-light leading-relaxed">
          At <span className="text-[#5B0B1F]" style={{ fontWeight: 600 }}>Newalkkar Saandiip</span>, we respect your privacy.
          This page explains how we handle the personal information you share with us.
        </p>

        {/* Body */}
        <div className="mt-10 space-y-8 text-base sm:text-lg text-[#2A1A2C] font-normal leading-[1.7]">
          <section>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#5B0B1F] mb-3" style={{ fontWeight: 700 }}>
              Information We Collect
            </h2>
            <p>
              Any information you submit through our website, advertisements, forms,
              WhatsApp, or consultations — including your <strong>name, phone number,
              email address, date of birth, and mobile number</strong> — is used solely
              for providing numerology, astrology, vaastu consultation, course information,
              customer support, and related services.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#5B0B1F] mb-3" style={{ fontWeight: 700 }}>
              How We Use Your Information
            </h2>
            <ul className="space-y-2 list-disc pl-6">
              <li>To deliver the consultation, course or service you requested.</li>
              <li>To send course / masterclass joining details, reminders and bonuses.</li>
              <li>To contact you regarding our services, courses, webinars, masterclasses and updates.</li>
              <li>To provide customer support and answer your queries.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#5B0B1F] mb-3" style={{ fontWeight: 700 }}>
              Sharing of Information
            </h2>
            <p>
              We <strong>do not sell, rent, or share</strong> your personal information
              with third parties — except where required by law, a valid legal request,
              or to comply with regulatory obligations.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#5B0B1F] mb-3" style={{ fontWeight: 700 }}>
              Consent to Contact
            </h2>
            <p>
              By submitting your information, you consent to being contacted via
              <strong> phone, WhatsApp, SMS, or email</strong> regarding our services,
              courses, webinars, masterclasses and important updates.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#5B0B1F] mb-3" style={{ fontWeight: 700 }}>
              Data Security
            </h2>
            <p>
              Reasonable security measures are in place to protect your information from
              unauthorised access or disclosure. However, no internet transmission can be
              guaranteed to be 100% secure.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#5B0B1F] mb-3" style={{ fontWeight: 700 }}>
              Your Rights
            </h2>
            <p>
              You may request access, correction or deletion of your personal information
              at any time by contacting us using the details below.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#5B0B1F] mb-3" style={{ fontWeight: 700 }}>
              Updates to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. The latest version
              will always be available on this page.
            </p>
          </section>
        </div>

        {/* Contact block */}
        <div
          className="mt-12 rounded-2xl p-6 sm:p-8 border-2 shadow-md"
          style={{
            borderColor: "rgba(91,11,31,0.35)",
            background: "linear-gradient(135deg, #FFFFFF 0%, #F5EAD8 100%)",
          }}
        >
          <h2 className="font-serif text-2xl sm:text-3xl text-[#5B0B1F]" style={{ fontWeight: 700 }}>
            Questions about this policy?
          </h2>
          <p className="mt-2 text-[#3B0413] font-medium">
            Please contact us using any of the details below.
          </p>
          <div className="mt-5 grid sm:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-[#5B0B1F]/10 border-2 border-[#5B0B1F]/35 flex items-center justify-center text-[#5B0B1F] shrink-0">
                <Shield size={18} />
              </div>
              <div>
                <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#B8881A]" style={{ fontWeight: 700 }}>NAME</div>
                <div className="text-[#5B0B1F]" style={{ fontWeight: 600 }}>Newalkkar Saandiip</div>
              </div>
            </div>
            <a
              href="https://wa.me/919929059153"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 hover:bg-white/60 rounded-lg p-1 -m-1 transition-colors"
              data-testid="privacy-whatsapp"
            >
              <div className="h-10 w-10 rounded-full bg-[#25D366]/15 border-2 border-[#25D366]/45 flex items-center justify-center text-[#128C7E] shrink-0">
                <WhatsAppIcon size={18} />
              </div>
              <div>
                <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#B8881A]" style={{ fontWeight: 700 }}>WHATSAPP</div>
                <div className="text-[#5B0B1F]" style={{ fontWeight: 600 }}>+91 99290 59153</div>
              </div>
            </a>
            <a
              href="https://newalkkarsaandiip.in/"
              className="flex items-start gap-3 hover:bg-white/60 rounded-lg p-1 -m-1 transition-colors"
            >
              <div className="h-10 w-10 rounded-full bg-[#5B0B1F]/10 border-2 border-[#5B0B1F]/35 flex items-center justify-center text-[#5B0B1F] shrink-0">
                <Mail size={18} />
              </div>
              <div>
                <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#B8881A]" style={{ fontWeight: 700 }}>WEBSITE</div>
                <div className="text-[#5B0B1F]" style={{ fontWeight: 600 }}>newalkkarsaandiip.in</div>
              </div>
            </a>
          </div>
        </div>

        {/* Tiny footer line */}
        <div className="mt-10 text-center text-xs text-[#6B5567]">
          © {new Date().getFullYear()} Newalkkar Saandiip. All rights reserved.
        </div>
      </main>
    </div>
  );
}
