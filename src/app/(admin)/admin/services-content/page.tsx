"use client";

import { useEffect, useState, FormEvent } from "react";
import { Save, Plus, Trash2, GripVertical } from "lucide-react";
import { AdminShell } from "../_components/AdminShell";
import { useToast } from "../_components/ToastProvider";

interface ServiceItem {
  num: string;
  icon: string;
  title_fr: string;
  title_en: string;
  desc_fr: string;
  desc_en: string;
}

const DEFAULT_SERVICES: ServiceItem[] = [
  { num: "01", icon: "🪪", title_fr: "Identité Visuelle",    title_en: "Brand Identity",        desc_fr: "Élaboration stratégique de votre identité visuelle — logotype, systèmes graphiques et guidelines institutionnelles.", desc_en: "Comprehensive brand building — logo, graphic charter, guidelines." },
  { num: "02", icon: "🌐", title_fr: "Web Design",           title_en: "Web Design",             desc_fr: "Développement d'interfaces web ultra-performantes — vitrines corporatives, plateformes e-commerce et landing pages optimisées.",       desc_en: "Modern, fast, optimized websites — showcase, e-commerce, landing pages." },
  { num: "03", icon: "📱", title_fr: "Community Management", title_en: "Community Management",   desc_fr: "Pilotage stratégique de vos réseaux sociaux, production de contenus à haute valeur ajoutée et gestion de communauté.",        desc_en: "Social media management, content creation, and community engagement." },
  { num: "04", icon: "📸", title_fr: "Photo Shooting",       title_en: "Photo Shooting",         desc_fr: "Direction photographique haut de gamme — packshot produit, portraits institutionnels, reportages corporate et lifestyle.",              desc_en: "Professional photoshoots — product, portrait, corporate, lifestyle." },
  { num: "05", icon: "🎬", title_fr: "Vidéo Making",         title_en: "Video Making",           desc_fr: "Production cinématographique complète — spots publicitaires, formats digitaux et couverture d'événements majeurs.",          desc_en: "Video shooting and editing — commercials, social networks, events." },
  { num: "06", icon: "📊", title_fr: "Stratégies Marketing", title_en: "Marketing Strategies",   desc_fr: "Conception de plans d'acquisition digitaux structurés pour maximiser votre retour sur investissement.",       desc_en: "Tailor-made digital communication plans to achieve your business goals." },
  { num: "07", icon: "✨", title_fr: "Branding",             title_en: "Branding",               desc_fr: "Définition du positionnement, stratégie de naming, architecture de marque et storytelling institutionnel.",         desc_en: "Strategic positioning, naming, brand storytelling, and global identity." },
  { num: "08", icon: "🧊", title_fr: "Conception 3D",        title_en: "3D Design",              desc_fr: "Modélisation 3D avancée, rendus architecturaux photoréalistes et conceptions visuelles immersives.",              desc_en: "3D modeling, architectural renders, and immersive visuals for your projects." },
  { num: "09", icon: "🖼", title_fr: "Design Graphique",     title_en: "Graphic Design",         desc_fr: "Direction artistique pour vos supports physiques — conception de packagings, affichage publicitaire et éditions premium.",               desc_en: "Flyers, posters, packaging, print materials — complete visual creation." },
  { num: "10", icon: "💡", title_fr: "Vision Créative",      title_en: "Creative Vision",        desc_fr: "Idéation et direction artistique globale pour orchestrer des campagnes publicitaires d'envergure.",           desc_en: "Global creative concept and art direction for your campaigns and projects." },
  { num: "11", icon: "✏️", title_fr: "Design",               title_en: "Design",                 desc_fr: "Création de systèmes visuels holistiques, incluant l'iconographie sur mesure et le design d'interface.",                    desc_en: "Interface design, iconography, and coherent visual systems." },
  { num: "12", icon: "🎯", title_fr: "Production Unique",    title_en: "Unique Production",      desc_fr: "Déploiement de stratégies de communication exclusives dédiées aux projets atypiques et hautement confidentiels.",                      desc_en: "Tailored communication for special and extraordinary projects." },
];

