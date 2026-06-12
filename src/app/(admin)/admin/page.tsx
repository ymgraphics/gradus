import { cookies } from "next/headers";
import { AdminShell } from "./_components/AdminShell";
import {
  FolderKanban, Briefcase, Users, MessageSquare,
  Handshake, TrendingUp, Plus, Mail, ExternalLink,
  Layout, BarChart2, Star, Zap,
} from "lucide-react";
import Link from "next/link";

async function getSessionEmail(): Promise<string> {
  const cookieStore = await cookies();
  const token = cookieStore.get("__session")?.value;
  if (!token) return "Admin";
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return "Admin";
    const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString());
    return payload.email || "Admin";
  } catch {
    return "Admin";
  }
}

async function getStats() {
  const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "gradus-portfolio";
  const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDApEMlRaUq3UnRwM2cn3qQEByG6nsX7YM";
  const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

  const fetchCount = async (col: string) => {
    try {
      const r = await fetch(`${BASE}/${col}?key=${API_KEY}&pageSize=200`, { cache: "no-store" });
      if (!r.ok) return 0;
      const d = await r.json();
      return (d.documents?.length) || 0;
    } catch { return 0; }
  };

  const [projects, jobs, team, feedbacks, partners, subscribers] = await Promise.all([
    fetchCount("projects"),
    fetchCount("jobs"),
    fetchCount("team_members"),
    fetchCount("feedbacks"),
    fetchCount("partners"),
    fetchCount("subscribers"),
  ]);

  return { projects, jobs, team, feedbacks, partners, subscribers };
}

export default async function AdminDashboard() {
  const [email, stats] = await Promise.all([getSessionEmail(), getStats()]);

  const statCards = [
    { label: "Projects",     value: stats.projects,    icon: FolderKanban, href: "/admin/projects",    color: "#6366f1", bg: "#eef2ff" },
    { label: "Jobs",         value: stats.jobs,        icon: Briefcase,    href: "/admin/jobs",        color: "#0ea5e9", bg: "#e0f2fe" },
    { label: "Team",         value: stats.team,        icon: Users,        href: "/admin/team",        color: "#10b981", bg: "#d1fae5" },
    { label: "Testimonials", value: stats.feedbacks,   icon: MessageSquare,href: "/admin/feedbacks",   color: "#f59e0b", bg: "#fef3c7" },
    { label: "Partners",     value: stats.partners,    icon: Handshake,    href: "/admin/partners",    color: "#D4A843", bg: "rgba(212,168,67,0.12)" },
    { label: "Subscribers",  value: stats.subscribers, icon: Mail,         href: "/admin/subscribers", color: "#ec4899", bg: "rgba(236,72,153,0.12)" },
  ];

  const quickActions = [
    { label: "Add Project",      href: "/admin/projects/new", icon: Plus },
    { label: "Add Team Member",  href: "/admin/team/new",     icon: Plus },
    { label: "Add Job",          href: "/admin/jobs/new",     icon: Plus },
    { label: "Subscribers CRM",  href: "/admin/subscribers",  icon: Mail },
    { label: "View Live Site",   href: "https://gradus.ma",   icon: ExternalLink, external: true },
  ];

  const siteContentLinks = [
    { label: "Hero",     href: "/admin/hero",             icon: Layout,    color: "#6366f1" },
    { label: "Stats",    href: "/admin/stats-content",    icon: BarChart2, color: "#0ea5e9" },
    { label: "Services", href: "/admin/services-content", icon: Star,      color: "#D4A843" },
    { label: "CTA",      href: "/admin/cta-content",      icon: Zap,       color: "#10b981" },
  ];

  return (
    <AdminShell title="Dashboard" email={email}>
      {/* Welcome banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #111, #1a1a1a)",
          borderRadius: 14, padding: "24px 28px",
          marginBottom: 24, border: "1px solid rgba(255,255,255,0.06)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 16,
        }}
      >
        <div>
          <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 700, margin: "0 0 6px", letterSpacing: "-0.3px" }}>
            Welcome back 👋
          </h2>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13.5, margin: 0 }}>
            {new Date().toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <TrendingUp size={16} style={{ color: "#D4A843" }} />
          <span style={{ color: "#D4A843", fontSize: 13, fontWeight: 600 }}>
            {stats.projects + stats.jobs + stats.team + stats.feedbacks + stats.partners} content records
            {stats.subscribers > 0 ? ` · ${stats.subscribers} subscribers` : ""}
          </span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="admin-stat-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        {statCards.map((s) => (
          <Link key={s.label} href={s.href} style={{ textDecoration: "none" }}>
            <div className="admin-stat-card">
              <div className="admin-stat-icon" style={{ background: s.bg, color: s.color }}>
                <s.icon size={20} />
              </div>
              <div>
                <div className="admin-stat-value">{s.value}</div>
                <div className="admin-stat-label">{s.label}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="admin-card" style={{ marginBottom: 24 }}>
        <div className="admin-card-header">
          <span className="admin-card-title">Quick Actions</span>
        </div>
        <div className="admin-card-body">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {quickActions.map((a) => (
              <Link
                key={a.label}
                href={a.href}
                target={(a as { external?: boolean }).external ? "_blank" : undefined}
                rel={(a as { external?: boolean }).external ? "noopener noreferrer" : undefined}
                className="btn btn-outline"
                style={{ textDecoration: "none" }}
              >
                <a.icon size={14} />
                {a.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Two-column bottom */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

        {/* Content overview */}
        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-title">Content Overview</span>
          </div>
          <div className="admin-card-body">
            <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
              <tbody>
                {statCards.map((s) => (
                  <tr key={s.label}>
                    <td style={{ padding: "8px 0", color: "rgba(255,255,255,0.4)", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", alignItems: "center", gap: 8 }}>
                      <s.icon size={14} style={{ color: s.color }} />
                      {s.label}
                    </td>
                    <td style={{ padding: "8px 0", textAlign: "right", fontWeight: 700, color: "#fff", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      {s.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Site Content links */}
        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-title">Edit Site Content</span>
          </div>
          <div className="admin-card-body">
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {siteContentLinks.map(l => (
                <Link
                  key={l.label}
                  href={l.href}
                  style={{
                    display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
                    borderRadius: 10, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
                    textDecoration: "none", transition: "all 0.15s",
                  }}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: `${l.color}18`, border: `1px solid ${l.color}30`,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <l.icon size={15} style={{ color: l.color }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>Edit {l.label} Section</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 1 }}>Update text, links & content</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
