/**
 * PublicLayout — shared layout wrapper for all public/SEO pages.
 * Contains the public nav bar and footer.
 * NOT used inside the authenticated dashboard.
 */

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { trackEvent } from "../analytics.js";

/* Design tokens matching the main app */
const T = {
  bg: "#FAF9F6",
  surface: "#FFFFFF",
  surfaceAlt: "#F3F1EB",
  ink: "#26281F",
  inkSoft: "#6E7268",
  inkFaint: "#9A9C93",
  border: "#E7E4DA",
  primary: "#3F6B57",
  primaryDark: "#2E5342",
  primarySoft: "#E4EEE8",
  accent: "#B97D82",
};

const FONT_IMPORT =
  "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');";

function BrandMark({ size = 30 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 34 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <defs>
        <linearGradient id="pubBmGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3F6B57" />
          <stop offset="100%" stopColor="#244434" />
        </linearGradient>
        <linearGradient id="pubBmLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E4EDE6" />
        </linearGradient>
        <linearGradient id="pubBmAccent" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F2A6AC" />
          <stop offset="100%" stopColor="#B97D82" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="32" height="32" rx="9.5" fill="url(#pubBmGrad)" stroke="#4E7E68" strokeWidth="1" />
      <path
        d="M17 7 C23 11 25.5 18 21.5 24 C19 27.5 13 27.5 9.5 24 C6.5 20.5 8.5 14 17 7 Z"
        fill="url(#pubBmLeaf)"
        opacity="0.95"
      />
      <path d="M17 9.5 C16 14.5 13.5 21 11.5 25" stroke="#3F6B57" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
      <circle cx="20.5" cy="20.5" r="3.2" fill="url(#pubBmAccent)" />
      <circle cx="21.3" cy="19.7" r="0.9" fill="#FFFFFF" opacity="0.9" />
    </svg>
  );
}

const NAV_LINKS = [
  { to: "/skin-tracker", label: "Skin Tracking" },
  { to: "/skin-photo-comparison", label: "Compare Photos" },
  { to: "/skincare-journal", label: "Journal" },
  { to: "/how-to-track-skin-progress", label: "How It Works" },
];

const FOOTER_CONTENT_LINKS = [
  { to: "/skin-tracker", label: "Skin Tracker" },
  { to: "/skin-progress-tracker", label: "Progress Tracker" },
  { to: "/skin-photo-comparison", label: "Photo Comparison" },
  { to: "/skincare-journal", label: "Skincare Journal" },
  { to: "/how-to-track-skin-progress", label: "How to Track" },
  { to: "/how-to-take-skin-progress-photos", label: "Photo Tips" },
];

