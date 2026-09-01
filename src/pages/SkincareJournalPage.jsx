/**
 * SkincareJournalPage — SEO guide at /skincare-journal
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

export default function SkincareJournalPage() {
  useEffect(() => { trackPageView("/skincare-journal", "Skincare Journal — SkinTrack"); }, []);

  return (
    <PublicLayout>
      <SeoHead
        title="Skincare Journal — Track Your Routine and Skin Progress"
        description="A skincare journal helps you connect your routine to real skin changes. Learn how to keep a photo-based skincare journal with notes, dates, and comparisons."
        canonicalPath="/skincare-journal"
      />

      <div style={{ background: `linear-gradient(180deg, #EEF5F0 0%, ${T.bg} 100%)`, padding: "56px 24px 48px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
            <Link to="/" style={{ color: T.inkFaint, fontSize: 13 }}>Home</Link>
            <span style={{ color: T.inkFaint, fontSize: 13 }}>/</span>
            <span style={{ color: T.inkSoft, fontSize: 13 }}>Skincare Journal</span>
          </div>
          <h1 style={{ color: T.ink, fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 16px", lineHeight: 1.2 }}>
            Skincare Journal — Connect Your Routine to Real Results
          </h1>
          <p style={{ color: T.inkSoft, fontSize: 18, lineHeight: 1.6, margin: 0 }}>
            A skincare journal helps you understand what your skin responds to — so you stop guessing and start seeing results.
          </p>
        </div>
      </div>

      <div style={{ padding: "48px 0 80px", maxWidth: 720, margin: "0 auto" }}>
        <div style={{ padding: "0 24px" }}>
          <h2 style={{ color: T.ink, fontWeight: 700, fontSize: 24, margin: "0 0 16px" }}>What is a skincare journal?</h2>
          <p style={{ color: T.inkSoft, lineHeight: 1.75, fontSize: 16 }}>
            A skincare journal is a personal log that connects what you put on your skin to how your skin looks and feels over time. Unlike a general diary, a skincare journal is specifically structured around:
          </p>
          <ul style={{ paddingLeft: 24, display: "flex", flexDirection: "column", gap: 8, color: T.inkSoft, fontSize: 16, lineHeight: 1.65 }}>
            <li>Dated photos of your skin (the most objective evidence)</li>
            <li>Notes about which products and routines you're using</li>
            <li>Observations about your skin's condition on specific dates</li>
            <li>Comparisons between time points to see what changed</li>
          </ul>
          <p style={{ color: T.inkSoft, lineHeight: 1.75, fontSize: 16, marginTop: 12 }}>
            When kept consistently, a skincare journal removes the guesswork from your routine. Instead of wondering if a product is working, you have a dated photo record that shows you exactly what changed and when.
          </p>

          <h2 style={{ color: T.ink, fontWeight: 700, fontSize: 24, margin: "32px 0 16px" }}>What to write in a skincare journal</h2>
          <p style={{ color: T.inkSoft, lineHeight: 1.75, fontSize: 16 }}>For each entry, you don't need to write a lot. The most useful skincare journal entries include:</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
            {[
              { icon: "📸", title: "A photo", desc: "The most important element. Consistent photos are worth 1000 words." },
              { icon: "📅", title: "The date", desc: "Never skip dating your entries. The timeline is the whole point." },
              { icon: "🧴", title: "Active products", desc: "Which serums, treatments, or prescription products are you currently using? Any new additions or removals?" },
              { icon: "😴", title: "Lifestyle notes", desc: "Sleep quality, stress, diet, and hydration all affect skin. A brief note when something major changes is helpful." },
              { icon: "👁️", title: "Observations", desc: "What does your skin look or feel like today? Dry, oily, balanced? Any new areas of concern?" },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{ display: "flex", gap: 14, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: "14px 18px", alignItems: "flex-start" }}>
                <span style={{ fontSize: 20, flexShrink: 0, marginTop: 2 }}>{icon}</span>
                <div>
                  <div style={{ color: T.ink, fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{title}</div>
                  <p style={{ color: T.inkSoft, fontSize: 14, lineHeight: 1.6, margin: 0 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ margin: "32px 0" }}>
            <AdSlot slot="6666666666" format="auto" />
          </div>

          <h2 style={{ color: T.ink, fontWeight: 700, fontSize: 24, margin: "32px 0 16px" }}>The power of comparing journal entries over time</h2>
          <p style={{ color: T.inkSoft, lineHeight: 1.75, fontSize: 16 }}>
            The real value of a skincare journal isn't any single entry — it's the pattern that emerges over time. When you compare an entry from 8 weeks ago with today's entry, you can:
          </p>
          <ul style={{ paddingLeft: 24, display: "flex", flexDirection: "column", gap: 8, color: T.inkSoft, fontSize: 16, lineHeight: 1.65 }}>
            <li>See objective photo evidence of changes (positive or negative)</li>
            <li>Identify which products you were using during periods of improvement</li>
            <li>Spot patterns — does your skin get worse during high-stress periods? After changing your diet?</li>
            <li>Know when a routine isn't working, so you can change it before months pass</li>
          </ul>
          <p style={{ color: T.inkSoft, lineHeight: 1.75, fontSize: 16, marginTop: 12 }}>
            SkinTrack's comparison slider makes this easy — select any two dated entries and drag the slider to reveal the difference.
          </p>

          <h2 style={{ color: T.ink, fontWeight: 700, fontSize: 24, margin: "32px 0 16px" }}>How SkinTrack works as a skincare journal</h2>
          <p style={{ color: T.inkSoft, lineHeight: 1.75, fontSize: 16 }}>
            SkinTrack is built specifically as a photo-first skincare journal. Each entry captures:
          </p>
          <ul style={{ paddingLeft: 24, display: "flex", flexDirection: "column", gap: 8, color: T.inkSoft, fontSize: 16, lineHeight: 1.65 }}>
            <li>A dated photo (taken in-app or uploaded from your device)</li>
            <li>The facial area (forehead, cheek, chin, jawline, neck, etc.)</li>
            <li>A note field for routine observations and product changes</li>
          </ul>
          <p style={{ color: T.inkSoft, lineHeight: 1.75, fontSize: 16, marginTop: 12 }}>
            Your entries build a private timeline you can browse and compare at any time. Everything is stored securely in your private account — never shared or made public.
          </p>

          <div style={{ background: T.primarySoft, border: `1px solid ${T.primary}`, borderRadius: 20, padding: "28px 24px", marginTop: 48, textAlign: "center" }}>
            <h2 style={{ color: T.primaryDark, fontWeight: 700, fontSize: 20, margin: "0 0 10px" }}>Start your skincare journal</h2>
            <p style={{ color: T.inkSoft, fontSize: 14, margin: "0 0 20px", lineHeight: 1.6 }}>Free, private, and takes less than 2 minutes per week.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link to="/signup" style={{ background: T.primary, color: "#FFFFFF", fontWeight: 700, fontSize: 15, padding: "12px 28px", borderRadius: 12, display: "inline-block" }}>Create Free Account</Link>
              <Link to="/skin-photo-comparison" style={{ background: T.surface, color: T.primaryDark, fontWeight: 600, fontSize: 15, padding: "12px 28px", borderRadius: 12, border: `1px solid ${T.border}`, display: "inline-block" }}>Try Free Comparison</Link>
            </div>
          </div>

          <div style={{ marginTop: 48 }}>
            <h3 style={{ color: T.ink, fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Related guides</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Link to="/skin-tracker" style={{ color: T.primaryDark, fontWeight: 600, fontSize: 14, textDecoration: "underline" }}>What Is a Skin Tracker?</Link>
              <Link to="/how-to-track-skin-progress" style={{ color: T.primaryDark, fontWeight: 600, fontSize: 14, textDecoration: "underline" }}>How to Track Skin Progress</Link>
              <Link to="/how-to-take-skin-progress-photos" style={{ color: T.primaryDark, fontWeight: 600, fontSize: 14, textDecoration: "underline" }}>How to Take Skin Progress Photos</Link>
            </div>
          </div>

          <p style={{ color: T.inkFaint, fontSize: 11, marginTop: 32, lineHeight: 1.6 }}>⚠️ SkinTrack is a personal journaling tool, not a medical device. It does not diagnose skin conditions or provide medical advice.</p>
        </div>
      </div>
    </PublicLayout>
  );
}
