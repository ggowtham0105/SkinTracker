/**
 * SkinProgressTrackerPage — SEO article at /skin-progress-tracker
 */
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import PublicLayout from "../components/PublicLayout.jsx";
import SeoHead from "../components/SeoHead.jsx";
import AdSlot from "../components/AdSlot.jsx";
import { trackPageView } from "../analytics.js";

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

export default function SkinProgressTrackerPage() {
  useEffect(() => {
    trackPageView("/skin-progress-tracker", "Skin Progress Tracker — SkinTrack");
  }, []);

  return (
    <PublicLayout>
      <SeoHead
        title="Skin Progress Tracker — See Real Results Over Time"
        description="A skin progress tracker helps you see objective changes in your skin over weeks and months. Learn how photo-based tracking reveals real results."
        canonicalPath="/skin-progress-tracker"
      />

      {/* Hero */}
      <div style={{ background: `linear-gradient(180deg, #EEF5F0 0%, ${T.bg} 100%)`, padding: "56px 24px 48px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
            <Link to="/" style={{ color: T.inkFaint, fontSize: 13 }}>Home</Link>
            <span style={{ color: T.inkFaint, fontSize: 13 }}>/</span>
            <span style={{ color: T.inkSoft, fontSize: 13 }}>Skin Progress Tracker</span>
          </div>
          <h1 style={{ color: T.ink, fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 16px", lineHeight: 1.2 }}>
            Skin Progress Tracker — See Real Results Over Time
          </h1>
          <p style={{ color: T.inkSoft, fontSize: 18, lineHeight: 1.6, margin: 0 }}>
            Track how your skin changes week by week with a photo-based progress system. See what's actually working.
          </p>
        </div>
      </div>

      <div style={{ padding: "48px 0 80px", maxWidth: 720, margin: "0 auto" }}>
        <div style={{ padding: "0 24px" }}>
          <h2 style={{ color: T.ink, fontWeight: 700, fontSize: 24, margin: "0 0 16px" }}>Why skin progress is hard to see without tracking</h2>
          <p style={{ color: T.inkSoft, lineHeight: 1.75, fontSize: 16 }}>
            Skin changes very slowly. The difference between your skin today and 6 weeks ago may be significant — but because you see your face every day, you're too close to it to notice the change happening. This is why most people underestimate or overestimate how much their routine is working.
          </p>
          <p style={{ color: T.inkSoft, lineHeight: 1.75, fontSize: 16 }}>
            A skin progress tracker solves this by creating a dated, visual record. When you compare your photo from 6 weeks ago with today's, the change becomes undeniable.
          </p>

          <h2 style={{ color: T.ink, fontWeight: 700, fontSize: 24, margin: "32px 0 16px" }}>What kind of progress can you track?</h2>
          <div style={{ display: "grid", gap: 14 }}>
            {[
              { icon: "🔴", label: "Redness & inflammation", desc: "Track how your skin tone and redness changes over time with consistent photos." },
              { icon: "🎯", label: "Acne and breakouts", desc: "Log breakout locations and frequency. See which routines correlate with improvement." },
              { icon: "✨", label: "Skin texture", desc: "High-resolution photos reveal changes in texture that are almost impossible to notice day-to-day." },
              { icon: "💧", label: "Hydration levels", desc: "Dry, flaky, or dull skin is clearly visible in photos. Track how hydration changes with your routine." },
              { icon: "🎨", label: "Pigmentation", desc: "Dark spots and hyperpigmentation can be tracked clearly with consistent lighting and camera angle." },
            ].map(({ icon, label, desc }) => (
              <div key={label} style={{ display: "flex", gap: 14, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: "16px 20px", alignItems: "flex-start" }}>
                <span style={{ fontSize: 22, flexShrink: 0, marginTop: 2 }}>{icon}</span>
                <div>
                  <div style={{ color: T.ink, fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{label}</div>
                  <p style={{ color: T.inkSoft, fontSize: 14, lineHeight: 1.6, margin: 0 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ maxWidth: "100%", margin: "32px 0" }}>
            <AdSlot slot="3333333333" format="auto" />
          </div>

          <h2 style={{ color: T.ink, fontWeight: 700, fontSize: 24, margin: "32px 0 16px" }}>How long does it take to see skin progress?</h2>
          <p style={{ color: T.inkSoft, lineHeight: 1.75, fontSize: 16 }}>
            Skin cells turn over roughly every 28–40 days in healthy adults. This means meaningful visible change from a new routine typically takes:
          </p>
          <ul style={{ paddingLeft: 24, display: "flex", flexDirection: "column", gap: 10, color: T.inkSoft, fontSize: 16, lineHeight: 1.6 }}>
            <li><strong>4–6 weeks</strong> for initial changes (texture, hydration) to become visible</li>
            <li><strong>8–12 weeks</strong> for more significant improvements (acne reduction, pigmentation)</li>
            <li><strong>3–6 months</strong> for long-term visible changes like fine lines or severe hyperpigmentation</li>
          </ul>
          <p style={{ color: T.inkSoft, lineHeight: 1.75, fontSize: 16, marginTop: 12 }}>
            This is exactly why a photo-based skin progress tracker is so useful. Without objective photos, it's almost impossible to accurately judge what changed and when.
          </p>

          <h2 style={{ color: T.ink, fontWeight: 700, fontSize: 24, margin: "32px 0 16px" }}>Using SkinTrack for progress tracking</h2>
          <p style={{ color: T.inkSoft, lineHeight: 1.75, fontSize: 16 }}>
            SkinTrack lets you build a personal skin progress timeline with photos, notes, and a comparison slider. Your entire photo history is organized by date, so you can compare any two time points directly. The interface is designed to be fast enough that tracking takes less than 2 minutes a week.
          </p>

          <div
            style={{
              background: T.primarySoft,
              border: `1px solid ${T.primary}`,
              borderRadius: 20,
              padding: "28px 24px",
              marginTop: 40,
              textAlign: "center",
            }}
          >
            <h2 style={{ color: T.primaryDark, fontWeight: 700, fontSize: 20, margin: "0 0 10px" }}>
              Start your skin progress tracker
            </h2>
            <p style={{ color: T.inkSoft, fontSize: 14, margin: "0 0 20px", lineHeight: 1.6 }}>
              Free account · Private photos · No medical advice
            </p>
            <Link
              to="/signup"
              style={{ background: T.primary, color: "#FFFFFF", fontWeight: 700, fontSize: 15, padding: "12px 28px", borderRadius: 12, display: "inline-block" }}
            >
              Create Free Account
            </Link>
          </div>

          <div style={{ marginTop: 48 }}>
            <h3 style={{ color: T.ink, fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Related guides</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Link to="/skin-tracker" style={{ color: T.primaryDark, fontWeight: 600, fontSize: 14, textDecoration: "underline" }}>What Is a Skin Tracker?</Link>
              <Link to="/how-to-track-skin-progress" style={{ color: T.primaryDark, fontWeight: 600, fontSize: 14, textDecoration: "underline" }}>How to Track Skin Progress: A Complete Guide</Link>
              <Link to="/skin-photo-comparison" style={{ color: T.primaryDark, fontWeight: 600, fontSize: 14, textDecoration: "underline" }}>Free Skin Photo Comparison Tool</Link>
            </div>
          </div>

          <p style={{ color: T.inkFaint, fontSize: 11, marginTop: 32, lineHeight: 1.6 }}>
            ⚠️ <strong>Medical Disclaimer:</strong> SkinTrack is a personal tracking tool, not a medical device. It does not diagnose or treat skin conditions. Consult a licensed dermatologist for any medical concerns.
          </p>
        </div>
      </div>
    </PublicLayout>
  );
}
