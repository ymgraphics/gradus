"use client";

import { useState, ReactNode } from "react";
import { Menu } from "lucide-react";
import { AdminSidebar } from "./AdminSidebar";
import { ToastProvider } from "./ToastProvider";

interface AdminShellProps {
  children: ReactNode;
  title: string;
  actions?: ReactNode;
  email?: string;
}

export function AdminShell({ children, title, actions, email }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ToastProvider>
      <div className="admin-shell">
        <AdminSidebar
          email={email}
          mobileOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="admin-main">
          {/* Top bar */}
          <header className="admin-topbar">
            <button
              className="btn btn-ghost btn-sm"
              style={{ display: "none" }}
              id="sidebar-toggle"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={18} />
            </button>
            <h1 className="admin-topbar-title">{title}</h1>
            {actions && (
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {actions}
              </div>
            )}
          </header>

          {/* Page content */}
          <div className="admin-content">{children}</div>
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #sidebar-toggle { display: flex !important; }
          .md-overlay { display: block !important; }
        }
      `}</style>
    </ToastProvider>
  );
}
