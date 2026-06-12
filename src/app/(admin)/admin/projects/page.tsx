"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Eye, EyeOff, Star } from "lucide-react";
import { AdminShell } from "../_components/AdminShell";
import { DataTable } from "../_components/DataTable";
import { ConfirmDialog } from "../_components/ConfirmDialog";
import { useToast } from "../_components/ToastProvider";

interface Project {
  id: string;
  _id: string;
  client: string;
  category: string;
  year: string;
  published: boolean;
  featured: boolean;
  sort_order: number;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<{ id: string; name: string } | null>(null);
  const { success, error } = useToast();

  async function fetchProjects() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/projects");
      const data = await res.json();
      const normalized = (Array.isArray(data) ? data : []).map((p: Record<string, unknown>) => ({
        id: (p._id || p.id || "") as string,
        _id: (p._id || p.id || "") as string,
        client: (p.client || "Unnamed") as string,
        category: (p.category || "—") as string,
        year: (p.year || "—") as string,
        published: p.published !== false,
        featured: p.featured === true,
        sort_order: Number(p.sort_order || 999),
      }));
      setProjects(normalized.sort((a, b) => a.sort_order - b.sort_order));
    } catch {
      error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchProjects(); }, []);

  async function handleDelete(id: string) {
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setProjects((prev) => prev.filter((p) => p.id !== id));
      success("Project deleted successfully");
    } catch {
      error("Failed to delete project");
    } finally {
      setDeleting(null);
      setConfirm(null);
    }
  }

  const columns = [
    { key: "sort_order", label: "#", width: "50px", render: (r: Project) => (
      <span style={{ color: "#9ca3af", fontSize: 12, fontWeight: 600 }}>{r.sort_order !== 999 ? r.sort_order : "—"}</span>
    )},
    { key: "client", label: "Client", render: (r: Project) => (
      <span style={{ fontWeight: 600, color: "#fff" }}>{r.client}</span>
    )},
    { key: "category", label: "Category" },
    { key: "year", label: "Year", width: "80px" },
    { key: "published", label: "Status", width: "100px", render: (r: Project) => (
      r.published
        ? <span className="badge badge-green"><Eye size={10} /> Published</span>
        : <span className="badge badge-gray"><EyeOff size={10} /> Draft</span>
    )},
    { key: "featured", label: "Featured", width: "90px", render: (r: Project) => (
      r.featured ? <span className="badge badge-gold"><Star size={10} /> Yes</span> : <span style={{ color: "#d1d5db", fontSize: 12 }}>—</span>
    )},
  ];

  return (
    <AdminShell
      title="Projects"
      actions={
        <Link href="/admin/projects/new" className="btn btn-gold">
          <Plus size={14} /> Add Project
        </Link>
      }
    >
      <DataTable
        columns={columns}
        data={projects}
        loading={loading}
        searchKeys={["client", "category", "year"]}
        emptyMessage="No projects found. Add your first project."
        actions={(row) => (
          <>
            <Link href={`/admin/projects/${row.id}`} className="btn btn-ghost btn-xs">
              <Pencil size={12} /> Edit
            </Link>
            <button
              className="btn btn-danger btn-xs"
              onClick={() => setConfirm({ id: row.id, name: row.client })}
            >
              <Trash2 size={12} />
            </button>
          </>
        )}
      />

      {confirm && (
        <ConfirmDialog
          title="Delete Project"
          message={`Are you sure you want to delete "${confirm.name}"? This action cannot be undone.`}
          confirmLabel="Delete Project"
          danger
          loading={deleting === confirm.id}
          onConfirm={() => handleDelete(confirm.id)}
          onCancel={() => setConfirm(null)}
        />
      )}
    </AdminShell>
  );
}
