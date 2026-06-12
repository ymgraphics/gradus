"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { AdminShell } from "../../_components/AdminShell";
import { ConfirmDialog } from "../../_components/ConfirmDialog";
import { useToast } from "../../_components/ToastProvider";
import { MediaPicker } from "../../_components/MediaPicker";

export default function EditPartnerPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { success, error: showError } = useToast();
  const [form, setForm] = useState<{ name: string; image_url: string; sort_order: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/partners/${id}`)
      .then((r) => r.json())
      .then((d) => setForm({
        name: d.name || "", image_url: d.image_url || "", sort_order: Number(d.sort_order || 99)
      }))
      .catch(() => showError("Failed to load partner"))
      .finally(() => setLoading(false));
  }, [id]);

  const set = (k: string, v: string | number) => setForm((f) => f ? { ...f, [k]: v } : f);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/partners/${id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      success("Partner updated!");
    } catch {
      showError("Failed to update partner.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await fetch(`/api/admin/partners/${id}`, { method: "DELETE" });
      success("Partner deleted");
      router.push("/admin/partners");
    } catch {
      showError("Failed to delete partner");
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  }

  if (loading || !form) return <AdminShell title="Edit Partner"><div className="skeleton" style={{ height: 200, borderRadius: 8 }} /></AdminShell>;

  return (
    <AdminShell title={`Edit: ${form.name}`} actions={
      <div style={{ display: "flex", gap: 8 }}>
        <button className="btn btn-danger btn-sm" onClick={() => setShowConfirm(true)}><Trash2 size={13} /> Delete</button>
        <Link href="/admin/partners" className="btn btn-outline btn-sm"><ArrowLeft size={13} /> Back</Link>
      </div>
    }>
      <form onSubmit={handleSubmit} className="admin-form" style={{ maxWidth: 600 }}>
        <div className="admin-card">
          <div className="admin-card-header"><span className="admin-card-title">Partner Details</span></div>
          <div className="admin-card-body">
            <div className="form-group">
              <label className="form-label">Partner Name *</label>
              <input className="form-control" value={form.name} onChange={(e) => set("name", e.target.value)} required />
            </div>
            <div className="form-group" style={{ marginTop: 16 }}>
              <MediaPicker label="Logo Image URL" value={form.image_url} onChange={(val) => set("image_url", val)} />
            </div>
            <div className="form-group" style={{ marginTop: 16 }}>
              <label className="form-label">Sort Order</label>
              <input className="form-control" type="number" value={form.sort_order} onChange={(e) => set("sort_order", Number(e.target.value))} />
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button type="submit" className="btn btn-gold" disabled={saving}><Save size={14} /> {saving ? "Saving..." : "Save Changes"}</button>
          <Link href="/admin/partners" className="btn btn-outline">Cancel</Link>
        </div>
      </form>
      {showConfirm && <ConfirmDialog title="Delete Partner" message={`Delete partner "${form.name}"?`} confirmLabel="Delete" danger loading={deleting} onConfirm={handleDelete} onCancel={() => setShowConfirm(false)} />}
    </AdminShell>
  );
}
