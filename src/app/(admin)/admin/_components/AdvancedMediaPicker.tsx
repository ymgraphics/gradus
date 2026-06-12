"use client";

import { useState } from "react";
import { Plus, X, Video } from "lucide-react";

export interface MediaAsset {
  id: string;
  url: string;
  type: "video" | "image";
  format: "reel" | "post" | "story" | "landscape" | "photography" | "bts";
  aspect: "portrait" | "landscape" | "square";
  featured?: boolean;
  title?: string;
}

interface AdvancedMediaPickerProps {
  label: string;
  assets: MediaAsset[];
  onChange: (assets: MediaAsset[]) => void;
}

export function AdvancedMediaPicker({ label, assets, onChange }: AdvancedMediaPickerProps) {
  function handleAddEmpty() {
    const newAsset: MediaAsset = {
      id: "asset-" + Math.random().toString(36).substr(2, 9),
      url: "",
      type: "image",
      format: "post",
      aspect: "landscape",
    };
    onChange([...assets, newAsset]);
  }

  function handleRemove(index: number) {
    const newAssets = [...assets];
    newAssets.splice(index, 1);
    onChange(newAssets);
  }

  function handleUpdate(index: number, key: keyof MediaAsset, value: string) {
    const newAssets = [...assets];
    newAssets[index] = { ...newAssets[index], [key]: value };
    
    // Auto-detect video
    if (key === "url") {
      const isVideo = value.endsWith(".mp4") || value.endsWith(".webm") || value.endsWith(".mov") || value.includes("video/upload");
      if (isVideo) {
        newAssets[index].type = "video";
        newAssets[index].format = "reel";
        newAssets[index].aspect = "portrait";
      } else {
        newAssets[index].type = "image";
      }
    }
    
    onChange(newAssets);
  }

  return (
    <div className="adv-media-picker-wrapper">
      <label className="form-label">{label}</label>
      
      <div className="adv-media-grid">
        {assets.map((asset, i) => (
          <div key={asset.id || i} className="adv-media-item">
            <div className="adv-media-preview">
              {asset.url ? (
                asset.type === "video" ? (
                  <div className="multi-media-video-placeholder">
                    <Video size={24} color="#888" />
                    <span className="text-[10px] truncate w-full px-2 text-center" title={asset.url}>
                      {asset.url.split("/").pop()}
                    </span>
                  </div>
                ) : (
                  <img src={asset.url} alt={`Asset ${i}`} className="multi-media-img" />
                )
              ) : (
                <div className="multi-media-video-placeholder">
                  <span className="text-[10px] text-center px-2">Paste URL below</span>
                </div>
              )}
              <button type="button" className="multi-media-remove" onClick={() => handleRemove(i)}>
                <X size={14} />
              </button>
            </div>
            <div className="adv-media-controls">
              <input 
                type="text" 
                placeholder="Cloudinary URL" 
                value={asset.url} 
                onChange={(e) => handleUpdate(i, "url", e.target.value)}
                className="adv-media-select"
                style={{ marginBottom: 4 }}
              />
              <select 
                value={asset.aspect} 
                onChange={(e) => handleUpdate(i, "aspect", e.target.value)}
                className="adv-media-select"
              >
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
                <option value="square">Square</option>
              </select>
              <select 
                value={asset.format} 
                onChange={(e) => handleUpdate(i, "format", e.target.value)}
                className="adv-media-select"
              >
                <option value="post">Post</option>
                <option value="reel">Reel</option>
                <option value="story">Story</option>
                <option value="landscape">Landscape</option>
                <option value="photography">Photography</option>
                <option value="bts">BTS</option>
              </select>
            </div>
          </div>
        ))}

        <button type="button" className="multi-media-add" onClick={handleAddEmpty}>
          <Plus size={24} color="#888" />
          <span>Add Asset</span>
        </button>
      </div>
    </div>
  );
}
