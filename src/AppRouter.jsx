/**
 * AppRouter — top-level route dispatcher.
 *
 * Strategy:
 *   - Root "/" for guests (no JWT) → LandingPage
 *   - Root "/" for authenticated users → SkinTrackApp (dashboard)
 *   - Root "/" with ?view=signup|login|?resetToken= → SkinTrackApp (preserves all auth flows)
 *   - Public SEO pages are always accessible at their specific URLs
 *   - SkinTrackApp handles its own internal tab state (no changes needed there)
 */

import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SkinTrackApp from "./App.jsx";

// Lazy-load public pages for performance
const LandingPage         = lazy(() => import("./pages/LandingPage.jsx"));
const CompareToolPage     = lazy(() => import("./pages/CompareToolPage.jsx"));
const SkinTrackerPage     = lazy(() => import("./pages/SkinTrackerPage.jsx"));
const SkinProgressPage    = lazy(() => import("./pages/SkinProgressTrackerPage.jsx"));
const HowToTrackPage      = lazy(() => import("./pages/HowToTrackPage.jsx"));
const TakePhotoGuidePage  = lazy(() => import("./pages/TakePhotoGuidePage.jsx"));
const SkincareJournalPage = lazy(() => import("./pages/SkincareJournalPage.jsx"));
const PrivacyPage         = lazy(() => import("./pages/PrivacyPage.jsx"));
const TermsPage           = lazy(() => import("./pages/TermsPage.jsx"));

// Minimal loading fallback (matches app bg color so no flash)
function PageLoader() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#FAF9F6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, sans-serif",
        color: "#9A9C93",
        fontSize: 14,
      }}
    >
      Loading…
    </div>
  );
}

/**
 * Root route component:
 * - If user has a JWT token in localStorage → show SkinTrackApp (dashboard)
 * - If URL has auth-related params (?view=, ?resetToken=) → show SkinTrackApp
 * - Otherwise → show LandingPage for organic visitors
 */
function RootRoute() {
  const token = localStorage.getItem("skintrack_token");
  const params = new URLSearchParams(window.location.search);
  const hasAuthParam = params.has("resetToken") || params.has("view") || params.has("openUpload");

  // Authenticated user or explicit auth flow → dashboard/auth app
  if (token || hasAuthParam) {
    return <SkinTrackApp />;
  }

  // Guest → landing page
  return (
    <Suspense fallback={<PageLoader />}>
      <LandingPage />
    </Suspense>
  );
}

export default function AppRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* ── Root: smart guest/auth dispatch ── */}
        <Route path="/" element={<RootRoute />} />

        {/* ── Public SEO pages ── */}
        <Route path="/skin-tracker"                    element={<SkinTrackerPage />} />
        <Route path="/skin-progress-tracker"           element={<SkinProgressPage />} />
        <Route path="/skin-photo-comparison"           element={<CompareToolPage />} />
        <Route path="/skincare-journal"                element={<SkincareJournalPage />} />
        <Route path="/how-to-track-skin-progress"      element={<HowToTrackPage />} />
        <Route path="/how-to-take-skin-progress-photos" element={<TakePhotoGuidePage />} />
        <Route path="/privacy"                         element={<PrivacyPage />} />
        <Route path="/terms"                           element={<TermsPage />} />

        {/* ── Fallback: redirect unknown paths to home ── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

