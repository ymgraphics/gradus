"use client";

import { useEffect, useState, FormEvent } from "react";
import { Save, Plus, Trash2 } from "lucide-react";
import { AdminShell } from "../_components/AdminShell";
import { useToast } from "../_components/ToastProvider";

interface StatItem { value: number; suffix: string; label_fr: string; label_en: string; }

const DEFAULT_STATS: StatItem[] = [
  { value: 98, suffix: "+", label_fr: "Campagnes Déployées",   label_en: "Brand Cases" },
  { value: 65, suffix: "",  label_fr: "Experts Dédiés",     label_en: "Creative Talents" },
  { value: 5,  suffix: "",  label_fr: "Années d'Excellence",   label_en: "Years of Impulse" },
  { value: 35, suffix: "",  label_fr: "Partenaires Stratégiques",  label_en: "Partner Brands" },
];

export default function StatsAdminPage() {
  const { success, error } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState<StatItem[]>(DEFAULT_STATS);

  useEffect(() => {
    fetch("/api/admin/site-content")
      .then(r => r.json())
      .then(d => {
        if (d?.stats_items && Array.isArray(d.stats_items) && d.stats_items.length > 0) {
          setStats(d.stats_items);
        }
      })
      .catch(() => error("Failed to load stats"))
      .finally(() => setLoading(false));
  }, []);

  const updateStat = (i: number, key: keyof StatItem, val: string | number) => {
    setStats(prev => prev.map((s, idx) => idx === i ? { ...s, [key]: val } : s));
  };

  const addStat = () => setStats(prev => [...prev, { value: 0, suffix: "", label_fr: "Nouveau Stat", label_en: "New Stat" }]);
  const removeStat = (i: number) => setStats(prev => prev.filter((_, idx) => idx !== i));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const existing = await fetch("/api/admin/site-content").then(r => r.json());
      const res = await fetch("/api/admin/site-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...existing, stats_items: stats }),
      });
      if (!res.ok) throw new Error();
      success("Stats saved!");
    } catch {
      error("Failed to save stats.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <AdminShell title="Stats"><div className="skeleton" style={{ height: 300, borderRadius: 8 }} /></AdminShell>;

  return (
    <AdminShell title="Stats Section"
      actions={
        <button type="button" className="btn btn-outline btn-sm" onClick={addStat}>
          <Plus size={13} /> Add Stat
        </button>
      }
    >
      <form onSubmit={handleSubmit} className="admin-form" style={{ maxWidth: 720 }}>
        <div className="admin-card">
          <div className="admin-card-header"><span className="admin-card-title">Counter Stats</span></div>
          <div className="admin-card-body" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {stats.map((stat, i) => (
              <div key={i} style={{
                padding: 16, borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(255,255,255,0.02)",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <span style={{ fontSize: 10, fontFamily: "monospace", color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    Stat #{i + 1}
                  </span>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => removeStat(i)} style={{ color: "rgba(255,100,100,0.5)" }}>
                    <Trash2 size={12} />
                  </button>
                </div>
                {/* Preview */}
                <div style={{ textAlign: "center", marginBottom: 16, padding: "12px", background: "rgba(212,168,67,0.04)", borderRadius: 8 }}>
                  <span style={{ fontSize: 40, fontWeight: 800, color: "#D4A843" }}>
                    {stat.value}{stat.suffix}
                  </span>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    {stat.label_fr}
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Number</label>
                    <input
                      type="number" className="form-control"
                      value={stat.value}
                      onChange={e => updateStat(i, "value", Number(e.target.value))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Suffix (e.g. +, %)</label>
                    <input
                      className="form-control" value={stat.suffix}
                      onChange={e => updateStat(i, "suffix", e.target.value)}
                      placeholder="+ or % or blank"
                    />
                  </div>
                </div>
                <div className="form-row" style={{ marginTop: 12 }}>
                  <div className="form-group">
                    <label className="form-label">Label 🇫🇷</label>
                    <input className="form-control" value={stat.label_fr} onChange={e => updateStat(i, "label_fr", e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Label 🇬🇧</label>
                    <input className="form-control" value={stat.label_en} onChange={e => updateStat(i, "label_en", e.target.value)} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="btn btn-gold" disabled={saving}>
          <Save size={14} /> {saving ? "Saving..." : "Save Stats"}
        </button>
      </form>
    </AdminShell>
  );
}
