"use client";

import { useEffect, useState, FormEvent } from "react";
import { Save, Zap } from "lucide-react";
import { AdminShell } from "../_components/AdminShell";
import { useToast } from "../_components/ToastProvider";

export default function CtaAdminPage() {
  const { success, error } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    cta_headline_line1_fr: "Prêt pour la",
    cta_headline_line2_fr: "Croissance ?",
    cta_body_fr: "Une vision ambitieuse nécessite une exécution parfaite. Le conseil exécutif de Gradus est à votre disposition —",
    cta_btn_fr: "Initier une Collaboration",
    cta_btn_url: "/contact",
    cta_email_label_fr: "Contact direct :",
    cta_email: "contact@gradus.ma",
    cta_headline_line1_en: "Ready to",
    cta_headline_line2_en: "Create?",
    cta_body_en: "An idea, a project, a challenge? Our team is ready to take on any challenge —",
    cta_btn_en: "Start your project",
    cta_email_label_en: "Or write to us:",
  });

  useEffect(() => {
    fetch("/api/admin/site-content")
      .then(r => r.json())
      .then(d => {
        if (d && Object.keys(d).length > 0) {
          setForm(prev => ({
            cta_headline_line1_fr: d.cta_headline_line1_fr || prev.cta_headline_line1_fr,
            cta_headline_line2_fr: d.cta_headline_line2_fr || prev.cta_headline_line2_fr,
            cta_body_fr: d.cta_body_fr || prev.cta_body_fr,
            cta_btn_fr: d.cta_btn_fr || prev.cta_btn_fr,
            cta_btn_url: d.cta_btn_url || prev.cta_btn_url,
            cta_email_label_fr: d.cta_email_label_fr || prev.cta_email_label_fr,
            cta_email: d.cta_email || prev.cta_email,
            cta_headline_line1_en: d.cta_headline_line1_en || prev.cta_headline_line1_en,
            cta_headline_line2_en: d.cta_headline_line2_en || prev.cta_headline_line2_en,
            cta_body_en: d.cta_body_en || prev.cta_body_en,
            cta_btn_en: d.cta_btn_en || prev.cta_btn_en,
            cta_email_label_en: d.cta_email_label_en || prev.cta_email_label_en,
          }));
        }
      })
      .catch(() => error("Failed to load CTA"))
      .finally(() => setLoading(false));
  }, []);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const existing = await fetch("/api/admin/site-content").then(r => r.json());
      const res = await fetch("/api/admin/site-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...existing, ...form }),
      });
      if (!res.ok) throw new Error();
      success("CTA section saved!");
    } catch {
      error("Failed to save CTA.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <AdminShell title="CTA"><div className="skeleton" style={{ height: 300, borderRadius: 8 }} /></AdminShell>;

  return (
    <AdminShell title="CTA Section">
      <form onSubmit={handleSubmit} className="admin-form" style={{ maxWidth: 800 }}>

        {/* Preview */}
        <div style={{
          padding: "28px 32px", borderRadius: 16, marginBottom: 24,
          background: "linear-gradient(135deg, rgba(212,168,67,0.06), rgba(212,168,67,0.02))",
          border: "1px solid rgba(212,168,67,0.15)", textAlign: "center",
        }}>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.3)", marginBottom: 8, fontFamily: "monospace", letterSpacing: "0.1em", textTransform: "uppercase" }}>Live Preview</div>
          <div style={{ fontSize: 32, fontWeight: 900, color: "#fff", lineHeight: 1.1 }}>
            {form.cta_headline_line1_fr}
          </div>
          <div style={{ fontSize: 32, fontWeight: 300, fontStyle: "italic", color: "#D4A843", lineHeight: 1.1, marginBottom: 12 }}>
            {form.cta_headline_line2_fr}
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 16 }}>{form.cta_body_fr}</div>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <span style={{ background: "#D4A843", color: "#0a0a0a", padding: "10px 20px", borderRadius: 30, fontSize: 13, fontWeight: 700 }}>
              {form.cta_btn_fr}
            </span>
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, display: "flex", alignItems: "center" }}>
              {form.cta_email_label_fr} {form.cta_email}
            </span>
          </div>
        </div>

        {/* Shared fields */}
        <div className="admin-card">
          <div className="admin-card-header"><Zap size={15} style={{ color: "#D4A843" }} /><span className="admin-card-title">Shared Fields</span></div>
          <div className="admin-card-body">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">CTA Button URL</label>
                <input className="form-control" value={form.cta_btn_url} onChange={e => set("cta_btn_url", e.target.value)} placeholder="/contact" />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address (secondary link)</label>
                <input className="form-control" type="email" value={form.cta_email} onChange={e => set("cta_email", e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        {/* French */}
        <div className="admin-card">
          <div className="admin-card-header"><span className="admin-card-title">🇫🇷 Français</span></div>
          <div className="admin-card-body">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Headline Line 1 (dark)</label>
                <input className="form-control" value={form.cta_headline_line1_fr} onChange={e => set("cta_headline_line1_fr", e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Headline Line 2 (gold italic)</label>
                <input className="form-control" value={form.cta_headline_line2_fr} onChange={e => set("cta_headline_line2_fr", e.target.value)} />
              </div>
            </div>
            <div className="form-group" style={{ marginTop: 14 }}>
              <label className="form-label">Body Text</label>
              <textarea className="form-control" rows={2} value={form.cta_body_fr} onChange={e => set("cta_body_fr", e.target.value)} />
            </div>
            <div className="form-row" style={{ marginTop: 14 }}>
              <div className="form-group">
                <label className="form-label">Button Label</label>
                <input className="form-control" value={form.cta_btn_fr} onChange={e => set("cta_btn_fr", e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Email Prefix Label</label>
                <input className="form-control" value={form.cta_email_label_fr} onChange={e => set("cta_email_label_fr", e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        {/* English */}
        <div className="admin-card">
          <div className="admin-card-header"><span className="admin-card-title">🇬🇧 English</span></div>
          <div className="admin-card-body">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Headline Line 1 (dark)</label>
                <input className="form-control" value={form.cta_headline_line1_en} onChange={e => set("cta_headline_line1_en", e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Headline Line 2 (gold italic)</label>
                <input className="form-control" value={form.cta_headline_line2_en} onChange={e => set("cta_headline_line2_en", e.target.value)} />
              </div>
            </div>
            <div className="form-group" style={{ marginTop: 14 }}>
              <label className="form-label">Body Text</label>
              <textarea className="form-control" rows={2} value={form.cta_body_en} onChange={e => set("cta_body_en", e.target.value)} />
            </div>
            <div className="form-row" style={{ marginTop: 14 }}>
              <div className="form-group">
                <label className="form-label">Button Label</label>
                <input className="form-control" value={form.cta_btn_en} onChange={e => set("cta_btn_en", e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Email Prefix Label</label>
                <input className="form-control" value={form.cta_email_label_en} onChange={e => set("cta_email_label_en", e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-gold" disabled={saving}>
          <Save size={14} /> {saving ? "Saving..." : "Save CTA Section"}
        </button>
      </form>
    </AdminShell>
  );
}
