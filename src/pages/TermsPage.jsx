/**
 * TermsPage — Terms of Service at /terms
 */
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import PublicLayout from "../components/PublicLayout.jsx";
import SeoHead from "../components/SeoHead.jsx";
import { trackPageView } from "../analytics.js";

const T = {
  bg: "#FAF9F6", surface: "#FFFFFF", surfaceAlt: "#F3F1EB",
  ink: "#26281F", inkSoft: "#6E7268", inkFaint: "#9A9C93",
  border: "#E7E4DA", primary: "#3F6B57", primaryDark: "#2E5342",
  primarySoft: "#E4EEE8",
};

function Section({ title, children }) {
  return (
    <section style={{ marginBottom: 40 }}>
      <h2 style={{ color: T.ink, fontWeight: 700, fontSize: 20, margin: "0 0 14px", paddingBottom: 10, borderBottom: `1px solid ${T.border}` }}>{title}</h2>
      <div style={{ color: T.inkSoft, fontSize: 15, lineHeight: 1.75 }}>{children}</div>
    </section>
  );
}

export default function TermsPage() {
  useEffect(() => { trackPageView("/terms", "Terms of Service — SkinTrack"); }, []);

  const lastUpdated = "September 1, 2026";

  return (
    <PublicLayout>
      <SeoHead
        title="Terms of Service"
        description="SkinTrack terms of service. Read about acceptable use, your rights, our responsibilities, and the medical disclaimer for this personal skin tracking tool."
        canonicalPath="/terms"
      />

      <div style={{ background: `linear-gradient(180deg, #EEF5F0 0%, ${T.bg} 100%)`, padding: "48px 24px 40px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
            <Link to="/" style={{ color: T.inkFaint, fontSize: 13 }}>Home</Link>
            <span style={{ color: T.inkFaint, fontSize: 13 }}>/</span>
            <span style={{ color: T.inkSoft, fontSize: 13 }}>Terms of Service</span>
          </div>
          <h1 style={{ color: T.ink, fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 12px" }}>Terms of Service</h1>
          <p style={{ color: T.inkFaint, fontSize: 13, margin: 0 }}>Last updated: {lastUpdated}</p>
        </div>
      </div>

      <div style={{ padding: "48px 24px 80px", maxWidth: 720, margin: "0 auto" }}>

        <div style={{ background: "#FFF8E1", border: "1px solid #F5C000", borderRadius: 16, padding: "16px 20px", marginBottom: 40 }}>
          <p style={{ color: "#7A5800", fontSize: 14, lineHeight: 1.6, margin: 0, fontWeight: 600 }}>
            ⚠️ Medical Disclaimer: SkinTrack is a personal monitoring and journaling tool. It is NOT a medical device, does NOT diagnose skin conditions, does NOT provide medical advice, and is NOT a substitute for professional dermatological care. Always consult a licensed dermatologist for any skin health concerns.
          </p>
        </div>

        <Section title="1. Acceptance of terms">
          <p>By creating an account or using SkinTrack, you agree to these Terms of Service. If you do not agree, please do not use the service.</p>
        </Section>

        <Section title="2. Description of service">
          <p>SkinTrack is a personal skin monitoring application that allows users to:</p>
          <ul style={{ paddingLeft: 24, display: "flex", flexDirection: "column", gap: 8 }}>
            <li>Upload and store skin progress photos organized by date and area</li>
            <li>Add notes about their skincare routines</li>
            <li>Compare photos over time using a slider interface</li>
            <li>Track their consistency with a streak and calendar view</li>
          </ul>
          <p style={{ marginTop: 12 }}>SkinTrack is intended solely as a personal tracking and journaling tool. It provides no medical analysis, diagnosis, or treatment recommendations.</p>
        </Section>

        <Section title="3. Account registration">
          <ul style={{ paddingLeft: 24, display: "flex", flexDirection: "column", gap: 8 }}>
            <li>You must provide accurate information when creating an account.</li>
            <li>You are responsible for maintaining the security of your account credentials.</li>
            <li>You must be at least 13 years old to use SkinTrack.</li>
            <li>You are responsible for all activity that occurs under your account.</li>
          </ul>
        </Section>

        <Section title="4. Acceptable use">
          <p>You agree not to:</p>
          <ul style={{ paddingLeft: 24, display: "flex", flexDirection: "column", gap: 8 }}>
            <li>Upload content that is not your own, or that infringes on others' rights</li>
            <li>Upload photos of other people without their consent</li>
            <li>Attempt to access other users' accounts or data</li>
            <li>Use the service for any unlawful purpose</li>
            <li>Attempt to reverse engineer, scrape, or exploit the service</li>
            <li>Upload malicious files or attempt to compromise the service's security</li>
          </ul>
        </Section>

        <Section title="5. Your content and data">
          <p>You retain ownership of the photos and notes you upload to SkinTrack. By uploading content, you grant us a limited license to store and display it to you within the application. We do not claim ownership of your content, and we do not use it for any purpose other than providing the SkinTrack service.</p>
          <p style={{ marginTop: 12 }}>You can delete any individual photo or your entire account at any time. Deletion is permanent and irreversible.</p>
        </Section>

        <Section title="6. Privacy">
          <p>Your use of SkinTrack is also governed by our <Link to="/privacy" style={{ color: T.primaryDark }}>Privacy Policy</Link>, which is incorporated into these Terms by reference. Please read it carefully.</p>
        </Section>

        <Section title="7. Medical disclaimer">
          <p>SkinTrack is explicitly <strong>not</strong> a medical device, healthcare application, or clinical tool. It does not:</p>
          <ul style={{ paddingLeft: 24, display: "flex", flexDirection: "column", gap: 8 }}>
            <li>Diagnose any skin condition</li>
            <li>Provide treatment recommendations</li>
            <li>Analyze photos for medical purposes</li>
            <li>Replace consultation with a qualified dermatologist or other healthcare professional</li>
          </ul>
          <p style={{ marginTop: 12 }}>The app is a personal photography and journaling tool, similar to maintaining a photo album with notes. Any skincare decisions you make based on your personal observations within the app are your own responsibility. Consult a licensed dermatologist for any medical concerns about your skin.</p>
        </Section>

        <Section title="8. Service availability">
          <p>We provide SkinTrack on an "as is" basis. We do not guarantee that the service will be available at all times, error-free, or uninterrupted. We may modify, suspend, or discontinue the service at any time. We will make reasonable efforts to notify users of significant changes.</p>
        </Section>

        <Section title="9. Limitation of liability">
          <p>To the fullest extent permitted by law, SkinTrack and its operators are not liable for any damages arising from your use of the service, including but not limited to loss of data, indirect damages, or damages arising from skin care decisions made based on your use of the app. This is a personal tool — use it wisely and in conjunction with professional advice where appropriate.</p>
        </Section>

        <Section title="10. Changes to these terms">
          <p>We may update these Terms occasionally. When we do, we will update the "Last updated" date. Continued use of SkinTrack after changes constitutes acceptance of the updated terms.</p>
        </Section>

        <Section title="11. Contact">
          <p>For questions about these Terms, contact us at: <strong>gowthamrajb.dev@gmail.com</strong></p>
        </Section>

        <div style={{ marginTop: 40, textAlign: "center" }}>
          <Link to="/privacy" style={{ color: T.primaryDark, fontWeight: 600, fontSize: 14, textDecoration: "underline" }}>
            View Privacy Policy →
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}
