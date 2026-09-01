/**
 * TakePhotoGuidePage — SEO guide at /how-to-take-skin-progress-photos
 */
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import PublicLayout from "../components/PublicLayout.jsx";
import SeoHead from "../components/SeoHead.jsx";
import AdSlot from "../components/AdSlot.jsx";
import { trackPageView } from "../analytics.js";

const T = {
  bg: "#FAF9F6", surface: "#FFFFFF", surfaceAlt: "#F3F1EB",
  ink: "#26281F", inkSoft: "#6E7268", inkFaint: "#9A9C93",
  border: "#E7E4DA", primary: "#3F6B57", primaryDark: "#2E5342",
  primarySoft: "#E4EEE8",
};

export default function TakePhotoGuidePage() {
  useEffect(() => { trackPageView("/how-to-take-skin-progress-photos", "How to Take Skin Progress Photos — SkinTrack"); }, []);

  return (
    <PublicLayout>
      <SeoHead
        title="How to Take Skin Progress Photos: Lighting, Angles & Tips"
        description="Learn how to take consistent, comparable skin progress photos. Tips on lighting, camera settings, angles, and timing for accurate before-and-after comparisons."
        canonicalPath="/how-to-take-skin-progress-photos"
      />

      <div style={{ background: `linear-gradient(180deg, #EEF5F0 0%, ${T.bg} 100%)`, padding: "56px 24px 48px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
            <Link to="/" style={{ color: T.inkFaint, fontSize: 13 }}>Home</Link>
            <span style={{ color: T.inkFaint, fontSize: 13 }}>/</span>
            <Link to="/how-to-track-skin-progress" style={{ color: T.inkFaint, fontSize: 13 }}>How to Track</Link>
            <span style={{ color: T.inkFaint, fontSize: 13 }}>/</span>
            <span style={{ color: T.inkSoft, fontSize: 13 }}>Photo Tips</span>
          </div>
          <h1 style={{ color: T.ink, fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 16px", lineHeight: 1.2 }}>
            How to Take Consistent Skin Progress Photos
          </h1>
          <p style={{ color: T.inkSoft, fontSize: 18, lineHeight: 1.6, margin: 0 }}>
            The most important thing about skin progress photos isn't quality — it's consistency. Here's exactly how to get it right.
          </p>
        </div>
      </div>

      <div style={{ padding: "48px 0 80px", maxWidth: 720, margin: "0 auto" }}>
        <div style={{ padding: "0 24px" }}>

          <h2 style={{ color: T.ink, fontWeight: 700, fontSize: 24, margin: "0 0 20px" }}>The photography basics for skin tracking</h2>

          {[
            {
              icon: "☀️",
              title: "1. Lighting: Natural window light is king",
              content: [
                "Stand facing a window so light falls evenly across your face.",
                "Avoid overhead bathroom lights — they create inconsistent shadows.",
                "Avoid direct sunlight — it's too harsh and creates overexposure.",
                "Overcast days actually provide the most consistent, diffuse light.",
                "If using artificial light: use a ring light at eye level, always the same distance away.",
                "The goal: the same light, every single time you photograph.",
              ],
            },
            {
              icon: "📐",
              title: "2. Camera angle and framing",
              content: [
                "Hold the camera at eye level — never shoot up or down at your face.",
                "Keep the camera parallel to your face, not tilted.",
                "Use the same distance each time. Arms-length with a phone works well.",
                "Center your face in the frame the same way every time.",
                "Pro tip: use a phone stand or prop your phone against something so your hands are free.",
              ],
            },
            {
              icon: "⏰",
              title: "3. Timing: Shoot at the same time of day",
              content: [
                "Skin fluctuates throughout the day — morning puffiness, evening redness, etc.",
                "Morning photos (after washing your face, before heavy makeup) give the most stable baseline.",
                "Never take tracking photos right after exercise, alcohol, or a hot shower.",
                "Stick to one specific time window, like 'every Sunday morning after my routine'.",
              ],
            },
            {
              icon: "🎨",
              title: "4. Skin preparation",
              content: [
                "For consistency, photograph at the same point in your skincare routine (e.g., cleanser only, no actives applied yet).",
                "Avoid heavy moisturizer, sunscreen, or heavy serums immediately before — they affect how skin reflects light.",
                "If you wear makeup, always photograph bare-faced or with the same minimal base.",
              ],
            },
            {
              icon: "📱",
              title: "5. Camera settings",
              content: [
                "Use the front-facing camera for selfie-style shots (more consistent than flipping the phone).",
                "Turn off beauty filters and portrait mode — they alter skin texture and are inconsistent.",
                "Use HDR if available — it provides better detail in skin texture.",
                "Don't zoom in — use your feet to get closer if needed.",
                "Take 2–3 photos and pick the sharpest one.",
              ],
            },
          ].map(({ icon, title, content }) => (
            <div key={title} style={{ marginBottom: 36 }}>
              <h3 style={{ color: T.ink, fontWeight: 700, fontSize: 18, margin: "0 0 12px", display: "flex", alignItems: "center", gap: 10 }}>
                <span>{icon}</span> {title}
              </h3>
              <ul style={{ paddingLeft: 24, display: "flex", flexDirection: "column", gap: 8, color: T.inkSoft, fontSize: 15, lineHeight: 1.65 }}>
                {content.map((c) => <li key={c}>{c}</li>)}
              </ul>
            </div>
          ))}

          <div style={{ margin: "32px 0" }}>
            <AdSlot slot="5555555555" format="auto" />
          </div>

          <h2 style={{ color: T.ink, fontWeight: 700, fontSize: 24, margin: "32px 0 16px" }}>Which facial areas to photograph</h2>
          <p style={{ color: T.inkSoft, lineHeight: 1.75, fontSize: 16 }}>SkinTrack lets you tag each photo with a specific facial area. This is important because different areas of your face may have very different skin concerns. Common areas to track:</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10, marginTop: 16 }}>
            {["Forehead", "Left cheek", "Right cheek", "Chin", "Jawline", "Neck"].map((area) => (
              <div key={area} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: "12px 16px", color: T.ink, fontWeight: 600, fontSize: 14 }}>
                📍 {area}
              </div>
            ))}
          </div>

          <h2 style={{ color: T.ink, fontWeight: 700, fontSize: 24, margin: "40px 0 16px" }}>Quick reference: The perfect skin tracking photo setup</h2>
          <div style={{ background: T.primarySoft, border: `1px solid ${T.primary}`, borderRadius: 16, padding: "20px 24px" }}>
            <ul style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8, color: T.primaryDark, fontSize: 14, lineHeight: 1.6 }}>
              <li>📍 Same spot in your home every time</li>
              <li>☀️ Facing a window (natural, diffuse light)</li>
              <li>📐 Camera at eye level, parallel to your face</li>
              <li>📏 Same distance (arms-length works)</li>
              <li>⏰ Same time of day (morning, post-routine)</li>
              <li>🚫 No filters, no portrait mode, no beauty mode</li>
              <li>😐 Neutral expression, relaxed face</li>
            </ul>
          </div>

          <div style={{ background: T.primarySoft, border: `1px solid ${T.primary}`, borderRadius: 20, padding: "28px 24px", marginTop: 48, textAlign: "center" }}>
            <h2 style={{ color: T.primaryDark, fontWeight: 700, fontSize: 20, margin: "0 0 10px" }}>Put these tips to use</h2>
            <p style={{ color: T.inkSoft, fontSize: 14, margin: "0 0 20px", lineHeight: 1.6 }}>Upload your first photo now — SkinTrack's camera includes alignment guides to help you maintain consistency.</p>
            <Link to="/signup" style={{ background: T.primary, color: "#FFFFFF", fontWeight: 700, fontSize: 15, padding: "12px 28px", borderRadius: 12, display: "inline-block" }}>
              Start Tracking Free
            </Link>
          </div>

          <div style={{ marginTop: 48 }}>
            <h3 style={{ color: T.ink, fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Related guides</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Link to="/how-to-track-skin-progress" style={{ color: T.primaryDark, fontWeight: 600, fontSize: 14, textDecoration: "underline" }}>How to Track Skin Progress</Link>
              <Link to="/skin-photo-comparison" style={{ color: T.primaryDark, fontWeight: 600, fontSize: 14, textDecoration: "underline" }}>Free Photo Comparison Tool</Link>
              <Link to="/skincare-journal" style={{ color: T.primaryDark, fontWeight: 600, fontSize: 14, textDecoration: "underline" }}>Skincare Journal Guide</Link>
            </div>
          </div>

          <p style={{ color: T.inkFaint, fontSize: 11, marginTop: 32, lineHeight: 1.6 }}>⚠️ SkinTrack is a personal tracking tool, not a medical device. Consult a dermatologist for any skin health concerns.</p>
        </div>
      </div>
    </PublicLayout>
  );
}