export default function PublicLayout({ children }) {
  const location = useLocation();

  return (
    <div
      style={{
        background: T.bg,
        minHeight: "100vh",
        fontFamily: "Inter, system-ui, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <style>{FONT_IMPORT}</style>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; }
        a { text-decoration: none; }
        .pub-nav-link { transition: color 0.15s; }
        .pub-nav-link:hover { color: ${T.primary} !important; }
        .pub-footer-link { transition: color 0.15s; }
        .pub-footer-link:hover { color: ${T.primary} !important; }
        @media (max-width: 768px) {
          .pub-nav-links { display: none !important; }
          .pub-nav-mobile-ctas { gap: 8px !important; }
        }
      `}</style>

      {/* ── Navigation Bar ── */}
      <nav
        style={{
          background: T.surface,
          borderBottom: `1px solid ${T.border}`,
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "0 20px",
            height: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Brand */}
          <Link
            to="/"
            style={{ display: "flex", alignItems: "center", gap: 10 }}
            aria-label="SkinTrack home"
          >
            <BrandMark size={30} />
            <span style={{ color: T.ink, fontWeight: 700, fontSize: 16, letterSpacing: "-0.01em" }}>
              SkinTrack
            </span>
          </Link>

          {/* Desktop nav links */}
          <div
            className="pub-nav-links"
            style={{ display: "flex", alignItems: "center", gap: 4 }}
          >
            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="pub-nav-link"
                style={{
                  color: location.pathname === to ? T.primary : T.inkSoft,
                  fontWeight: location.pathname === to ? 600 : 500,
                  fontSize: 14,
                  padding: "6px 12px",
                  borderRadius: 8,
                  background: location.pathname === to ? T.primarySoft : "transparent",
                }}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* CTAs */}
          <div
            className="pub-nav-mobile-ctas"
            style={{ display: "flex", alignItems: "center", gap: 10 }}
          >
            <Link
              to="/?view=login"
              style={{
                color: T.inkSoft,
                fontWeight: 600,
                fontSize: 14,
                padding: "7px 14px",
                borderRadius: 10,
              }}
              className="pub-nav-link"
              onClick={() => trackEvent("cta_clicked", { cta: "nav_login" })}
            >
              Log In
            </Link>
            <Link
              to="/?view=signup"
              style={{
                background: T.primary,
                color: "#FFFFFF",
                fontWeight: 600,
                fontSize: 14,
                padding: "8px 18px",
                borderRadius: 10,
                display: "inline-block",
              }}
              onClick={() => trackEvent("signup_clicked", { source: "nav" })}
            >
              Sign Up Free
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Page Content ── */}
      <main style={{ flex: 1 }}>{children}</main>

      {/* ── Footer ── */}
      <footer
        style={{
          background: T.surface,
          borderTop: `1px solid ${T.border}`,
          padding: "40px 20px 30px",
          marginTop: "auto",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 32,
              marginBottom: 36,
            }}
          >
            {/* Brand column */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <BrandMark size={26} />
                <span style={{ color: T.ink, fontWeight: 700, fontSize: 15 }}>SkinTrack</span>
              </div>
              <p style={{ color: T.inkSoft, fontSize: 13, lineHeight: 1.6, maxWidth: 220, margin: 0 }}>
                A personal skin progress tracking tool. Organize your photos, compare progress over time, and stay consistent.
              </p>
              <p style={{ color: T.inkFaint, fontSize: 11, marginTop: 10 }}>
                ⚠️ Not a medical device. For personal tracking only.
              </p>
            </div>

            {/* Content links */}
            <div>
              <div style={{ color: T.inkFaint, fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>
                Guides & Tools
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {FOOTER_CONTENT_LINKS.map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    className="pub-footer-link"
                    style={{ color: T.inkSoft, fontSize: 13, fontWeight: 500 }}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Legal links */}
            <div>
              <div style={{ color: T.inkFaint, fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>
                Legal
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <Link to="/privacy" className="pub-footer-link" style={{ color: T.inkSoft, fontSize: 13, fontWeight: 500 }}>Privacy Policy</Link>
                <Link to="/terms" className="pub-footer-link" style={{ color: T.inkSoft, fontSize: 13, fontWeight: 500 }}>Terms of Service</Link>
              </div>
            </div>

            {/* Account */}
            <div>
              <div style={{ color: T.inkFaint, fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>
                Account
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <Link
                  to="/?view=signup"
                  className="pub-footer-link"
                  style={{ color: T.inkSoft, fontSize: 13, fontWeight: 500 }}
                  onClick={() => trackEvent("signup_clicked", { source: "footer" })}
                >
                  Create Free Account
                </Link>
                <Link
                  to="/?view=login"
                  className="pub-footer-link"
                  style={{ color: T.inkSoft, fontSize: 13, fontWeight: 500 }}
                >
                  Log In
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div
            style={{
              borderTop: `1px solid ${T.border}`,
              paddingTop: 20,
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <p style={{ color: T.inkFaint, fontSize: 12, margin: 0 }}>
              © {new Date().getFullYear()} SkinTrack. All rights reserved.
            </p>
            <p style={{ color: T.inkFaint, fontSize: 11, margin: 0 }}>
              Not a medical device — consult a dermatologist for medical concerns.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
