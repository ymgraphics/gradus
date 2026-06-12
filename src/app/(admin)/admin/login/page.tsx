"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signInAdmin } from "@/lib/admin-auth";
import { Eye, EyeOff, Lock, Mail, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInAdmin(email, password);
      router.push("/admin");
      router.refresh();
    } catch (err: unknown) {
      const msg = (err as { code?: string })?.code;
      if (msg === "auth/invalid-credential" || msg === "auth/user-not-found" || msg === "auth/wrong-password") {
        setError("Invalid email or password.");
      } else if (msg === "auth/too-many-requests") {
        setError("Too many failed attempts. Please try again later.");
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f0f0f",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif",
      }}
    >
      {/* Background pattern */}
      <div
        style={{
          position: "fixed", inset: 0, opacity: 0.03,
          backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "32px 32px",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: 400,
          background: "#1a1a1a",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
          position: "relative",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "36px 36px 28px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 52, height: 52,
              background: "linear-gradient(135deg, #D4A843, #b8882d)",
              borderRadius: 14,
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px",
              fontSize: 22, fontWeight: 800, color: "#000",
            }}
          >
            G
          </div>
          <h1
            style={{
              color: "#fff", fontSize: 22, fontWeight: 700,
              letterSpacing: "-0.5px", margin: "0 0 6px",
            }}
          >
            Gradus Admin
          </h1>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, margin: 0 }}>
            Sign in to access the dashboard
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: "28px 36px 36px" }}>
          {error && (
            <div
              style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: 8, padding: "10px 14px",
                color: "#f87171", fontSize: 13, marginBottom: 20,
              }}
            >
              <AlertCircle size={15} style={{ flexShrink: 0 }} />
              {error}
            </div>
          )}

          {/* Email */}
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: "block", fontSize: 12, fontWeight: 600,
                color: "rgba(255,255,255,0.5)", marginBottom: 8,
                letterSpacing: "0.04em", textTransform: "uppercase",
              }}
            >
              Email
            </label>
            <div style={{ position: "relative" }}>
              <Mail
                size={15}
                style={{
                  position: "absolute", left: 12, top: "50%",
                  transform: "translateY(-50%)", color: "rgba(255,255,255,0.25)",
                }}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@gradus.ma"
                style={{
                  width: "100%", padding: "11px 12px 11px 38px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10, color: "#fff", fontSize: 14,
                  outline: "none", boxSizing: "border-box",
                  fontFamily: "inherit",
                  transition: "border-color 0.15s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#D4A843")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: 24 }}>
            <label
              style={{
                display: "block", fontSize: 12, fontWeight: 600,
                color: "rgba(255,255,255,0.5)", marginBottom: 8,
                letterSpacing: "0.04em", textTransform: "uppercase",
              }}
            >
              Password
            </label>
            <div style={{ position: "relative" }}>
              <Lock
                size={15}
                style={{
                  position: "absolute", left: 12, top: "50%",
                  transform: "translateY(-50%)", color: "rgba(255,255,255,0.25)",
                }}
              />
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={{
                  width: "100%", padding: "11px 40px 11px 38px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10, color: "#fff", fontSize: 14,
                  outline: "none", boxSizing: "border-box",
                  fontFamily: "inherit",
                  transition: "border-color 0.15s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#D4A843")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: "absolute", right: 12, top: "50%",
                  transform: "translateY(-50%)", background: "none",
                  border: "none", color: "rgba(255,255,255,0.3)",
                  cursor: "pointer", padding: 0,
                }}
              >
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%", padding: "13px",
              background: loading ? "rgba(212,168,67,0.5)" : "#D4A843",
              border: "none", borderRadius: 10, color: "#000",
              fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.15s", fontFamily: "inherit",
            }}
          >
            {loading ? "Signing in..." : "Sign in to Admin"}
          </button>
        </form>
      </div>
    </div>
  );
}
