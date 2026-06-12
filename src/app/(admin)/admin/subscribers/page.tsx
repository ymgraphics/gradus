"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Mail, Download, Trash2, Users, Clock, Globe, Calendar,
  Tag, CheckCircle, XCircle, AlertCircle, MessageSquare,
  ChevronDown, Search, RefreshCw, Copy,
} from "lucide-react";
import { AdminShell } from "../_components/AdminShell";
import { useToast } from "../_components/ToastProvider";

interface Subscriber {
  id: string;
  email: string;
  source: string;
  subscribed_at: string;
  status: "new" | "contacted" | "converted" | "unsubscribed";
  notes: string;
  last_contacted_at: string;
  ip: string;
}

const STATUS_CONFIG = {
  new:          { label: "New",          color: "#6366f1", bg: "rgba(99,102,241,0.12)",  icon: AlertCircle },
  contacted:    { label: "Contacted",    color: "#0ea5e9", bg: "rgba(14,165,233,0.12)",  icon: Mail },
  converted:    { label: "Converted",    color: "#10b981", bg: "rgba(16,185,129,0.12)",  icon: CheckCircle },
  unsubscribed: { label: "Unsubscribed", color: "#a1a1aa", bg: "rgba(107,114,128,0.12)", icon: XCircle },
} as const;

