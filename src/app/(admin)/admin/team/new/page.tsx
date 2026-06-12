"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { AdminShell } from "../../_components/AdminShell";
import { useToast } from "../../_components/ToastProvider";
import { MediaPicker } from "../../_components/MediaPicker";

export default function NewTeamMemberPage() {
  const router = useRouter();
  const { success, error } = useToast();
  const [form, setForm] = useState({ name: "", role: "", is_ceo: false, image_url: "", tags: "", sort_order: 99 });
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string | boolean | number) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { error("Name is required"); return; }
    setSaving(true);
    try {
      const tagsArr = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
      const payload = { ...form, tags: tagsArr };
      const res = await fetch("/api/admin/team", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      success("Team member created!");
      router.push("/admin/team");
    } catch {
      error("Failed to create team member.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminShell title="New Team Member" actions={<Link href="/admin/team" className="btn btn-outline btn-sm"><ArrowLeft size={14} /> Back</Link>}>
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
              <input className="form-control" value={form.tags} onChange={(e) => set("tags", e.target.value)} placeholder="e.g. Design, UI/UX" />
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
          <button type="submit" className="btn btn-gold" disabled={saving}><Save size={14} /> {saving ? "Saving..." : "Create Member"}</button>
          <Link href="/admin/team" className="btn btn-outline">Cancel</Link>
        </div>
      </form>
    </AdminShell>
  );
}
