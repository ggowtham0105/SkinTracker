/**
 * SkinTrackerPage — SEO article page at /skin-tracker
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

function ArticleSection({ children }) {
  return (
    <section
      style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: "0 24px",
        lineHeight: 1.75,
        color: T.inkSoft,
        fontSize: 16,
      }}
    >
      {children}
    </section>
  );
}

export default function SkinTrackerPage() {
  useEffect(() => {
    trackPageView("/skin-tracker", "Skin Tracker — SkinTrack");
  }, []);

  return (
    <PublicLayout>
      <SeoHead
        title="Skin Tracker — Monitor Your Skin Progress with Photos"
        description="Learn how to use a skin tracker to monitor your skin's progress over time. Organize your skin photos, track changes, and compare results with SkinTrack."
        canonicalPath="/skin-tracker"
      />

      {/* Hero */}
      <div style={{ background: `linear-gradient(180deg, #EEF5F0 0%, ${T.bg} 100%)`, padding: "56px 24px 48px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
            <Link to="/" style={{ color: T.inkFaint, fontSize: 13 }}>Home</Link>
            <span style={{ color: T.inkFaint, fontSize: 13 }}>/</span>
            <span style={{ color: T.inkSoft, fontSize: 13 }}>Skin Tracker</span>
          </div>
          <h1 style={{ color: T.ink, fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 16px", lineHeight: 1.2 }}>
            What Is a Skin Tracker — And Why You Need One
          </h1>
          <p style={{ color: T.inkSoft, fontSize: 18, lineHeight: 1.6, margin: 0 }}>
            A skin tracker is a system for monitoring your skin's condition over time using consistent photo logs, notes, and progress comparisons.
          </p>
        </div>
      </div>

      <div style={{ padding: "48px 0 80px" }}>
        <ArticleSection>
          <h2 style={{ color: T.ink, fontWeight: 700, fontSize: 24, margin: "0 0 16px" }}>What does a skin tracker do?</h2>
          <p>
            A skin tracker helps you build an objective photographic record of how your skin changes over time. Rather than relying on memory or first impressions, a skin tracker gives you dated, organized evidence of what your skin looked like on a specific date — and what products or routines you were using at the time.
          </p>
          <p>
            Most skin trackers consist of:
          </p>
          <ul style={{ paddingLeft: 24, display: "flex", flexDirection: "column", gap: 8 }}>
            <li>A photo log organized by date and facial area</li>
            <li>Notes about your skincare routine, products, or observations</li>
            <li>A comparison tool to view before and after photos side by side</li>
            <li>A timeline or history view of all your entries</li>
          </ul>
          <p>
            SkinTrack provides all of these features in a private, mobile-friendly web application.
          </p>
        </ArticleSection>

        <ArticleSection>
          <h2 style={{ color: T.ink, fontWeight: 700, fontSize: 24, margin: "32px 0 16px" }}>Why track your skin with photos?</h2>
          <p>
            The human eye adapts very quickly to our own appearance. When you look in the mirror every morning, you naturally adjust to gradual changes — both improvements and regressions. This makes it almost impossible to reliably judge your own skin progress by memory alone.
          </p>
          <p>
            A consistent photo log removes this bias. By comparing a photo from 6 weeks ago with one taken today, you can see changes that were completely invisible to you in real time. This is especially useful for:
          </p>
          <ul style={{ paddingLeft: 24, display: "flex", flexDirection: "column", gap: 8 }}>
            <li>Tracking the effectiveness of a new skincare routine or product</li>
            <li>Monitoring acne, redness, or skin texture over time</li>
            <li>Documenting changes that you want to discuss with a dermatologist</li>
            <li>Maintaining motivation to keep a consistent skincare routine</li>
          </ul>
        </ArticleSection>

        {/* Ad slot between sections */}
        <div style={{ maxWidth: 720, margin: "32px auto", padding: "0 24px" }}>
          <AdSlot slot="2222222222" format="auto" />
        </div>

        <ArticleSection>
          <h2 style={{ color: T.ink, fontWeight: 700, fontSize: 24, margin: "32px 0 16px" }}>How to use SkinTrack as your skin tracker</h2>
          <p>
            SkinTrack is designed to be the simplest possible skin tracker. Here's the workflow:
          </p>
          <ol style={{ paddingLeft: 24, display: "flex", flexDirection: "column", gap: 12 }}>
            <li><strong>Create a free account</strong> — sign up with your email or Google account.</li>
            <li><strong>Take your first photo</strong> — use the in-app camera or upload from your phone gallery.</li>
            <li><strong>Tag the area</strong> — choose which part of your face or neck the photo covers.</li>
            <li><strong>Add notes</strong> — record what products you've been using, any observations, or how your skin feels.</li>
            <li><strong>Repeat regularly</strong> — weekly photos give the best comparison data over time.</li>
            <li><strong>Use the comparison slider</strong> — select any two photos to compare them side by side.</li>
          </ol>
        </ArticleSection>

        <ArticleSection>
          <h2 style={{ color: T.ink, fontWeight: 700, fontSize: 24, margin: "32px 0 16px" }}>What makes a good skin tracking habit?</h2>
          <p>
            The most important factor in skin tracking isn't how many photos you take — it's <strong>consistency</strong>. A few consistent practices make all the difference:
          </p>
          <ul style={{ paddingLeft: 24, display: "flex", flexDirection: "column", gap: 8 }}>
            <li><strong>Same lighting every time</strong> — natural window light is ideal. Artificial lighting changes your skin's appearance significantly.</li>
            <li><strong>Same angle and distance</strong> — a consistent framing makes comparisons far more accurate.</li>
            <li><strong>Same time of day</strong> — skin changes throughout the day (puffiness, redness, etc). Morning after your routine is usually best.</li>
            <li><strong>Regular schedule</strong> — weekly or bi-weekly photos are enough to track meaningful change.</li>
          </ul>
        </ArticleSection>

        <ArticleSection>
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
              Start tracking your skin today
            </h2>
            <p style={{ color: T.inkSoft, fontSize: 14, margin: "0 0 20px", lineHeight: 1.6 }}>
              SkinTrack is free. Your photos are private. No medical claims — just a personal tracking tool.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link
                to="/signup"
                style={{ background: T.primary, color: "#FFFFFF", fontWeight: 700, fontSize: 15, padding: "12px 28px", borderRadius: 12, display: "inline-block" }}
              >
                Create Free Account
              </Link>
              <Link
                to="/skin-photo-comparison"
                style={{ background: T.surface, color: T.primaryDark, fontWeight: 600, fontSize: 15, padding: "12px 28px", borderRadius: 12, border: `1px solid ${T.border}`, display: "inline-block" }}
              >
                Try Photo Comparison
              </Link>
            </div>
          </div>

          {/* Related links */}
          <div style={{ marginTop: 48 }}>
            <h3 style={{ color: T.ink, fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Related guides</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Link to="/skin-progress-tracker" style={{ color: T.primaryDark, fontWeight: 600, fontSize: 14, textDecoration: "underline" }}>Skin Progress Tracker — Monitor Visible Results</Link>
              <Link to="/how-to-track-skin-progress" style={{ color: T.primaryDark, fontWeight: 600, fontSize: 14, textDecoration: "underline" }}>How to Track Skin Progress: A Complete Guide</Link>
              <Link to="/how-to-take-skin-progress-photos" style={{ color: T.primaryDark, fontWeight: 600, fontSize: 14, textDecoration: "underline" }}>How to Take Consistent Skin Progress Photos</Link>
              <Link to="/skincare-journal" style={{ color: T.primaryDark, fontWeight: 600, fontSize: 14, textDecoration: "underline" }}>Skincare Journal — Log Your Routine and Results</Link>
            </div>
          </div>

          <p style={{ color: T.inkFaint, fontSize: 11, marginTop: 32, lineHeight: 1.6 }}>
            ⚠️ <strong>Medical Disclaimer:</strong> SkinTrack is a personal monitoring and journaling tool. It does not diagnose skin conditions, provide medical advice, or replace professional dermatological care. Consult a licensed dermatologist for any medical concerns.
          </p>
        </ArticleSection>
      </div>
    </PublicLayout>
  );
}
