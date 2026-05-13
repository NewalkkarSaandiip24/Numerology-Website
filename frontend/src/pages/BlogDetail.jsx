import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Calendar, BookOpen } from "lucide-react";
import Logo from "../components/Logo";
import WhatsAppIcon from "../components/WhatsAppIcon";
import useSEO from "../hooks/useSEO";
import { publicApi, formatErr } from "../lib/api";

const fmtDate = (iso) => {
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
};

export default function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    setLoading(true);
    (async () => {
      try {
        const data = await publicApi.getBlog(slug);
        if (alive) setBlog(data);
      } catch (e) {
        if (alive) setError(formatErr(e));
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [slug]);

  useSEO({
    title: blog
      ? `${blog.title} | Numerology & Vastu Blog — Newalkkar Saandiip`
      : "Article | Newalkkar Saandiip Blog",
    description: blog
      ? (blog.content || "").slice(0, 158).replace(/\s+/g, " ").trim()
      : "Read articles on Numerology, Name Correction, Mobile Number Numerology, Business Name Numerology and Online Vastu Tips by Newalkkar Saandiip, India's trusted Numerologist & Vastu Consultant.",
    keywords:
      "Numerology Blog, Vastu Blog, Online Vastu Tips, Name Numerology, Mobile Number Numerology, Business Name Numerology, Kaal Sarp Dosh, Pitra Dosh, Newalkkar Saandiip, Best Numerologist in India",
    canonical: `https://newalkkarsaandiip.in/blogs/${slug}`,
    ogImage: blog?.image_base64?.startsWith("data:")
      ? "https://newalkkarsaandiip.in/saandiip-namaste.webp"
      : blog?.image_base64 || "https://newalkkarsaandiip.in/saandiip-namaste.webp",
  });

  // JSON-LD: BlogPosting
  useEffect(() => {
    const old = document.getElementById("blog-jsonld");
    if (old) old.remove();
    if (!blog) return;
    const data = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: blog.title,
      datePublished: blog.created_at,
      dateModified: blog.updated_at,
      author: {
        "@type": "Person",
        name: "Newalkkar Saandiip",
        url: "https://newalkkarsaandiip.in/",
      },
      publisher: {
        "@type": "Person",
        name: "Newalkkar Saandiip",
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `https://newalkkarsaandiip.in/blogs/${blog.slug}`,
      },
    };
    const s = document.createElement("script");
    s.type = "application/ld+json";
    s.id = "blog-jsonld";
    s.text = JSON.stringify(data);
    document.head.appendChild(s);
  }, [blog]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0F0518] text-[#F8F5F0]">
      <header className="border-b border-[#D4AF37]/15 bg-[#0F0518]/80 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-3" data-testid="blog-home-link">
            <Logo size={36} />
            <span className="font-serif text-base sm:text-lg" style={{ fontWeight: 500 }}>
              Numerology & Vastu Blog
            </span>
          </Link>
          <Link
            to="/blogs"
            data-testid="blog-back-link"
            className="inline-flex items-center gap-2 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[#C8BED6] hover:text-[#D4AF37] transition-colors"
          >
            <ArrowLeft size={14} /> All Articles
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {loading && (
          <div className="text-center text-[#C8BED6]/70 font-mono text-xs uppercase tracking-[0.2em] py-16">
            Loading…
          </div>
        )}

        {error && !loading && (
          <div data-testid="blog-error" className="px-4 py-3 rounded-lg border border-red-400/40 bg-red-500/10 text-red-200 text-sm">
            {error}
            <div className="mt-4">
              <Link to="/blogs" className="btn-ghost text-sm">
                <ArrowLeft size={14} /> Back to all articles
              </Link>
            </div>
          </div>
        )}

        {blog && !loading && (
          <article data-testid="blog-article">
            <div className="flex items-center gap-1.5 text-xs text-[#C8BED6]/70 font-mono uppercase tracking-[0.18em]">
              <Calendar size={11} /> {fmtDate(blog.created_at)}
            </div>
            <h1
              className="mt-4 font-serif text-3xl sm:text-4xl md:text-5xl leading-[1.1] tracking-tight"
              style={{ fontWeight: 500 }}
            >
              {blog.title}
            </h1>
            <div className="mt-4 inline-flex items-center gap-2 text-sm text-[#C8BED6]">
              <BookOpen size={14} className="text-[#D4AF37]" />
              by <span className="text-[#F3D060]">Newalkkar Saandiip</span>
            </div>

            {blog.image_base64 && (
              <div className="mt-7 rounded-2xl overflow-hidden border border-[#D4AF37]/25">
                <img
                  src={blog.image_base64}
                  alt={blog.title}
                  loading="eager"
                  decoding="async"
                  className="w-full h-auto"
                />
              </div>
            )}

            <div
              className="mt-8 text-[#F8F5F0] text-base sm:text-lg leading-[1.75] font-light whitespace-pre-wrap"
              data-testid="blog-content"
            >
              {blog.content}
            </div>

            {/* CTA */}
            <div
              className="mt-12 rounded-2xl border-2 p-6 sm:p-8"
              style={{
                borderColor: "rgba(212,175,55,0.55)",
                background:
                  "linear-gradient(135deg, rgba(212,175,55,0.16) 0%, rgba(147,112,219,0.14) 100%)",
              }}
            >
              <h2 className="font-serif text-xl sm:text-2xl text-[#F8F5F0]" style={{ fontWeight: 500 }}>
                Looking for guidance for <em className="gold-shimmer not-italic font-semibold">your</em> situation?
              </h2>
              <p className="mt-2 text-[#C8BED6] font-light">
                Book a personal consultation with Newalkkar Saandiip ji — Name Correction,
                Mobile Number, Business Name Numerology & Online Vastu Tips.
              </p>
              <a
                href="https://wa.me/919929059153?text=Namaste%20Newalkkar%20Saandiip%20ji%2C%20I%20read%20your%20blog%20and%20would%20like%20to%20book%20a%20personal%20consultation."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp mt-5 text-base"
                data-testid="blog-cta-whatsapp"
              >
                <WhatsAppIcon size={20} /> Book Consultation on WhatsApp
              </a>
            </div>

            <div className="mt-10">
              <Link
                to="/blogs"
                className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.22em] text-[#D4AF37] hover:text-[#F3D060]"
              >
                <ArrowLeft size={14} /> All articles <ArrowRight size={14} />
              </Link>
            </div>
          </article>
        )}
      </main>
    </div>
  );
}
