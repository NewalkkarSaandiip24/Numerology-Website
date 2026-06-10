import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, History, RefreshCw, LogOut, Lock, Phone, User, Calendar, Shield, BookOpen, Image as ImageIcon, X, Video, Film, Link as LinkIcon, Folder, Pencil } from "lucide-react";
import Logo from "../components/Logo";
import useSEO from "../hooks/useSEO";
import { adminApi, getToken, clearToken, formatErr } from "../lib/api";

export default function AdminPage() {
  useSEO({
    title: "Admin · Newalkkar Saandiip",
    description: "Admin panel — restricted access.",
    canonical: "https://newalkkarsaandiip.in/admin",
  });

  const [authed, setAuthed] = useState(!!getToken());
  const [tab, setTab] = useState("active");
  const [active, setActive] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ mobile: "", name: "", expires_on: "" });

  const refresh = async () => {
    setError("");
    setLoading(true);
    try {
      const [a, h] = await Promise.all([adminApi.listUsers(), adminApi.history()]);
      setActive(a);
      setHistory(h);
    } catch (e) {
      if (e?.response?.status === 401) {
        clearToken();
        setAuthed(false);
      } else setError(formatErr(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authed) refresh();
    // eslint-disable-next-line
  }, [authed]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    if (!/^\d{10}$/.test(form.mobile)) {
      setError("Mobile must be exactly 10 digits.");
      return;
    }
    if (!form.name.trim()) {
      setError("Please enter a name.");
      return;
    }
    if (!form.expires_on) {
      setError("Please pick an expiry date.");
      return;
    }
    try {
      await adminApi.addUser(form);
      setForm({ mobile: "", name: "", expires_on: "" });
      setAdding(false);
      refresh();
    } catch (e) {
      setError(formatErr(e));
    }
  };

  const handleRemove = async (id, name) => {
    if (!window.confirm(`Remove access for ${name}?`)) return;
    try {
      await adminApi.removeUser(id);
      refresh();
    } catch (e) {
      setError(formatErr(e));
    }
  };

  const handleLogout = () => {
    clearToken();
    setAuthed(false);
  };

  if (!authed) return <LoginForm onAuthed={() => setAuthed(true)} />;

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0F0518] text-[#F8F5F0]">
      <header className="border-b border-[#D4AF37]/15 bg-[#0F0518]/80 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-3" data-testid="admin-home-link">
            <Logo size={36} />
            <span className="font-serif text-base sm:text-lg" style={{ fontWeight: 500 }}>Admin Panel</span>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            data-testid="admin-logout-btn"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#D4AF37]/30 text-xs font-mono uppercase tracking-[0.2em] text-[#C8BED6] hover:text-[#D4AF37] hover:border-[#D4AF37] transition-colors"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            <div className="v-label mb-2">Authorized Mobile Numbers</div>
            <h1 className="font-serif text-3xl sm:text-4xl" style={{ fontWeight: 400 }}>
              Manage <span className="gold-shimmer">Compatibility Access</span>
            </h1>
            <p className="mt-2 text-sm text-[#C8BED6] font-light max-w-xl">
              Authorize a client's mobile number to use the Mobile Number Compatibility checker.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={refresh}
              disabled={loading}
              data-testid="admin-refresh-btn"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-[#D4AF37]/30 text-xs font-mono uppercase tracking-[0.2em] text-[#C8BED6] hover:text-[#D4AF37] hover:border-[#D4AF37] transition-colors disabled:opacity-50"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
            </button>
            <button
              type="button"
              onClick={() => setAdding((v) => !v)}
              data-testid="admin-add-btn"
              className="btn-gold text-sm"
            >
              <Plus size={16} /> Add Mobile
            </button>
          </div>
        </div>

        {adding && (
          <form
            onSubmit={handleAdd}
            data-testid="admin-add-form"
            className="glass-card p-5 sm:p-6 mb-6"
          >
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="v-label block mb-1.5">Mobile (10 digits)</label>
                <input
                  type="tel"
                  inputMode="tel"
                  className="field-input"
                  data-testid="admin-form-mobile"
                  placeholder="9876543210"
                  value={form.mobile}
                  onChange={(e) => setForm({ ...form, mobile: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                />
              </div>
              <div>
                <label className="v-label block mb-1.5">Client Name</label>
                <input
                  type="text"
                  className="field-input"
                  data-testid="admin-form-name"
                  placeholder="Full name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <label className="v-label block mb-1.5">Access Until</label>
                <input
                  type="date"
                  className="field-input"
                  data-testid="admin-form-expiry"
                  min={new Date().toISOString().split("T")[0]}
                  value={form.expires_on}
                  onChange={(e) => setForm({ ...form, expires_on: e.target.value })}
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-5">
              <button type="submit" className="btn-gold" data-testid="admin-form-submit">
                <Plus size={16} /> Authorize
              </button>
              <button
                type="button"
                onClick={() => { setAdding(false); setForm({ mobile: "", name: "", expires_on: "" }); }}
                className="btn-ghost"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {error && (
          <div data-testid="admin-error" className="mb-4 px-4 py-3 rounded-lg border border-red-400/40 bg-red-500/10 text-red-200 text-sm">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-[#D4AF37]/20 mb-5">
          <TabBtn active={tab === "active"} onClick={() => setTab("active")} testid="tab-active">
            Active <span className="ml-2 text-[#D4AF37]">{active.length}</span>
          </TabBtn>
          <TabBtn active={tab === "history"} onClick={() => setTab("history")} testid="tab-history">
            <History size={14} className="inline mr-1" /> Removed <span className="ml-2 text-[#D4AF37]">{history.length}</span>
          </TabBtn>
        </div>

        {/* Table */}
        <UserTable rows={tab === "active" ? active : history} mode={tab} onRemove={handleRemove} loading={loading} />

        {/* ===== Blog Management Section ===== */}
        <BlogManager />

        {/* ===== Recordings Management Section ===== */}
        <RecordingsManager />
      </main>
    </div>
  );
}

const TabBtn = ({ active, onClick, children, testid }) => (
  <button
    type="button"
    onClick={onClick}
    data-testid={testid}
    className={`px-4 py-3 font-mono text-[11px] uppercase tracking-[0.22em] transition-colors border-b-2 ${
      active ? "text-[#F3D060] border-[#D4AF37]" : "text-[#C8BED6]/60 border-transparent hover:text-[#C8BED6]"
    }`}
  >
    {children}
  </button>
);

const UserTable = ({ rows, mode, onRemove, loading }) => {
  if (loading && rows.length === 0)
    return <div className="text-center py-12 text-[#C8BED6]/70 font-mono text-xs uppercase tracking-[0.2em]">Loading…</div>;
  if (!rows.length)
    return <div className="text-center py-16 text-[#C8BED6]/60">No records yet.</div>;
  return (
    <div className="overflow-x-auto rounded-xl border border-[#D4AF37]/15">
      <table className="w-full text-sm">
        <thead className="bg-[#1A0B2E]/60">
          <tr className="text-left">
            <th className="p-3 font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] text-[#F3D060]">Mobile</th>
            <th className="p-3 font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] text-[#F3D060]">Name</th>
            <th className="p-3 font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] text-[#F3D060]">{mode === "active" ? "Authorized On" : "Removed On"}</th>
            <th className="p-3 font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] text-[#F3D060]">Expires</th>
            {mode === "active" && <th className="p-3"></th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((u) => (
            <tr key={u.id} data-testid={`row-${u.mobile}`} className="border-t border-[#D4AF37]/10 hover:bg-[#D4AF37]/5">
              <td className="p-3 font-mono text-[#F8F5F0]">{u.mobile}</td>
              <td className="p-3 text-[#F8F5F0]">{u.name}</td>
              <td className="p-3 text-[#C8BED6]/85 text-xs">{formatDateTime(mode === "active" ? u.authorized_at : u.removed_at)}</td>
              <td className="p-3 text-[#C8BED6]/85 text-xs">{u.expires_on}</td>
              {mode === "active" && (
                <td className="p-3 text-right">
                  <button
                    type="button"
                    onClick={() => onRemove(u.id, u.name)}
                    data-testid={`row-remove-${u.mobile}`}
                    className="inline-flex items-center gap-1.5 text-xs text-red-300 hover:text-red-200 transition-colors px-2 py-1 rounded border border-red-400/30 hover:border-red-400/60"
                  >
                    <Trash2 size={12} /> Remove
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

function formatDateTime(iso) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return iso;
  }
}

/* ============= Blog Manager (admin) ============= */
function BlogManager() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [imageName, setImageName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const refresh = async () => {
    setError("");
    setLoading(true);
    try {
      const data = await adminApi.listBlogs ? await adminApi.listBlogs() : await publicListBlogs();
      setBlogs(data);
    } catch (e) {
      setError(formatErr(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line
  }, []);

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (f.size > 2 * 1024 * 1024) {
      setError("Image is over 2 MB. Please choose a smaller image.");
      return;
    }
    const r = new FileReader();
    r.onload = () => {
      setImageBase64(r.result);
      setImageName(f.name);
      setError("");
    };
    r.readAsDataURL(f);
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setImageBase64("");
    setImageName("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (title.trim().length < 2) {
      setError("Please enter a title.");
      return;
    }
    if (content.trim().length < 2) {
      setError("Please enter the blog content.");
      return;
    }
    setSubmitting(true);
    try {
      await adminApi.createBlog({
        title: title.trim(),
        content: content.trim(),
        image_base64: imageBase64 || null,
      });
      resetForm();
      setShowForm(false);
      await refresh();
    } catch (e) {
      setError(formatErr(e));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete the blog "${title}"? This cannot be undone.`)) return;
    try {
      await adminApi.deleteBlog(id);
      await refresh();
    } catch (e) {
      setError(formatErr(e));
    }
  };

  return (
    <section className="mt-14" data-testid="blog-manager">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <div className="v-label mb-2">Numerology & Vastu Blog</div>
          <h2 className="font-serif text-2xl sm:text-3xl" style={{ fontWeight: 400 }}>
            Manage <span className="gold-shimmer">Blogs</span>
          </h2>
          <p className="mt-2 text-sm text-[#C8BED6] font-light max-w-2xl">
            Publish articles to the public Blogs page. Add a heading, an optional cover image and the content body.
            Each blog also has its own SEO page automatically.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          data-testid="blog-add-btn"
          className="btn-gold text-sm"
        >
          <Plus size={16} /> {showForm ? "Cancel" : "Add Blog"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} data-testid="blog-form" className="glass-card p-5 sm:p-6 mb-6">
          <div className="space-y-5">
            {/* Title with clear button */}
            <div>
              <label className="v-label block mb-1.5">Blog Heading / Title</label>
              <div className="relative">
                <input
                  type="text"
                  className="field-input pr-10"
                  data-testid="blog-form-title"
                  placeholder="e.g. How a Lucky Mobile Number Can Change Your Life"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={200}
                />
                {title && (
                  <button
                    type="button"
                    onClick={() => setTitle("")}
                    data-testid="blog-form-title-clear"
                    aria-label="Clear title"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full hover:bg-[#D4AF37]/15 text-[#C8BED6] hover:text-[#D4AF37] flex items-center justify-center transition-colors"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Image upload */}
            <div>
              <label className="v-label block mb-1.5">Cover Image (optional, max 2 MB)</label>
              {!imageBase64 ? (
                <label
                  htmlFor="blog-image-input"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg border border-dashed border-[#D4AF37]/40 hover:border-[#D4AF37]/70 hover:bg-[#D4AF37]/5 cursor-pointer transition-colors"
                >
                  <ImageIcon size={18} className="text-[#D4AF37]" />
                  <span className="text-sm text-[#C8BED6] font-light">
                    Click to upload an image (JPG / PNG / WebP)
                  </span>
                  <input
                    id="blog-image-input"
                    data-testid="blog-form-image"
                    type="file"
                    accept="image/*"
                    onChange={handleFile}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="flex items-start gap-4 p-3 rounded-lg border border-[#D4AF37]/30 bg-[#D4AF37]/5">
                  <img src={imageBase64} alt={imageName} className="w-24 h-24 object-cover rounded-md border border-[#D4AF37]/30" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-[#F8F5F0] truncate">{imageName}</div>
                    <div className="text-xs text-[#C8BED6]/70 mt-1">Image attached</div>
                    <button
                      type="button"
                      onClick={() => { setImageBase64(""); setImageName(""); }}
                      data-testid="blog-form-image-clear"
                      className="mt-2 inline-flex items-center gap-1.5 text-xs text-red-300 hover:text-red-200 transition-colors px-2 py-1 rounded border border-red-400/30 hover:border-red-400/60"
                    >
                      <Trash2 size={12} /> Remove image
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Content with clear button */}
            <div>
              <label className="v-label block mb-1.5">Content / Body</label>
              <div className="relative">
                <textarea
                  rows={8}
                  className="field-input pr-10"
                  data-testid="blog-form-content"
                  placeholder="Write your article here — use blank lines to separate paragraphs."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  maxLength={20000}
                />
                {content && (
                  <button
                    type="button"
                    onClick={() => setContent("")}
                    data-testid="blog-form-content-clear"
                    aria-label="Clear content"
                    className="absolute right-2 top-2 h-7 w-7 rounded-full hover:bg-[#D4AF37]/15 text-[#C8BED6] hover:text-[#D4AF37] flex items-center justify-center transition-colors"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
              <div className="mt-1 text-xs text-[#C8BED6]/60 font-mono">
                {content.length} / 20000
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                type="submit"
                disabled={submitting}
                data-testid="blog-form-submit"
                className="btn-gold disabled:opacity-50"
              >
                <Plus size={16} /> {submitting ? "Publishing…" : "Publish Blog"}
              </button>
              <button
                type="button"
                onClick={() => { resetForm(); setShowForm(false); }}
                className="btn-ghost"
              >
                Cancel
              </button>
            </div>

            {error && (
              <div data-testid="blog-form-error" className="px-3 py-2 rounded-lg border border-red-400/40 bg-red-500/10 text-red-200 text-xs">
                {error}
              </div>
            )}
          </div>
        </form>
      )}

      {!showForm && error && (
        <div className="mb-4 px-4 py-3 rounded-lg border border-red-400/40 bg-red-500/10 text-red-200 text-sm">
          {error}
        </div>
      )}

      {/* Blog list */}
      {loading && blogs.length === 0 ? (
        <div className="text-center py-10 text-[#C8BED6]/70 font-mono text-xs uppercase tracking-[0.2em]">
          Loading…
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-10 text-[#C8BED6]/60 border border-dashed border-[#D4AF37]/25 rounded-xl">
          <BookOpen size={28} className="mx-auto mb-3 text-[#D4AF37]/45" strokeWidth={1.3} />
          No blogs yet. Click <span className="text-[#D4AF37]">Add Blog</span> above to publish your first article.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {blogs.map((b) => (
            <div
              key={b.id}
              data-testid={`blog-row-${b.slug}`}
              className="glass-card overflow-hidden flex"
            >
              <div className="w-28 sm:w-32 shrink-0 bg-gradient-to-br from-[#1A0B2E] to-[#0F0518] flex items-center justify-center">
                {b.image_base64 ? (
                  <img src={b.image_base64} alt={b.title} className="w-full h-full object-cover" />
                ) : (
                  <BookOpen size={24} className="text-[#D4AF37]/40" strokeWidth={1.2} />
                )}
              </div>
              <div className="flex-1 p-4 flex flex-col min-w-0">
                <div className="font-serif text-base sm:text-lg text-[#F8F5F0] line-clamp-2" style={{ fontWeight: 500 }}>
                  {b.title}
                </div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[#C8BED6]/60">
                  {formatDateTime(b.created_at)}
                </div>
                <p className="mt-2 text-xs text-[#C8BED6] line-clamp-2 font-light">{b.content}</p>
                <div className="mt-auto pt-3 flex items-center gap-3">
                  <Link
                    to={`/blogs/${b.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono uppercase tracking-[0.2em] text-[#D4AF37] hover:text-[#F3D060]"
                    data-testid={`blog-row-view-${b.slug}`}
                  >
                    View →
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(b.id, b.title)}
                    data-testid={`blog-row-delete-${b.slug}`}
                    className="ml-auto inline-flex items-center gap-1.5 text-xs text-red-300 hover:text-red-200 transition-colors px-2 py-1 rounded border border-red-400/30 hover:border-red-400/60"
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// Fallback list helper if adminApi doesn't have listBlogs (defensive)
async function publicListBlogs() {
  const { publicApi } = await import("../lib/api");
  return publicApi.listBlogs();
}

/* ============= Recordings Manager (admin) ============= */
function RecordingsManager() {
  const [sections, setSections] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSecForm, setShowSecForm] = useState(false);
  const [secName, setSecName] = useState("");
  const [showVidForm, setShowVidForm] = useState(false);
  const [vidForm, setVidForm] = useState({
    section_id: "",
    title: "",
    youtube_url: "",
    description: "",
    allowed_mobiles: "",
  });
  const [editingVideo, setEditingVideo] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const refresh = async () => {
    setError("");
    setLoading(true);
    try {
      const [s, v] = await Promise.all([
        adminApi.listSections(),
        adminApi.listAllVideos(),
      ]);
      setSections(s);
      setVideos(v);
    } catch (e) {
      setError(formatErr(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line
  }, []);

  const handleAddSection = async (e) => {
    e.preventDefault();
    setError("");
    if (secName.trim().length < 2) {
      setError("Please enter a section name.");
      return;
    }
    try {
      await adminApi.createSection({ name: secName.trim() });
      setSecName("");
      setShowSecForm(false);
      await refresh();
    } catch (e) {
      setError(formatErr(e));
    }
  };

  const handleDeleteSection = async (id, name) => {
    if (
      !window.confirm(
        `Delete section "${name}"? All videos inside this section will also be removed.`
      )
    )
      return;
    try {
      await adminApi.deleteSection(id);
      await refresh();
    } catch (e) {
      setError(formatErr(e));
    }
  };

  const openAddVideo = (section_id = "") => {
    setEditingVideo(null);
    setVidForm({
      section_id: section_id || sections[0]?.id || "",
      title: "",
      youtube_url: "",
      description: "",
      allowed_mobiles: "",
    });
    setShowVidForm(true);
  };

  const openEditVideo = (v) => {
    setEditingVideo(v);
    setVidForm({
      section_id: v.section_id,
      title: v.title,
      youtube_url: `https://youtu.be/${v.youtube_id}`,
      description: v.description || "",
      allowed_mobiles: (v.allowed_mobiles || []).join(", "),
    });
    setShowVidForm(true);
  };

  const handleVidSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const mobiles = vidForm.allowed_mobiles
      .split(/[\s,]+/)
      .map((m) => m.replace(/\D/g, ""))
      .filter((m) => m.length === 10);

    if (!vidForm.title.trim()) return setError("Please enter a video title.");
    if (editingVideo) {
      setSubmitting(true);
      try {
        await adminApi.updateVideo(editingVideo.id, {
          title: vidForm.title.trim(),
          description: vidForm.description.trim(),
          allowed_mobiles: mobiles,
        });
        setShowVidForm(false);
        setEditingVideo(null);
        await refresh();
      } catch (e) {
        setError(formatErr(e));
      } finally {
        setSubmitting(false);
      }
      return;
    }

    if (!vidForm.section_id) return setError("Please pick a section.");
    if (!vidForm.youtube_url.trim()) return setError("Please paste a YouTube URL.");

    setSubmitting(true);
    try {
      await adminApi.createVideo({
        section_id: vidForm.section_id,
        title: vidForm.title.trim(),
        youtube_url: vidForm.youtube_url.trim(),
        description: vidForm.description.trim(),
        allowed_mobiles: mobiles,
      });
      setShowVidForm(false);
      await refresh();
    } catch (e) {
      setError(formatErr(e));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteVideo = async (id, title) => {
    if (!window.confirm(`Delete video "${title}"?`)) return;
    try {
      await adminApi.deleteVideo(id);
      await refresh();
    } catch (e) {
      setError(formatErr(e));
    }
  };

  const videosBySection = sections.map((s) => ({
    ...s,
    videos: videos.filter((v) => v.section_id === s.id),
  }));

  return (
    <section className="mt-14" data-testid="recordings-manager">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <div className="v-label mb-2">Client Portal · YouTube Unlisted</div>
          <h2 className="font-serif text-2xl sm:text-3xl" style={{ fontWeight: 400 }}>
            Manage <span className="gold-shimmer">Recorded Sessions</span>
          </h2>
          <p className="mt-2 text-sm text-[#C8BED6] font-light max-w-2xl">
            Organize unlisted YouTube videos into sections. Leave the &quot;Allowed
            Mobiles&quot; field empty to let{" "}
            <span className="text-[#F3D060]">any active authorized client</span> watch,
            or list specific 10-digit mobile numbers to restrict a video to just those
            clients.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowSecForm((v) => !v)}
            data-testid="rec-add-section-btn"
            className="btn-ghost text-sm"
          >
            <Folder size={16} /> {showSecForm ? "Cancel" : "Add Section"}
          </button>
          <button
            type="button"
            onClick={() => openAddVideo()}
            disabled={sections.length === 0}
            data-testid="rec-add-video-btn"
            className="btn-gold text-sm disabled:opacity-50"
          >
            <Plus size={16} /> Add Video
          </button>
        </div>
      </div>

      {showSecForm && (
        <form
          onSubmit={handleAddSection}
          data-testid="rec-section-form"
          className="glass-card p-5 sm:p-6 mb-6"
        >
          <label className="v-label block mb-1.5">Section Name</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              className="field-input flex-1"
              data-testid="rec-section-name"
              placeholder="e.g. Mobile Numerology Course"
              value={secName}
              onChange={(e) => setSecName(e.target.value)}
              maxLength={80}
            />
            <button
              type="submit"
              data-testid="rec-section-submit"
              className="btn-gold"
            >
              <Plus size={16} /> Create
            </button>
          </div>
        </form>
      )}

      {showVidForm && (
        <form
          onSubmit={handleVidSubmit}
          data-testid="rec-video-form"
          className="glass-card p-5 sm:p-6 mb-6"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <div className={editingVideo ? "sm:col-span-1 opacity-60" : ""}>
              <label className="v-label block mb-1.5">Section</label>
              <select
                className="field-input"
                data-testid="rec-video-section"
                value={vidForm.section_id}
                onChange={(e) =>
                  setVidForm({ ...vidForm, section_id: e.target.value })
                }
                disabled={!!editingVideo}
              >
                {sections.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="v-label block mb-1.5">Video Title</label>
              <input
                type="text"
                className="field-input"
                data-testid="rec-video-title"
                placeholder="e.g. Day 1 — Foundations of Mobile Numerology"
                value={vidForm.title}
                onChange={(e) =>
                  setVidForm({ ...vidForm, title: e.target.value })
                }
                maxLength={200}
              />
            </div>
          </div>

          {!editingVideo && (
            <div className="mt-4">
              <label className="v-label block mb-1.5">
                <LinkIcon size={11} className="inline mr-1" /> YouTube Unlisted URL
              </label>
              <input
                type="url"
                className="field-input"
                data-testid="rec-video-url"
                placeholder="https://youtu.be/XXXXXXXXXXX or https://www.youtube.com/watch?v=…"
                value={vidForm.youtube_url}
                onChange={(e) =>
                  setVidForm({ ...vidForm, youtube_url: e.target.value })
                }
              />
              <p className="mt-1 text-[11px] font-mono uppercase tracking-[0.2em] text-[#C8BED6]/60">
                Upload to YouTube as &quot;Unlisted&quot; — anyone with the link (or via
                this portal) can view, but it won&apos;t appear in YouTube search.
              </p>
            </div>
          )}

          <div className="mt-4">
            <label className="v-label block mb-1.5">Description (optional)</label>
            <textarea
              rows={3}
              className="field-input"
              data-testid="rec-video-desc"
              placeholder="Short summary that appears under the video."
              value={vidForm.description}
              onChange={(e) =>
                setVidForm({ ...vidForm, description: e.target.value })
              }
              maxLength={2000}
            />
          </div>

          <div className="mt-4">
            <label className="v-label block mb-1.5">
              Allowed Mobile Numbers (optional)
            </label>
            <textarea
              rows={2}
              className="field-input"
              data-testid="rec-video-mobiles"
              placeholder="Leave empty for ALL authorized clients. Or enter 10-digit numbers separated by commas/spaces, e.g. 9929059153, 9829312193"
              value={vidForm.allowed_mobiles}
              onChange={(e) =>
                setVidForm({ ...vidForm, allowed_mobiles: e.target.value })
              }
            />
            <p className="mt-1 text-[11px] font-mono uppercase tracking-[0.2em] text-[#C8BED6]/60">
              Numbers listed here must already be authorized in the table above.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-5">
            <button
              type="submit"
              disabled={submitting}
              data-testid="rec-video-submit"
              className="btn-gold disabled:opacity-50"
            >
              <Plus size={16} />
              {submitting
                ? "Saving…"
                : editingVideo
                ? "Update Video"
                : "Publish Video"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowVidForm(false);
                setEditingVideo(null);
              }}
              className="btn-ghost"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {error && (
        <div
          data-testid="rec-error"
          className="mb-4 px-4 py-3 rounded-lg border border-red-400/40 bg-red-500/10 text-red-200 text-sm"
        >
          {error}
        </div>
      )}

      {loading && sections.length === 0 ? (
        <div className="text-center py-10 text-[#C8BED6]/70 font-mono text-xs uppercase tracking-[0.2em]">
          Loading…
        </div>
      ) : sections.length === 0 ? (
        <div className="text-center py-10 text-[#C8BED6]/60 border border-dashed border-[#D4AF37]/25 rounded-xl">
          <Video
            size={28}
            className="mx-auto mb-3 text-[#D4AF37]/45"
            strokeWidth={1.3}
          />
          No sections yet. Click <span className="text-[#D4AF37]">Add Section</span>{" "}
          first, then add YouTube videos under it.
        </div>
      ) : (
        <div className="space-y-6">
          {videosBySection.map((sec) => (
            <div
              key={sec.id}
              data-testid={`rec-section-${sec.slug || sec.id}`}
              className="glass-card p-5 sm:p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div className="flex items-center gap-3 min-w-0">
                  <Folder
                    size={18}
                    className="text-[#D4AF37] shrink-0"
                    strokeWidth={1.5}
                  />
                  <h3
                    className="font-serif text-lg sm:text-xl text-[#F8F5F0] truncate"
                    style={{ fontWeight: 500 }}
                  >
                    {sec.name}
                  </h3>
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#C8BED6]/60 ml-1">
                    {sec.videos.length} video{sec.videos.length === 1 ? "" : "s"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openAddVideo(sec.id)}
                    data-testid={`rec-add-video-here-${sec.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.2em] text-[#D4AF37] hover:text-[#F3D060] px-2 py-1"
                  >
                    <Plus size={12} /> Add Video
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteSection(sec.id, sec.name)}
                    data-testid={`rec-delete-section-${sec.id}`}
                    className="inline-flex items-center gap-1.5 text-xs text-red-300 hover:text-red-200 transition-colors px-2 py-1 rounded border border-red-400/30 hover:border-red-400/60"
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>

              {sec.videos.length === 0 ? (
                <div className="text-center py-6 text-[#C8BED6]/55 text-sm">
                  No videos in this section yet.
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-3">
                  {sec.videos.map((v) => (
                    <div
                      key={v.id}
                      data-testid={`rec-video-row-${v.id}`}
                      className="flex gap-3 p-3 rounded-lg border border-[#D4AF37]/15 bg-[#1A0B2E]/30"
                    >
                      <a
                        href={`https://youtu.be/${v.youtube_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-24 h-16 shrink-0 rounded-md overflow-hidden bg-black relative group"
                      >
                        <img
                          src={`https://img.youtube.com/vi/${v.youtube_id}/hqdefault.jpg`}
                          alt={v.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <Film
                          size={18}
                          className="absolute inset-0 m-auto text-white drop-shadow-lg opacity-90 group-hover:scale-110 transition-transform"
                        />
                      </a>
                      <div className="flex-1 min-w-0">
                        <div
                          className="font-serif text-sm sm:text-base text-[#F8F5F0] line-clamp-1"
                          style={{ fontWeight: 500 }}
                        >
                          {v.title}
                        </div>
                        <div className="mt-1 text-[11px] font-mono uppercase tracking-[0.18em] text-[#C8BED6]/60">
                          {v.allowed_mobiles && v.allowed_mobiles.length
                            ? `Restricted · ${v.allowed_mobiles.length} mobile${
                                v.allowed_mobiles.length === 1 ? "" : "s"
                              }`
                            : "All authorized clients"}
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openEditVideo(v)}
                            data-testid={`rec-edit-video-${v.id}`}
                            className="inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-[0.18em] text-[#D4AF37] hover:text-[#F3D060] px-2 py-0.5 rounded border border-[#D4AF37]/30 hover:border-[#D4AF37]"
                          >
                            <Pencil size={11} /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteVideo(v.id, v.title)}
                            data-testid={`rec-delete-video-${v.id}`}
                            className="inline-flex items-center gap-1 text-[11px] text-red-300 hover:text-red-200 px-2 py-0.5 rounded border border-red-400/30 hover:border-red-400/60"
                          >
                            <Trash2 size={11} /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/* ============= Login Form ============= */
function LoginForm({ onAuthed }) {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await adminApi.login(mobile.trim(), password.trim());
      onAuthed();
    } catch (e) {
      setError(formatErr(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0F0518] text-[#F8F5F0] flex items-center justify-center px-4 py-10">
      <div className="radial-glow w-[460px] h-[460px] -top-32 -left-32 bg-[#9370DB]/22" />
      <div className="radial-glow w-[420px] h-[420px] -bottom-32 -right-32 bg-[#D4AF37]/15" />
      <Link to="/" className="absolute top-4 left-4 text-xs font-mono uppercase tracking-[0.22em] text-[#C8BED6] hover:text-[#D4AF37] inline-flex items-center gap-2">
        <ArrowLeft size={14} /> Back to Site
      </Link>
      <form
        onSubmit={submit}
        data-testid="admin-login-form"
        className="relative z-10 w-full max-w-sm glass-card p-7 sm:p-8"
      >
        <div className="flex flex-col items-center text-center mb-6">
          <Logo size={64} />
          <div className="v-label mt-4">Admin Access</div>
          <h1 className="font-serif text-2xl sm:text-3xl mt-1" style={{ fontWeight: 400 }}>
            Sign in
          </h1>
        </div>

        <label className="v-label block mb-1.5"><Phone size={11} className="inline mr-1" /> Admin Mobile</label>
        <input
          type="tel"
          inputMode="tel"
          className="field-input mb-4"
          data-testid="admin-login-mobile"
          placeholder="10-digit mobile"
          value={mobile}
          onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
          autoComplete="username"
        />

        <label className="v-label block mb-1.5"><Lock size={11} className="inline mr-1" /> Password</label>
        <input
          type="password"
          className="field-input mb-5"
          data-testid="admin-login-password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />

        {error && (
          <div data-testid="admin-login-error" className="mb-4 px-3 py-2 rounded-lg border border-red-400/40 bg-red-500/10 text-red-200 text-xs">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          data-testid="admin-login-submit"
          className="btn-gold w-full justify-center disabled:opacity-50"
        >
          <Shield size={16} /> {loading ? "Signing in…" : "Sign in"}
        </button>

        <p className="mt-5 text-center text-[10px] font-mono uppercase tracking-[0.22em] text-[#C8BED6]/55">
          Restricted to authorized admins only
        </p>
      </form>
    </div>
  );
}
