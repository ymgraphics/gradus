"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

interface Props {
  headline: string;
  subheading: string;
  launchDate: string;
  showEmail: boolean;
  instagram: string;
  facebook: string;
  linkedin: string;
  isPreview: boolean;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calcTimeLeft(target: string): TimeLeft | null {
  if (!target) return null;
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function ComingSoonClient({
  headline,
  subheading,
  launchDate,
  showEmail,
  instagram,
  facebook,
  linkedin,
  isPreview,
}: Props) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!launchDate) return;
    setTimeLeft(calcTimeLeft(launchDate));
    intervalRef.current = setInterval(() => setTimeLeft(calcTimeLeft(launchDate)), 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [launchDate]);

  // ── Interactive Particle Canvas ─────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    let W = window.innerWidth;
    let H = window.innerHeight;
    let dpr = window.devicePixelRatio || 1;

    // Mouse / touch state — starts at centre, offscreen flag
    const mouse = { x: W / 2, y: H / 2, active: false };

    // ── Particle definition ──────────────────────────────────────────────
    const PARTICLE_COUNT = Math.min(Math.floor((W * H) / 9000), 160);
    const CONNECT_DIST = 130;        // max px distance to draw connection
    const MOUSE_REPEL_DIST = 120;    // px radius of repulsion field
    const MOUSE_REPEL_FORCE = 0.012; // acceleration multiplier
    const FRICTION = 0.92;           // velocity decay per frame

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      baseX: number;
      baseY: number;
      size: number;
      alpha: number;
    }

    const particles: Particle[] = [];

    const initParticles = () => {
      particles.length = 0;
      const count = Math.min(Math.floor((W * H) / 9000), 160);
      for (let i = 0; i < count; i++) {
        const x = Math.random() * W;
        const y = Math.random() * H;
        particles.push({
          x, y,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          baseX: x,
          baseY: y,
          size: Math.random() * 1.4 + 0.4,
          alpha: Math.random() * 0.5 + 0.2,
        });
      }
    };

    // ── Resize ───────────────────────────────────────────────────────────
    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.scale(dpr, dpr);
      initParticles();
    };

    resize();
    window.addEventListener("resize", resize);

    // ── Mouse / touch handlers ────────────────────────────────────────────
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };
    const onMouseLeave = () => { mouse.active = false; };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
        mouse.active = true;
      }
    };
    const onTouchEnd = () => { mouse.active = false; };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);

    // ── Color palette — gold + indigo + violet ────────────────────────────
    const PALETTE = [
      [212, 168, 67],   // Gradus Gold
      [109, 40, 217],   // Deep Purple
      [167, 139, 250],  // Soft Violet
      [180, 140, 60],   // Warm Amber
      [255, 255, 255],  // White
    ];

    // ── Draw loop ─────────────────────────────────────────────────────────
    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Update & draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Mouse repulsion
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MOUSE_REPEL_DIST && dist > 0) {
            const force = (MOUSE_REPEL_DIST - dist) / MOUSE_REPEL_DIST;
            p.vx += (dx / dist) * force * MOUSE_REPEL_FORCE * 60;
            p.vy += (dy / dist) * force * MOUSE_REPEL_FORCE * 60;
          }
        }

        // Gentle drift back toward baseX/Y
        p.vx += (p.baseX - p.x) * 0.00015;
        p.vy += (p.baseY - p.y) * 0.00015;

        // Apply friction & integrate
        p.vx *= FRICTION;
        p.vy *= FRICTION;
        p.x += p.vx;
        p.y += p.vy;

        // Wrap at edges
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10;
        if (p.y > H + 10) p.y = -10;

        // Draw dot
        const [r, g, b] = PALETTE[i % PALETTE.length];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${p.alpha})`;
        ctx.fill();

        // Draw connections to nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) {
            const lineAlpha = (1 - dist / CONNECT_DIST) * 0.12;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(212,168,67,${lineAlpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw interactive cursor glow when mouse is active
      if (mouse.active) {
        const grd = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, MOUSE_REPEL_DIST);
        grd.addColorStop(0, "rgba(212,168,67,0.04)");
        grd.addColorStop(1, "rgba(212,168,67,0)");
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, MOUSE_REPEL_DIST, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      setSubmitError("Une erreur est survenue. Réessayez.");
    } finally {
      setSubmitting(false);
    }
  }

  const hasSocials = instagram || facebook || linkedin;

  return (
    <>
      <style>{`
        /* ── Glassmorphism card ── */
        .cs-glass {
          background: rgba(255,255,255,0.035);
          backdrop-filter: blur(28px) saturate(200%) brightness(1.05);
          -webkit-backdrop-filter: blur(28px) saturate(200%) brightness(1.05);
          border: 1px solid rgba(255,255,255,0.09);
        }

        /* ── Static shine overlay on card top edge ── */
        .cs-card-shine {
          position: absolute;
          top: 0; left: 12%; right: 12%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent);
          pointer-events: none;
        }

        /* ── Button hover ── */
        .cs-btn {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .cs-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(212,168,67,0.35);
        }

        /* ── Social icon hover ── */
        .cs-social {
          transition: background 0.25s, border-color 0.25s, color 0.25s, transform 0.25s;
        }
        .cs-social:hover {
          background: rgba(212,168,67,0.1) !important;
          border-color: rgba(212,168,67,0.35) !important;
          color: rgba(212,168,67,0.85) !important;
          transform: translateY(-2px);
        }

        /* ── Email input focus ── */
        .cs-input:focus {
          border-color: rgba(212,168,67,0.6) !important;
          box-shadow: 0 0 0 3px rgba(212,168,67,0.08) !important;
          outline: none;
        }

        @supports not (backdrop-filter: blur(1px)) {
          .cs-glass { background: rgba(8,8,16,0.96) !important; }
        }

        @media (prefers-reduced-motion: reduce) {
          * { transition: none !important; }
        }
      `}</style>

      {/* ══ ROOT CONTAINER ══════════════════════════════════════════════════ */}
      <div style={{
        position: "fixed", inset: 0,
        background: "#06060f",
        overflow: "hidden",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        fontFamily: "'Inter', -apple-system, sans-serif",
        zIndex: 9999,
      }}>

        {/* ── Interactive Particle Canvas ──────────────────────────────── */}
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            top: 0, left: 0,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* ── Subtle vignette overlay ──────────────────────────────────── */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(6,6,15,0.75) 100%)",
          pointerEvents: "none", zIndex: 1,
        }} />

        {/* ── Preview Banner ───────────────────────────────────────────── */}
        {isPreview && (
          <div style={{
            position: "fixed", top: 0, left: 0, right: 0,
            background: "rgba(212,168,67,0.12)", backdropFilter: "blur(8px)",
            borderBottom: "1px solid rgba(212,168,67,0.25)",
            padding: "10px 20px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            zIndex: 10000, fontSize: 11, fontFamily: "monospace",
            color: "rgba(212,168,67,0.85)", letterSpacing: "0.12em",
          }}>
            <span>⚡ PREVIEW MODE — Only visible to admins</span>
            <Link href="/admin/settings" style={{ color: "rgba(212,168,67,0.7)", textDecoration: "underline", fontSize: 11 }}>
              ← Back to Settings
            </Link>
          </div>
        )}

        {/* ══ GLASS CARD ══════════════════════════════════════════════════ */}
        <div
          className="cs-glass"
          style={{
            position: "relative", zIndex: 10,
            width: "min(560px, 92vw)",
            padding: "clamp(36px, 6vw, 64px)",
            borderRadius: 32,
            display: "flex", flexDirection: "column", alignItems: "center", gap: 0,
            boxShadow: "0 32px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        >
          {/* Top shine */}
          <div className="cs-card-shine" />

          {/* Bottom ambient glow */}
          <div style={{
            position: "absolute", bottom: -40, left: "20%", right: "20%", height: 40,
            background: "radial-gradient(ellipse at top, rgba(212,168,67,0.08), transparent 70%)",
            filter: "blur(10px)",
            pointerEvents: "none",
          }} />

          {/* ── Logo ──────────────────────────────────────────────────── */}
          <div style={{ position: "relative", marginBottom: 36 }}>
            <Image
              src="/assets/logo.svg"
              alt="Gradus Agency"
              width={160}
              height={44}
              priority
              style={{ width: 140, height: "auto", opacity: 0.95 }}
            />
          </div>

          {/* ── Eyebrow ───────────────────────────────────────────────── */}
          <div style={{
            fontFamily: "monospace", fontSize: 9,
            textTransform: "uppercase", color: "rgba(212,168,67,0.8)",
            marginBottom: 18, letterSpacing: "0.5em",
          }}>
            Casablanca · Maroc
          </div>

          {/* ── Headline ──────────────────────────────────────────────── */}
          <h1 style={{
            fontSize: "clamp(28px, 6vw, 46px)",
            fontWeight: 700, color: "#fff",
            textAlign: "center", lineHeight: 1.1,
            letterSpacing: "-0.025em",
            marginBottom: 14,
          }}>
            {headline}
          </h1>

          {/* ── Subheading ────────────────────────────────────────────── */}
          <p style={{
            fontSize: "clamp(13px, 2.2vw, 15px)",
            color: "rgba(255,255,255,0.38)",
            textAlign: "center", lineHeight: 1.65,
            marginBottom: 36, maxWidth: 360,
          }}>
            {subheading}
          </p>

          {/* ── Gold Divider ──────────────────────────────────────────── */}
          <div style={{
            width: 50, height: 1, marginBottom: 36,
            background: "linear-gradient(90deg, transparent, rgba(212,168,67,0.6), transparent)",
          }} />

          {/* ── Countdown ────────────────────────────────────────────── */}
          {launchDate && timeLeft && (
            <div style={{
              display: "flex", gap: "clamp(8px, 3vw, 24px)",
              marginBottom: 36,
            }}>
              {(["days", "hours", "minutes", "seconds"] as const).map((unit, ui) => (
                <div key={unit} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                  <div style={{
                    padding: "12px 16px",
                    background: "rgba(255,255,255,0.04)",
                    borderRadius: 12, minWidth: 56, textAlign: "center",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}>
                    <span style={{
                      fontSize: "clamp(22px, 5vw, 34px)",
                      fontWeight: 700, color: "#fff",
                      fontVariantNumeric: "tabular-nums", lineHeight: 1,
                      display: "block",
                    }}>
                      {String(timeLeft[unit]).padStart(2, "0")}
                    </span>
                  </div>
                  <span style={{
                    fontSize: 8, letterSpacing: "0.35em",
                    textTransform: "uppercase", color: "rgba(255,255,255,0.28)",
                    fontFamily: "monospace",
                  }}>
                    {unit === "days" ? "Jours" : unit === "hours" ? "Heures" : unit === "minutes" ? "Min" : "Sec"}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* ── Email Capture ─────────────────────────────────────────── */}
          {showEmail && !submitted && (
            <form onSubmit={handleEmailSubmit} style={{
              width: "100%", display: "flex", flexDirection: "column",
              gap: 10, marginBottom: 28,
            }}>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                  className="cs-input"
                  style={{
                    flex: 1, background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 14, padding: "14px 18px",
                    color: "#fff", fontSize: 14,
                    transition: "border-color 0.3s, box-shadow 0.3s",
                    fontFamily: "inherit",
                  }}
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="cs-btn"
                  style={{
                    padding: "14px 22px", borderRadius: 14,
                    background: submitting ? "rgba(212,168,67,0.35)" : "linear-gradient(135deg, #D4A843 0%, #c49a38 100%)",
                    color: "#06060f", fontWeight: 700, fontSize: 13,
                    border: "none", cursor: submitting ? "not-allowed" : "pointer",
                    letterSpacing: "0.05em", whiteSpace: "nowrap",
                    opacity: submitting ? 0.7 : 1,
                  }}
                >
                  {submitting ? "..." : "Notifier"}
                </button>
              </div>
              {submitError ? (
                <p style={{ fontSize: 11, color: "#f87171", textAlign: "center", margin: 0 }}>{submitError}</p>
              ) : (
                <p style={{ fontSize: 10, color: "rgba(255,255,255,0.18)", textAlign: "center", fontFamily: "monospace", letterSpacing: "0.05em" }}>
                  Nous vous prévenons dès le lancement — aucun spam.
                </p>
              )}
            </form>
          )}

          {showEmail && submitted && (
            <div style={{
              width: "100%", padding: "14px 18px", borderRadius: 14, marginBottom: 28,
              background: "rgba(212,168,67,0.07)", border: "1px solid rgba(212,168,67,0.2)",
              textAlign: "center", color: "rgba(212,168,67,0.9)", fontSize: 13,
            }}>
              ✓ Parfait ! Nous vous contacterons dès le lancement.
            </div>
          )}

          {/* ── Social Links ──────────────────────────────────────────── */}
          {hasSocials && (
            <div style={{ display: "flex", gap: 12, marginBottom: 32 }}>
              {[
                { url: instagram, label: "Instagram", icon: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/>
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                  </svg>
                )},
                { url: facebook, label: "Facebook", icon: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                )},
                { url: linkedin, label: "LinkedIn", icon: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
                    <circle cx="4" cy="4" r="2"/>
                  </svg>
                )},
              ].filter(s => s.url).map(s => (
                <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                  className="cs-social"
                  style={{
                    width: 42, height: 42, borderRadius: 13,
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(255,255,255,0.03)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "rgba(255,255,255,0.4)", textDecoration: "none",
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          )}

          {/* ── Footer ────────────────────────────────────────────────── */}
          <p style={{
            fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.18)", fontFamily: "monospace",
          }}>
            © {new Date().getFullYear()} Gradus Agency
          </p>
        </div>
      </div>
    </>
  );
}
