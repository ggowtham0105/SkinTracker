/* ---------------------------------------------------------
   SkinTrack Analytics
   Reads VITE_GA_MEASUREMENT_ID from env.
   All calls are no-ops when the env var is absent.
   DO NOT collect sensitive health information.
--------------------------------------------------------- */

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

/**
 * Load the Google Analytics gtag script once.
 * Called automatically on first event if GA_ID is set.
 */
let _gtagLoaded = false;
function loadGtag() {
  if (_gtagLoaded || !GA_ID) return;
  _gtagLoaded = true;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_ID, {
    // Disable sending user IDs or personalized data
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
}

/**
 * Track a named event with optional metadata.
 * Events collected:
 *   page_view         — public page loads
 *   cta_clicked       — hero CTA buttons
 *   signup_clicked    — any signup link
 *   login_success     — user logged in
 *   comparison_started   — public compare tool: files selected
 *   comparison_completed — public compare tool: slider moved
 *   photo_upload_started — authenticated upload flow opened
 */
export function trackEvent(name, params = {}) {
  if (!GA_ID) return;
  loadGtag();
  try {
    window.gtag("event", name, {
      ...params,
      // Strip any fields that could contain health/personal info
      user_id: undefined,
      email: undefined,
    });
  } catch {
    // Never let analytics break the UI
  }
}

/**
 * Track a page view for a given path.
 * Call this inside useEffect on public pages.
 */
export function trackPageView(path, title) {
  if (!GA_ID) return;
  loadGtag();
  try {
    window.gtag("event", "page_view", {
      page_path: path,
      page_title: title,
    });
  } catch {}
}
