"use client";

import { useState } from "react";
import { Plus, X, Video } from "lucide-react";
import { MediaPickerModal } from "./MediaPicker";

interface MultiMediaPickerProps {
  label: string;
  urls: string[];
  onChange: (urls: string[]) => void;
  type?: "image" | "video";
}

export function MultiMediaPicker({ label, urls, onChange, type = "image" }: MultiMediaPickerProps) {
  const [modalOpen, setModalOpen] = useState(false);

  function handleAdd(url: string) {
    onChange([...urls, url]);
    setModalOpen(false);
  }

  function handleRemove(index: number) {
    const newUrls = [...urls];
    newUrls.splice(index, 1);
    onChange(newUrls);
  }

  return (
    <div className="multi-media-picker-wrapper">
      <label className="form-label">{label}</label>
      
      <div className="multi-media-grid">
        {urls.map((url, i) => (
          <div key={i} className="multi-media-item">
            {type === "video" || url.endsWith(".mp4") || url.endsWith(".webm") ? (
              <div className="multi-media-video-placeholder">
                <Video size={24} color="#888" />
                <span className="text-[10px] truncate w-full px-2 text-center" title={url}>{url.split("/").pop()}</span>
              </div>
            ) : (
              <img src={url} alt={`Media ${i}`} className="multi-media-img" />
            )}
            <button type="button" className="multi-media-remove" onClick={() => handleRemove(i)}>
              <X size={14} />
            </button>
          </div>
        ))}

        <button type="button" className="multi-media-add" onClick={() => setModalOpen(true)}>
          <Plus size={24} color="#888" />
          <span>Add Media</span>
        </button>
      </div>

      {modalOpen && (
        <MediaPickerModal 
          onClose={() => setModalOpen(false)} 
          onSelect={handleAdd} 
        />
      )}
    </div>
  );
}