function timeAgo(dateStr: string): string {
  if (!dateStr) return "—";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("fr-MA", { day: "2-digit", month: "short", year: "numeric" });
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("fr-MA", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

const AVATAR_GRADIENTS = [
  "linear-gradient(135deg,#D4A843,#c49a38)",
  "linear-gradient(135deg,#7c3aed,#5b21b6)",
  "linear-gradient(135deg,#0ea5e9,#0284c7)",
  "linear-gradient(135deg,#10b981,#059669)",
  "linear-gradient(135deg,#f59e0b,#d97706)",
  "linear-gradient(135deg,#ec4899,#db2777)",
];
const avatarColor = (email: string) => {
  if (!email) return AVATAR_GRADIENTS[0];
  const charCode = email.charCodeAt(0);
  return AVATAR_GRADIENTS[charCode % AVATAR_GRADIENTS.length] || AVATAR_GRADIENTS[0];
};

export default function SubscribersPage() {
  const { success, error } = useToast();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "az">("newest");
  const [bulkSelected, setBulkSelected] = useState<Set<string>>(new Set());
  const [notesDraft, setNotesDraft] = useState<Record<string, string>>({});
  const [savingNotes, setSavingNotes] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/subscribers");
      if (!res.ok) throw new Error();
      const data: Subscriber[] = await res.json();
      setSubscribers(data);
      // Pre-fill notes drafts
      const drafts: Record<string, string> = {};
      data.forEach(s => { drafts[s.id] = s.notes || ""; });
      setNotesDraft(drafts);
    } catch {
      error("Failed to load subscribers");
    } finally {
      setLoading(false);
    }
  }, [error]);

  useEffect(() => { load(); }, [load]);

  // ── Computed list ─────────────────────────────────────────────────────
  const filtered = subscribers
    .filter(s => {
      const email = s.email || "";
      const source = s.source || "";
      const ip = s.ip || "";
      const matchSearch = email.toLowerCase().includes(search.toLowerCase()) ||
        ip.includes(search) ||
        source.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || s.status === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      if (sortOrder === "newest") return new Date(b.subscribed_at).getTime() - new Date(a.subscribed_at).getTime();
      if (sortOrder === "oldest") return new Date(a.subscribed_at).getTime() - new Date(b.subscribed_at).getTime();
      return (a.email || "").localeCompare(b.email || "");
    });

  // ── Stats ─────────────────────────────────────────────────────────────
  const now = Date.now();
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const weekAgo   = new Date(now - 7  * 86400000);
  const monthAgo  = new Date(now - 30 * 86400000);
  const todayCount    = subscribers.filter(s => new Date(s.subscribed_at) >= today).length;
  const weekCount     = subscribers.filter(s => new Date(s.subscribed_at) >= weekAgo).length;
  const monthCount    = subscribers.filter(s => new Date(s.subscribed_at) >= monthAgo).length;
  const convertedCount = subscribers.filter(s => s.status === "converted").length;

  // ── Bulk ──────────────────────────────────────────────────────────────
  const allSelected = filtered.length > 0 && filtered.every(s => bulkSelected.has(s.id));
  const toggleBulk = (id: string) => setBulkSelected(prev => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });
  const toggleAll = () => {
    if (allSelected) setBulkSelected(new Set());
    else setBulkSelected(new Set(filtered.map(s => s.id)));
  };

  async function bulkDelete() {
    if (!confirm(`Delete ${bulkSelected.size} subscribers? This cannot be undone.`)) return;
    const ids = Array.from(bulkSelected);
    await Promise.all(ids.map(id => fetch(`/api/admin/subscribers/${id}`, { method: "DELETE" })));
    setSubscribers(prev => prev.filter(s => !ids.includes(s.id)));
    setBulkSelected(new Set());
    success(`Deleted ${ids.length} subscribers`);
  }

  function exportCSV(ids?: Set<string>) {
    const list = ids ? filtered.filter(s => ids.has(s.id)) : filtered;
    const header = "Email,Source,Status,IP,Date Subscribed,Last Contacted,Notes\n";
    const rows = list.map(s =>
      `"${s.email}","${s.source}","${s.status}","${s.ip || ""}","${s.subscribed_at}","${s.last_contacted_at || ""}","${(s.notes || "").replace(/"/g, "'")}"`
    ).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url;
    a.download = `gradus-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
    success(`Exported ${list.length} contacts`);
  }

  // ── CRM mutations ─────────────────────────────────────────────────────
  async function updateStatus(id: string, status: string) {
    setUpdatingStatus(id);
    try {
      await fetch(`/api/admin/subscribers/${id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setSubscribers(prev => prev.map(s => s.id === id ? { ...s, status: status as Subscriber["status"] } : s));
      success("Status updated");
    } catch { error("Failed to update status"); }
    finally { setUpdatingStatus(null); }
  }

  async function saveNotes(id: string) {
    setSavingNotes(id);
    try {
      const notes = notesDraft[id] || "";
      await fetch(`/api/admin/subscribers/${id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });
      setSubscribers(prev => prev.map(s => s.id === id ? { ...s, notes } : s));
      success("Notes saved");
    } catch { error("Failed to save notes"); }
    finally { setSavingNotes(null); }
  }

  async function handleEmail(sub: Subscriber) {
    const ts = new Date().toISOString();
    await fetch(`/api/admin/subscribers/${sub.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ last_contacted_at: ts }),
    });
    setSubscribers(prev => prev.map(s => s.id === sub.id ? { ...s, last_contacted_at: ts } : s));
    window.location.href = `mailto:${sub.email}`;
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this subscriber?")) return;
    await fetch(`/api/admin/subscribers/${id}`, { method: "DELETE" });
    setSubscribers(prev => prev.filter(s => s.id !== id));
    if (expanded === id) setExpanded(null);
    success("Subscriber removed");
  }

  function copyToClipboard(text: string, label: string) {
    navigator.clipboard.writeText(text).then(() => success(`${label} copied`));
  }

  return (
    <AdminShell
      title="Subscribers CRM"
      actions={
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-outline btn-sm" onClick={load}>
            <RefreshCw size={13} /> Refresh
          </button>
          {subscribers.length > 0 && (
            <button className="btn btn-outline btn-sm" onClick={() => exportCSV()}>
              <Download size={13} /> Export CSV
            </button>
          )}
        </div>
      }
    >
      {/* ── Stats Row ──────────────────────────────────────────────────── */}
      {!loading && subscribers.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
          {[
            { icon: Users,    label: "Total",      value: subscribers.length, color: "#D4A843" },
            { icon: Clock,    label: "Today",       value: todayCount,         color: "#10b981" },
            { icon: Globe,    label: "This Week",   value: weekCount,          color: "#7c3aed" },
            { icon: Calendar, label: "This Month",  value: monthCount,         color: "#0ea5e9" },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="admin-card" style={{ margin: 0 }}>
              <div className="admin-card-body" style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: `${color}18`, border: `1px solid ${color}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={16} style={{ color }} />
                </div>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: "#fff", lineHeight: 1 }}>{value}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 3, fontFamily: "monospace", letterSpacing: "0.05em", textTransform: "uppercase" }}>{label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Converted badge ───────────────────────────────────────────── */}
      {convertedCount > 0 && (
        <div style={{ marginBottom: 16, padding: "10px 16px", borderRadius: 10, background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)", display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#10b981" }}>
          <CheckCircle size={14} />
          <strong>{convertedCount}</strong> subscriber{convertedCount !== 1 ? "s" : ""} converted into clients
        </div>
      )}

      {/* ── Loading ───────────────────────────────────────────────────── */}
      {loading ? (
        <div className="admin-card">
          <div className="admin-card-body">
            {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 64, borderRadius: 10, marginBottom: 8 }} />)}
          </div>
        </div>
      ) : subscribers.length === 0 ? (
        <div className="admin-card">
          <div className="admin-card-body" style={{ textAlign: "center", padding: "80px 24px" }}>
            <div style={{ width: 64, height: 64, borderRadius: 20, background: "rgba(212,168,67,0.08)", border: "1px solid rgba(212,168,67,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <Mail size={28} style={{ color: "rgba(212,168,67,0.4)" }} />
            </div>
            <p style={{ fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 8, fontSize: 15 }}>No subscribers yet</p>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.25)", maxWidth: 300, margin: "0 auto" }}>
              Emails from the Coming Soon page will appear here automatically.
            </p>
          </div>
        </div>
      ) : (
        <div className="admin-card" style={{ margin: 0 }}>

          {/* ── Toolbar ──────────────────────────────────────────────── */}
          <div className="admin-card-header" style={{ flexWrap: "wrap", gap: 10 }}>
            <span className="admin-card-title" style={{ flexShrink: 0 }}>
              {filtered.length} / {subscribers.length} contacts
            </span>
            <div style={{ position: "relative", flex: 1, minWidth: 160, maxWidth: 240 }}>
              <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.25)", pointerEvents: "none" }} />
              <input className="form-control" placeholder="Search email, IP, source..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 30, fontSize: 13, padding: "7px 12px 7px 30px" }} />
            </div>
            <div style={{ position: "relative" }}>
              <select className="form-control" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ fontSize: 12, padding: "7px 28px 7px 10px", appearance: "none", cursor: "pointer" }}>
                <option value="all">All Status</option>
                {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
              <ChevronDown size={12} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "rgba(255,255,255,0.3)" }} />
            </div>
            <div style={{ position: "relative" }}>
              <select className="form-control" value={sortOrder} onChange={e => setSortOrder(e.target.value as "newest"|"oldest"|"az")} style={{ fontSize: 12, padding: "7px 28px 7px 10px", appearance: "none", cursor: "pointer" }}>
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="az">A → Z</option>
              </select>
              <ChevronDown size={12} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "rgba(255,255,255,0.3)" }} />
            </div>
          </div>

          {/* ── Bulk action bar ───────────────────────────────────────── */}
          {bulkSelected.size > 0 && (
            <div style={{ padding: "8px 20px", background: "rgba(212,168,67,0.06)", borderBottom: "1px solid rgba(212,168,67,0.15)", display: "flex", alignItems: "center", gap: 12, fontSize: 12 }}>
              <span style={{ color: "rgba(212,168,67,0.8)" }}>{bulkSelected.size} selected</span>
              <button className="btn btn-outline btn-sm" onClick={() => exportCSV(bulkSelected)} style={{ fontSize: 11 }}><Download size={11} /> Export</button>
              <button className="btn btn-danger btn-sm" onClick={bulkDelete} style={{ fontSize: 11 }}><Trash2 size={11} /> Delete</button>
              <button className="btn btn-ghost btn-sm" onClick={() => setBulkSelected(new Set())} style={{ fontSize: 11, marginLeft: "auto" }}>Clear</button>
            </div>
          )}

          {/* ── Table header ─────────────────────────────────────────── */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "36px 44px 1fr 110px 160px 100px 80px 80px",
            gap: 12, padding: "10px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            fontSize: 9, fontFamily: "monospace", letterSpacing: "0.12em",
            textTransform: "uppercase", color: "rgba(255,255,255,0.2)",
          }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <input type="checkbox" checked={allSelected} onChange={toggleAll} style={{ cursor: "pointer", width: 14, height: 14, accentColor: "#D4A843" }} />
            </div>
            <div />
            <div>Email</div>
            <div>Status</div>
            <div>Subscribed</div>
            <div>Source</div>
            <div>IP</div>
            <div>Actions</div>
          </div>

          {/* ── Rows ─────────────────────────────────────────────────── */}
          <div>
            {filtered.length === 0 ? (
              <p style={{ padding: "32px", textAlign: "center", color: "rgba(255,255,255,0.2)", fontSize: 13 }}>
                No results{search ? ` for "${search}"` : ""}
              </p>
            ) : filtered.map((sub, i) => {
              const sc = STATUS_CONFIG[sub.status] || STATUS_CONFIG.new;
              const isExpanded = expanded === sub.id;
              const isBulk = bulkSelected.has(sub.id);

              return (
                <div key={sub.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>

                  {/* ── Main row ──────────────────────────────────────── */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "36px 44px 1fr 110px 160px 100px 80px 80px",
                      gap: 12, padding: "14px 20px",
                      alignItems: "center",
                      background: isExpanded ? "rgba(212,168,67,0.04)" : isBulk ? "rgba(99,102,241,0.04)" : "transparent",
                      borderLeft: isExpanded ? "2px solid rgba(212,168,67,0.4)" : "2px solid transparent",
                      cursor: "pointer",
                      transition: "background 0.12s",
                    }}
                    onClick={() => setExpanded(isExpanded ? null : sub.id)}
                  >
                    {/* Checkbox */}
                    <div onClick={e => e.stopPropagation()}>
                      <input type="checkbox" checked={isBulk} onChange={() => toggleBulk(sub.id)} style={{ cursor: "pointer", width: 14, height: 14, accentColor: "#D4A843" }} />
                    </div>

                    {/* Avatar */}
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: avatarColor(sub.email), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                      {(sub.email?.[0] || "?").toUpperCase()}
                    </div>

                    {/* Email */}
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 500, color: "#fff", fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {sub.email}
                      </div>
                      {sub.notes && (
                        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                          <MessageSquare size={9} style={{ color: "rgba(255,255,255,0.2)" }} />
                          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 200 }}>
                            {sub.notes}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Status badge */}
                    <div style={{ fontSize: 10, fontFamily: "monospace", letterSpacing: "0.06em", textTransform: "uppercase", color: sc.color, background: sc.bg, padding: "3px 8px", borderRadius: 5, display: "inline-flex", alignItems: "center", gap: 4, width: "fit-content" }}>
                      <sc.icon size={10} />{sc.label}
                    </div>

                    {/* Subscribed date */}
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>
                      <div>{formatDate(sub.subscribed_at).split(",")[0]}</div>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", marginTop: 2 }}>{timeAgo(sub.subscribed_at)}</div>
                    </div>

                    {/* Source */}
                    <div>
                      <span style={{ fontSize: 9, fontFamily: "monospace", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.05)", padding: "2px 6px", borderRadius: 3 }}>
                        {sub.source || "coming_soon"}
                      </span>
                    </div>

                    {/* IP */}
                    <div
                      style={{ fontSize: 10, fontFamily: "monospace", color: "rgba(255,255,255,0.25)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", cursor: sub.ip ? "copy" : "default" }}
                      title={sub.ip || "—"}
                      onClick={e => { e.stopPropagation(); if (sub.ip) copyToClipboard(sub.ip, "IP"); }}
                    >
                      {sub.ip ? sub.ip.split(",")[0].trim() : "—"}
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", gap: 4 }} onClick={e => e.stopPropagation()}>
                      <button className="btn btn-ghost btn-sm" title="Send email" onClick={() => handleEmail(sub)} style={{ padding: "4px 6px", color: "rgba(255,255,255,0.3)" }}>
                        <Mail size={13} />
                      </button>
                      <button className="btn btn-ghost btn-sm" title="Delete" onClick={() => handleDelete(sub.id)} style={{ padding: "4px 6px", color: "rgba(255,80,80,0.4)" }}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* ── Expanded detail row ───────────────────────────── */}
                  {isExpanded && (
                    <div style={{ padding: "0 20px 20px 112px", background: "rgba(212,168,67,0.02)" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>

                        {/* Full contact info */}
                        <div style={{ padding: 16, borderRadius: 10, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                          <div style={{ fontSize: 9, fontFamily: "monospace", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 12 }}>Contact Info</div>
                          {[
                            { label: "Email",         value: sub.email,                                             copy: true },
                            { label: "Subscribed",    value: formatDate(sub.subscribed_at) },
                            { label: "Source",        value: sub.source || "coming_soon" },
                            { label: "IP Address",    value: sub.ip || "Not captured",                              copy: !!sub.ip },
                            { label: "Last Contacted",value: sub.last_contacted_at ? formatDate(sub.last_contacted_at) : "Never" },
                            { label: "Subscriber ID", value: sub.id,                                                mono: true },
                          ].map(({ label, value, copy, mono }) => (
                            <div key={label} style={{ marginBottom: 10 }}>
                              <div style={{ fontSize: 9, fontFamily: "monospace", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 3 }}>{label}</div>
                              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <span style={{ fontSize: mono || label === "Subscriber ID" ? 9 : 12, color: "rgba(255,255,255,0.7)", fontFamily: mono || label === "Subscriber ID" || label === "IP Address" ? "monospace" : "inherit", wordBreak: "break-all" }}>
                                  {value}
                                </span>
                                {copy && (
                                  <button onClick={() => copyToClipboard(value as string, label)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.2)", padding: 2, flexShrink: 0 }}>
                                    <Copy size={10} />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Status + quick actions */}
                        <div style={{ padding: 16, borderRadius: 10, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                          <div style={{ fontSize: 9, fontFamily: "monospace", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 12 }}>CRM Status</div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 16 }}>
                            {(Object.entries(STATUS_CONFIG) as [string, typeof STATUS_CONFIG[keyof typeof STATUS_CONFIG]][]).map(([key, cfg]) => (
                              <button
                                key={key}
                                disabled={updatingStatus === sub.id}
                                onClick={() => updateStatus(sub.id, key)}
                                style={{
                                  padding: "8px 10px", borderRadius: 8, fontSize: 11,
                                  fontFamily: "monospace", letterSpacing: "0.06em", textTransform: "uppercase",
                                  border: "1px solid", cursor: "pointer",
                                  display: "flex", alignItems: "center", gap: 5,
                                  background: sub.status === key ? cfg.bg : "transparent",
                                  borderColor: sub.status === key ? cfg.color : "rgba(255,255,255,0.08)",
                                  color: sub.status === key ? cfg.color : "rgba(255,255,255,0.35)",
                                  transition: "all 0.15s",
                                }}
                              >
                                <cfg.icon size={11} />{cfg.label}
                              </button>
                            ))}
                          </div>
                          <div style={{ display: "flex", gap: 8 }}>
                            <button className="btn btn-gold btn-sm" style={{ flex: 1, justifyContent: "center" }} onClick={() => handleEmail(sub)}>
                              <Mail size={13} /> Email
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(sub.id)}>
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>

                        {/* Notes */}
                        <div style={{ padding: 16, borderRadius: 10, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                          <div style={{ fontSize: 9, fontFamily: "monospace", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                            <Tag size={9} /> Notes
                          </div>
                          <textarea
                            className="form-control"
                            rows={5}
                            placeholder="Internal notes about this contact..."
                            value={notesDraft[sub.id] ?? sub.notes ?? ""}
                            onChange={e => setNotesDraft(prev => ({ ...prev, [sub.id]: e.target.value }))}
                            style={{ fontSize: 12, resize: "vertical", width: "100%" }}
                          />
                          <button
                            className="btn btn-outline btn-sm"
                            style={{ marginTop: 8, fontSize: 11, width: "100%", justifyContent: "center" }}
                            onClick={() => saveNotes(sub.id)}
                            disabled={savingNotes === sub.id || notesDraft[sub.id] === sub.notes}
                          >
                            {savingNotes === sub.id ? "Saving..." : "Save Notes"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </AdminShell>
  );
}
