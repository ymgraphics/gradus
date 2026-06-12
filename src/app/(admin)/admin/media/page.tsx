"use client";

import { useEffect, useState, useRef } from "react";
import { UploadCloud, Check, Trash2, FileIcon, Copy } from "lucide-react";
import { AdminShell } from "../_components/AdminShell";
import { ConfirmDialog } from "../_components/ConfirmDialog";
import { useToast } from "../_components/ToastProvider";

interface StorageFile {
  name: string;
  fullPath: string;
  size: number;
  contentType: string;
  timeCreated: string;
  url: string;
  isImage: boolean;
}

export default function MediaManagerPage() {
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirmDelete, setConfirmDelete] = useState<string[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { success, error } = useToast();

  async function fetchFiles() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/media?prefix=uploads");
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setFiles(data.files || []);
    } catch {
      error("Failed to load media files. Ensure Storage is configured.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchFiles(); }, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;
    
    setUploading(true);
    let successCount = 0;

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "uploads");

      try {
        const res = await fetch("/api/admin/media/upload", {
          method: "POST",
          body: formData,
        });
        if (!res.ok) throw new Error();
        successCount++;
      } catch {
        error(`Failed to upload ${file.name}`);
      }
    }

    if (successCount > 0) {
      success(`Uploaded ${successCount} file(s)`);
      fetchFiles();
    }
    
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleDelete(paths: string[]) {
    if (paths.length === 0) return;
    try {
      for (const path of paths) {
        await fetch(`/api/admin/media?path=${encodeURIComponent(path)}`, { method: "DELETE" });
      }
      setFiles((prev) => prev.filter((f) => !paths.includes(f.fullPath)));
      setSelected((prev) => {
        const next = new Set(prev);
        paths.forEach(p => next.delete(p));
        return next;
      });
      success(`Deleted ${paths.length} file(s)`);
    } catch {
      error("Failed to delete some files");
    } finally {
      setConfirmDelete(null);
    }
  }

  const toggleSelect = (path: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };

  const copyUrl = (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    success("URL copied to clipboard");
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(2) + " MB";
  };

  return (
    <AdminShell
      title="Media Manager"
      actions={
        <>
          {selected.size > 0 && (
            <button className="btn btn-danger btn-sm" onClick={() => setConfirmDelete(Array.from(selected))}>
              <Trash2 size={14} /> Delete Selected ({selected.size})
            </button>
          )}
          <button className="btn btn-gold" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
            <UploadCloud size={14} /> {uploading ? "Uploading..." : "Upload Files"}
          </button>
          <input type="file" ref={fileInputRef} onChange={handleUpload} multiple style={{ display: "none" }} />
        </>
      }
    >
      {/* Upload Zone */}
      <div 
        className="upload-zone admin-card"
        style={{ marginBottom: 24 }}
        onClick={() => fileInputRef.current?.click()}
      >
        <UploadCloud size={32} style={{ margin: "0 auto 12px" }} />
        <div style={{ fontSize: 16, fontWeight: 600, color: "#fff", marginBottom: 4 }}>Click or drag files to upload</div>
        <div style={{ fontSize: 13 }}>Support for Images, PDFs, and Videos</div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="media-grid">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ aspectRatio: "1", borderRadius: 10 }} />
          ))}
        </div>
      ) : files.length === 0 ? (
        <div className="admin-empty admin-card">
          <div className="admin-empty-title">No media files found</div>
          <div className="admin-empty-desc">Upload some files to get started. They will be stored in your Firebase Storage bucket.</div>
        </div>
      ) : (
        <div className="media-grid">
          {files.map((file) => {
            const isSelected = selected.has(file.fullPath);
            return (
              <div 
                key={file.fullPath} 
                className={`media-item ${isSelected ? "selected" : ""}`}
                onClick={() => toggleSelect(file.fullPath)}
              >
                <div className="media-item-check"><Check size={12} color="#fff" strokeWidth={3} /></div>
                
                {file.isImage ? (
                  <img src={file.url} alt={file.name} className="media-item-thumb" loading="lazy" />
                ) : (
                  <div className="media-item-thumb" style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "#27272a" }}>
                    <FileIcon size={32} color="#9ca3af" />
                  </div>
                )}
                
                <div className="media-item-info">
                  <div className="media-item-name" title={file.name}>{file.name}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                    <div className="media-item-size">{formatSize(file.size)}</div>
                    <button 
                      onClick={(e) => copyUrl(file.url, e)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "#a1a1aa", padding: 2 }}
                      title="Copy public URL"
                    >
                      <Copy size={12} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {confirmDelete && (
        <ConfirmDialog 
          title="Delete Files" 
          message={`Are you sure you want to permanently delete ${confirmDelete.length} file(s) from storage? This cannot be undone.`} 
          confirmLabel="Delete Permanently" 
          danger 
          onConfirm={() => handleDelete(confirmDelete)} 
          onCancel={() => setConfirmDelete(null)} 
        />
      )}
    </AdminShell>
  );
}
