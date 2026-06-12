"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { AdminShell } from "../_components/AdminShell";
import { DataTable } from "../_components/DataTable";
import { ConfirmDialog } from "../_components/ConfirmDialog";
import { useToast } from "../_components/ToastProvider";

interface Job {
  id: string;
  _id: string;
  title: string;
  department: string;
  type: string;
  location: string;
  sort_order: number;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<{ id: string; name: string } | null>(null);
  const { success, error } = useToast();

  async function fetchJobs() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/jobs");
      const data = await res.json();
      const normalized = (Array.isArray(data) ? data : []).map((p: Record<string, unknown>) => ({
        id: (p._id || p.id || "") as string,
        _id: (p._id || p.id || "") as string,
        title: (p.title || "Untitled") as string,
        department: (p.department || "—") as string,
        type: (p.type || "—") as string,
        location: (p.location || "—") as string,
        sort_order: Number(p.sort_order || 999),
      }));
      setJobs(normalized.sort((a, b) => a.sort_order - b.sort_order));
    } catch {
      error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchJobs(); }, []);

  async function handleDelete(id: string) {
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/jobs/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setJobs((prev) => prev.filter((p) => p.id !== id));
      success("Job deleted successfully");
    } catch {
      error("Failed to delete job");
    } finally {
      setDeleting(null);
      setConfirm(null);
    }
  }

  const columns = [
    { key: "sort_order", label: "#", width: "50px", render: (r: Job) => (
      <span style={{ color: "#9ca3af", fontSize: 12, fontWeight: 600 }}>{r.sort_order !== 999 ? r.sort_order : "—"}</span>
    )},
    { key: "title", label: "Title", render: (r: Job) => (
      <span style={{ fontWeight: 600, color: "#fff" }}>{r.title}</span>
    )},
    { key: "department", label: "Department" },
    { key: "type", label: "Type", width: "100px", render: (r: Job) => (
      <span className="badge badge-blue">{r.type}</span>
    )},
    { key: "location", label: "Location", width: "150px" },
  ];

  return (
    <AdminShell
      title="Jobs"
      actions={
        <Link href="/admin/jobs/new" className="btn btn-gold">
          <Plus size={14} /> Add Job
        </Link>
      }
    >
      <DataTable
        columns={columns}
        data={jobs}
        loading={loading}
        searchKeys={["title", "department", "location"]}
        emptyMessage="No jobs found. Create your first job listing."
        actions={(row) => (
          <>
            <Link href={`/admin/jobs/${row.id}`} className="btn btn-ghost btn-xs">
              <Pencil size={12} /> Edit
            </Link>
            <button
              className="btn btn-danger btn-xs"
              onClick={() => setConfirm({ id: row.id, name: row.title })}
            >
              <Trash2 size={12} />
            </button>
          </>
        )}
      />

      {confirm && (
        <ConfirmDialog
          title="Delete Job"
          message={`Are you sure you want to delete "${confirm.name}"?`}
          confirmLabel="Delete Job"
          danger
          loading={deleting === confirm.id}
          onConfirm={() => handleDelete(confirm.id)}
          onCancel={() => setConfirm(null)}
        />
      )}
    </AdminShell>
  );
}
