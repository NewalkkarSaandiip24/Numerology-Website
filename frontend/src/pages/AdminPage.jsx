import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, History, RefreshCw, LogOut, Lock, Phone, User, Calendar, Shield } from "lucide-react";
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
            <th className="p-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]">Mobile</th>
            <th className="p-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]">Name</th>
            <th className="p-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]">{mode === "active" ? "Authorized On" : "Removed On"}</th>
            <th className="p-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]">Expires</th>
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
