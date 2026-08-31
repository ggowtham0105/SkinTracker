/**
 * PrivacyPage — Privacy Policy at /privacy
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

export default function PrivacyPage() {
  useEffect(() => { trackPageView("/privacy", "Privacy Policy — SkinTrack"); }, []);

  const lastUpdated = "September 1, 2026";

  return (
    <PublicLayout>
      <SeoHead
        title="Privacy Policy"
        description="SkinTrack privacy policy. Learn how we handle your skin photos, personal data, and what controls you have over your information."
        canonicalPath="/privacy"
      />

      <div style={{ background: `linear-gradient(180deg, #EEF5F0 0%, ${T.bg} 100%)`, padding: "48px 24px 40px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
            <Link to="/" style={{ color: T.inkFaint, fontSize: 13 }}>Home</Link>
            <span style={{ color: T.inkFaint, fontSize: 13 }}>/</span>
            <span style={{ color: T.inkSoft, fontSize: 13 }}>Privacy Policy</span>
          </div>
          <h1 style={{ color: T.ink, fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 12px" }}>Privacy Policy</h1>
          <p style={{ color: T.inkFaint, fontSize: 13, margin: 0 }}>Last updated: {lastUpdated}</p>
        </div>
      </div>

      <div style={{ padding: "48px 24px 80px", maxWidth: 720, margin: "0 auto" }}>

        <div style={{ background: T.primarySoft, border: `1px solid ${T.primary}`, borderRadius: 16, padding: "16px 20px", marginBottom: 40 }}>
          <p style={{ color: T.primaryDark, fontSize: 14, lineHeight: 1.6, margin: 0 }}>
            <strong>Summary:</strong> SkinTrack stores your skin photos and account information to provide the tracking service. Your photos are private and associated only with your account. We do not sell your data, and we do not use your skin photos for advertising targeting.
          </p>
        </div>

        <Section title="1. Who we are">
          <p>SkinTrack ("we," "us," or "our") is a personal skin progress tracking application. SkinTrack is a personal project currently operated by the developer.</p>
          <p>If you have questions about this Privacy Policy, you can contact us at: <strong>gowthamrajb.dev@gmail.com</strong></p>
        </Section>

        <Section title="2. What information we collect">
          <p>When you create an account and use SkinTrack, we collect:</p>
          <ul style={{ paddingLeft: 24, display: "flex", flexDirection: "column", gap: 8 }}>
            <li><strong>Account information:</strong> Your email address and display name (required to create an account).</li>
            <li><strong>Authentication data:</strong> A hashed password (we never store your plain-text password) or, if you sign in with Google, your Google user ID and email.</li>
            <li><strong>Skin photos:</strong> Photos you upload to the app, stored on our server and associated only with your account.</li>
            <li><strong>Photo metadata:</strong> The date, facial area tag, and any notes you add to each photo entry.</li>
            <li><strong>Notification preferences:</strong> Your reminder frequency and time settings, stored in your account settings.</li>
            <li><strong>Authentication tokens:</strong> A JWT (JSON Web Token) stored in your browser's localStorage, used to keep you logged in.</li>
          </ul>
        </Section>

        <Section title="3. How we use your information">
          <ul style={{ paddingLeft: 24, display: "flex", flexDirection: "column", gap: 8 }}>
            <li>To provide the SkinTrack service: storing and displaying your photos, timeline, comparisons, and notes.</li>
            <li>To authenticate you and maintain your session.</li>
            <li>To send you email reminders (only if you have configured them and only to your registered email address).</li>
            <li>To allow you to delete your account and all associated data.</li>
          </ul>
          <p style={{ marginTop: 12 }}><strong>We do not use your skin photos or personal data for advertising targeting.</strong> If advertising (Google AdSense) is displayed on public informational pages, it is on public content pages only — never inside your private dashboard, photo upload area, or logged-in application.</p>
        </Section>

        <Section title="4. How skin photos are handled">
          <p>Your skin photos are treated as sensitive personal data:</p>
          <ul style={{ paddingLeft: 24, display: "flex", flexDirection: "column", gap: 8 }}>
            <li>Photos are stored on the server's file system in the <code>uploads/</code> directory, associated with your account ID.</li>
            <li>Photos are accessible only through authenticated API endpoints — they require a valid JWT token from your account to view.</li>
            <li>Photos are never shared with third parties.</li>
            <li>Photos are never used for advertising targeting or any form of personalization beyond displaying them to you.</li>
            <li>When you delete a photo through the app, it is permanently removed from the server.</li>
            <li>When you delete your account, all your photos and data are permanently deleted.</li>
          </ul>
          <p style={{ marginTop: 12 }}>The public photo comparison tool (<Link to="/skin-photo-comparison" style={{ color: T.primaryDark }}>skin-photo-comparison</Link>) processes photos entirely in your browser using JavaScript. These photos are never uploaded to our server.</p>
        </Section>

        <Section title="5. Authentication">
          <p>SkinTrack supports two authentication methods:</p>
          <ul style={{ paddingLeft: 24, display: "flex", flexDirection: "column", gap: 8 }}>
            <li><strong>Email/password:</strong> Your password is hashed with bcrypt before storage. We never store or have access to your plain-text password.</li>
            <li><strong>Google Sign-In (Firebase):</strong> If you sign in with Google, we receive your Google email address and display name via Firebase Authentication. We do not receive your Google password. Google's privacy policy governs the Google sign-in process.</li>
          </ul>
          <p style={{ marginTop: 12 }}>Authentication sessions are maintained via a JWT token stored in your browser's localStorage. This token expires after 7 days (or 30 days for Google Sign-In). You can log out at any time to clear the token.</p>
        </Section>

        <Section title="6. Cookies and local storage">
          <p>SkinTrack does not use tracking cookies. We use browser localStorage for:</p>
          <ul style={{ paddingLeft: 24, display: "flex", flexDirection: "column", gap: 8 }}>
            <li>Your authentication token (to keep you logged in)</li>
            <li>Your notification preferences (as a local cache)</li>
          </ul>
          <p style={{ marginTop: 12 }}>If Google AdSense is enabled on public pages, Google may set cookies for advertising purposes on those public pages. These cookies do not apply to your private logged-in session. You can manage advertising preferences through <a href="https://adssettings.google.com" style={{ color: T.primaryDark }}>Google's Ad Settings</a>.</p>
        </Section>

        <Section title="7. Analytics">
          <p>SkinTrack may use Google Analytics (if configured) to measure traffic on public pages. Analytics data collected includes:</p>
          <ul style={{ paddingLeft: 24, display: "flex", flexDirection: "column", gap: 8 }}>
            <li>Pages visited and approximate geographic region</li>
            <li>General usage patterns (which features are used)</li>
          </ul>
          <p style={{ marginTop: 12 }}>Analytics is configured to disable Google Signals (cross-site tracking) and advertising personalization. We do not collect or send user IDs, email addresses, or health information to analytics systems. Analytics data is aggregated and anonymous.</p>
        </Section>

        <Section title="8. Data sharing">
          <p>We do not sell, rent, or share your personal data with third parties, except:</p>
          <ul style={{ paddingLeft: 24, display: "flex", flexDirection: "column", gap: 8 }}>
            <li><strong>Google Firebase:</strong> Used for Google Sign-In authentication. Governed by <a href="https://policies.google.com/privacy" style={{ color: T.primaryDark }}>Google's Privacy Policy</a>.</li>
            <li><strong>Email service providers:</strong> Used to send password reset and reminder emails to your registered email address only.</li>
          </ul>
        </Section>

        <Section title="9. Your rights and data controls">
          <p>You have full control over your data:</p>
          <ul style={{ paddingLeft: 24, display: "flex", flexDirection: "column", gap: 8 }}>
            <li><strong>Delete a photo:</strong> Delete any individual photo from within the app at any time. Deletion is immediate and permanent.</li>
            <li><strong>Delete your account:</strong> Use the "Delete Account" option in your profile settings. This permanently deletes your account, all photos, all notes, and all associated data. This action cannot be undone.</li>
            <li><strong>Log out:</strong> Log out at any time to clear your authentication session from this device.</li>
            <li><strong>Export:</strong> Currently, a formal data export feature is not available. You can download individual photos directly from the app.</li>
          </ul>
        </Section>

        <Section title="10. Data retention">
          <p>Your data is retained for as long as your account exists. When you delete your account, all data is permanently deleted from our systems. We do not retain backups of deleted account data.</p>
        </Section>

        <Section title="11. Children's privacy">
          <p>SkinTrack is not intended for use by children under 13. We do not knowingly collect personal information from children under 13. If you believe a child under 13 has created an account, please contact us.</p>
        </Section>

        <Section title="12. Changes to this policy">
          <p>We may update this Privacy Policy occasionally. When we do, we will update the "Last updated" date at the top of this page. Continued use of SkinTrack after a policy update constitutes acceptance of the revised policy.</p>
        </Section>

        <Section title="13. Contact">
          <p>For privacy questions or data deletion requests, contact us at: <strong>gowthamrajb.dev@gmail.com</strong></p>
        </Section>

        <div style={{ marginTop: 40, textAlign: "center" }}>
          <Link to="/terms" style={{ color: T.primaryDark, fontWeight: 600, fontSize: 14, textDecoration: "underline" }}>
            View Terms of Service →
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}
