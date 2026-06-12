"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { AdminShell } from "../_components/AdminShell";
import { DataTable } from "../_components/DataTable";
import { ConfirmDialog } from "../_components/ConfirmDialog";
import { useToast } from "../_components/ToastProvider";

interface Feedback {
  id: string;
  _id: string;
  name: string;
  title: string;
  rating: number;
  sort_order: number;
}

export default function FeedbacksPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<{ id: string; name: string } | null>(null);
  const { success, error } = useToast();

  async function fetchFeedbacks() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/feedbacks");
      const data = await res.json();
      const normalized = (Array.isArray(data) ? data : []).map((p: Record<string, unknown>) => ({
        id: (p._id || p.id || "") as string,
        _id: (p._id || p.id || "") as string,
        name: (p.name || "Unnamed") as string,
        title: (p.title || "—") as string,
        rating: Number(p.rating || 5),
        sort_order: Number(p.sort_order || 999),
      }));
      setFeedbacks(normalized.sort((a, b) => a.sort_order - b.sort_order));
    } catch {
      error("Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchFeedbacks(); }, []);

  async function handleDelete(id: string) {
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/feedbacks/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setFeedbacks((prev) => prev.filter((p) => p.id !== id));
      success("Testimonial deleted");
    } catch {
      error("Failed to delete testimonial");
    } finally {
      setDeleting(null);
      setConfirm(null);
    }
  }

  const columns = [
    { key: "sort_order", label: "#", width: "50px", render: (r: Feedback) => (
      <span style={{ color: "#9ca3af", fontSize: 12, fontWeight: 600 }}>{r.sort_order !== 999 ? r.sort_order : "—"}</span>
    )},
    { key: "name", label: "Name", render: (r: Feedback) => <span style={{ fontWeight: 600, color: "#fff" }}>{r.name}</span> },
    { key: "title", label: "Title" },
    { key: "rating", label: "Rating", width: "120px", render: (r: Feedback) => (
      <div style={{ display: "flex", gap: 2, color: "#f59e0b" }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={12} fill={i < r.rating ? "currentColor" : "transparent"} strokeWidth={i < r.rating ? 0 : 1} stroke="#d1d5db" />
        ))}
      </div>
    )},
  ];

  return (
    <AdminShell title="Testimonials" actions={<Link href="/admin/feedbacks/new" className="btn btn-gold"><Plus size={14} /> Add Testimonial</Link>}>
      <DataTable
        columns={columns}
        data={feedbacks}
        loading={loading}
        searchKeys={["name", "title"]}
        emptyMessage="No testimonials found."
        actions={(row) => (
          <>
            <Link href={`/admin/feedbacks/${row.id}`} className="btn btn-ghost btn-xs"><Pencil size={12} /> Edit</Link>
            <button className="btn btn-danger btn-xs" onClick={() => setConfirm({ id: row.id, name: row.name })}><Trash2 size={12} /></button>
          </>
        )}
      />
      {confirm && (
        <ConfirmDialog title="Delete Testimonial" message={`Delete testimonial from "${confirm.name}"?`} confirmLabel="Delete" danger loading={deleting === confirm.id} onConfirm={() => handleDelete(confirm.id)} onCancel={() => setConfirm(null)} />
      )}
    </AdminShell>
  );
}
