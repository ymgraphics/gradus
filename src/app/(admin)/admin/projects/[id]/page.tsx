"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { AdminShell } from "../../_components/AdminShell";
import { ConfirmDialog } from "../../_components/ConfirmDialog";
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

export default function EditProjectPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { success, error: showError } = useToast();
  const [form, setForm] = useState<ProjectForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/projects/${id}`)
      .then((r) => r.json())
      .then((d: any) => {
        setForm({
          client: (d.client as string) || "",
          year: (d.year as string) || "",
          category: (d.category as string) || "",
          industry: (d.industry as string) || "",
          description: (d.content?.description as string) || (d.description as string) || "",
          challenge: (d.content?.challenge as string) || (d.challenge as string) || "",
          solution: (d.content?.solution as string) || (d.solution as string) || "",
          results: (d.content?.results as string) || (d.results as string) || "",
          coverImage: (d.media?.cover as string) || (d.cover_image as string) || (d.coverImage as string) || "",
          logo: (d.media?.logo as string) || (d.logo as string) || "",
          assets: Array.isArray(d.media?.assets) ? (d.media.assets as MediaAsset[]) : [],
          seo_title: (d.seo?.title as string) || (d.seo_title as string) || "",
          seo_description: (d.seo?.description as string) || (d.seo_description as string) || "",
          published: d.settings?.published !== undefined ? d.settings.published : d.published !== false,
          featured: d.settings?.featured !== undefined ? d.settings.featured : !!d.featured,
          sort_order: d.settings?.sort_order !== undefined ? d.settings.sort_order : (Number(d.sort_order) || 99),
          layout_format: (d.settings?.layout_format as string) || (d.layout_format as string) || "half",
          tags: Array.isArray(d.tags) ? d.tags.join(", ") : "",
        });
      })
      .catch(() => showError("Failed to load project"))
      .finally(() => setLoading(false));
  }, [id]);

  const set = (k: keyof ProjectForm, v: string | boolean | number | MediaAsset[]) =>
    setForm((f) => f ? { ...f, [k]: v } : f);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form) return;
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
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      success("Project updated successfully!");
    } catch {
      showError("Failed to save project.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
      success("Project deleted");
      router.push("/admin/projects");
    } catch {
      showError("Failed to delete project");
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  }

  if (loading || !form) {
    return (
      <AdminShell title="Edit Project">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[200, 300, 150].map((h, i) => (
            <div key={i} className="admin-card">
              <div className="admin-card-body">
                <div className="skeleton" style={{ height: h, borderRadius: 8 }} />
              </div>
            </div>
          ))}
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      title={`Edit: ${form.client || "Project"}`}
      actions={
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-danger btn-sm" onClick={() => setShowConfirm(true)}>
            <Trash2 size={13} /> Delete
          </button>
          <Link href="/admin/projects" className="btn btn-outline btn-sm">
            <ArrowLeft size={13} /> Back
          </Link>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="admin-form" style={{ maxWidth: 800 }}>
        <div className="admin-card">
          <div className="admin-card-header"><span className="admin-card-title">Project Identity</span></div>
          <div className="admin-card-body">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Client Name *</label>
                <input className="form-control" value={form.client} onChange={(e) => set("client", e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Year</label>
                <input className="form-control" value={form.year} onChange={(e) => set("year", e.target.value)} />
              </div>
            </div>
            <div className="form-row" style={{ marginTop: 16 }}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <input className="form-control" value={form.category} onChange={(e) => set("category", e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Industry</label>
                <input className="form-control" value={form.industry} onChange={(e) => set("industry", e.target.value)} />
              </div>
            </div>
            <div className="form-group" style={{ marginTop: 16 }}>
              <label className="form-label">Tags (comma-separated)</label>
              <input className="form-control" value={form.tags} onChange={(e) => set("tags", e.target.value)} />
            </div>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-header"><span className="admin-card-title">Case Study Content</span></div>
          <div className="admin-card-body">
            {(["description", "challenge", "solution", "results"] as const).map((field) => (
              <div className="form-group" key={field} style={{ marginBottom: 16 }}>
                <label className="form-label" style={{ textTransform: "capitalize" }}>{field}</label>
                <textarea className="form-control" value={form[field]} onChange={(e) => set(field, e.target.value)} rows={3} />
              </div>
            ))}
          </div>
        </div>

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

        <div className="admin-card">
          <div className="admin-card-header"><span className="admin-card-title">SEO</span></div>
          <div className="admin-card-body">
            <div className="form-group">
              <label className="form-label">Meta Title</label>
              <input className="form-control" value={form.seo_title} onChange={(e) => set("seo_title", e.target.value)} />
            </div>
            <div className="form-group" style={{ marginTop: 16 }}>
              <label className="form-label">Meta Description</label>
              <textarea className="form-control" value={form.seo_description} onChange={(e) => set("seo_description", e.target.value)} rows={2} />
            </div>
          </div>
        </div>

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
            <Save size={14} /> {saving ? "Saving..." : "Save Changes"}
          </button>
          <Link href="/admin/projects" className="btn btn-outline">Cancel</Link>
        </div>
      </form>

      {showConfirm && (
        <ConfirmDialog
          title="Delete Project"
          message={`Delete "${form.client}"? This cannot be undone.`}
          confirmLabel="Delete"
          danger
          loading={deleting}
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </AdminShell>
  );
}
