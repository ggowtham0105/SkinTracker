/**
 * AdSlot — reusable Google AdSense placeholder.
 *
 * Usage:
 *   <AdSlot slot="1234567890" format="auto" />
 *
 * - Renders nothing visible when VITE_ADSENSE_CLIENT_ID is not set.
 * - Renders a real <ins class="adsbygoogle"> when the env var is present.
 * - NEVER placed inside private dashboard, upload forms, or login pages.
 * - User skin photos and health data are never used for ad targeting.
 */

import React, { useEffect, useRef } from "react";

const ADSENSE_CLIENT = import.meta.env.VITE_ADSENSE_CLIENT_ID;

let _scriptInjected = false;

function injectAdSenseScript() {
  if (_scriptInjected || !ADSENSE_CLIENT) return;
  _scriptInjected = true;
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
  script.crossOrigin = "anonymous";
  document.head.appendChild(script);
}

export default function AdSlot({
  slot,
  format = "auto",
  responsive = true,
  style = {},
}) {
  const insRef = useRef(null);

  useEffect(() => {
    if (!ADSENSE_CLIENT) return;
    injectAdSenseScript();

    // Push ad after script is ready
    const timer = setTimeout(() => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {}
    }, 300);

    return () => clearTimeout(timer);
  }, [slot]);

  if (!ADSENSE_CLIENT) {
    // In development/staging: render an invisible placeholder
    // (helps identify placement locations without fake ads)
    return (
      <div
        aria-hidden="true"
        data-ad-slot={slot}
        style={{
          display: "none",
          height: 0,
          overflow: "hidden",
        }}
      />
    );
  }

  return (
    <div
      style={{
        display: "block",
        textAlign: "center",
        marginTop: 24,
        marginBottom: 24,
        ...style,
      }}
      aria-label="Advertisement"
    >
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  );
}
