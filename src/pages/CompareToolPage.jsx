/**
 * CompareToolPage — public free photo comparison tool.
 * Images are processed entirely client-side using URL.createObjectURL().
 * No photos are sent to the server. No permanent storage.
 */

import React, { useState, useRef, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import PublicLayout from "../components/PublicLayout.jsx";
import SeoHead from "../components/SeoHead.jsx";
import { trackEvent, trackPageView } from "../analytics.js";

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
  accentSoft: "#F3E6E7",
  danger: "#B4544B",
};

function UploadZone({ label, imageUrl, onFile, id }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) onFile(file);
  }, [onFile]);

  return (
    <div style={{ flex: 1 }}>
      <label
        htmlFor={id}
        style={{
          color: T.inkFaint,
          fontSize: 11,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          display: "block",
          marginBottom: 8,
        }}
      >
        {label}
      </label>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        style={{
          height: 220,
          border: `2px dashed ${dragging ? T.primary : (imageUrl ? T.border : "#C5C9C0")}`,
          borderRadius: 16,
          background: dragging ? T.primarySoft : (imageUrl ? "#000" : T.surfaceAlt),
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          position: "relative",
          transition: "border-color 0.2s, background 0.2s",
        }}
        role="button"
        tabIndex={0}
        aria-label={`Upload ${label}`}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={label}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div style={{ textAlign: "center", padding: 16 }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>📷</div>
            <div style={{ color: T.inkSoft, fontWeight: 600, fontSize: 14 }}>
              {dragging ? "Drop here!" : "Click or drag photo here"}
            </div>
            <div style={{ color: T.inkFaint, fontSize: 12, marginTop: 4 }}>
              JPG, PNG, WebP · Up to 20MB
            </div>
          </div>
        )}
        {imageUrl && (
          <button
            onClick={(e) => { e.stopPropagation(); onFile(null); }}
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              background: "rgba(0,0,0,0.6)",
              color: "#fff",
              border: "none",
              borderRadius: "50%",
              width: 28,
              height: 28,
              cursor: "pointer",
              fontSize: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-label="Remove photo"
          >
            ×
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) onFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}

