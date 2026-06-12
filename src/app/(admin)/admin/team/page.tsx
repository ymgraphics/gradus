"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Award } from "lucide-react";
import { AdminShell } from "../_components/AdminShell";
import { DataTable } from "../_components/DataTable";
import { ConfirmDialog } from "../_components/ConfirmDialog";
import { useToast } from "../_components/ToastProvider";

interface TeamMember {
  id: string;
  _id: string;
  name: string;
  role: string;
  is_ceo: boolean;
  image_url: string;
  sort_order: number;
}

export default function TeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<{ id: string; name: string } | null>(null);
  const { success, error } = useToast();

  async function fetchTeam() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/team");
      const data = await res.json();
      const normalized = (Array.isArray(data) ? data : []).map((p: Record<string, unknown>) => ({
        id: (p._id || p.id || "") as string,
        _id: (p._id || p.id || "") as string,
        name: (p.name || "Unnamed") as string,
        role: (p.role || "—") as string,
        is_ceo: p.is_ceo === true,
        image_url: (p.image_url || "") as string,
        sort_order: Number(p.sort_order || 999),
      }));
      setTeam(normalized.sort((a, b) => a.sort_order - b.sort_order));
    } catch {
      error("Failed to load team");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchTeam(); }, []);

  async function handleDelete(id: string) {
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/team/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setTeam((prev) => prev.filter((p) => p.id !== id));
      success("Team member deleted");
    } catch {
      error("Failed to delete team member");
    } finally {
      setDeleting(null);
      setConfirm(null);
    }
  }

  const columns = [
    { key: "sort_order", label: "#", width: "50px", render: (r: TeamMember) => (
      <span style={{ color: "#9ca3af", fontSize: 12, fontWeight: 600 }}>{r.sort_order !== 999 ? r.sort_order : "—"}</span>
    )},
    { key: "name", label: "Name", render: (r: TeamMember) => (
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {r.image_url ? (
          <img src={r.image_url} alt="" style={{ width: 32, height: 32, borderRadius: 8, objectFit: "cover", background: "#27272a" }} />
        ) : (
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "#e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#9ca3af" }}>
            {r.name[0]}
          </div>
        )}
        <span style={{ fontWeight: 600, color: "#fff" }}>{r.name}</span>
      </div>
    )},
    { key: "role", label: "Role" },
    { key: "is_ceo", label: "CEO", width: "90px", render: (r: TeamMember) => (
      r.is_ceo ? <span className="badge badge-gold"><Award size={10} /> CEO</span> : <span style={{ color: "#d1d5db", fontSize: 12 }}>—</span>
    )},
  ];

  return (
    <AdminShell title="Team Members" actions={<Link href="/admin/team/new" className="btn btn-gold"><Plus size={14} /> Add Member</Link>}>
      <DataTable
        columns={columns}
        data={team}
        loading={loading}
        searchKeys={["name", "role"]}
        emptyMessage="No team members found."
        actions={(row) => (
          <>
            <Link href={`/admin/team/${row.id}`} className="btn btn-ghost btn-xs"><Pencil size={12} /> Edit</Link>
            <button className="btn btn-danger btn-xs" onClick={() => setConfirm({ id: row.id, name: row.name })}><Trash2 size={12} /></button>
          </>
        )}
      />
      {confirm && (
        <ConfirmDialog title="Delete Member" message={`Delete "${confirm.name}"?`} confirmLabel="Delete" danger loading={deleting === confirm.id} onConfirm={() => handleDelete(confirm.id)} onCancel={() => setConfirm(null)} />
      )}
    </AdminShell>
  );
}
