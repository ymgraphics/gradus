"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { AdminShell } from "../../_components/AdminShell";
import { ConfirmDialog } from "../../_components/ConfirmDialog";
import { useToast } from "../../_components/ToastProvider";

export default function EditJobPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { success, error: showError } = useToast();
  const [form, setForm] = useState<{ title: string; department: string; type: string; location: string; description: string; link: string; sort_order: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/jobs/${id}`)
      .then((r) => r.json())
      .then((d) => setForm({
        title: d.title || "", department: d.department || "", type: d.type || "Full-time",
        location: d.location || "", description: d.description || "", link: d.link || "", sort_order: Number(d.sort_order || 99)
      }))
      .catch(() => showError("Failed to load job"))
      .finally(() => setLoading(false));
  }, [id]);

  const set = (k: string, v: string | number) => setForm((f) => f ? { ...f, [k]: v } : f);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/jobs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      success("Job updated successfully!");
    } catch {
      showError("Failed to save job.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await fetch(`/api/admin/jobs/${id}`, { method: "DELETE" });
      success("Job deleted");
      router.push("/admin/jobs");
    } catch {
      showError("Failed to delete job");
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  }

  if (loading || !form) {
    return <AdminShell title="Edit Job"><div className="skeleton" style={{ height: 200, borderRadius: 8 }} /></AdminShell>;
  }

  return (
    <AdminShell
      title={`Edit: ${form.title}`}
      actions={
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-danger btn-sm" onClick={() => setShowConfirm(true)}><Trash2 size={13} /> Delete</button>
          <Link href="/admin/jobs" className="btn btn-outline btn-sm"><ArrowLeft size={13} /> Back</Link>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="admin-form" style={{ maxWidth: 600 }}>
        <div className="admin-card">
          <div className="admin-card-header"><span className="admin-card-title">Job Details</span></div>
          <div className="admin-card-body">
            <div className="form-group">
              <label className="form-label">Job Title *</label>
              <input className="form-control" value={form.title} onChange={(e) => set("title", e.target.value)} required />
            </div>
            <div className="form-row" style={{ marginTop: 16 }}>
              <div className="form-group">
                <label className="form-label">Department</label>
                <input className="form-control" value={form.department} onChange={(e) => set("department", e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Type</label>
                <select className="form-control" value={form.type} onChange={(e) => set("type", e.target.value)}>
                  <option>Full-time</option><option>Part-time</option><option>Contract</option><option>Internship</option><option>Freelance</option>
                </select>
              </div>
            </div>
            <div className="form-group" style={{ marginTop: 16 }}>
              <label className="form-label">Location</label>
              <input className="form-control" value={form.location} onChange={(e) => set("location", e.target.value)} />
            </div>
            <div className="form-group" style={{ marginTop: 16 }}>
              <label className="form-label">Description</label>
              <textarea className="form-control" value={form.description} onChange={(e) => set("description", e.target.value)} rows={4} />
            </div>
            <div className="form-group" style={{ marginTop: 16 }}>
              <label className="form-label">Application Link URL</label>
              <input className="form-control" type="url" value={form.link} onChange={(e) => set("link", e.target.value)} />
            </div>
            <div className="form-group" style={{ marginTop: 16 }}>
              <label className="form-label">Sort Order</label>
              <input className="form-control" type="number" value={form.sort_order} onChange={(e) => set("sort_order", Number(e.target.value))} />
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button type="submit" className="btn btn-gold" disabled={saving}>
            <Save size={14} /> {saving ? "Saving..." : "Save Changes"}
          </button>
          <Link href="/admin/jobs" className="btn btn-outline">Cancel</Link>
        </div>
      </form>

      {showConfirm && (
        <ConfirmDialog title="Delete Job" message={`Delete "${form.title}"?`} confirmLabel="Delete" danger loading={deleting} onConfirm={handleDelete} onCancel={() => setShowConfirm(false)} />
      )}
    </AdminShell>
  );
}
