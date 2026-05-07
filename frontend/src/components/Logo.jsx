import React from "react";

/**
 * Brand mark: uses the user's own logo image (Newalkkar Saandiip — NS gold/silver monogram).
 * Includes a soft golden halo glow that intensifies on hover.
 */
const Logo = ({ size = 56, className = "", asLink = false }) => {
  return (
    <div
      className={`logo-wrap group inline-flex items-center ${className}`}
      data-testid="brand-logo"
    >
      <span className="logo-mark relative inline-flex items-center justify-center">
        <span className="logo-glow logo-glow-bright" aria-hidden="true" />
        <img
          src="/logo.png"
          alt="Newalkkar Saandiip — Numerology, Vaastu, Mobile Numerology"
          width={size}
          height={size}
          className="relative z-[1] rounded-[14%] transition-transform duration-700 ease-out group-hover:scale-[1.08]"
          style={{ width: size, height: size, objectFit: "cover" }}
        />
      </span>
    </div>
  );
};

export default Logo;
