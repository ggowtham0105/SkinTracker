/**
 * LandingPage — public home page for SkinTrack.
 * Shown at "/" for unauthenticated visitors.
 * Logged-in users go directly to the dashboard (handled in AppRouter → SkinTrackApp).
 */

import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import PublicLayout from "../components/PublicLayout.jsx";
import SeoHead from "../components/SeoHead.jsx";
import AdSlot from "../components/AdSlot.jsx";
import { trackEvent, trackPageView } from "../analytics.js";

/* Design tokens — matching the main app */
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
  accentSoft: "#F3E6E7",
};

function FeatureCard({ icon, title, description }) {
  return (
    <div
      style={{
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: 20,
        padding: "28px 24px",
        transition: "box-shadow 0.2s, transform 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 8px 28px rgba(63,107,87,0.10)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "none";
      }}
    >
      <div
        style={{
          background: T.primarySoft,
          width: 48,
          height: 48,
          borderRadius: 14,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          marginBottom: 16,
        }}
      >
        {icon}
      </div>
      <h3 style={{ color: T.ink, fontWeight: 700, fontSize: 16, margin: "0 0 8px" }}>{title}</h3>
      <p style={{ color: T.inkSoft, fontSize: 14, lineHeight: 1.6, margin: 0 }}>{description}</p>
    </div>
  );
}

function StepItem({ number, title, description }) {
  return (
    <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
      <div
        style={{
          background: T.primary,
          color: "#fff",
          width: 36,
          height: 36,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'IBM Plex Mono', monospace",
          fontWeight: 700,
          fontSize: 14,
          flexShrink: 0,
          marginTop: 2,
        }}
      >
        {number}
      </div>
      <div>
        <h3 style={{ color: T.ink, fontWeight: 700, fontSize: 16, margin: "0 0 6px" }}>{title}</h3>
        <p style={{ color: T.inkSoft, fontSize: 14, lineHeight: 1.6, margin: 0 }}>{description}</p>
      </div>
    </div>
  );
}

function PrivacyBadge({ icon, text }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: 14,
        padding: "12px 18px",
      }}
    >
      <span style={{ fontSize: 18 }}>{icon}</span>
      <span style={{ color: T.inkSoft, fontSize: 13, fontWeight: 500 }}>{text}</span>
    </div>
  );
}

