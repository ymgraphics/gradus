"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { AdminShell } from "../../_components/AdminShell";
import { ConfirmDialog } from "../../_components/ConfirmDialog";
import { useToast } from "../../_components/ToastProvider";
import { MediaPicker } from "../../_components/MediaPicker";

export default function EditTeamMemberPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { success, error: showError } = useToast();
  const [form, setForm] = useState<{ name: string; role: string; is_ceo: boolean; image_url: string; tags: string; sort_order: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/team/${id}`)
      .then((r) => r.json())
      .then((d) => setForm({
        name: d.name || "", role: d.role || "", is_ceo: d.is_ceo === true,
        image_url: d.image_url || "", sort_order: Number(d.sort_order || 99),
        tags: Array.isArray(d.tags) ? d.tags.join(", ") : ""
      }))
      .catch(() => showError("Failed to load team member"))
      .finally(() => setLoading(false));
  }, [id]);

  const set = (k: string, v: string | boolean | number) => setForm((f) => f ? { ...f, [k]: v } : f);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    try {
      const tagsArr = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
      const payload = { ...form, tags: tagsArr };
      const res = await fetch(`/api/admin/team/${id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      success("Team member updated!");
    } catch {
      showError("Failed to update team member.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await fetch(`/api/admin/team/${id}`, { method: "DELETE" });
      success("Team member deleted");
      router.push("/admin/team");
    } catch {
      showError("Failed to delete team member");
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  }

  if (loading || !form) return <AdminShell title="Edit Member"><div className="skeleton" style={{ height: 200, borderRadius: 8 }} /></AdminShell>;

  return (
    <AdminShell title={`Edit: ${form.name}`} actions={
      <div style={{ display: "flex", gap: 8 }}>
        <button className="btn btn-danger btn-sm" onClick={() => setShowConfirm(true)}><Trash2 size={13} /> Delete</button>
        <Link href="/admin/team" className="btn btn-outline btn-sm"><ArrowLeft size={13} /> Back</Link>
      </div>
    }>
      <form onSubmit={handleSubmit} className="admin-form" style={{ maxWidth: 600 }}>
        <div className="admin-card">
          <div className="admin-card-header"><span className="admin-card-title">Details</span></div>
          <div className="admin-card-body">
            <div className="form-group">
              <label className="form-label">Name *</label>
              <input className="form-control" value={form.name} onChange={(e) => set("name", e.target.value)} required />
            </div>
            <div className="form-group" style={{ marginTop: 16 }}>
              <label className="form-label">Role *</label>
              <input className="form-control" value={form.role} onChange={(e) => set("role", e.target.value)} required />
            </div>
            <div className="form-group" style={{ marginTop: 16 }}>
              <MediaPicker label="Image URL" value={form.image_url} onChange={(val) => set("image_url", val)} />
            </div>
            <div className="form-group" style={{ marginTop: 16 }}>
              <label className="form-label">Tags (comma-separated)</label>
              <input className="form-control" value={form.tags} onChange={(e) => set("tags", e.target.value)} />
            </div>
            <div className="form-group" style={{ marginTop: 16 }}>
              <label className="form-label">Sort Order</label>
              <input className="form-control" type="number" value={form.sort_order} onChange={(e) => set("sort_order", Number(e.target.value))} />
            </div>
            <div className="form-toggle" style={{ marginTop: 24 }}>
              <button type="button" className={`toggle ${form.is_ceo ? "on" : ""}`} onClick={() => set("is_ceo", !form.is_ceo)} />
              <label className="form-label" style={{ margin: 0 }}>Is CEO / Founder</label>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button type="submit" className="btn btn-gold" disabled={saving}><Save size={14} /> {saving ? "Saving..." : "Save Changes"}</button>
          <Link href="/admin/team" className="btn btn-outline">Cancel</Link>
        </div>
      </form>
      {showConfirm && <ConfirmDialog title="Delete Member" message={`Delete "${form.name}"?`} confirmLabel="Delete" danger loading={deleting} onConfirm={handleDelete} onCancel={() => setShowConfirm(false)} />}
    </AdminShell>
  );
}
