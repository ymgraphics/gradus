"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { AdminShell } from "../../_components/AdminShell";
import { useToast } from "../../_components/ToastProvider";
import { MediaPicker } from "../../_components/MediaPicker";

export default function NewPartnerPage() {
  const router = useRouter();
  const { success, error } = useToast();
  const [form, setForm] = useState({ name: "", image_url: "", sort_order: 99 });
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string | number) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { error("Name is required"); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/partners", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      success("Partner created!");
      router.push("/admin/partners");
    } catch {
      error("Failed to create partner.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminShell title="New Partner" actions={<Link href="/admin/partners" className="btn btn-outline btn-sm"><ArrowLeft size={14} /> Back</Link>}>
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
          <button type="submit" className="btn btn-gold" disabled={saving}><Save size={14} /> {saving ? "Saving..." : "Create Partner"}</button>
          <Link href="/admin/partners" className="btn btn-outline">Cancel</Link>
        </div>
      </form>
    </AdminShell>
  );
}