export default function LandingPage() {
  useEffect(() => {
    trackPageView("/", "SkinTrack — Track Your Skin Progress");
  }, []);

  return (
    <PublicLayout>
      <SeoHead
        title="Track Your Skin Progress Over Time"
        description="SkinTrack helps you organize and compare skin progress photos over time. Free photo comparison tool, progress timeline, and secure private journal."
        canonicalPath="/"
      />

      <style>{`
        @media (max-width: 640px) {
          .hero-btns { flex-direction: column !important; }
          .hero-btns a { text-align: center !important; }
          .features-grid { grid-template-columns: 1fr !important; }
          .steps-grid { grid-template-columns: 1fr !important; }
          .privacy-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── Hero Section ── */}
      <section
        style={{
          background: `linear-gradient(180deg, #EEF5F0 0%, ${T.bg} 100%)`,
          padding: "72px 24px 64px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: T.primarySoft,
              border: `1px solid ${T.primary}`,
              borderRadius: 100,
              padding: "6px 16px",
              marginBottom: 28,
            }}
          >
            <span style={{ fontSize: 13 }}>🌿</span>
            <span style={{ color: T.primaryDark, fontWeight: 600, fontSize: 13 }}>
              Free skin progress tracker
            </span>
          </div>

          <h1
            style={{
              color: T.ink,
              fontSize: "clamp(32px, 5vw, 52px)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
              margin: "0 0 20px",
            }}
          >
            Track Your Skin{" "}
            <span style={{ color: T.primary }}>Progress</span> Over Time
          </h1>

          <p
            style={{
              color: T.inkSoft,
              fontSize: "clamp(16px, 2.5vw, 19px)",
              lineHeight: 1.6,
              margin: "0 auto 40px",
              maxWidth: 520,
            }}
          >
            SkinTrack helps you organize and compare your skin progress photos
            over time — consistently, privately, and for free.
          </p>

          <div
            className="hero-btns"
            style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}
          >
            <Link
              to="/signup"
              style={{
                background: T.primary,
                color: "#FFFFFF",
                fontWeight: 700,
                fontSize: 16,
                padding: "14px 32px",
                borderRadius: 14,
                display: "inline-block",
                boxShadow: "0 4px 16px rgba(63,107,87,0.30)",
                transition: "opacity 0.15s, transform 0.15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.93"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "none"; }}
              onClick={() => trackEvent("cta_clicked", { cta: "hero_signup" })}
            >
              Start Tracking Free
            </Link>
            <Link
              to="/skin-photo-comparison"
              style={{
                background: T.surface,
                color: T.primaryDark,
                fontWeight: 700,
                fontSize: 16,
                padding: "14px 32px",
                borderRadius: 14,
                border: `1.5px solid ${T.primary}`,
                display: "inline-block",
                transition: "background 0.15s, transform 0.15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = T.primarySoft; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = T.surface; e.currentTarget.style.transform = "none"; }}
              onClick={() => trackEvent("cta_clicked", { cta: "hero_compare" })}
            >
              Compare Photos
            </Link>
          </div>

          <p style={{ color: T.inkFaint, fontSize: 12, marginTop: 20 }}>
            No credit card required · Free account · Private photos
          </p>
        </div>
      </section>

      {/* ── Mock UI Preview ── */}
      <section style={{ padding: "0 24px 64px", marginTop: -20 }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div
            style={{
              background: T.surface,
              border: `1px solid ${T.border}`,
              borderRadius: 24,
              padding: 24,
              boxShadow: "0 12px 40px rgba(38,40,31,0.08)",
            }}
          >
            {/* Fake progress bar visualization */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ color: T.ink, fontWeight: 700, fontSize: 14 }}>Last 30 days</span>
                <span style={{ color: T.accent, fontSize: 12, fontWeight: 600 }}>🔥 12-day streak</span>
              </div>
              <div style={{ display: "flex", gap: 3 }}>
                {Array.from({ length: 30 }, (_, i) => (
                  <div
                    key={i}
                    style={{
                      height: 18,
                      flex: 1,
                      borderRadius: 4,
                      background: [2,5,6,7,9,11,12,13,15,18,19,21,23,24,25,26,27,28,29].includes(i)
                        ? T.primary
                        : T.surfaceAlt,
                    }}
                  />
                ))}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              {[
                { label: "Photos", value: "19" },
                { label: "Tracking", value: "12w" },
                { label: "Last upload", value: "Sep 01" },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  style={{
                    background: T.surfaceAlt,
                    border: `1px solid ${T.border}`,
                    borderRadius: 14,
                    padding: "12px 14px",
                  }}
                >
                  <div style={{ color: T.inkFaint, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</div>
                  <div style={{ color: T.ink, fontWeight: 700, fontSize: 18, fontFamily: "'IBM Plex Mono', monospace", marginTop: 4 }}>{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── What is SkinTrack ── */}
      <section style={{ padding: "48px 24px 64px", background: T.surface }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ color: T.ink, fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 800, margin: "0 0 14px", letterSpacing: "-0.01em" }}>
              What is SkinTrack?
            </h2>
            <p style={{ color: T.inkSoft, fontSize: 16, lineHeight: 1.6, maxWidth: 540, margin: "0 auto" }}>
              SkinTrack is a personal skin progress journal. It helps you take consistent photos, 
              compare before-and-after, and maintain a private history of your skin over time.
            </p>
          </div>

          <div
            className="features-grid"
            style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}
          >
            <FeatureCard
              icon="📸"
              title="Consistent Photo Logging"
              description="Upload photos regularly with face area tags. Consistency is the key to meaningful skin progress tracking."
            />
            <FeatureCard
              icon="🔄"
              title="Side-by-Side Comparison"
              description="Compare any two photos with an interactive slider. See exactly how your skin has changed over weeks or months."
            />
            <FeatureCard
              icon="📅"
              title="Progress Timeline"
              description="View your entire skin history in chronological order. Keep notes about what products or routines you were using."
            />
            <FeatureCard
              icon="🔥"
              title="Streak Tracking"
              description="Build a consistent habit with a 30-day photo grid and daily streak counter. See your tracking patterns at a glance."
            />
            <FeatureCard
              icon="🔒"
              title="Private & Secure"
              description="Your skin photos are stored securely and are completely private. We never share your images with anyone."
            />
            <FeatureCard
              icon="🆓"
              title="Free to Use"
              description="Create a free account and start tracking immediately. No credit card required. Your data is yours."
            />
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section style={{ padding: "64px 24px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ color: T.ink, fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 800, margin: "0 0 14px", letterSpacing: "-0.01em" }}>
              How skin progress tracking works
            </h2>
            <p style={{ color: T.inkSoft, fontSize: 16, lineHeight: 1.6, maxWidth: 480, margin: "0 auto" }}>
              A simple, consistent routine that takes less than 2 minutes per day.
            </p>
          </div>

          <div
            className="steps-grid"
            style={{ display: "flex", flexDirection: "column", gap: 28 }}
          >
            <StepItem
              number="1"
              title="Take a photo in consistent lighting"
              description="Use natural light or a bright room. Same angle, same distance. Consistency matters more than perfection."
            />
            <StepItem
              number="2"
              title="Tag the area and add a note"
              description="Select which area of your face (forehead, cheek, chin, etc.) and optionally note what products or routines you've been using."
            />
            <StepItem
              number="3"
              title="Build your timeline"
              description="Over days and weeks, your photo history builds automatically. Compare any two dates to see visible progress."
            />
            <StepItem
              number="4"
              title="Use the comparison slider"
              description="Drag the slider between before and after to see exactly how your skin has changed. No guessing required."
            />
          </div>

          <div style={{ textAlign: "center", marginTop: 48 }}>
            <Link
              to="/how-to-track-skin-progress"
              style={{ color: T.primaryDark, fontWeight: 600, fontSize: 14, textDecoration: "underline" }}
            >
              Read our full skin tracking guide →
            </Link>
          </div>
        </div>
      </section>

      {/* ── AdSlot (public content page) ── */}
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 24px" }}>
        <AdSlot slot="1111111111" format="auto" />
      </div>

      {/* ── Why consistent photos matter ── */}
      <section style={{ padding: "64px 24px", background: T.surface }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
            <div>
              <h2 style={{ color: T.ink, fontSize: "clamp(22px, 3.5vw, 32px)", fontWeight: 800, margin: "0 0 16px", letterSpacing: "-0.01em" }}>
                Why take regular skin photos?
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  { icon: "👁️", text: "We adapt to our own skin so gradually, we don't notice changes in the mirror." },
                  { icon: "📊", text: "A photo log gives you objective evidence of what's actually working in your routine." },
                  { icon: "📆", text: "Comparing photos from 4–8 weeks apart shows changes that aren't visible day-to-day." },
                  { icon: "📋", text: "Notes help you correlate skincare changes with visible results over time." },
                ].map(({ icon, text }) => (
                  <div key={text} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 18, marginTop: 2 }}>{icon}</span>
                    <p style={{ color: T.inkSoft, fontSize: 14, lineHeight: 1.6, margin: 0 }}>{text}</p>
                  </div>
                ))}
              </div>
              <Link
                to="/skin-progress-tracker"
                style={{ color: T.primaryDark, fontWeight: 600, fontSize: 14, textDecoration: "underline", marginTop: 20, display: "inline-block" }}
              >
                Learn more about progress tracking →
              </Link>
            </div>
            <div
              style={{
                background: `linear-gradient(135deg, ${T.primarySoft} 0%, #F3E6E7 100%)`,
                borderRadius: 24,
                padding: 32,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 56, marginBottom: 16 }}>📸</div>
              <p style={{ color: T.primary, fontWeight: 700, fontSize: 18, margin: "0 0 8px" }}>
                "I finally stopped guessing."
              </p>
              <p style={{ color: T.inkSoft, fontSize: 13, lineHeight: 1.6, margin: 0 }}>
                Consistent photos make it easy to see what's actually changing — without relying on memory or first impressions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Privacy & Security ── */}
      <section style={{ padding: "64px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ color: T.ink, fontSize: "clamp(22px, 3.5vw, 32px)", fontWeight: 800, margin: "0 0 14px", letterSpacing: "-0.01em" }}>
            Your photos are private
          </h2>
          <p style={{ color: T.inkSoft, fontSize: 15, lineHeight: 1.6, maxWidth: 480, margin: "0 auto 36px" }}>
            We treat your skin photos as sensitive personal data. They are stored securely and never shared, 
            sold, or used for advertising targeting.
          </p>

          <div
            className="privacy-grid"
            style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}
          >
            <PrivacyBadge icon="🔒" text="Photos are private to your account only" />
            <PrivacyBadge icon="🚫" text="Never used for advertising targeting" />
            <PrivacyBadge icon="🗑️" text="Delete your account and all data anytime" />
          </div>

          <div style={{ marginTop: 24 }}>
            <Link to="/privacy" style={{ color: T.inkSoft, fontSize: 13, textDecoration: "underline" }}>
              Read our full Privacy Policy
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section
        style={{
          background: `linear-gradient(135deg, ${T.primary} 0%, ${T.primaryDark} 100%)`,
          padding: "72px 24px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          <h2 style={{ color: "#FFFFFF", fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 800, margin: "0 0 16px", letterSpacing: "-0.01em" }}>
            Start your skin progress journal today
          </h2>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 16, lineHeight: 1.6, margin: "0 0 36px" }}>
            Free account. Private photos. No medical advice — just a consistent tracking tool that helps you see real change.
          </p>

          <div className="hero-btns" style={{ display: "flex", gap: 14, justifyContent: "center" }}>
            <Link
              to="/signup"
              style={{
                background: "#FFFFFF",
                color: T.primaryDark,
                fontWeight: 700,
                fontSize: 16,
                padding: "14px 32px",
                borderRadius: 14,
                display: "inline-block",
                boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
              }}
              onClick={() => trackEvent("cta_clicked", { cta: "bottom_signup" })}
            >
              Start Tracking Free
            </Link>
            <Link
              to="/skin-photo-comparison"
              style={{
                background: "transparent",
                color: "#FFFFFF",
                fontWeight: 700,
                fontSize: 16,
                padding: "14px 32px",
                borderRadius: 14,
                border: "2px solid rgba(255,255,255,0.5)",
                display: "inline-block",
              }}
              onClick={() => trackEvent("cta_clicked", { cta: "bottom_compare" })}
            >
              Try Free Comparison
            </Link>
          </div>

          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, marginTop: 20 }}>
            ⚠️ SkinTrack is a personal tracking tool, not a medical device. Consult a dermatologist for medical advice.
          </p>
        </div>
      </section>
    </PublicLayout>
  );
}
