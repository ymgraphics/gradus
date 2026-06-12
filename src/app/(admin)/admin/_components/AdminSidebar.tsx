"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Briefcase,
  Users,
  MessageSquare,
  Handshake,
  Mail,
  Settings,
  LogOut,
  X,
  BarChart2,
  Zap,
  Star,
  Layout,
} from "lucide-react";
import { signOutAdmin } from "@/lib/admin-auth";
import { useRouter } from "next/navigation";

const NAV = [
  {
    section: "Content",
    items: [
      { href: "/admin",            label: "Dashboard",    icon: LayoutDashboard, exact: true },
      { href: "/admin/projects",   label: "Projects",     icon: FolderKanban },
      { href: "/admin/jobs",       label: "Jobs",         icon: Briefcase },
      { href: "/admin/team",       label: "Team",         icon: Users },
      { href: "/admin/feedbacks",  label: "Testimonials", icon: MessageSquare },
      { href: "/admin/partners",   label: "Partners",     icon: Handshake },
    ],
  },
  {
    section: "CRM",
    items: [
      { href: "/admin/subscribers", label: "Subscribers", icon: Mail },
    ],
  },
  {
    section: "Site Content",
    items: [
      { href: "/admin/hero",             label: "Hero",     icon: Layout },
      { href: "/admin/stats-content",    label: "Stats",    icon: BarChart2 },
      { href: "/admin/services-content", label: "Services", icon: Star },
      { href: "/admin/cta-content",      label: "CTA",      icon: Zap },
    ],
  },
  {
    section: "System",
    items: [
      { href: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
];

interface AdminSidebarProps {
  email?: string;
  onClose?: () => void;
  mobileOpen?: boolean;
}

export function AdminSidebar({ email, onClose, mobileOpen }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string, exact = false) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  async function handleLogout() {
    await signOutAdmin();
    router.push("/admin/login");
    router.refresh();
  }

  const initials = email ? email[0].toUpperCase() : "A";

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
            zIndex: 49, display: "none",
          }}
          className="md-overlay"
          onClick={onClose}
        />
      )}

      <aside className={`admin-sidebar ${mobileOpen ? "open" : ""}`}>
        {/* Logo */}
        <div className="admin-logo">
          <div className="admin-logo-mark">G</div>
          <div className="admin-logo-text">
            <span className="admin-logo-title">Gradus</span>
            <span className="admin-logo-subtitle">Admin Panel</span>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              style={{ marginLeft: "auto", color: "rgba(255,255,255,0.3)", background: "none", border: "none", cursor: "pointer", padding: 4 }}
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className="admin-nav">
          {NAV.map((section) => (
            <div key={section.section}>
              <div className="admin-nav-section">
                <div className="admin-nav-section-label">{section.section}</div>
              </div>
              {section.items.map((item) => {
                const active = isActive(item.href, (item as { exact?: boolean }).exact);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`admin-nav-link ${active ? "active" : ""}`}
                    onClick={onClose}
                  >
                    <item.icon size={16} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User bar */}
        <div className="admin-user-bar">
          <div className="admin-user-info">
            <div className="admin-user-avatar">{initials}</div>
            <span className="admin-user-email">{email || "Admin"}</span>
            <button className="admin-logout-btn" title="Logout" onClick={handleLogout}>
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
