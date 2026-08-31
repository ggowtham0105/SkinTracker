/**
 * HowToTrackPage — SEO guide at /how-to-track-skin-progress
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
  primarySoft: "#E4EEE8", accent: "#B97D82",
};

function Step({ n, title, body }) {
  return (
    <div style={{ display: "flex", gap: 20, paddingBottom: 32, borderBottom: `1px solid ${T.border}` }}>
      <div style={{ background: T.primary, color: "#fff", width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16, flexShrink: 0, marginTop: 4, fontFamily: "monospace" }}>{n}</div>
      <div>
        <h3 style={{ color: T.ink, fontWeight: 700, fontSize: 18, margin: "0 0 10px" }}>{title}</h3>
        <p style={{ color: T.inkSoft, fontSize: 15, lineHeight: 1.7, margin: 0 }}>{body}</p>
      </div>
    </div>
  );
}

export default function HowToTrackPage() {
  useEffect(() => { trackPageView("/how-to-track-skin-progress", "How to Track Skin Progress — SkinTrack"); }, []);

  return (
    <PublicLayout>
      <SeoHead
        title="How to Track Skin Progress: A Complete Step-by-Step Guide"
        description="Learn exactly how to track your skin progress with photos. Step-by-step guide covering consistency, lighting, angles, notes, and comparison techniques."
        canonicalPath="/how-to-track-skin-progress"
      />

      <div style={{ background: `linear-gradient(180deg, #EEF5F0 0%, ${T.bg} 100%)`, padding: "56px 24px 48px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
            <Link to="/" style={{ color: T.inkFaint, fontSize: 13 }}>Home</Link>
            <span style={{ color: T.inkFaint, fontSize: 13 }}>/</span>
            <span style={{ color: T.inkSoft, fontSize: 13 }}>How to Track Skin Progress</span>
          </div>
          <h1 style={{ color: T.ink, fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 16px", lineHeight: 1.2 }}>
            How to Track Skin Progress: A Complete Guide
          </h1>
          <p style={{ color: T.inkSoft, fontSize: 18, lineHeight: 1.6, margin: 0 }}>
            Everything you need to build a consistent skin monitoring habit that actually shows you meaningful results.
          </p>
        </div>
      </div>

      <div style={{ padding: "48px 0 80px", maxWidth: 720, margin: "0 auto" }}>
        <div style={{ padding: "0 24px" }}>
          <h2 style={{ color: T.ink, fontWeight: 700, fontSize: 24, margin: "0 0 16px" }}>Why most people fail at tracking skin progress</h2>
          <p style={{ color: T.inkSoft, lineHeight: 1.75, fontSize: 16 }}>
            Most people try to track their skin progress by just "paying attention." The problem is that your brain is wired to adapt to gradual change. Without a concrete reference point, your brain rewrites your memory of what your skin looked like before. That's why so many people feel like nothing is working, even when they're making real progress — or conversely, feel like they've improved when they haven't.
          </p>
          <p style={{ color: T.inkSoft, lineHeight: 1.75, fontSize: 16 }}>
            The solution is simple: take consistent photos and compare them objectively.
          </p>

          <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 32 }}>
            <Step n="1" title="Set a consistent schedule" body="Choose one day per week (or every 2 weeks) to take your skin photo. Set a recurring reminder. Consistency matters far more than frequency. Weekly photos give you enough data points without becoming a burden." />
            <Step n="2" title="Find your lighting spot" body="Natural window light is the gold standard. Stand facing the window (not sideways) for even illumination with no shadows. Avoid bathroom mirrors under overhead lighting — the shadows are inconsistent and unflattering." />
            <Step n="3" title="Fix your camera distance and angle" body="Stand the same distance from the camera every time (arms-length with a phone works well). Look directly at the camera. Use the front-facing camera for consistency. Some people mark a spot on the floor to stand in the same place each time." />
            <Step n="4" title="Take photos at the same time of day" body="Skin changes throughout the day. Morning photos (after washing your face, before heavy makeup) give the most consistent baseline. Your skin will look different in the evening — not because of your routine, but because of natural daily fluctuation." />
            <Step n="5" title="Tag the area and log your notes" body="Every time you upload a photo in SkinTrack, tag which part of your face it covers (forehead, cheek, chin, etc.) and write a brief note. Include what products you've been using, any changes to your routine, or what your skin feels like. These notes become incredibly valuable when you look back months later." />
            <Step n="6" title="Compare every 4–8 weeks" body="Comparing photos that are too close together (less than a week) usually shows no meaningful change. The real power of tracking comes from comparing 4–8 week intervals. Use the comparison slider to reveal changes that your memory would never have captured." />
          </div>

          <div style={{ maxWidth: "100%", margin: "32px 0" }}>
            <AdSlot slot="4444444444" format="auto" />
          </div>

          <h2 style={{ color: T.ink, fontWeight: 700, fontSize: 24, margin: "32px 0 16px" }}>Common tracking mistakes to avoid</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { icon: "❌", mistake: "Comparing photos taken in different lighting", fix: "Always use the same window or light source." },
              { icon: "❌", mistake: "Taking photos right after working out or drinking alcohol", fix: "Both cause temporary flushing and puffiness. Take photos at your normal baseline." },
              { icon: "❌", mistake: "Changing too many skincare products at once", fix: "Introduce one new product at a time so you can attribute changes correctly." },
              { icon: "❌", mistake: "Giving up after 2–3 weeks", fix: "Most skin improvements take at least 4–8 weeks to become visible. Patience is essential." },
              { icon: "❌", mistake: "Only tracking on \"good\" skin days", fix: "Track consistently regardless of how your skin looks that day. The honest record is more useful." },
            ].map(({ icon, mistake, fix }) => (
              <div key={mistake} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: "16px 20px" }}>
                <div style={{ color: T.ink, fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{icon} {mistake}</div>
                <p style={{ color: T.inkSoft, fontSize: 14, lineHeight: 1.6, margin: 0 }}>✅ {fix}</p>
              </div>
            ))}
          </div>

          <div style={{ background: T.primarySoft, border: `1px solid ${T.primary}`, borderRadius: 20, padding: "28px 24px", marginTop: 48, textAlign: "center" }}>
            <h2 style={{ color: T.primaryDark, fontWeight: 700, fontSize: 20, margin: "0 0 10px" }}>Ready to start tracking?</h2>
            <p style={{ color: T.inkSoft, fontSize: 14, margin: "0 0 20px", lineHeight: 1.6 }}>
              SkinTrack is free, private, and designed to make consistent skin tracking effortless.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link to="/?view=signup" style={{ background: T.primary, color: "#FFFFFF", fontWeight: 700, fontSize: 15, padding: "12px 28px", borderRadius: 12, display: "inline-block" }}>Start Tracking Free</Link>
              <Link to="/how-to-take-skin-progress-photos" style={{ background: T.surface, color: T.primaryDark, fontWeight: 600, fontSize: 15, padding: "12px 28px", borderRadius: 12, border: `1px solid ${T.border}`, display: "inline-block" }}>Photo Taking Guide</Link>
            </div>
          </div>

          <div style={{ marginTop: 48 }}>
            <h3 style={{ color: T.ink, fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Related guides</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Link to="/skin-tracker" style={{ color: T.primaryDark, fontWeight: 600, fontSize: 14, textDecoration: "underline" }}>What Is a Skin Tracker?</Link>
              <Link to="/skin-progress-tracker" style={{ color: T.primaryDark, fontWeight: 600, fontSize: 14, textDecoration: "underline" }}>Skin Progress Tracker</Link>
              <Link to="/how-to-take-skin-progress-photos" style={{ color: T.primaryDark, fontWeight: 600, fontSize: 14, textDecoration: "underline" }}>How to Take Skin Progress Photos</Link>
              <Link to="/skincare-journal" style={{ color: T.primaryDark, fontWeight: 600, fontSize: 14, textDecoration: "underline" }}>Skincare Journal Guide</Link>
              <Link to="/skin-photo-comparison" style={{ color: T.primaryDark, fontWeight: 600, fontSize: 14, textDecoration: "underline" }}>Free Photo Comparison Tool</Link>
            </div>
          </div>

          <p style={{ color: T.inkFaint, fontSize: 11, marginTop: 32, lineHeight: 1.6 }}>⚠️ <strong>Medical Disclaimer:</strong> SkinTrack is not a medical device. It does not diagnose skin conditions or provide medical advice. Consult a dermatologist for medical concerns.</p>
        </div>
      </div>
    </PublicLayout>
  );
}
