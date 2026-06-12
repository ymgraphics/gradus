"use client";

import { useEffect, useState, FormEvent } from "react";
import { Save, Layout } from "lucide-react";
import { AdminShell } from "../_components/AdminShell";
import { useToast } from "../_components/ToastProvider";

const VIDEO_PLACEHOLDER = "https://res.cloudinary.com/dxnjje6pf/video/upload/q_auto/f_auto/v1779352523/Gradus_Think_out_of_the_box_prob4_tvmddu.mp4";

export default function HeroAdminPage() {
  const { success, error } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    hero_title1_fr: "Créativité",
    hero_title2_fr: "Haute",
    hero_title3_fr: "Performance.",
    hero_subtitle_fr: "Gradus s'impose comme l'agence créative de référence à Casablanca, fusionnant direction artistique d'avant-garde, production audiovisuelle premium et stratégies d'acquisition agressives. Notre mission : assurer votre suprématie digitale.",
    hero_cta_fr: "Planifier une consultation",
    hero_cta2_fr: "Explorer nos expertises",
    hero_title1_en: "High",
    hero_title2_en: "Performance",
    hero_title3_en: "Creativity.",
    hero_subtitle_en: "We are Gradus. The next-generation creative agency in Casablanca blending avant-garde design, premium video production, and aggressive growth marketing. No fluff, just measurable brand dominance.",
    hero_cta_en: "Schedule brief",
    hero_cta2_en: "View our assets",
    hero_video_url: VIDEO_PLACEHOLDER,
    hero_location_line: "Casablanca, Maroc · contact@gradus.ma",
  });

  useEffect(() => {
    fetch("/api/admin/site-content")
      .then(r => r.json())
      .then(d => {
        if (d && Object.keys(d).length > 0) {
          setForm(prev => ({
            ...prev,
            hero_title1_fr: d.hero_title1_fr || prev.hero_title1_fr,
            hero_title2_fr: d.hero_title2_fr || prev.hero_title2_fr,
            hero_title3_fr: d.hero_title3_fr || prev.hero_title3_fr,
            hero_subtitle_fr: d.hero_subtitle_fr || prev.hero_subtitle_fr,
            hero_cta_fr: d.hero_cta_fr || prev.hero_cta_fr,
            hero_cta2_fr: d.hero_cta2_fr || prev.hero_cta2_fr,
            hero_title1_en: d.hero_title1_en || prev.hero_title1_en,
            hero_title2_en: d.hero_title2_en || prev.hero_title2_en,
            hero_title3_en: d.hero_title3_en || prev.hero_title3_en,
            hero_subtitle_en: d.hero_subtitle_en || prev.hero_subtitle_en,
            hero_cta_en: d.hero_cta_en || prev.hero_cta_en,
            hero_cta2_en: d.hero_cta2_en || prev.hero_cta2_en,
            hero_video_url: d.hero_video_url || prev.hero_video_url,
            hero_location_line: d.hero_location_line || prev.hero_location_line,
          }));
        }
      })
      .catch(() => error("Failed to load content"))
      .finally(() => setLoading(false));
  }, []);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      // Merge with existing site_content doc
      const existing = await fetch("/api/admin/site-content").then(r => r.json());
      const res = await fetch("/api/admin/site-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...existing, ...form }),
      });
      if (!res.ok) throw new Error();
      success("Hero content saved!");
    } catch {
      error("Failed to save hero content.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <AdminShell title="Hero"><div className="skeleton" style={{ height: 400, borderRadius: 8 }} /></AdminShell>;

  return (
    <AdminShell title="Hero Section">
      <form onSubmit={handleSubmit} className="admin-form" style={{ maxWidth: 860 }}>

        {/* Video URL */}
        <div className="admin-card">
          <div className="admin-card-header">
            <Layout size={15} style={{ color: "#D4A843" }} />
            <span className="admin-card-title">Background Video</span>
          </div>
          <div className="admin-card-body">
            <div className="form-group">
              <label className="form-label">Cloudinary Video URL</label>
              <input
                className="form-control"
                value={form.hero_video_url}
                onChange={e => set("hero_video_url", e.target.value)}
                placeholder={VIDEO_PLACEHOLDER}
              />
              <span className="form-hint" style={{ marginTop: 4, display: "block" }}>
                Paste a Cloudinary (or any hosted) MP4 URL. Replaces the full-screen hero background video.
              </span>
            </div>
            {form.hero_video_url && (
              <video
                src={form.hero_video_url}
                muted playsInline
                style={{ marginTop: 12, width: "100%", maxHeight: 180, borderRadius: 8, objectFit: "cover", border: "1px solid rgba(255,255,255,0.08)" }}
              />
            )}
          </div>
        </div>

        {/* Location line */}
        <div className="admin-card">
          <div className="admin-card-header"><span className="admin-card-title">Location Line</span></div>
          <div className="admin-card-body">
            <div className="form-group">
              <label className="form-label">Bottom Caption Text</label>
              <input className="form-control" value={form.hero_location_line} onChange={e => set("hero_location_line", e.target.value)} />
            </div>
          </div>
        </div>

        {/* French content */}
        <div className="admin-card">
          <div className="admin-card-header"><span className="admin-card-title">🇫🇷 Français</span></div>
          <div className="admin-card-body">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Title Line 1</label>
                <input className="form-control" value={form.hero_title1_fr} onChange={e => set("hero_title1_fr", e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Title Line 2</label>
                <input className="form-control" value={form.hero_title2_fr} onChange={e => set("hero_title2_fr", e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Title Line 3 (Underlined)</label>
                <input className="form-control" value={form.hero_title3_fr} onChange={e => set("hero_title3_fr", e.target.value)} />
              </div>
            </div>
            <div className="form-group" style={{ marginTop: 16 }}>
              <label className="form-label">Subtitle</label>
              <textarea className="form-control" rows={3} value={form.hero_subtitle_fr} onChange={e => set("hero_subtitle_fr", e.target.value)} />
            </div>
            <div className="form-row" style={{ marginTop: 16 }}>
              <div className="form-group">
                <label className="form-label">Primary CTA</label>
                <input className="form-control" value={form.hero_cta_fr} onChange={e => set("hero_cta_fr", e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Secondary CTA</label>
                <input className="form-control" value={form.hero_cta2_fr} onChange={e => set("hero_cta2_fr", e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        {/* English content */}
        <div className="admin-card">
          <div className="admin-card-header"><span className="admin-card-title">🇬🇧 English</span></div>
          <div className="admin-card-body">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Title Line 1</label>
                <input className="form-control" value={form.hero_title1_en} onChange={e => set("hero_title1_en", e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Title Line 2</label>
                <input className="form-control" value={form.hero_title2_en} onChange={e => set("hero_title2_en", e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Title Line 3 (Underlined)</label>
                <input className="form-control" value={form.hero_title3_en} onChange={e => set("hero_title3_en", e.target.value)} />
              </div>
            </div>
            <div className="form-group" style={{ marginTop: 16 }}>
              <label className="form-label">Subtitle</label>
              <textarea className="form-control" rows={3} value={form.hero_subtitle_en} onChange={e => set("hero_subtitle_en", e.target.value)} />
            </div>
            <div className="form-row" style={{ marginTop: 16 }}>
              <div className="form-group">
                <label className="form-label">Primary CTA</label>
                <input className="form-control" value={form.hero_cta_en} onChange={e => set("hero_cta_en", e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Secondary CTA</label>
                <input className="form-control" value={form.hero_cta2_en} onChange={e => set("hero_cta2_en", e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-gold" disabled={saving}>
          <Save size={14} /> {saving ? "Saving..." : "Save Hero Content"}
        </button>
      </form>
    </AdminShell>
  );
}
