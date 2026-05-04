import React from "react";

/**
 * Sacred-geometry logo combining:
 *  - An outer lotus/compass ring (Vastu directional symbolism)
 *  - Interlocking triangles (Sri Yantra / cosmic balance)
 *  - A central stylised "9" — the master completion number (also reflecting "9929059153")
 * Drawn with gold strokes over transparent background.
 */
const Logo = ({ size = 64, showWordmark = false, className = "" }) => {
  const s = size;
  return (
    <div
      className={`logo-wrap group flex items-center gap-3 ${className}`}
      data-testid="brand-logo"
    >
      <div className="logo-mark relative">
        <span className="logo-glow" aria-hidden="true" />
        <svg
          width={s}
          height={s}
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Newalkkar Saandiip brand mark"
          className="relative z-[1] transition-transform duration-700 ease-out group-hover:scale-[1.08] group-hover:rotate-[8deg]"
        >
        <defs>
          <linearGradient id="goldGrad" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F3D060" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#A88326" />
          </linearGradient>
        </defs>

        {/* Outer ring */}
        <circle cx="60" cy="60" r="56" stroke="url(#goldGrad)" strokeWidth="1" opacity="0.6" />
        {/* Compass ticks - 8 directions (Vastu) */}
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i * 360) / 16;
          const rad = (angle * Math.PI) / 180;
          const x1 = 60 + Math.cos(rad) * 54;
          const y1 = 60 + Math.sin(rad) * 54;
          const x2 = 60 + Math.cos(rad) * (i % 2 === 0 ? 49 : 51);
          const y2 = 60 + Math.sin(rad) * (i % 2 === 0 ? 49 : 51);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="url(#goldGrad)"
              strokeWidth="1"
              opacity={i % 2 === 0 ? 0.9 : 0.4}
            />
          );
        })}

        {/* Inner decorative ring */}
        <circle cx="60" cy="60" r="44" stroke="url(#goldGrad)" strokeWidth="0.6" opacity="0.5" />

        {/* Sri Yantra inspired triangles */}
        <polygon points="60,22 92,78 28,78" stroke="url(#goldGrad)" strokeWidth="1" fill="none" opacity="0.85" />
        <polygon points="60,98 28,42 92,42" stroke="url(#goldGrad)" strokeWidth="1" fill="none" opacity="0.85" />

        {/* Central circle */}
        <circle cx="60" cy="60" r="16" stroke="url(#goldGrad)" strokeWidth="1" fill="rgba(15,5,24,0.85)" />

        {/* Central numeral — stylised N + 9 monogram */}
        <text
          x="60"
          y="67"
          textAnchor="middle"
          fontFamily="Cormorant Garamond, serif"
          fontSize="22"
          fontWeight="600"
          fill="url(#goldGrad)"
          letterSpacing="-1"
        >
          N9
        </text>
        </svg>
      </div>

      {showWordmark && (
        <div className="leading-tight transition-colors duration-500">
          <div
            className="font-serif text-base sm:text-lg md:text-xl tracking-tight whitespace-nowrap text-[#F8F5F0] group-hover:text-[#F3D060] transition-colors duration-500"
            style={{ fontWeight: 500 }}
          >
            Newalkkar Saandiip
          </div>
          <div
            className="font-serif italic text-[11px] sm:text-[12px] tracking-[0.06em] text-[#D4AF37]/85 group-hover:text-[#F3D060] transition-colors duration-500"
            style={{ fontWeight: 400 }}
          >
            numerology · vastu
          </div>
        </div>
      )}
    </div>
  );
};

export default Logo;
