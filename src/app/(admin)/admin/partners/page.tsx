"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { AdminShell } from "../_components/AdminShell";
import { DataTable } from "../_components/DataTable";
import { ConfirmDialog } from "../_components/ConfirmDialog";
import { useToast } from "../_components/ToastProvider";

interface Partner {
  id: string;
  _id: string;
  name: string;
  image_url: string;
  sort_order: number;
}

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<{ id: string; name: string } | null>(null);
  const { success, error } = useToast();

  async function fetchPartners() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/partners");
      const data = await res.json();
      const normalized = (Array.isArray(data) ? data : []).map((p: Record<string, unknown>) => ({
        id: (p._id || p.id || "") as string,
        _id: (p._id || p.id || "") as string,
        name: (p.name || "Unnamed") as string,
        image_url: (p.image_url || "") as string,
        sort_order: Number(p.sort_order || 999),
      }));
      setPartners(normalized.sort((a, b) => a.sort_order - b.sort_order));
    } catch {
      error("Failed to load partners");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchPartners(); }, []);

  async function handleDelete(id: string) {
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/partners/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setPartners((prev) => prev.filter((p) => p.id !== id));
      success("Partner deleted");
    } catch {
      error("Failed to delete partner");
    } finally {
      setDeleting(null);
      setConfirm(null);
    }
  }

  const columns = [
    { key: "sort_order", label: "#", width: "50px", render: (r: Partner) => (
      <span style={{ color: "#9ca3af", fontSize: 12, fontWeight: 600 }}>{r.sort_order !== 999 ? r.sort_order : "—"}</span>
    )},
    { key: "name", label: "Partner Name", render: (r: Partner) => (
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {r.image_url ? (
          <div style={{ padding: 4, background: "#111111", border: "1px solid #222222", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", width: 48, height: 48 }}>
            <img src={r.image_url} alt="" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
          </div>
        ) : (
          <div style={{ width: 48, height: 48, borderRadius: 8, background: "#27272a", border: "1px dashed #d1d5db" }} />
        )}
        <span style={{ fontWeight: 600, color: "#fff" }}>{r.name}</span>
      </div>
    )},
  ];

  return (
    <AdminShell title="Partners" actions={<Link href="/admin/partners/new" className="btn btn-gold"><Plus size={14} /> Add Partner</Link>}>
      <DataTable
        columns={columns}
        data={partners}
        loading={loading}
        searchKeys={["name"]}
        emptyMessage="No partners found."
        actions={(row) => (
          <>
            <Link href={`/admin/partners/${row.id}`} className="btn btn-ghost btn-xs"><Pencil size={12} /> Edit</Link>
            <button className="btn btn-danger btn-xs" onClick={() => setConfirm({ id: row.id, name: row.name })}><Trash2 size={12} /></button>
          </>
        )}
      />
      {confirm && (
        <ConfirmDialog title="Delete Partner" message={`Delete partner "${confirm.name}"?`} confirmLabel="Delete" danger loading={deleting === confirm.id} onConfirm={() => handleDelete(confirm.id)} onCancel={() => setConfirm(null)} />
      )}
    </AdminShell>
  );
}
