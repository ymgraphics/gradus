"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { AdminShell } from "../../_components/AdminShell";
import { useToast } from "../../_components/ToastProvider";

export default function NewJobPage() {
  const router = useRouter();
  const { success, error } = useToast();
  const [form, setForm] = useState({
    title: "", department: "", type: "Full-time", location: "",
    description: "", link: "", sort_order: 99
  });
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string | number) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) { error("Title is required"); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      success("Job created successfully!");
      router.push("/admin/jobs");
    } catch {
      error("Failed to create job.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminShell
      title="New Job"
      actions={
        <Link href="/admin/jobs" className="btn btn-outline btn-sm">
          <ArrowLeft size={14} /> Back
        </Link>
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
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Contract</option>
                  <option>Internship</option>
                  <option>Freelance</option>
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
              <input className="form-control" type="url" value={form.link} onChange={(e) => set("link", e.target.value)} placeholder="https://" />
            </div>
            <div className="form-group" style={{ marginTop: 16 }}>
              <label className="form-label">Sort Order</label>
              <input className="form-control" type="number" value={form.sort_order} onChange={(e) => set("sort_order", Number(e.target.value))} />
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button type="submit" className="btn btn-gold" disabled={saving}>
            <Save size={14} /> {saving ? "Saving..." : "Create Job"}
          </button>
          <Link href="/admin/jobs" className="btn btn-outline">Cancel</Link>
        </div>
      </form>
    </AdminShell>
  );
}
