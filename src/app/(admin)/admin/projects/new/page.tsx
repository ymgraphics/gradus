"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { AdminShell } from "../../_components/AdminShell";
import { useToast } from "../../_components/ToastProvider";
import { MediaPicker } from "../../_components/MediaPicker";
import { AdvancedMediaPicker, MediaAsset } from "../../_components/AdvancedMediaPicker";

interface ProjectForm {
  client: string; year: string; category: string; industry: string;
  description: string; challenge: string; solution: string; results: string;
  coverImage: string; logo: string;
  assets: MediaAsset[];
  seo_title: string; seo_description: string;
  published: boolean; featured: boolean; sort_order: number; layout_format: string;
  tags: string;
}

const EMPTY: ProjectForm = {
  client: "", year: new Date().getFullYear().toString(), category: "", industry: "",
  description: "", challenge: "", solution: "", results: "",
  coverImage: "", logo: "",
  assets: [],
  seo_title: "", seo_description: "",
  published: true, featured: false, sort_order: 99, layout_format: "half",
  tags: "",
};

export default function NewProjectPage() {
  const router = useRouter();
  const { success, error } = useToast();
  const [form, setForm] = useState<ProjectForm>(EMPTY);
  const [saving, setSaving] = useState(false);

  const set = (k: keyof ProjectForm, v: string | boolean | number | MediaAsset[]) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.client.trim()) { error("Client name is required"); return; }
    setSaving(true);
    try {
      const tagsArr = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
      const payload = {
        client: form.client,
        year: form.year,
        category: form.category,
        industry: form.industry,
        tags: tagsArr,
        content: {
          description: form.description,
          challenge: form.challenge,
          solution: form.solution,
          results: form.results,
        },
        media: {
          cover: form.coverImage,
          logo: form.logo,
          assets: form.assets,
        },
        seo: {
          title: form.seo_title,
          description: form.seo_description,
        },
        settings: {
          published: form.published,
          featured: form.featured,
          sort_order: Number(form.sort_order),
          layout_format: form.layout_format,
        }
      };
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      success("Project created successfully!");
      router.push("/admin/projects");
    } catch {
      error("Failed to create project. Try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminShell
      title="New Project"
      actions={
        <Link href="/admin/projects" className="btn btn-outline btn-sm">
          <ArrowLeft size={14} /> Back
        </Link>
      }
    >
      <form onSubmit={handleSubmit} className="admin-form" style={{ maxWidth: 800 }}>
        {/* Identity */}
        <div className="admin-card">
          <div className="admin-card-header"><span className="admin-card-title">Project Identity</span></div>
          <div className="admin-card-body">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Client Name *</label>
                <input className="form-control" value={form.client} onChange={(e) => set("client", e.target.value)} placeholder="e.g. Dar Dada" required />
              </div>
              <div className="form-group">
                <label className="form-label">Year</label>
                <input className="form-control" value={form.year} onChange={(e) => set("year", e.target.value)} placeholder="2024" />
              </div>
            </div>
            <div className="form-row" style={{ marginTop: 16 }}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <input className="form-control" value={form.category} onChange={(e) => set("category", e.target.value)} placeholder="e.g. Branding · Social Media" />
              </div>
              <div className="form-group">
                <label className="form-label">Industry</label>
                <input className="form-control" value={form.industry} onChange={(e) => set("industry", e.target.value)} placeholder="e.g. Food & Beverage" />
              </div>
            </div>
          </div>
          <div className="admin-card">
            <h3>Publishing & SEO</h3>
            <div className="form-group" style={{ marginTop: 16 }}>
              <label className="form-label">Layout Format</label>
              <select className="admin-input" value={form.layout_format} onChange={e => set("layout_format", e.target.value)}>
                <option value="full">Full Width</option>
                <option value="half">Half Width (2 Columns)</option>
                <option value="third">Third Width (3 Columns)</option>
              </select>
            </div>
            <div className="form-group" style={{ marginTop: 16 }}>
              <label className="form-label">Tags (comma-separated)</label>
              <input className="form-control" value={form.tags} onChange={(e) => set("tags", e.target.value)} placeholder="Branding, Social Media, Print" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="admin-card">
          <div className="admin-card-header"><span className="admin-card-title">Case Study Content</span></div>
          <div className="admin-card-body">
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-control" value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Short project description..." rows={3} />
            </div>
            <div className="form-group" style={{ marginTop: 16 }}>
              <label className="form-label">Challenge</label>
              <textarea className="form-control" value={form.challenge} onChange={(e) => set("challenge", e.target.value)} placeholder="What problem did the client face?" rows={3} />
            </div>
            <div className="form-group" style={{ marginTop: 16 }}>
              <label className="form-label">Solution</label>
              <textarea className="form-control" value={form.solution} onChange={(e) => set("solution", e.target.value)} placeholder="How did you solve it?" rows={3} />
            </div>
            <div className="form-group" style={{ marginTop: 16 }}>
              <label className="form-label">Results</label>
              <textarea className="form-control" value={form.results} onChange={(e) => set("results", e.target.value)} placeholder="What were the measurable outcomes?" rows={3} />
            </div>
          </div>
        </div>

        {/* Media */}
        <div className="admin-card">
          <div className="admin-card-header"><span className="admin-card-title">Media</span></div>
          <div className="admin-card-body">
            <div className="form-group">
              <MediaPicker label="Cover Image URL" value={form.coverImage} onChange={(val) => set("coverImage", val)} />
            </div>
            <div className="form-group" style={{ marginTop: 16 }}>
              <MediaPicker label="Logo URL" value={form.logo} onChange={(val) => set("logo", val)} />
            </div>
            <div className="form-group" style={{ marginTop: 16 }}>
              <AdvancedMediaPicker label="Media Assets" assets={form.assets} onChange={(val) => set("assets", val)} />
            </div>
          </div>
        </div>

        {/* SEO */}
        <div className="admin-card">
          <div className="admin-card-header"><span className="admin-card-title">SEO</span></div>
          <div className="admin-card-body">
            <div className="form-group">
              <label className="form-label">Meta Title</label>
              <input className="form-control" value={form.seo_title} onChange={(e) => set("seo_title", e.target.value)} placeholder="Project SEO title..." />
            </div>
            <div className="form-group" style={{ marginTop: 16 }}>
              <label className="form-label">Meta Description</label>
              <textarea className="form-control" value={form.seo_description} onChange={(e) => set("seo_description", e.target.value)} rows={2} placeholder="Project meta description..." />
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="admin-card">
          <div className="admin-card-header"><span className="admin-card-title">Settings</span></div>
          <div className="admin-card-body">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Sort Order</label>
                <input className="form-control" type="number" value={form.sort_order} onChange={(e) => set("sort_order", Number(e.target.value))} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 24, marginTop: 16 }}>
              <div className="form-toggle">
                <button type="button" className={`toggle ${form.published ? "on" : ""}`} onClick={() => set("published", !form.published)} />
                <label className="form-label" style={{ margin: 0 }}>Published</label>
              </div>
              <div className="form-toggle">
                <button type="button" className={`toggle ${form.featured ? "on" : ""}`} onClick={() => set("featured", !form.featured)} />
                <label className="form-label" style={{ margin: 0 }}>Featured</label>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button type="submit" className="btn btn-gold" disabled={saving}>
            <Save size={14} /> {saving ? "Saving..." : "Create Project"}
          </button>
          <Link href="/admin/projects" className="btn btn-outline">Cancel</Link>
        </div>
      </form>
    </AdminShell>
  );
}