export default function CompareToolPage() {
  const [photoA, setPhotoA] = useState(null); // { url, name }
  const [photoB, setPhotoB] = useState(null);
  const [slider, setSlider] = useState(50);
  const [comparisonStarted, setComparisonStarted] = useState(false);

  useEffect(() => {
    trackPageView("/skin-photo-comparison", "Free Skin Photo Comparison Tool — SkinTrack");
    // Cleanup object URLs on unmount
    return () => {
      if (photoA?.url) URL.revokeObjectURL(photoA.url);
      if (photoB?.url) URL.revokeObjectURL(photoB.url);
    };
  }, []);

  function handleFile(slot, file) {
    const prev = slot === "A" ? photoA : photoB;
    if (prev?.url) URL.revokeObjectURL(prev.url);

    if (!file) {
      if (slot === "A") setPhotoA(null);
      else setPhotoB(null);
      return;
    }

    const url = URL.createObjectURL(file);
    if (slot === "A") setPhotoA({ url, name: file.name });
    else setPhotoB({ url, name: file.name });
  }

  const bothReady = photoA && photoB;

  useEffect(() => {
    if (bothReady && !comparisonStarted) {
      setComparisonStarted(true);
      trackEvent("comparison_started", { source: "public_tool" });
    }
  }, [bothReady]);

  function handleSliderChange(e) {
    setSlider(Number(e.target.value));
    trackEvent("comparison_completed", { source: "public_tool" });
  }

  return (
    <PublicLayout>
      <SeoHead
        title="Free Skin Photo Comparison Tool"
        description="Compare two skin photos side-by-side with an interactive slider. Upload your before and after photos — processed entirely in your browser. No account required."
        canonicalPath="/skin-photo-comparison"
      />

      <div style={{ maxWidth: 820, margin: "0 auto", padding: "48px 24px 80px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h1
            style={{
              color: T.ink,
              fontSize: "clamp(26px, 4vw, 40px)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              margin: "0 0 14px",
            }}
          >
            Free Skin Photo Comparison Tool
          </h1>
          <p style={{ color: T.inkSoft, fontSize: 16, lineHeight: 1.6, maxWidth: 520, margin: "0 auto 16px" }}>
            Upload two skin photos and compare them side-by-side with a slider. 
            See exactly how your skin has changed over time.
          </p>

          {/* Privacy notice */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: T.primarySoft,
              border: `1px solid ${T.primary}`,
              borderRadius: 100,
              padding: "6px 16px",
            }}
          >
            <span style={{ fontSize: 13 }}>🔒</span>
            <span style={{ color: T.primaryDark, fontWeight: 600, fontSize: 12 }}>
              Photos never leave your device — processed entirely in your browser
            </span>
          </div>
        </div>

        {/* Upload zone */}
        <div
          style={{
            background: T.surface,
            border: `1px solid ${T.border}`,
            borderRadius: 24,
            padding: "28px 24px",
            marginBottom: 24,
          }}
        >
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            <UploadZone
              id="photo-a"
              label="Photo A (Before / Older)"
              imageUrl={photoA?.url}
              onFile={(f) => handleFile("A", f)}
            />
            <UploadZone
              id="photo-b"
              label="Photo B (After / Newer)"
              imageUrl={photoB?.url}
              onFile={(f) => handleFile("B", f)}
            />
          </div>
        </div>

        {/* Comparison viewer */}
        {bothReady && (
          <div
            style={{
              background: T.surface,
              border: `1px solid ${T.border}`,
              borderRadius: 24,
              padding: "24px",
              marginBottom: 24,
            }}
          >
            <h2 style={{ color: T.ink, fontWeight: 700, fontSize: 16, margin: "0 0 16px" }}>
              Drag the slider to compare
            </h2>

            {/* Comparison slider */}
            <div
              style={{
                position: "relative",
                height: 360,
                borderRadius: 16,
                overflow: "hidden",
                border: `1px solid ${T.border}`,
                background: "#000",
                marginBottom: 14,
              }}
            >
              {/* Photo A (base layer) */}
              <img
                src={photoA.url}
                alt="Before photo"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />

              {/* Photo B (revealed layer) */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  clipPath: `inset(0 0 0 ${slider}%)`,
                }}
              >
                <img
                  src={photoB.url}
                  alt="After photo"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </div>

              {/* Divider line */}
              <div
                style={{
                  position: "absolute",
                  left: `${slider}%`,
                  top: 0,
                  bottom: 0,
                  width: 3,
                  background: "#FFFFFF",
                  boxShadow: "0 0 8px rgba(0,0,0,0.4)",
                  transform: "translateX(-50%)",
                }}
              />

              {/* Labels */}
              <span
                style={{
                  position: "absolute",
                  bottom: 12,
                  left: 12,
                  background: "rgba(0,0,0,0.6)",
                  color: "#fff",
                  padding: "4px 10px",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                Photo A (Before)
              </span>
              <span
                style={{
                  position: "absolute",
                  bottom: 12,
                  right: 12,
                  background: "rgba(0,0,0,0.6)",
                  color: "#fff",
                  padding: "4px 10px",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                Photo B (After)
              </span>
            </div>

            <input
              type="range"
              min={0}
              max={100}
              value={slider}
              onChange={handleSliderChange}
              style={{ width: "100%" }}
              aria-label="Comparison slider — drag to reveal Photo B"
            />
          </div>
        )}

        {/* CTA to save */}
        <div
          style={{
            background: `linear-gradient(135deg, ${T.primarySoft} 0%, #f3e6e7 100%)`,
            border: `1px solid ${T.border}`,
            borderRadius: 20,
            padding: "28px 24px",
            textAlign: "center",
          }}
        >
          <h2 style={{ color: T.ink, fontWeight: 700, fontSize: 18, margin: "0 0 8px" }}>
            Save this comparison with SkinTrack
          </h2>
          <p style={{ color: T.inkSoft, fontSize: 14, lineHeight: 1.6, margin: "0 0 20px", maxWidth: 420, marginLeft: "auto", marginRight: "auto" }}>
            Create a free account to save your photos, build a timeline, and compare any two dates — permanently and privately.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              to="/?view=signup"
              style={{
                background: T.primary,
                color: "#FFFFFF",
                fontWeight: 700,
                fontSize: 15,
                padding: "12px 28px",
                borderRadius: 12,
                display: "inline-block",
              }}
              onClick={() => trackEvent("signup_clicked", { source: "compare_tool_cta" })}
            >
              Create Free Account
            </Link>
            <Link
              to="/?view=login"
              style={{
                background: T.surface,
                color: T.primaryDark,
                fontWeight: 600,
                fontSize: 15,
                padding: "12px 28px",
                borderRadius: 12,
                border: `1px solid ${T.border}`,
                display: "inline-block",
              }}
            >
              Log In
            </Link>
          </div>
        </div>

        {/* Tips */}
        <div style={{ marginTop: 40 }}>
          <h2 style={{ color: T.ink, fontWeight: 700, fontSize: 18, marginBottom: 20 }}>
            Tips for a meaningful skin photo comparison
          </h2>
          <div style={{ display: "grid", gap: 14 }}>
            {[
              { icon: "💡", tip: "Use the same lighting in both photos. Natural window light works best and is easy to reproduce." },
              { icon: "📐", tip: "Keep the same camera angle and distance. Small differences can make comparisons misleading." },
              { icon: "📅", tip: "Compare photos at least 4–8 weeks apart. Short-term changes can be invisible to the naked eye." },
              { icon: "🚿", tip: "Take photos at the same time of day, ideally after your morning routine." },
            ].map(({ icon, tip }) => (
              <div
                key={tip}
                style={{
                  display: "flex",
                  gap: 14,
                  background: T.surface,
                  border: `1px solid ${T.border}`,
                  borderRadius: 14,
                  padding: "14px 18px",
                  alignItems: "flex-start",
                }}
              >
                <span style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>{icon}</span>
                <p style={{ color: T.inkSoft, fontSize: 14, lineHeight: 1.6, margin: 0 }}>{tip}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 24, textAlign: "center" }}>
            <Link
              to="/how-to-take-skin-progress-photos"
              style={{ color: T.primaryDark, fontWeight: 600, fontSize: 14, textDecoration: "underline" }}
            >
              Read our complete photo guide →
            </Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
