import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck, PlayCircle, Video, Lock, RefreshCw, LogOut, Maximize2 } from "lucide-react";
import Logo from "../components/Logo";
import WhatsAppIcon from "../components/WhatsAppIcon";
import useSEO from "../hooks/useSEO";
import { publicApi, formatErr } from "../lib/api";

const STORAGE_KEY = "ns_recordings_mobile";
const WHATSAPP_NUMBER = "919929059153";

export default function Recordings() {
  useSEO({
    title: "Recorded Sessions · Newalkkar Saandiip — Private Client Portal",
    description:
      "Authorized clients can watch their recorded numerology, mobile numerology and Vaastu sessions with Newalkkar Saandiip ji. Access is restricted to mobile numbers approved by the administrator.",
    canonical: "https://newalkkarsaandiip.in/recordings",
    noindex: true,
  });

  const [mobile, setMobile] = useState(
    () => localStorage.getItem(STORAGE_KEY) || ""
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null); // { name, mobile, sections: [...] }
  const [activeSection, setActiveSection] = useState(null);
  const autoTried = React.useRef(false);

  const verify = React.useCallback(async (raw, silent = false) => {
    setError("");
    const m = (raw || "").replace(/\D/g, "");
    if (m.length !== 10) {
      if (!silent) setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    setLoading(true);
    try {
      const res = await publicApi.recordingsAccess(m);
      setData(res);
      setActiveSection(res?.sections?.[0]?.id || null);
      localStorage.setItem(STORAGE_KEY, m);
    } catch (e) {
      if (!silent) setError(formatErr(e));
      if (silent) localStorage.removeItem(STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-restore previously authorized mobile (once on mount)
  useEffect(() => {
    if (autoTried.current) return;
    autoTried.current = true;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && /^\d{10}$/.test(saved)) {
      verify(saved, true);
    }
  }, [verify]);

  const handleSubmit = (event) => {
    event.preventDefault();
    verify(mobile);
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setData(null);
    setMobile("");
    setActiveSection(null);
    setError("");
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0F0518] text-[#F8F5F0]">
      <div className="radial-glow w-[520px] h-[520px] -top-40 -left-40 bg-[#9370DB]/22" />
      <div className="radial-glow w-[480px] h-[480px] -bottom-40 -right-40 bg-[#D4AF37]/15" />

      {/* Header */}
      <header className="border-b border-[#D4AF37]/15 bg-[#0F0518]/80 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-3" data-testid="recordings-home-link">
            <Logo size={36} />
            <span className="font-serif text-base sm:text-lg" style={{ fontWeight: 500 }}>
              Recordings
            </span>
          </Link>
          {data ? (
            <button
              type="button"
              onClick={handleLogout}
              data-testid="recordings-logout-btn"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#D4AF37]/30 text-xs font-mono uppercase tracking-[0.2em] text-[#C8BED6] hover:text-[#D4AF37] hover:border-[#D4AF37] transition-colors"
            >
              <LogOut size={14} /> Sign out
            </button>
          ) : (
            <Link
              to="/"
              className="text-xs font-mono uppercase tracking-[0.22em] text-[#C8BED6] hover:text-[#D4AF37] inline-flex items-center gap-2"
            >
              <ArrowLeft size={14} /> Back
            </Link>
          )}
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {!data ? (
          <GateForm
            mobile={mobile}
            setMobile={setMobile}
            error={error}
            loading={loading}
            onSubmit={handleSubmit}
          />
        ) : (
          <Library
            data={data}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            onRefresh={() => verify(data.mobile, true)}
            loading={loading}
          />
        )}
      </main>
    </div>
  );
}

/* ============= Mobile gate form ============= */
function GateForm({ mobile, setMobile, error, loading, onSubmit }) {
  return (
    <div className="max-w-xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-full border border-[#D4AF37]/40 text-[#D4AF37] mb-5">
          <Lock size={22} strokeWidth={1.4} />
        </div>
        <div className="v-label mb-2">Private Client Portal</div>
        <h1
          className="font-serif text-3xl sm:text-4xl md:text-5xl leading-[1.1] tracking-tight"
          style={{ fontWeight: 400 }}
        >
          Recorded <span className="gold-shimmer">Sessions</span>
        </h1>
        <p className="mt-4 text-[#C8BED6] font-light leading-relaxed max-w-md mx-auto">
          Access is restricted to mobile numbers approved by{" "}
          <span className="text-[#F3D060]">Newalkkar Saandiip ji</span>. Please enter your
          authorized mobile number to view your recordings.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        data-testid="recordings-gate-form"
        className="glass-card p-6 sm:p-8"
      >
        <label className="v-label block mb-1.5">Your Authorized Mobile</label>
        <input
          type="tel"
          inputMode="tel"
          className="field-input"
          data-testid="recordings-mobile-input"
          placeholder="Enter 10-digit mobile number"
          value={mobile}
          onChange={(e) =>
            setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
          }
          autoComplete="tel"
        />

        {error && (
          <div
            data-testid="recordings-error"
            className="mt-4 px-3 py-2 rounded-lg border border-red-400/40 bg-red-500/10 text-red-200 text-sm"
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          data-testid="recordings-submit-btn"
          className="btn-gold w-full justify-center mt-5 disabled:opacity-50"
        >
          <ShieldCheck size={18} />
          {loading ? "Verifying…" : "Verify & View Recordings"}
        </button>

        <p className="mt-5 text-center text-[11px] font-mono uppercase tracking-[0.22em] text-[#C8BED6]/55">
          🔒 Your number is never shared or stored on a third-party server.
        </p>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm text-[#C8BED6] font-light">
          Not authorized yet?{" "}
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
              "Namaste Newalkkar Saandiip ji, please grant me access to the Recorded Sessions portal."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="recordings-request-access-link"
            className="text-[#F3D060] underline-offset-4 hover:underline inline-flex items-center gap-1.5"
          >
            <WhatsAppIcon size={14} /> Request access on WhatsApp
          </a>
        </p>
      </div>
    </div>
  );
}

/* ============= Library (sections + videos) ============= */
function Library({ data, activeSection, setActiveSection, onRefresh, loading }) {
  const sections = data.sections || [];
  const current = sections.find((s) => s.id === activeSection) || sections[0];

  if (!sections.length) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <Video size={36} className="mx-auto mb-4 text-[#D4AF37]/45" strokeWidth={1.3} />
        <div className="v-label mb-2">Welcome, {data.name || "Friend"}</div>
        <h2
          className="font-serif text-2xl sm:text-3xl text-[#F8F5F0] mb-3"
          style={{ fontWeight: 400 }}
        >
          No recordings yet
        </h2>
        <p className="text-[#C8BED6] font-light max-w-md mx-auto">
          Newalkkar Saandiip ji has not added any recordings for your number yet. Please
          check back later or contact the administrator on WhatsApp.
        </p>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 btn-whatsapp inline-flex"
          data-testid="recordings-empty-whatsapp"
        >
          <WhatsAppIcon size={18} /> Message on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <div className="v-label mb-2">Welcome back, {data.name || "Friend"}</div>
          <h1
            className="font-serif text-3xl sm:text-4xl tracking-tight"
            style={{ fontWeight: 400 }}
          >
            Your <span className="gold-shimmer">Recorded Sessions</span>
          </h1>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          data-testid="recordings-refresh-btn"
          className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-[#D4AF37]/30 text-xs font-mono uppercase tracking-[0.2em] text-[#C8BED6] hover:text-[#D4AF37] hover:border-[#D4AF37] transition-colors disabled:opacity-50 self-start"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {/* Section tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 -mx-1 px-1 border-b border-[#D4AF37]/15">
        {sections.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setActiveSection(s.id)}
            data-testid={`recordings-section-tab-${s.slug || s.id}`}
            className={`whitespace-nowrap px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.22em] transition-colors border-b-2 -mb-px ${
              current?.id === s.id
                ? "text-[#F3D060] border-[#D4AF37]"
                : "text-[#C8BED6]/60 border-transparent hover:text-[#C8BED6]"
            }`}
          >
            {s.name}
            <span className="ml-2 text-[#D4AF37]">{s.videos?.length || 0}</span>
          </button>
        ))}
      </div>

      {/* Videos grid */}
      {current && current.videos?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
          {current.videos.map((v) => (
            <VideoCard key={v.id} video={v} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-[#C8BED6]/60 border border-dashed border-[#D4AF37]/25 rounded-xl">
          No recordings in this section yet.
        </div>
      )}
    </div>
  );
}

/* ============= Helper: lazy-load YouTube IFrame API ============= */
let _ytReadyPromise = null;
function loadYouTubeAPI() {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT && window.YT.Player) return Promise.resolve(window.YT);
  if (_ytReadyPromise) return _ytReadyPromise;

  _ytReadyPromise = new Promise((resolve) => {
    const existingScript = document.getElementById("yt-iframe-api");
    if (!existingScript) {
      const tag = document.createElement("script");
      tag.id = "yt-iframe-api";
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    }
    const prevReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (typeof prevReady === "function") prevReady();
      resolve(window.YT);
    };
    // Safety: poll in case the global was already overwritten
    const poll = setInterval(() => {
      if (window.YT && window.YT.Player) {
        clearInterval(poll);
        resolve(window.YT);
      }
    }, 300);
  });
  return _ytReadyPromise;
}

function formatTime(s) {
  if (!s || !isFinite(s)) return "0:00";
  const total = Math.max(0, Math.floor(s));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const ss = String(total % 60).padStart(2, "0");
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${ss}` : `${m}:${ss}`;
}

function VideoCard({ video }) {
  const wrapperRef = useRef(null);
  const iframeRef = useRef(null);
  const playerRef = useRef(null);
  const barRef = useRef(null);
  const isPortrait = video.orientation === "portrait";

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [dragging, setDragging] = useState(false);

  const playerDomId = useMemo(() => `yt-player-${video.id}`, [video.id]);

  const blockContext = (e) => e.preventDefault();

  const goFullscreen = () => {
    const el = wrapperRef.current;
    if (!el) return;
    const req =
      el.requestFullscreen ||
      el.webkitRequestFullscreen ||
      el.msRequestFullscreen;
    if (req) req.call(el);
  };

  // Bottom is fully covered by the violet strip — only top + bottom 22% are clipped
  const videoClipPath = "polygon(0 16%, 100% 16%, 100% 78%, 0 78%)";

  // Initialize YT player
  useEffect(() => {
    let cancelled = false;
    let pollId = null;

    loadYouTubeAPI().then((YT) => {
      if (cancelled || !iframeRef.current || !YT) return;
      try {
        playerRef.current = new YT.Player(iframeRef.current, {
          events: {
            onReady: (e) => {
              if (cancelled) return;
              try {
                setDuration(e.target.getDuration() || 0);
              } catch {}
              setIsReady(true);
            },
          },
        });
      } catch (err) {
        // ignore — player will simply not have JS control
      }
    });

    return () => {
      cancelled = true;
      if (pollId) clearInterval(pollId);
      try {
        playerRef.current?.destroy?.();
      } catch {}
      playerRef.current = null;
    };
  }, []);

  // Poll currentTime + duration
  useEffect(() => {
    if (!isReady) return;
    const id = setInterval(() => {
      try {
        const p = playerRef.current;
        if (!p?.getCurrentTime) return;
        if (!dragging) setCurrentTime(p.getCurrentTime() || 0);
        const d = p.getDuration?.() || 0;
        if (d && d !== duration) setDuration(d);
      } catch {}
    }, 400);
    return () => clearInterval(id);
  }, [isReady, dragging, duration]);

  const seekFromEvent = useCallback(
    (evt) => {
      if (!playerRef.current?.seekTo || !duration || !barRef.current) return;
      const rect = barRef.current.getBoundingClientRect();
      const clientX = evt.touches?.[0]?.clientX ?? evt.clientX;
      const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const target = pct * duration;
      try {
        playerRef.current.seekTo(target, true);
      } catch {}
      setCurrentTime(target);
    },
    [duration]
  );

  const startDrag = (e) => {
    e.preventDefault();
    setDragging(true);
    seekFromEvent(e);
  };
  const onMove = (e) => {
    if (dragging) seekFromEvent(e);
  };
  const endDrag = () => setDragging(false);

  // Attach global listeners during drag
  useEffect(() => {
    if (!dragging) return;
    const mm = (e) => seekFromEvent(e);
    const mu = () => setDragging(false);
    window.addEventListener("mousemove", mm);
    window.addEventListener("mouseup", mu);
    window.addEventListener("touchmove", mm, { passive: false });
    window.addEventListener("touchend", mu);
    return () => {
      window.removeEventListener("mousemove", mm);
      window.removeEventListener("mouseup", mu);
      window.removeEventListener("touchmove", mm);
      window.removeEventListener("touchend", mu);
    };
  }, [dragging, seekFromEvent]);

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div
      data-testid={`recordings-video-${video.id}`}
      className="glass-card overflow-hidden flex flex-col"
      onContextMenu={blockContext}
    >
      <div
        className={
          isPortrait
            ? "mx-auto w-full max-w-[340px] sm:max-w-[400px]"
            : "w-full"
        }
      >
        <div
          ref={wrapperRef}
          className={`${
            isPortrait ? "aspect-[9/16]" : "aspect-video"
          } relative select-none group fs-target`}
          style={{
            background:
              "radial-gradient(ellipse at center, #1A0B2E 0%, #0A0212 100%)",
          }}
        >
          <iframe
            ref={iframeRef}
            id={playerDomId}
            src={`https://www.youtube.com/embed/${video.youtube_id}?rel=0&modestbranding=1&iv_load_policy=3&playsinline=1&fs=0&disablekb=1&enablejsapi=1`}
            title={video.title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            className="absolute inset-0 w-full h-full"
            style={{ clipPath: videoClipPath, WebkitClipPath: videoClipPath }}
          />

          {/* Top frame — hides YouTube title bar AND carries the custom seek bar */}
          <div
            aria-hidden="true"
            className="absolute top-0 inset-x-0 h-[16%] z-10 pointer-events-auto px-3 sm:px-4 flex flex-col justify-between py-1.5 sm:py-2"
            style={{
              background:
                "linear-gradient(180deg, #0F0518 0%, #19082b 70%, rgba(212,175,55,0.18) 100%)",
              borderBottom: "1px solid rgba(212,175,55,0.35)",
            }}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[8px] sm:text-[10px] uppercase tracking-[0.22em] text-[#F3D060]/85 truncate">
                Private · Newalkkar Saandiip
              </span>
              <span className="font-mono text-[9px] sm:text-[11px] text-[#F3D060]/85 tabular-nums shrink-0">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* Custom scrubber */}
            <div
              ref={barRef}
              role="slider"
              aria-label="Video progress"
              aria-valuemin={0}
              aria-valuemax={Math.max(1, Math.floor(duration))}
              aria-valuenow={Math.floor(currentTime)}
              tabIndex={0}
              onMouseDown={startDrag}
              onTouchStart={startDrag}
              onMouseMove={onMove}
              onMouseUp={endDrag}
              data-testid={`recordings-seekbar-${video.id}`}
              className="relative h-2 sm:h-2.5 mx-0.5 rounded-full cursor-pointer overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.10)",
                touchAction: "none",
              }}
            >
              <div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  width: `${progress}%`,
                  background:
                    "linear-gradient(90deg, #D4AF37 0%, #F3D060 100%)",
                  boxShadow: "0 0 6px rgba(212,175,55,0.55)",
                }}
              />
              <div
                className="absolute top-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 -translate-y-1/2 -translate-x-1/2 rounded-full bg-[#F3D060] border border-[#1A0B2E] shadow-[0_0_6px_rgba(212,175,55,0.85)] pointer-events-none"
                style={{ left: `${progress}%`, display: duration ? "block" : "none" }}
              />
            </div>
          </div>

          {/* Continuous bottom strip — hides the YouTube control bar (scrubber, share, "Watch on YouTube") */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-[22%] z-10 pointer-events-auto"
            style={{
              background:
                "linear-gradient(180deg, #19082b 0%, #0F0518 55%, #0A0212 100%)",
              borderTop: "1px solid rgba(212,175,55,0.32)",
              boxShadow: "inset 0 1px 0 rgba(212,175,55,0.18)",
            }}
          >
            <div className="absolute bottom-2 right-4 flex items-center gap-2">
              <span className="font-serif italic text-[11px] sm:text-xs text-[#F3D060]/90 tracking-wide">
                Newalkkar Saandiip
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37] shadow-[0_0_6px_#D4AF37]" />
            </div>
          </div>

          {/* Maximize button — always visible on touch; hover on desktop */}
          <button
            type="button"
            onClick={goFullscreen}
            data-testid={`recordings-fullscreen-${video.id}`}
            aria-label="Maximize video"
            className="absolute bottom-1.5 left-2 z-30 h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-black/65 hover:bg-black/85 active:bg-black/90 backdrop-blur-sm border border-[#D4AF37]/55 text-[#F3D060] flex items-center justify-center transition-opacity opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100"
          >
            <Maximize2 size={13} strokeWidth={2} />
          </button>
        </div>
      </div>
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-2 mb-1">
          <PlayCircle size={16} className="text-[#D4AF37] mt-1 shrink-0" />
          <h3
            className="font-serif text-base sm:text-lg text-[#F8F5F0] leading-snug"
            style={{ fontWeight: 500 }}
          >
            {video.title}
          </h3>
        </div>
        {video.description && (
          <p className="mt-2 text-sm text-[#C8BED6] font-light leading-relaxed whitespace-pre-line">
            {video.description}
          </p>
        )}
      </div>
    </div>
  );
}
