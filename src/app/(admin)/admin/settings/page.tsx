"use client";

import { useEffect, useState, FormEvent } from "react";
import { Save, Eye, Power } from "lucide-react";
import { AdminShell } from "../_components/AdminShell";
import { useToast } from "../_components/ToastProvider";

export default function SettingsPage() {
  const { success, error } = useToast();
  const [form, setForm] = useState({
    siteName: "", tagline: "", email: "", phone: "",
    address: "", facebook: "", instagram: "", linkedin: "",
    maintenance: false, seo_description: "",
    color_primary: "#0a0a0a", color_gold: "#D4A843", color_orange: "#E85D24",
    font_family: "",
    // Coming Soon fields
    coming_soon: false,
    cs_headline: "Quelque chose arrive.",
    cs_subheading: "Gradus Agency — Casablanca, Maroc",
    cs_launch_date: "",
    cs_show_email: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => setForm({
        siteName: d.siteName || "Gradus Agency",
        tagline: d.tagline || "",
        email: d.email || "",
        phone: d.phone || "",
        address: d.address || "",
        facebook: d.facebook || "",
        instagram: d.instagram || "",
        linkedin: d.linkedin || "",
        maintenance: d.maintenance === true,
        seo_description: d.seo_description || "",
        color_primary: d.color_primary || "#0a0a0a",
        color_gold: d.color_gold || "#D4A843",
        color_orange: d.color_orange || "#E85D24",
        font_family: d.font_family || "",
        coming_soon: d.coming_soon === true,
        cs_headline: d.cs_headline || "Quelque chose arrive.",
        cs_subheading: d.cs_subheading || "Gradus Agency — Casablanca, Maroc",
        cs_launch_date: d.cs_launch_date || "",
        cs_show_email: d.cs_show_email !== false,
      }))
      .catch(() => error("Failed to load settings"))
      .finally(() => setLoading(false));
  }, []);

  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      success("Settings saved successfully!");
    } catch {
      error("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <AdminShell title="Settings"><div className="skeleton" style={{ height: 400, borderRadius: 8 }} /></AdminShell>;

  return (
    <AdminShell title="Site Settings">
      <form onSubmit={handleSubmit} className="admin-form" style={{ maxWidth: 800 }}>

        {/* ── COMING SOON MODE ─────────────────────────────────────── */}
        <div className="admin-card" style={{ border: form.coming_soon ? "1px solid rgba(212,168,67,0.4)" : undefined }}>
          <div className="admin-card-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Power size={16} style={{ color: form.coming_soon ? "#D4A843" : "rgba(255,255,255,0.3)" }} />
              <span className="admin-card-title">Coming Soon Mode</span>
              {form.coming_soon && (
                <span style={{
                  fontSize: 9, fontFamily: "monospace", letterSpacing: "0.15em",
                  textTransform: "uppercase", color: "#D4A843",
                  background: "rgba(212,168,67,0.12)", border: "1px solid rgba(212,168,67,0.3)",
                  borderRadius: 4, padding: "2px 8px",
                }}>
                  ACTIVE
                </span>
              )}
            </div>
            <a
              href="/coming-soon?preview=1"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm"
              style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}
            >
              <Eye size={13} /> Preview Page
            </a>
          </div>

          <div className="admin-card-body">
            {/* Master toggle */}
            <div className="form-toggle" style={{ marginBottom: 24, padding: "16px", background: "rgba(212,168,67,0.04)", borderRadius: 10, border: "1px solid rgba(212,168,67,0.1)" }}>
              <button
                type="button"
                className={`toggle ${form.coming_soon ? "on" : ""}`}
                onClick={() => set("coming_soon", !form.coming_soon)}
              />
              <div>
                <label className="form-label" style={{ margin: 0, display: "block", color: form.coming_soon ? "#D4A843" : undefined }}>
                  {form.coming_soon ? "Coming Soon is ON — site is hidden from public visitors" : "Coming Soon is OFF — site is publicly visible"}
                </label>
                <span className="form-hint">
                  When ON, all public routes redirect to the coming soon page. You (admin) always see the real site.
                </span>
              </div>
            </div>

            {/* Headline */}
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Headline</label>
              <input
                className="form-control"
                value={form.cs_headline}
                onChange={(e) => set("cs_headline", e.target.value)}
                placeholder="Quelque chose arrive."
              />
            </div>

            {/* Subheading */}
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Subheading</label>
              <input
                className="form-control"
                value={form.cs_subheading}
                onChange={(e) => set("cs_subheading", e.target.value)}
                placeholder="Gradus Agency — Casablanca, Maroc"
              />
            </div>

            {/* Launch date */}
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Launch Date (for countdown timer)</label>
              <input
                className="form-control"
                type="datetime-local"
                value={form.cs_launch_date}
                onChange={(e) => set("cs_launch_date", e.target.value)}
              />
              <span className="form-hint" style={{ marginTop: 4, display: "block" }}>
                Leave blank to hide the countdown timer.
              </span>
            </div>

            {/* Email toggle */}
            <div className="form-toggle">
              <button
                type="button"
                className={`toggle ${form.cs_show_email ? "on" : ""}`}
                onClick={() => set("cs_show_email", !form.cs_show_email)}
              />
              <div>
                <label className="form-label" style={{ margin: 0, display: "block" }}>Show email capture form</label>
                <span className="form-hint">Displays an email input field for visitors to register interest.</span>
              </div>
            </div>

            <div style={{ marginTop: 16, padding: "12px 16px", background: "rgba(255,255,255,0.03)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)" }}>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "monospace", margin: 0, lineHeight: 1.6 }}>
                💡 Social links (Instagram, Facebook, LinkedIn) are pulled from the Social Media section below.
              </p>
            </div>
          </div>
        </div>

        {/* ── THEME & BRANDING ─────────────────────────────────────── */}
        <div className="admin-card">
          <div className="admin-card-header"><span className="admin-card-title">Theme &amp; Branding</span></div>
          <div className="admin-card-body">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Primary Background Color</label>
                <div style={{ display: "flex", gap: 8 }}>
                  <input type="color" value={form.color_primary} onChange={(e) => set("color_primary", e.target.value)} style={{ width: 40, height: 40, padding: 0, border: "none", borderRadius: 4, cursor: "pointer" }} />
                  <input className="form-control" value={form.color_primary} onChange={(e) => set("color_primary", e.target.value)} style={{ flex: 1 }} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Gold Accent Color</label>
                <div style={{ display: "flex", gap: 8 }}>
                  <input type="color" value={form.color_gold} onChange={(e) => set("color_gold", e.target.value)} style={{ width: 40, height: 40, padding: 0, border: "none", borderRadius: 4, cursor: "pointer" }} />
                  <input className="form-control" value={form.color_gold} onChange={(e) => set("color_gold", e.target.value)} style={{ flex: 1 }} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Orange Accent Color</label>
                <div style={{ display: "flex", gap: 8 }}>
                  <input type="color" value={form.color_orange} onChange={(e) => set("color_orange", e.target.value)} style={{ width: 40, height: 40, padding: 0, border: "none", borderRadius: 4, cursor: "pointer" }} />
                  <input className="form-control" value={form.color_orange} onChange={(e) => set("color_orange", e.target.value)} style={{ flex: 1 }} />
                </div>
              </div>
            </div>
            <div className="form-group" style={{ marginTop: 16 }}>
              <label className="form-label">Global Font Family (Optional)</label>
              <input className="form-control" value={form.font_family} onChange={(e) => set("font_family", e.target.value)} placeholder="e.g. 'Inter', 'Roboto', sans-serif" />
              <span className="form-hint" style={{ marginTop: 4, display: "block" }}>Leave blank to use the default Clash Display &amp; Inter fonts.</span>
            </div>
          </div>
        </div>

        {/* ── GENERAL SETTINGS ─────────────────────────────────────── */}
        <div className="admin-card">
          <div className="admin-card-header"><span className="admin-card-title">General Settings</span></div>
          <div className="admin-card-body">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Site Name</label>
                <input className="form-control" value={form.siteName} onChange={(e) => set("siteName", e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Tagline</label>
                <input className="form-control" value={form.tagline} onChange={(e) => set("tagline", e.target.value)} />
              </div>
            </div>
            <div className="form-group" style={{ marginTop: 16 }}>
              <label className="form-label">Global SEO Description</label>
              <textarea className="form-control" value={form.seo_description} onChange={(e) => set("seo_description", e.target.value)} rows={3} />
            </div>
          </div>
        </div>

        {/* ── CONTACT ─────────────────────────────────────────────── */}
        <div className="admin-card">
          <div className="admin-card-header"><span className="admin-card-title">Contact Information</span></div>
          <div className="admin-card-body">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Public Email</label>
                <input className="form-control" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input className="form-control" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
              </div>
            </div>
            <div className="form-group" style={{ marginTop: 16 }}>
              <label className="form-label">Office Address</label>
              <textarea className="form-control" value={form.address} onChange={(e) => set("address", e.target.value)} rows={2} />
            </div>
          </div>
        </div>

        {/* ── SOCIAL MEDIA ─────────────────────────────────────────── */}
        <div className="admin-card">
          <div className="admin-card-header"><span className="admin-card-title">Social Media Links</span></div>
          <div className="admin-card-body">
            <div className="form-group">
              <label className="form-label">Instagram URL</label>
              <input className="form-control" type="url" value={form.instagram} onChange={(e) => set("instagram", e.target.value)} />
            </div>
            <div className="form-group" style={{ marginTop: 16 }}>
              <label className="form-label">LinkedIn URL</label>
              <input className="form-control" type="url" value={form.linkedin} onChange={(e) => set("linkedin", e.target.value)} />
            </div>
            <div className="form-group" style={{ marginTop: 16 }}>
              <label className="form-label">Facebook URL</label>
              <input className="form-control" type="url" value={form.facebook} onChange={(e) => set("facebook", e.target.value)} />
            </div>
          </div>
        </div>

        {/* ── SYSTEM ──────────────────────────────────────────────── */}
        <div className="admin-card">
          <div className="admin-card-header"><span className="admin-card-title">System</span></div>
          <div className="admin-card-body">
            <div className="form-toggle">
              <button type="button" className={`toggle ${form.maintenance ? "on" : ""}`} onClick={() => set("maintenance", !form.maintenance)} />
              <div>
                <label className="form-label" style={{ margin: 0, display: "block" }}>Maintenance Mode</label>
                <span className="form-hint">Shows a generic maintenance banner to non-admin visitors.</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <button type="submit" className="btn btn-gold" disabled={saving}>
            <Save size={14} /> {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>

      </form>
    </AdminShell>
  );
}
