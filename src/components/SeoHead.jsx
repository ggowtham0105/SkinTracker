/**
 * SeoHead — injects dynamic SEO meta tags into document.head.
 * Uses document.title and meta tag manipulation directly
 * (no react-helmet needed for this lightweight setup).
 */

import { useEffect } from "react";

const SITE_NAME = "SkinTrack";
const DEFAULT_IMAGE = "/og-image.png";
const SITE_URL = "https://skintrack.app"; // Update when you have a real domain

export default function SeoHead({
  title,
  description,
  canonicalPath = "",
  ogImage = DEFAULT_IMAGE,
  ogType = "website",
}) {
  const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — Track Your Skin Progress`;
  const canonicalUrl = `${SITE_URL}${canonicalPath}`;

  useEffect(() => {
    // Page title
    document.title = fullTitle;

    // Helper to set or create meta tag
    function setMeta(name, content, isProperty = false) {
      const attr = isProperty ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    }

    // Helper for link tags
    function setLink(rel, href) {
      let el = document.querySelector(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement("link");
        el.setAttribute("rel", rel);
        document.head.appendChild(el);
      }
      el.setAttribute("href", href);
    }

    // Standard meta
    if (description) setMeta("description", description);

    // Canonical
    setLink("canonical", canonicalUrl);

    // Open Graph
    setMeta("og:type", ogType, true);
    setMeta("og:title", fullTitle, true);
    if (description) setMeta("og:description", description, true);
    setMeta("og:url", canonicalUrl, true);
    setMeta("og:site_name", SITE_NAME, true);
    setMeta("og:image", ogImage, true);

    // Twitter Card
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", fullTitle);
    if (description) setMeta("twitter:description", description);
    setMeta("twitter:image", ogImage);

    // Restore on unmount
    return () => {
      document.title = `${SITE_NAME} — Skin Monitoring`;
    };
  }, [fullTitle, description, canonicalUrl, ogImage, ogType]);

  return null;
}
