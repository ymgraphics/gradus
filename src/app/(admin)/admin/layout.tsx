import type { ReactNode } from "react";
import { ToastProvider } from "./_components/ToastProvider";
import "./admin.css";

export const metadata = {
  title: { default: "Gradus Admin", template: "%s — Gradus Admin" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <div suppressHydrationWarning>
          <ToastProvider>
            {children}
          </ToastProvider>
        </div>
      </body>
    </html>
  );
}
