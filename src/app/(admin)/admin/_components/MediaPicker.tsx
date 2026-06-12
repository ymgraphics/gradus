"use client";

import { useState, useEffect, useRef } from "react";
import { Image as ImageIcon, X, UploadCloud, Check, FileIcon } from "lucide-react";
import { useToast } from "./ToastProvider";

interface StorageFile {
  name: string;
  fullPath: string;
  size: number;
  contentType: string;
  timeCreated: string;
  url: string;
  isImage: boolean;
}

interface MediaPickerProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function MediaPicker({ value, onChange, label = "Image URL" }: MediaPickerProps) {
  return (
    <div className="media-picker-wrapper">
      <label className="form-label">{label}</label>
      
      {value ? (
        <div className="media-picker-preview" style={{ position: 'relative', width: 200, height: 120, border: '1px solid var(--admin-border)', borderRadius: 8, overflow: 'hidden', marginBottom: 8 }}>
          <img src={value} alt="Selected" className="media-picker-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      ) : null}
      
      <div style={{ display: 'flex', gap: 8 }}>
        <input 
          type="text" 
          className="admin-input" 
          placeholder="Paste Cloudinary URL..." 
          value={value}
          onChange={e => onChange(e.target.value)} 
          style={{ flex: 1 }} 
        />
        {value && (
          <button type="button" className="btn btn-sm btn-danger" onClick={() => onChange("")}>Clear</button>
        )}
      </div>
    </div>
  );
}

export function MediaPickerModal({ onClose, onSelect }: { onClose: () => void, onSelect: (url: string) => void }) {
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
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
      error("Failed to load media files.");
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
        const res = await fetch("/api/admin/media/upload", { method: "POST", body: formData });
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

  return (
    <div className="media-modal-overlay">
      <div className="media-modal-content admin-card">
        <div className="media-modal-header">
          <h3 style={{ margin: 0, fontSize: 18 }}>Select Media</h3>
          <button type="button" onClick={onClose} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer" }}><X size={20} /></button>
        </div>
        
        <div className="media-modal-body">
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <button type="button" className="btn btn-gold btn-sm" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
              <UploadCloud size={14} /> {uploading ? "Uploading..." : "Upload New File"}
            </button>
            <input type="file" ref={fileInputRef} onChange={handleUpload} multiple style={{ display: "none" }} />
          </div>

          {loading ? (
            <div className="media-grid">
              {Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton" style={{ aspectRatio: "1", borderRadius: 10 }} />)}
            </div>
          ) : files.length === 0 ? (
            <div className="admin-empty" style={{ background: "#1a1a1a" }}>No media files found.</div>
          ) : (
            <div className="media-grid">
              {files.map((file) => (
                <div 
                  key={file.fullPath} 
                  className="media-item"
                  onClick={() => onSelect(file.url)}
                  style={{ cursor: "pointer" }}
                >
                  {file.isImage ? (
                    <img src={file.url} alt={file.name} className="media-item-thumb" loading="lazy" />
                  ) : (
                    <div className="media-item-thumb" style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "#27272a" }}>
                      <FileIcon size={32} color="#9ca3af" />
                    </div>
                  )}
                  <div className="media-item-info">
                    <div className="media-item-name" title={file.name}>{file.name}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
