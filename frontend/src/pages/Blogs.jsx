import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, BookOpen, Calendar } from "lucide-react";
import Logo from "../components/Logo";
import useSEO from "../hooks/useSEO";
import { publicApi, formatErr } from "../lib/api";

const fmtDate = (iso) => {
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
};

const stripToExcerpt = (s, max = 180) => {
  if (!s) return "";
  const t = s.replace(/\s+/g, " ").trim();
  return t.length > max ? t.slice(0, max - 1) + "…" : t;
};

export default function Blogs() {
  useSEO({
    title:
      "Numerology & Vastu Blog | Newalkkar Saandiip — Best Numerologist in India",
    description:
      "Read the latest articles on Numerology, Name Correction, Mobile Number Numerology, Business Name Numerology, Online Vastu Tips, Kaal Sarp Dosh and Pitra Dosh remedies — written by Newalkkar Saandiip, India's trusted Numerologist & Vastu Consultant.",
    keywords:
      "Numerology Blog, Vastu Blog, Best Numerologist in India Blog, Online Vastu Tips, Mobile Number Numerology articles, Name Correction blog, Business Name Numerology blog, Kaal Sarp Dosh remedies blog, Pitra Dosh remedies blog, Online Numerology Consultation tips, Chaldean Numerology, Lucky Mobile Number tips, Newalkkar Saandiip blog, Numerologist for Business, Numerologist for Marriage, Numerologist for Career, Indian Vastu Consultant blog",
    canonical: "https://newalkkarsaandiip.in/blogs",
    ogImage: "https://newalkkarsaandiip.in/saandiip-namaste.webp",
  });

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await publicApi.listBlogs();
        if (alive) setBlogs(data);
      } catch (e) {
        if (alive) setError(formatErr(e));
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Per-page JSON-LD: ItemList of BlogPostings
  useEffect(() => {
    const old = document.getElementById("blogs-jsonld");
    if (old) old.remove();
    if (!blogs.length) return;
    const data = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: blogs.map((b, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `https://newalkkarsaandiip.in/blogs/${b.slug}`,
        name: b.title,
      })),
    };
    const s = document.createElement("script");
    s.type = "application/ld+json";
    s.id = "blogs-jsonld";
    s.text = JSON.stringify(data);
    document.head.appendChild(s);
  }, [blogs]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0F0518] text-[#F8F5F0]">
      <header className="border-b border-[#D4AF37]/15 bg-[#0F0518]/80 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-3" data-testid="blogs-home-link">
            <Logo size={36} />
            <span className="font-serif text-base sm:text-lg" style={{ fontWeight: 500 }}>
              Numerology & Vastu Blog
            </span>
          </Link>
          <Link
            to="/"
            data-testid="blogs-back-link"
            className="inline-flex items-center gap-2 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[#C8BED6] hover:text-[#D4AF37] transition-colors"
          >
            <ArrowLeft size={14} /> Home
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-[1px] w-10 bg-[#D4AF37]" />
            <span className="v-label">Insights & Articles</span>
          </div>
          <h1
            className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight"
            style={{ fontWeight: 400 }}
          >
            Numerology, Vastu &{" "}
            <em className="gold-shimmer not-italic font-medium">
              Mobile Number Wisdom
            </em>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-[#C8BED6] font-light leading-relaxed">
            Practical articles on Name Numerology, Mobile Number Numerology, Business
            Name corrections, Online Vastu Tips and dosh remedies — written by
            <span className="text-[#F3D060]"> Newalkkar Saandiip</span>, India's
            trusted Numerologist & Vastu Consultant.
          </p>
        </div>

        {loading && (
          <div className="mt-14 text-center text-[#C8BED6]/70 font-mono text-xs uppercase tracking-[0.2em]">
            Loading articles…
          </div>
        )}

        {error && !loading && (
          <div data-testid="blogs-error" className="mt-10 max-w-2xl mx-auto px-4 py-3 rounded-lg border border-red-400/40 bg-red-500/10 text-red-200 text-sm">
            {error}
          </div>
        )}

        {!loading && !blogs.length && !error && (
          <div data-testid="blogs-empty" className="mt-16 glass-card p-8 sm:p-10 text-center max-w-2xl mx-auto">
            <BookOpen size={32} className="text-[#D4AF37] mx-auto mb-4" strokeWidth={1.3} />
            <h2 className="font-serif text-2xl sm:text-3xl text-[#F8F5F0]" style={{ fontWeight: 500 }}>
              Articles coming soon
            </h2>
            <p className="mt-3 text-[#C8BED6] font-light">
              Newalkkar Saandiip ji is preparing the first set of articles on
              Numerology, Vastu and Mobile Number guidance. Please check back shortly.
            </p>
          </div>
        )}

        {!loading && blogs.length > 0 && (
          <div className="mt-12 sm:mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8" data-testid="blogs-grid">
            {blogs.map((b) => (
              <Link
                key={b.id}
                to={`/blogs/${b.slug}`}
                data-testid={`blog-card-${b.slug}`}
                className="glass-card overflow-hidden flex flex-col group hover:border-[#D4AF37]/55 transition-all"
              >
                <div className="aspect-[16/10] bg-gradient-to-br from-[#1A0B2E] to-[#0F0518] overflow-hidden">
                  {b.image_base64 ? (
                    <img
                      src={b.image_base64}
                      alt={b.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen size={36} className="text-[#D4AF37]/45" strokeWidth={1.2} />
                    </div>
                  )}
                </div>
                <div className="p-5 sm:p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-1.5 text-xs text-[#C8BED6]/70 font-mono uppercase tracking-[0.18em]">
                    <Calendar size={11} /> {fmtDate(b.created_at)}
                  </div>
                  <h2
                    className="mt-3 font-serif text-xl sm:text-2xl text-[#F8F5F0] leading-tight"
                    style={{ fontWeight: 500 }}
                  >
                    {b.title}
                  </h2>
                  <p className="mt-3 text-sm sm:text-[15px] text-[#C8BED6] font-light leading-relaxed flex-1">
                    {stripToExcerpt(b.content)}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-[#D4AF37] group-hover:text-[#F3D060] transition-colors">
                    Read article <ArrowRight size={13} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