export default function ServicesAdminPage() {
  const { success, error } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [services, setServices] = useState<ServiceItem[]>(DEFAULT_SERVICES);
  const [sectionTitle1_fr, setSectionTitle1Fr] = useState("Nos");
  const [sectionTitle2_fr, setSectionTitle2Fr] = useState("Expertises.");
  const [sectionTitle1_en, setSectionTitle1En] = useState("Our");
  const [sectionTitle2_en, setSectionTitle2En] = useState("Weapons.");
  const [expanded, setExpanded] = useState<number | null>(0);

  useEffect(() => {
    fetch("/api/admin/site-content")
      .then(r => r.json())
      .then(d => {
        if (d?.services_items && Array.isArray(d.services_items)) setServices(d.services_items);
        if (d?.services_title1_fr) setSectionTitle1Fr(d.services_title1_fr);
        if (d?.services_title2_fr) setSectionTitle2Fr(d.services_title2_fr);
        if (d?.services_title1_en) setSectionTitle1En(d.services_title1_en);
        if (d?.services_title2_en) setSectionTitle2En(d.services_title2_en);
      })
      .catch(() => error("Failed to load services"))
      .finally(() => setLoading(false));
  }, []);

  const update = (i: number, key: keyof ServiceItem, val: string) =>
    setServices(prev => prev.map((s, idx) => idx === i ? { ...s, [key]: val } : s));

  const addService = () => {
    const num = String(services.length + 1).padStart(2, "0");
    setServices(prev => [...prev, { num, icon: "⭐", title_fr: "Nouveau Service", title_en: "New Service", desc_fr: "Description en français.", desc_en: "Description in English." }]);
    setExpanded(services.length);
  };

  const removeService = (i: number) => {
    setServices(prev => prev.filter((_, idx) => idx !== i).map((s, idx) => ({ ...s, num: String(idx + 1).padStart(2, "0") })));
    setExpanded(null);
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const existing = await fetch("/api/admin/site-content").then(r => r.json());
      const res = await fetch("/api/admin/site-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...existing,
          services_items: services,
          services_title1_fr: sectionTitle1_fr,
          services_title2_fr: sectionTitle2_fr,
          services_title1_en: sectionTitle1_en,
          services_title2_en: sectionTitle2_en,
        }),
      });
      if (!res.ok) throw new Error();
      success("Services saved!");
    } catch {
      error("Failed to save services.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <AdminShell title="Services"><div className="skeleton" style={{ height: 400, borderRadius: 8 }} /></AdminShell>;

  return (
    <AdminShell title="Services Section"
      actions={
        <button type="button" className="btn btn-outline btn-sm" onClick={addService}>
          <Plus size={13} /> Add Service
        </button>
      }
    >
      <form onSubmit={handleSubmit} className="admin-form" style={{ maxWidth: 840 }}>

        {/* Section headline */}
        <div className="admin-card">
          <div className="admin-card-header"><span className="admin-card-title">Section Headline</span></div>
          <div className="admin-card-body">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Title Word 1 🇫🇷</label>
                <input className="form-control" value={sectionTitle1_fr} onChange={e => setSectionTitle1Fr(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Title Word 2 🇫🇷 (gold italic)</label>
                <input className="form-control" value={sectionTitle2_fr} onChange={e => setSectionTitle2Fr(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Title Word 1 🇬🇧</label>
                <input className="form-control" value={sectionTitle1_en} onChange={e => setSectionTitle1En(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Title Word 2 🇬🇧 (gold italic)</label>
                <input className="form-control" value={sectionTitle2_en} onChange={e => setSectionTitle2En(e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        {/* Service cards */}
        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-title">{services.length} Service Cards</span>
          </div>
          <div className="admin-card-body" style={{ padding: 0 }}>
            {services.map((svc, i) => (
              <div key={i} style={{ borderBottom: i < services.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                {/* Accordion header */}
                <div
                  onClick={() => setExpanded(expanded === i ? null : i)}
                  style={{
                    display: "flex", alignItems: "center", gap: 12, padding: "14px 20px",
                    cursor: "pointer", transition: "background 0.12s",
                  }}
                >
                  <GripVertical size={14} style={{ color: "rgba(255,255,255,0.2)", flexShrink: 0 }} />
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{svc.icon}</span>
                  <span style={{ fontWeight: 500, color: "#fff", fontSize: 13, flex: 1 }}>{svc.title_fr}</span>
                  <span style={{ fontSize: 10, fontFamily: "monospace", color: "rgba(255,255,255,0.25)" }}>{svc.num}</span>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={e => { e.stopPropagation(); removeService(i); }}
                    style={{ color: "rgba(255,80,80,0.4)", flexShrink: 0 }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>

                {/* Accordion body */}
                {expanded === i && (
                  <div style={{ padding: "0 20px 20px" }}>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Icon (emoji)</label>
                        <input className="form-control" value={svc.icon} onChange={e => update(i, "icon", e.target.value)} style={{ fontSize: 18 }} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Number Label</label>
                        <input className="form-control" value={svc.num} onChange={e => update(i, "num", e.target.value)} />
                      </div>
                    </div>
                    <div className="form-row" style={{ marginTop: 12 }}>
                      <div className="form-group">
                        <label className="form-label">Title 🇫🇷</label>
                        <input className="form-control" value={svc.title_fr} onChange={e => update(i, "title_fr", e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Title 🇬🇧</label>
                        <input className="form-control" value={svc.title_en} onChange={e => update(i, "title_en", e.target.value)} />
                      </div>
                    </div>
                    <div className="form-group" style={{ marginTop: 12 }}>
                      <label className="form-label">Description 🇫🇷</label>
                      <textarea className="form-control" rows={2} value={svc.desc_fr} onChange={e => update(i, "desc_fr", e.target.value)} />
                    </div>
                    <div className="form-group" style={{ marginTop: 12 }}>
                      <label className="form-label">Description 🇬🇧</label>
                      <textarea className="form-control" rows={2} value={svc.desc_en} onChange={e => update(i, "desc_en", e.target.value)} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="btn btn-gold" disabled={saving}>
          <Save size={14} /> {saving ? "Saving..." : "Save Services"}
        </button>
      </form>
    </AdminShell>
  );
}
