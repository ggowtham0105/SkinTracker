import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import api, { getToken, setToken, clearToken } from "./api.js";
import { LoginPage, SignupPage, ForgotPasswordPage, ResetPasswordPage } from "./AuthPages.jsx";
import {
  Home,
  Camera,
  Calendar,
  RefreshCw,
  User,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  Flame,
  Image as ImageIcon,
  Check,
  Upload as UploadIcon,
  Info,
  Trash2,
  Download,
  Bell,
  Clock,
  Shield,
  CheckCircle,
  KeyRound,
  Mail,
  Send,
  Layers,
  Eye,
  EyeOff,
  Sliders,
} from "lucide-react";

/* ---------------------------------------------------------
   Design tokens (kept off Tailwind's arbitrary-value syntax
   since this environment has no JIT compiler)
--------------------------------------------------------- */
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

const FONT_IMPORT =
  "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');";

/* ---------------------------------------------------------
   Mock data
--------------------------------------------------------- */
const AREAS = [
  "Forehead",
  "Left cheek",
  "Right cheek",
  "Chin",
  "Jawline",
  "Neck",
  "Other",
];

// Deterministic soft placeholder tones per photo (fallback when no image URL)
const TONES = [
  ["#E9DED2", "#D9C6B4"],
  ["#E3E6DA", "#CBD3BC"],
  ["#EADCDC", "#D8BFC0"],
  ["#DEE4E1", "#C3D0CB"],
  ["#EBE1CF", "#D9C7A5"],
  ["#E1DFE8", "#C7C3D6"],
];

/* ---------------------------------------------------------
   Helpers
--------------------------------------------------------- */
function fmtShort(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
}
function fmtLong(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}
function weeksBetween(oldStr, newStr) {
  const a = new Date(oldStr + "T00:00:00");
  const b = new Date(newStr + "T00:00:00");
  const days = Math.round((b - a) / 86400000);
  return Math.max(1, Math.round(days / 7));
}
function last30DaysGrid(photos) {
  const today = new Date("2026-08-27T00:00:00");
  const set = new Set(photos.map((p) => p.date));
  const days = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    days.push({ iso, hasPhoto: set.has(iso) });
  }
  return days;
}
function currentStreak(days) {
  let streak = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].hasPhoto) streak++;
    else break;
  }
  return streak;
}

/* ---------------------------------------------------------
   Small shared UI atoms
--------------------------------------------------------- */
function Pill({ children, tone = "primary", small }) {
  const bg = tone === "primary" ? T.primarySoft : T.accentSoft;
  const fg = tone === "primary" ? T.primaryDark : "#7A4A4E";
  return (
    <span
      style={{
        background: bg,
        color: fg,
        fontFamily: "'IBM Plex Mono', monospace",
        fontWeight: 600,
        letterSpacing: "0.01em",
      }}
      className={`inline-block rounded-full ${
        small ? "text-xs px-2 py-0.5" : "text-xs px-3 py-1"
      }`}
    >
      {children}
    </span>
  );
}

function PhotoThumb({ tone, size = "normal", imageUrl }) {
  const h = size === "large" ? 220 : size === "small" ? 96 : 150;
  const fallbackTone = tone || TONES[0];

  if (imageUrl) {
    return (
      <div
        style={{
          height: h,
          borderRadius: 14,
          border: `1px solid ${T.border}`,
          overflow: "hidden",
        }}
        className="w-full"
      >
        <img
          src={imageUrl}
          alt="Skin photo"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        height: h,
        borderRadius: 14,
        background: `linear-gradient(155deg, ${fallbackTone[0]} 0%, ${fallbackTone[1]} 100%)`,
        border: `1px solid ${T.border}`,
        position: "relative",
        overflow: "hidden",
      }}
      className="w-full flex items-center justify-center"
      aria-hidden="true"
    >
      <ImageIcon size={size === "small" ? 18 : 26} color="#FFFFFF" opacity={0.55} />
    </div>
  );
}

function BrandMark({ size = 34 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 34 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0"
    >
      <defs>
        <linearGradient id="bmGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3F6B57" />
          <stop offset="100%" stopColor="#244434" />
        </linearGradient>
        <linearGradient id="bmLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E4EDE6" />
        </linearGradient>
        <linearGradient id="bmAccent" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F2A6AC" />
          <stop offset="100%" stopColor="#B97D82" />
        </linearGradient>
      </defs>

      {/* Squircle Container */}
      <rect x="1" y="1" width="32" height="32" rx="9.5" fill="url(#bmGrad)" stroke="#4E7E68" strokeWidth="1" />

      {/* Botanical Leaf / Droplet Contour */}
      <path
        d="M17 7 C23 11 25.5 18 21.5 24 C19 27.5 13 27.5 9.5 24 C6.5 20.5 8.5 14 17 7 Z"
        fill="url(#bmLeaf)"
        opacity="0.95"
      />
      {/* Inner vein curve */}
      <path
        d="M17 9.5 C16 14.5 13.5 21 11.5 25"
        stroke="#3F6B57"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.5"
      />
      {/* Healthy skin bloom dot */}
      <circle cx="20.5" cy="20.5" r="3.2" fill="url(#bmAccent)" />
      <circle cx="21.3" cy="19.7" r="0.9" fill="#FFFFFF" opacity="0.9" />
    </svg>
  );
}

/* ---------------------------------------------------------
   Header
--------------------------------------------------------- */
function Header({ user, onProfile }) {
  return (
    <div className="flex items-center justify-between px-5 pt-6 pb-4">
      <div className="flex items-center gap-3">
        <BrandMark />
        <div>
          <div
            style={{ color: T.ink, fontWeight: 700, fontSize: 17, letterSpacing: "-0.01em" }}
          >
            SkinTrack
          </div>
        </div>
      </div>
      <button
        onClick={onProfile}
        aria-label="Open profile"
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: T.surfaceAlt,
          border: `1.5px solid ${T.border}`,
          overflow: "hidden",
        }}
        className="flex items-center justify-center relative active:scale-95 transition-transform shadow-xs"
      >
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt={user.name || "Profile"}
            className="w-full h-full object-cover"
          />
        ) : (
          <User size={18} color={T.inkSoft} />
        )}
      </button>
    </div>
  );
}

/* ---------------------------------------------------------
   Dashboard view
--------------------------------------------------------- */
function Dashboard({ photos, onOpenUpload, onGoTimeline, onGoCompare, savedBanner }) {
  const stats = useMemo(() => {
    const total = photos.length;
    const sorted = [...photos].sort((a, b) => new Date(a.date) - new Date(b.date));
    const weeks = sorted.length > 1 ? weeksBetween(sorted[0].date, sorted[sorted.length - 1].date) : 0;
    const last = sorted[sorted.length - 1];
    return { total, weeks, lastDate: last ? last.date : null };
  }, [photos]);

  const grid = useMemo(() => last30DaysGrid(photos), [photos]);
  const streak = useMemo(() => currentStreak(grid), [grid]);

  return (
    <div className="px-5 pb-6">
      <div className="mb-5">
        <h1 style={{ color: T.ink, fontSize: 22, fontWeight: 700, letterSpacing: "-0.01em", margin: 0 }}>
          Welcome back 👋
        </h1>
        <p style={{ color: T.inkSoft, fontSize: 14, marginTop: 4 }}>
          Track your skin progress over time.
        </p>
      </div>

      {savedBanner && (
        <div
          style={{
            background: T.primarySoft,
            border: `1px solid ${T.primary}`,
            color: T.primaryDark,
          }}
          className="rounded-2xl px-4 py-3 mb-4 flex items-center gap-2 text-sm font-medium"
        >
          <Check size={16} />
          Photo uploaded
        </div>
      )}

      {/* Upload hero card */}
      <div
        style={{
          background: T.surface,
          border: `1px solid ${T.border}`,
          boxShadow: "0 1px 2px rgba(38,40,31,0.04)",
        }}
        className="rounded-3xl p-5 mb-4"
      >
        <div className="flex items-start gap-4">
          <div
            style={{ background: T.primarySoft, borderRadius: 16, width: 56, height: 56 }}
            className="flex items-center justify-center flex-shrink-0"
          >
            <Camera size={26} color={T.primaryDark} />
          </div>
          <div className="flex-1 min-w-0">
            <div style={{ color: T.ink, fontWeight: 700, fontSize: 15 }}>
              Track today's progress
            </div>
            <div style={{ color: T.inkSoft, fontSize: 13, marginTop: 2 }}>
              Upload a new skin photo
            </div>
            <div style={{ color: T.inkFaint, fontSize: 12, marginTop: 6, lineHeight: 1.5 }}>
              Keep your photos consistent for better comparison.
            </div>
          </div>
        </div>
        <button
          onClick={onOpenUpload}
          style={{ background: T.primary, color: "#FFFFFF" }}
          className="w-full mt-4 rounded-2xl py-3.5 font-semibold text-sm flex items-center justify-center gap-2 active:opacity-90"
        >
          <Plus size={18} />
          Upload photo
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <StatCard label="Photos" value={stats.total} />
        <StatCard label="Tracking" value={`${stats.weeks}w`} sub="weeks" />
        <StatCard label="Last upload" value={stats.lastDate ? fmtShort(stats.lastDate) : "—"} small />
      </div>

      {/* Consistency ribbon (signature element) */}
      <div
        style={{ background: T.surface, border: `1px solid ${T.border}` }}
        className="rounded-2xl p-4 mb-6"
      >
        <div className="flex items-center justify-between mb-3">
          <span style={{ color: T.ink, fontWeight: 600, fontSize: 13 }}>Last 30 days</span>
          {streak > 0 && (
            <span
              style={{ color: T.accent }}
              className="flex items-center gap-1 text-xs font-semibold"
            >
              <Flame size={13} />
              {streak}-day streak
            </span>
          )}
        </div>
        <div className="flex gap-1">
          {grid.map((d) => (
            <div
              key={d.iso}
              title={d.iso}
              style={{
                height: 18,
                flex: 1,
                borderRadius: 4,
                background: d.hasPhoto ? T.primary : T.surfaceAlt,
                border: `1px solid ${d.hasPhoto ? T.primary : T.border}`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Recent Progress */}
      <div className="flex items-center justify-between mb-3">
        <h2 style={{ color: T.ink, fontWeight: 700, fontSize: 15 }}>Recent progress</h2>
        <button
          onClick={onGoTimeline}
          style={{ color: T.primaryDark, fontSize: 13, fontWeight: 600 }}
        >
          See all
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {photos.slice(0, 4).map((p) => (
          <div
            key={p.id}
            onClick={() => onSelectPhoto && onSelectPhoto(p)}
            style={{ background: T.surface, border: `1px solid ${T.border}` }}
            className="rounded-2xl p-2.5 cursor-pointer relative group transition-transform hover:-translate-y-0.5 shadow-sm"
          >
            <PhotoThumb tone={p.tone} imageUrl={p.imageUrl} />
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRequestDeletePhoto && onRequestDeletePhoto(p);
              }}
              title="Delete photo"
              style={{
                position: "absolute",
                top: 14,
                right: 14,
                background: "rgba(255, 255, 255, 0.9)",
                color: T.danger,
                border: `1px solid ${T.border}`,
              }}
              className="p-1.5 rounded-full shadow-md transition-opacity hover:bg-red-50"
            >
              <Trash2 size={13} />
            </button>
            <div
              style={{ fontFamily: "'IBM Plex Mono', monospace", color: T.ink, fontSize: 12, fontWeight: 600 }}
              className="mt-2"
            >
              {fmtLong(p.date)}
            </div>
            <div style={{ color: T.inkSoft, fontSize: 12, marginTop: 2 }}>{p.area}</div>
            {p.note && (
              <div style={{ color: T.inkFaint, fontSize: 12, fontStyle: "italic", marginTop: 3 }} className="truncate">
                "{p.note}"
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Compare card */}
      <div
        style={{ background: T.surface, border: `1px solid ${T.border}` }}
        className="rounded-3xl p-5 mb-6"
      >
        <div className="flex items-center gap-3 mb-1">
          <div
            style={{ background: T.accentSoft, borderRadius: 12, width: 42, height: 42 }}
            className="flex items-center justify-center flex-shrink-0"
          >
            <RefreshCw size={19} color={T.accent} />
          </div>
          <div style={{ color: T.ink, fontWeight: 700, fontSize: 15 }}>Compare progress</div>
        </div>
        <p style={{ color: T.inkSoft, fontSize: 13, marginTop: 6 }}>
          Compare two photos to see your progress.
        </p>
        <button
          onClick={onGoCompare}
          style={{ border: `1px solid ${T.primary}`, color: T.primaryDark }}
          className="w-full mt-4 rounded-2xl py-3 font-semibold text-sm"
        >
          Compare photos
        </button>
      </div>

      {/* Timeline preview */}
      <div style={{ background: T.surface, border: `1px solid ${T.border}` }} className="rounded-3xl p-5">
        <div style={{ color: T.ink, fontWeight: 700, fontSize: 15 }} className="mb-3">
          Your timeline
        </div>
        <div>
          {photos.slice(0, 4).map((p, i) => (
            <div key={p.id} className="flex items-center gap-3 py-2">
              <div
                style={{ background: T.primarySoft }}
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
              >
                <Camera size={13} color={T.primaryDark} />
              </div>
              <span
                style={{ fontFamily: "'IBM Plex Mono', monospace", color: T.ink, fontSize: 13, fontWeight: 500 }}
              >
                {fmtShort(p.date)}
              </span>
              <span style={{ color: T.inkFaint, fontSize: 12 }}>{p.area}</span>
            </div>
          ))}
        </div>
        <button
          onClick={onGoTimeline}
          style={{ color: T.primaryDark }}
          className="w-full mt-2 text-sm font-semibold py-2"
        >
          View full timeline
        </button>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, small }) {
  return (
    <div
      style={{ background: T.surface, border: `1px solid ${T.border}` }}
      className="rounded-2xl p-3.5 flex flex-col items-start"
    >
      <span style={{ color: T.inkFaint, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.03em" }}>
        {label}
      </span>
      <span
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          color: T.ink,
          fontWeight: 600,
          fontSize: small ? 16 : 20,
          marginTop: 4,
        }}
      >
        {value}
      </span>
    </div>
  );
}

/* ---------------------------------------------------------
   Timeline view
--------------------------------------------------------- */
function Timeline({ photos, onSelectPhoto, onRequestDeletePhoto }) {
  if (!photos || photos.length === 0) {
    return (
      <div className="px-5 pb-6 text-center pt-8">
        <h1 style={{ color: T.ink, fontSize: 20, fontWeight: 700 }} className="mb-1">
          Your timeline
        </h1>
        <p style={{ color: T.inkSoft, fontSize: 13 }} className="mb-8">
          No tracked entries yet.
        </p>
      </div>
    );
  }

  return (
    <div className="px-5 pb-6">
      <h1 style={{ color: T.ink, fontSize: 20, fontWeight: 700 }} className="mb-1">
        Your timeline
      </h1>
      <p style={{ color: T.inkSoft, fontSize: 13 }} className="mb-5">
        Every tracked entry, most recent first ({photos.length} total).
      </p>
      <div style={{ position: "relative" }}>
        <div
          style={{ position: "absolute", left: 17, top: 8, bottom: 8, width: 2, background: T.border }}
        />
        {photos.map((p) => (
          <div key={p.id} className="relative flex gap-4 pb-5">
            <div
              style={{ background: T.surface, border: `2px solid ${T.primary}` }}
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 z-10"
            >
              <Camera size={15} color={T.primaryDark} />
            </div>
            <div
              onClick={() => onSelectPhoto && onSelectPhoto(p)}
              style={{ background: T.surface, border: `1px solid ${T.border}` }}
              className="flex-1 rounded-2xl p-3 flex gap-3 cursor-pointer relative group transition-transform hover:-translate-y-0.5 shadow-sm"
            >
              <div style={{ width: 64, flexShrink: 0 }}>
                <PhotoThumb tone={p.tone} size="small" imageUrl={p.imageUrl} />
              </div>
              <div className="min-w-0 flex-1 pr-6">
                <div
                  style={{ fontFamily: "'IBM Plex Mono', monospace", color: T.ink, fontSize: 13, fontWeight: 600 }}
                >
                  {fmtLong(p.date)}
                </div>
                <div style={{ color: T.inkSoft, fontSize: 12, marginTop: 2 }}>{p.area}</div>
                {p.note && (
                  <div style={{ color: T.inkFaint, fontSize: 12, fontStyle: "italic", marginTop: 3 }}>
                    "{p.note}"
                  </div>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRequestDeletePhoto && onRequestDeletePhoto(p);
                }}
                title="Delete photo"
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  background: "transparent",
                  color: T.inkFaint,
                }}
                className="p-1.5 rounded-lg hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   Compare view
--------------------------------------------------------- */
function Compare({ photos }) {
  const sorted = useMemo(() => [...photos].sort((a, b) => new Date(a.date) - new Date(b.date)), [photos]);
  const [olderId, setOlderId] = useState(sorted[0]?.id);
  const [newerId, setNewerId] = useState(sorted[sorted.length - 1]?.id);
  const [slider, setSlider] = useState(50);

  const older = photos.find((p) => p.id === olderId);
  const newer = photos.find((p) => p.id === newerId);

  return (
    <div className="px-5 pb-6">
      <h1 style={{ color: T.ink, fontSize: 20, fontWeight: 700 }} className="mb-1">
        Compare progress
      </h1>
      <p style={{ color: T.inkSoft, fontSize: 13 }} className="mb-5">
        Select two photos and drag the slider.
      </p>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <div>
          <label style={{ color: T.inkFaint, fontSize: 11, fontWeight: 600, textTransform: "uppercase" }}>
            Previous photo
          </label>
          <select
            value={olderId}
            onChange={(e) => setOlderId(Number(e.target.value))}
            style={{ border: `1px solid ${T.border}`, background: T.surface, color: T.ink }}
            className="w-full mt-1 rounded-xl px-3 py-2.5 text-sm"
          >
            {sorted.map((p) => (
              <option key={p.id} value={p.id}>
                {fmtLong(p.date)} — {p.area}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label style={{ color: T.inkFaint, fontSize: 11, fontWeight: 600, textTransform: "uppercase" }}>
            Newer photo
          </label>
          <select
            value={newerId}
            onChange={(e) => setNewerId(Number(e.target.value))}
            style={{ border: `1px solid ${T.border}`, background: T.surface, color: T.ink }}
            className="w-full mt-1 rounded-xl px-3 py-2.5 text-sm"
          >
            {sorted.map((p) => (
              <option key={p.id} value={p.id}>
                {fmtLong(p.date)} — {p.area}
              </option>
            ))}
          </select>
        </div>
      </div>

      {older && newer && (
        <>
          <div
            style={{
              position: "relative",
              height: 300,
              borderRadius: 20,
              overflow: "hidden",
              border: `1px solid ${T.border}`,
              background: "#000000",
            }}
            className="mb-3"
          >
            {/* Older photo (base layer) */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: older.imageUrl
                  ? "#000000"
                  : `linear-gradient(155deg, ${older.tone?.[0] || "#E9DED2"} 0%, ${older.tone?.[1] || "#D9C6B4"} 100%)`,
              }}
              className="flex items-center justify-center overflow-hidden"
            >
              {older.imageUrl ? (
                <img
                  src={older.imageUrl}
                  alt="Previous"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span style={{ color: "#FFFFFF", opacity: 0.7, fontSize: 12, fontFamily: "'IBM Plex Mono', monospace" }}>
                  {fmtShort(older.date)}
                </span>
              )}
              <span
                style={{
                  position: "absolute",
                  bottom: 12,
                  left: 12,
                  background: "rgba(0,0,0,0.55)",
                  color: "#FFFFFF",
                  padding: "4px 8px",
                  borderRadius: 8,
                  fontSize: 11,
                  fontFamily: "'IBM Plex Mono', monospace",
                }}
              >
                {fmtShort(older.date)}
              </span>
            </div>

            {/* Newer photo (revealed layer with clipPath) */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                clipPath: `inset(0 0 0 ${slider}%)`,
                background: newer.imageUrl
                  ? "#000000"
                  : `linear-gradient(155deg, ${newer.tone?.[0] || "#E3E6DA"} 0%, ${newer.tone?.[1] || "#CBD3BC"} 100%)`,
              }}
              className="flex items-center justify-center overflow-hidden"
            >
              {newer.imageUrl ? (
                <img
                  src={newer.imageUrl}
                  alt="Newer"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span style={{ color: "#FFFFFF", opacity: 0.7, fontSize: 12, fontFamily: "'IBM Plex Mono', monospace" }}>
                  {fmtShort(newer.date)}
                </span>
              )}
              <span
                style={{
                  position: "absolute",
                  bottom: 12,
                  right: 12,
                  background: "rgba(0,0,0,0.55)",
                  color: "#FFFFFF",
                  padding: "4px 8px",
                  borderRadius: 8,
                  fontSize: 11,
                  fontFamily: "'IBM Plex Mono', monospace",
                }}
              >
                {fmtShort(newer.date)}
              </span>
            </div>

            {/* Divider bar */}
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
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={slider}
            onChange={(e) => setSlider(Number(e.target.value))}
            className="w-full mb-6"
            aria-label="Reveal newer photo"
          />

          <div className="grid grid-cols-2 gap-3">
            <NoteCard label="Previous photo" p={older} />
            <NoteCard label="Newer photo" p={newer} />
          </div>
        </>
      )}
    </div>
  );
}

function NoteCard({ label, p }) {
  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}` }} className="rounded-2xl p-3">
      <div style={{ color: T.inkFaint, fontSize: 11, fontWeight: 600, textTransform: "uppercase" }}>
        {label}
      </div>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", color: T.ink, fontSize: 13, fontWeight: 600 }} className="mt-1">
        {fmtLong(p.date)}
      </div>
      <div style={{ color: T.inkSoft, fontSize: 12, marginTop: 2 }}>{p.area}</div>
      {p.note && (
        <div style={{ color: T.inkFaint, fontSize: 12, fontStyle: "italic", marginTop: 3 }}>
          Your notes: "{p.note}"
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------
   Photo Detail & Delete Confirmation Modals
--------------------------------------------------------- */
function PhotoDetailModal({ photo, onClose, onRequestDelete }) {
  if (!photo) return null;

  return (
    <div
      style={{ background: "rgba(38,40,31,0.55)" }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xs"
    >
      <div
        style={{ background: T.surface, maxHeight: "90vh" }}
        className="w-full max-w-sm rounded-3xl overflow-y-auto shadow-2xl p-5"
      >
        <div className="flex items-center justify-between pb-3 mb-2 border-b" style={{ borderColor: T.border }}>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", color: T.ink, fontWeight: 700, fontSize: 14 }}>
            {fmtLong(photo.date)}
          </span>
          <button onClick={onClose} aria-label="Close" className="p-1 rounded-lg hover:bg-black/5">
            <X size={18} color={T.inkSoft} />
          </button>
        </div>

        <div className="mb-4 rounded-2xl overflow-hidden" style={{ border: `1px solid ${T.border}` }}>
          {photo.imageUrl ? (
            <img
              src={photo.imageUrl}
              alt="Skin detail"
              className="w-full h-64 object-cover"
            />
          ) : (
            <PhotoThumb tone={photo.tone} size="large" imageUrl={null} />
          )}
        </div>

        <div className="mb-5">
          <div style={{ color: T.primaryDark, fontWeight: 700, fontSize: 15 }}>
            {photo.area}
          </div>
          {photo.note ? (
            <div style={{ color: T.inkSoft, fontSize: 13, marginTop: 4, fontStyle: "italic", background: T.surfaceAlt, padding: "8px 12px", borderRadius: 12 }}>
              "{photo.note}"
            </div>
          ) : (
            <div style={{ color: T.inkFaint, fontSize: 12, marginTop: 2 }}>
              No notes logged for this entry.
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onRequestDelete(photo)}
            style={{ background: T.accentSoft, color: T.danger, border: `1px solid ${T.accent}` }}
            className="flex-1 py-3 rounded-2xl font-semibold text-xs flex items-center justify-center gap-1.5 active:opacity-90"
          >
            <Trash2 size={15} />
            Delete photo
          </button>
          <button
            onClick={onClose}
            style={{ background: T.surfaceAlt, color: T.ink, border: `1px solid ${T.border}` }}
            className="flex-1 py-3 rounded-2xl font-semibold text-xs active:opacity-90"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirmModal({ photo, onCancel, onConfirm }) {
  if (!photo) return null;

  return (
    <div
      style={{ background: "rgba(38,40,31,0.65)" }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        style={{ background: T.surface }}
        className="w-full max-w-xs rounded-3xl p-6 shadow-2xl text-center"
      >
        <div
          style={{ background: T.accentSoft, color: T.danger, width: 48, height: 48, borderRadius: 16 }}
          className="flex items-center justify-center mx-auto mb-4"
        >
          <Trash2 size={22} />
        </div>
        <h3 style={{ color: T.ink, fontWeight: 700, fontSize: 17 }} className="mb-1.5">
          Delete this photo?
        </h3>
        <p style={{ color: T.inkSoft, fontSize: 13 }} className="mb-6 leading-relaxed">
          This photo from <strong>{fmtShort(photo.date)}</strong> will be permanently removed from your skin history.
        </p>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => onConfirm(photo.id)}
            style={{ background: T.danger, color: "#FFFFFF" }}
            className="w-full py-3 rounded-2xl font-semibold text-sm shadow-md active:opacity-90"
          >
            Delete photo
          </button>
          <button
            onClick={onCancel}
            style={{ background: T.surfaceAlt, color: T.ink }}
            className="w-full py-3 rounded-2xl font-medium text-sm hover:bg-black/5"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   Profile interactive submodals
--------------------------------------------------------- */
function ReminderModal({ isOpen, onClose, onSave }) {
  const [freq, setFreq] = useState(() => localStorage.getItem("skintrack_reminder_freq") || "Daily");
  const [time, setTime] = useState(() => localStorage.getItem("skintrack_reminder_time") || "09:00");

  if (!isOpen) return null;

  const options = ["Daily", "Every 2 days", "Every 3 days", "Weekly", "Disabled"];

  async function handleSave() {
    localStorage.setItem("skintrack_reminder_freq", freq);
    localStorage.setItem("skintrack_reminder_time", time);
    try {
      await api.post("/api/reminders/settings", {
        reminder_frequency: freq,
        reminder_time: time,
      });
    } catch {}
    onSave && onSave(freq, time);
    onClose();
  }

  return (
    <div
      style={{ background: "rgba(38,40,31,0.5)" }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div style={{ background: T.surface }} className="w-full max-w-sm rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock size={18} color={T.primaryDark} />
            <span style={{ color: T.ink, fontWeight: 700, fontSize: 16 }}>Reminder frequency</span>
          </div>
          <button onClick={onClose}><X size={18} color={T.inkSoft} /></button>
        </div>

        <p style={{ color: T.inkSoft, fontSize: 13 }} className="mb-4">
          Set how often you'd like a gentle prompt to capture your skin tracking photo.
        </p>

        <div className="space-y-2 mb-4">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setFreq(opt)}
              style={{
                background: freq === opt ? T.primarySoft : T.surfaceAlt,
                border: `1.5px solid ${freq === opt ? T.primary : T.border}`,
                color: freq === opt ? T.primaryDark : T.ink,
              }}
              className="w-full rounded-xl px-4 py-3 text-left font-medium text-sm flex items-center justify-between transition-colors"
            >
              <span>{opt}</span>
              {freq === opt && <Check size={16} color={T.primaryDark} />}
            </button>
          ))}
        </div>

        {freq !== "Disabled" && (
          <div className="mb-6">
            <label style={{ color: T.inkFaint, fontSize: 11, fontWeight: 600, textTransform: "uppercase" }}>
              Preferred reminder time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              style={{ border: `1px solid ${T.border}`, background: T.surface, color: T.ink }}
              className="w-full mt-1 rounded-xl px-3 py-2.5 text-sm"
            />
          </div>
        )}

        <button
          onClick={handleSave}
          style={{ background: T.primary, color: "#FFFFFF" }}
          className="w-full py-3.5 rounded-2xl font-semibold text-sm shadow-md active:opacity-90"
        >
          Save preferences
        </button>
      </div>
    </div>
  );
}

function NotificationModal({ isOpen, onClose, onSave }) {
  const [daily, setDaily] = useState(() => localStorage.getItem("skintrack_notif_daily") !== "false");
  const [streak, setStreak] = useState(() => localStorage.getItem("skintrack_notif_streak") !== "false");
  const [digest, setDigest] = useState(() => localStorage.getItem("skintrack_notif_digest") !== "false");

  if (!isOpen) return null;

  async function handleSave() {
    localStorage.setItem("skintrack_notif_daily", daily ? "true" : "false");
    localStorage.setItem("skintrack_notif_streak", streak ? "true" : "false");
    localStorage.setItem("skintrack_notif_digest", digest ? "true" : "false");
    try {
      await api.post("/api/reminders/settings", {
        email_reminders: daily,
        browser_reminders: streak,
      });
    } catch {}
    onSave && onSave();
    onClose();
  }

  const items = [
    { id: "daily", label: "Daily photo reminders", sub: "Prompt you at your scheduled time", val: daily, set: setDaily },
    { id: "streak", label: "Streak & milestone alerts", sub: "Cheer you on as you track consistently", val: streak, set: setStreak },
    { id: "digest", label: "Weekly progress recap", sub: "Summary of changes and photos taken", val: digest, set: setDigest },
  ];

  return (
    <div
      style={{ background: "rgba(38,40,31,0.5)" }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div style={{ background: T.surface }} className="w-full max-w-sm rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bell size={18} color={T.primaryDark} />
            <span style={{ color: T.ink, fontWeight: 700, fontSize: 16 }}>Notification preferences</span>
          </div>
          <button onClick={onClose}><X size={18} color={T.inkSoft} /></button>
        </div>

        <div className="space-y-3 mb-6">
          {items.map((it) => (
            <div
              key={it.id}
              style={{ background: T.surfaceAlt, border: `1px solid ${T.border}` }}
              className="rounded-2xl p-3.5 flex items-center justify-between gap-3"
            >
              <div>
                <div style={{ color: T.ink, fontWeight: 600, fontSize: 13 }}>{it.label}</div>
                <div style={{ color: T.inkSoft, fontSize: 11 }}>{it.sub}</div>
              </div>
              <button
                type="button"
                onClick={() => it.set(!it.val)}
                style={{
                  width: 44,
                  height: 26,
                  borderRadius: 14,
                  background: it.val ? T.primary : "#D1D5DB",
                  position: "relative",
                  transition: "background 0.2s",
                }}
                className="flex-shrink-0"
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "#FFFFFF",
                    position: "absolute",
                    top: 3,
                    left: it.val ? 21 : 3,
                    transition: "left 0.2s",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                  }}
                />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={handleSave}
          style={{ background: T.primary, color: "#FFFFFF" }}
          className="w-full py-3.5 rounded-2xl font-semibold text-sm shadow-md"
        >
          Save preferences
        </button>
      </div>
    </div>
  );
}

function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      style={{ background: "rgba(38,40,31,0.5)" }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div style={{ background: T.surface }} className="w-full max-w-sm rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Shield size={18} color={T.primaryDark} />
            <span style={{ color: T.ink, fontWeight: 700, fontSize: 16 }}>About SkinTrack</span>
          </div>
          <button onClick={onClose}><X size={18} color={T.inkSoft} /></button>
        </div>

        <div className="space-y-3 mb-5 text-xs text-left" style={{ color: T.inkSoft, lineHeight: 1.6 }}>
          <p>
            SkinTrack helps you monitor skin changes over time with structured photo logs, consistent comparison sliders, and privacy-first local storage.
          </p>
          <p style={{ color: T.inkFaint }}>
            ⚠️ <strong>Medical Disclaimer:</strong> SkinTrack is a personal monitoring and tracking tool. It does not diagnose skin conditions, prescribe treatments, or provide medical advice. Consult a licensed dermatologist for medical concerns.
          </p>
        </div>

        <button
          onClick={onClose}
          style={{ background: T.primary, color: "#FFFFFF" }}
          className="w-full py-3 rounded-2xl font-semibold text-sm"
        >
          Got it
        </button>
      </div>
    </div>
  );
}

function DeleteAccountModal({ isOpen, onClose, onConfirm, userEmail }) {
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await onConfirm();
    } catch (err) {
      alert(err.message || "Failed to delete account");
      setIsDeleting(false);
    }
  }

  return (
    <div
      style={{ background: "rgba(38,40,31,0.65)", backdropFilter: "blur(4px)" }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        style={{ background: T.surface }}
        className="w-full max-w-sm rounded-3xl p-6 shadow-2xl text-center animate-fade-in"
      >
        <div
          style={{
            background: "#FFF5F5",
            color: T.danger,
            width: 52,
            height: 52,
            borderRadius: 18,
            border: "1px solid #FED7D7",
          }}
          className="flex items-center justify-center mx-auto mb-4"
        >
          <Trash2 size={24} />
        </div>

        <h3 style={{ color: T.ink, fontWeight: 800, fontSize: 18 }} className="mb-2">
          Delete your account?
        </h3>

        <p style={{ color: T.inkSoft, fontSize: 13, lineHeight: 1.5 }} className="mb-4">
          This will permanently erase your account (<strong>{userEmail}</strong>), all photos, skin timeline records, and preferences. <strong style={{ color: T.danger }}>This action cannot be undone.</strong>
        </p>

        <div className="mb-5 text-left">
          <label style={{ color: T.inkSoft, fontSize: 12, fontWeight: 500, display: "block", marginBottom: 5 }}>
            Type <span style={{ fontWeight: 700, color: T.danger }}>DELETE</span> to confirm:
          </label>
          <input
            type="text"
            placeholder="DELETE"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            style={{
              border: `1.5px solid ${confirmText === "DELETE" ? T.danger : T.border}`,
              background: T.surfaceAlt,
              color: T.ink,
            }}
            className="w-full rounded-xl px-3 py-2.5 text-sm font-bold text-center tracking-wider"
          />
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={handleDelete}
            disabled={confirmText !== "DELETE" || isDeleting}
            style={{
              background: confirmText === "DELETE" ? T.danger : "#E2E8F0",
              color: confirmText === "DELETE" ? "#FFFFFF" : "#A0AEC0",
              cursor: confirmText === "DELETE" ? "pointer" : "not-allowed",
            }}
            className="w-full py-3.5 rounded-2xl font-semibold text-sm shadow-md transition-all active:scale-98"
          >
            {isDeleting ? "Permanently deleting…" : "Permanently Delete Account"}
          </button>
          <button
            onClick={onClose}
            disabled={isDeleting}
            style={{ background: T.surfaceAlt, color: T.ink }}
            className="w-full py-3 rounded-2xl font-medium text-sm hover:bg-black/5"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function Profile({ user, photos, onLogout, onUpdateUser, onDeleteAccount, onShowToast }) {
  const [modalType, setModalType] = useState(null); // reminder | notif | about | delete_account
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const avatarInputRef = useRef(null);

  const reminderFreq = localStorage.getItem("skintrack_reminder_freq") || "Daily";
  const reminderTime = localStorage.getItem("skintrack_reminder_time") || "09:00";

  async function handleAvatarFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingAvatar(true);
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const data = await api.upload("/api/auth/avatar", formData);
      if (onUpdateUser && data.user) {
        onUpdateUser(data.user);
      }
      onShowToast && onShowToast("Profile picture updated!");
    } catch (err) {
      console.error("Failed to upload avatar:", err);
      alert(err.message || "Failed to update profile picture");
    } finally {
      setIsUploadingAvatar(false);
    }
  }

  function handleExport() {
    const data = {
      app: "SkinTrack",
      exportedAt: new Date().toISOString(),
      user: {
        name: user?.name || "You",
        email: user?.email,
      },
      stats: {
        totalPhotos: photos.length,
      },
      photos: photos.map((p) => ({
        id: p.id,
        date: p.date,
        area: p.area,
        note: p.note,
        filename: p.filename,
        imageUrl: p.imageUrl,
        created_at: p.created_at,
      })),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `skintrack_export_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a);

    onShowToast && onShowToast(`Exported ${photos.length} photo logs to JSON!`);
  }

  const rows = [
    {
      id: "reminder",
      title: "Reminder frequency",
      sub: `${reminderFreq} ${reminderFreq !== "Disabled" ? `at ${reminderTime}` : ""}`,
      icon: Clock,
      onClick: () => setModalType("reminder"),
    },
    {
      id: "notif",
      title: "Notification preferences",
      sub: "Alerts & streak tracking",
      icon: Bell,
      onClick: () => setModalType("notif"),
    },
    {
      id: "export",
      title: "Export your data",
      sub: `Download ${photos.length} records as JSON`,
      icon: Download,
      onClick: handleExport,
    },
    {
      id: "about",
      title: "About SkinTrack",
      sub: "Privacy & details",
      icon: Shield,
      onClick: () => setModalType("about"),
    },
  ];

  return (
    <div className="px-5 pb-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <div
            style={{
              background: T.primarySoft,
              width: 64,
              height: 64,
              borderRadius: "50%",
              overflow: "hidden",
              border: `2px solid ${T.primary}`,
            }}
            className="flex items-center justify-center shadow-sm"
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name || "Profile"}
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={30} color={T.primaryDark} />
            )}
          </div>
          <button
            type="button"
            onClick={() => avatarInputRef.current?.click()}
            disabled={isUploadingAvatar}
            style={{
              position: "absolute",
              bottom: -2,
              right: -2,
              background: T.primary,
              color: "#FFFFFF",
              width: 26,
              height: 26,
              borderRadius: "50%",
              border: "2px solid #FFFFFF",
            }}
            className="flex items-center justify-center shadow-md active:scale-90 transition-transform"
            title="Upload profile picture"
          >
            <Camera size={13} />
          </button>
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarFile}
            className="hidden"
          />
        </div>
        <div>
          <div style={{ color: T.ink, fontWeight: 700, fontSize: 17 }}>
            {user?.name || "You"}
          </div>
          <div style={{ color: T.inkSoft, fontSize: 12 }}>
            {user?.email || "Personal tracking account"}
          </div>
          <button
            type="button"
            onClick={() => avatarInputRef.current?.click()}
            style={{ color: T.primaryDark, fontSize: 12, fontWeight: 600 }}
            className="mt-1 hover:underline block"
          >
            {isUploadingAvatar ? "Uploading…" : user?.avatar ? "Change photo" : "Add profile photo"}
          </button>
        </div>
      </div>

      <div style={{ background: T.surface, border: `1px solid ${T.border}` }} className="rounded-2xl overflow-hidden mb-5">
        {rows.map((r, i) => {
          const Icon = r.icon;
          return (
            <button
              key={r.id}
              onClick={r.onClick}
              style={{ borderBottom: i < rows.length - 1 ? `1px solid ${T.border}` : "none" }}
              className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-black/2 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div style={{ color: T.primaryDark }}>
                  <Icon size={18} />
                </div>
                <div>
                  <span style={{ color: T.ink, fontSize: 14, fontWeight: 500 }} className="block">
                    {r.title}
                  </span>
                  {r.sub && (
                    <span style={{ color: T.inkFaint, fontSize: 11 }} className="block mt-0.5">
                      {r.sub}
                    </span>
                  )}
                </div>
              </div>
              <ChevronRight size={16} color={T.inkFaint} />
            </button>
          );
        })}
      </div>

      <button
        onClick={onLogout}
        style={{
          background: T.surfaceAlt,
          color: T.ink,
          border: `1px solid ${T.border}`,
        }}
        className="w-full rounded-2xl py-3.5 font-semibold text-sm mb-4 active:opacity-90 shadow-xs"
      >
        Sign out
      </button>

      {/* Danger Zone: Account Deletion */}
      <div className="rounded-2xl p-4 mb-5 border" style={{ background: "#FFFBFB", borderColor: "#FED7D7" }}>
        <div style={{ color: T.danger, fontSize: 11, fontWeight: 700, textTransform: "uppercase", marginBottom: 6 }}>
          Danger Zone
        </div>
        <p style={{ color: T.inkSoft, fontSize: 12, lineHeight: 1.5, marginBottom: 12 }}>
          Permanently delete your account, all photos, and history.
        </p>
        <button
          type="button"
          onClick={() => setModalType("delete_account")}
          style={{
            background: "#FFF5F5",
            color: T.danger,
            border: "1px solid #FEB2B2",
          }}
          className="w-full rounded-xl py-2.5 font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-red-100/60 active:scale-98 transition-all"
        >
          <Trash2 size={14} />
          Delete Account
        </button>
      </div>

      <div
        style={{ background: T.surfaceAlt, border: `1px solid ${T.border}` }}
        className="rounded-2xl p-4 flex gap-2.5"
      >
        <Info size={16} color={T.inkSoft} className="flex-shrink-0 mt-0.5" />
        <p style={{ color: T.inkSoft, fontSize: 12, lineHeight: 1.5 }}>
          SkinTrack is a personal photo-tracking tool. It does not diagnose skin
          conditions or provide medical advice.
        </p>
      </div>

      {/* Profile submodals */}
      <ReminderModal
        isOpen={modalType === "reminder"}
        onClose={() => setModalType(null)}
        onSave={() => onShowToast && onShowToast("Reminder schedule updated!")}
      />
      <NotificationModal
        isOpen={modalType === "notif"}
        onClose={() => setModalType(null)}
        onSave={() => onShowToast && onShowToast("Notification preferences updated!")}
      />
      <AboutModal
        isOpen={modalType === "about"}
        onClose={() => setModalType(null)}
      />
      <DeleteAccountModal
        isOpen={modalType === "delete_account"}
        onClose={() => setModalType(null)}
        onConfirm={onDeleteAccount}
        userEmail={user?.email || "your account"}
      />
    </div>
  );
}

/* ---------------------------------------------------------
   Upload modal with Live Camera & File Chooser
--------------------------------------------------------- */
function UploadModal({ photos = [], onClose, onSave }) {
  const [step, setStep] = useState(1);
  const [previewSrc, setPreviewSrc] = useState(null);
  const [rawFile, setRawFile] = useState(null);
  const [area, setArea] = useState(null);
  const [note, setNote] = useState("");
  
  // Camera state
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [facingMode, setFacingMode] = useState("user");
  const [isStartingCamera, setIsStartingCamera] = useState(false);

  // Ghost alignment state
  const [showGhost, setShowGhost] = useState(true);
  const [ghostOpacity, setGhostOpacity] = useState(35);
  const [showGuide, setShowGuide] = useState(true);
  const [selectedGhostIndex, setSelectedGhostIndex] = useState(0);

  // Filter photos that have valid imageUrl for ghost overlay
  const availableGhostPhotos = useMemo(() => {
    return (photos || []).filter((p) => p.imageUrl);
  }, [photos]);

  const activeGhostPhoto = availableGhostPhotos[selectedGhostIndex] || availableGhostPhotos[0] || null;

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Stop camera tracks cleanly
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
    setIsStartingCamera(false);
  }, []);

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  // Start live webcam/camera stream
  async function startCamera(mode = facingMode) {
    setCameraError(null);
    setIsStartingCamera(true);
    stopCamera();

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API is not supported in this browser. Please upload a file instead.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 1280 },
          height: { ideal: 1280 },
        },
        audio: false,
      });

      streamRef.current = stream;
      setFacingMode(mode);
      setCameraActive(true);
      setIsStartingCamera(false);

      // Attach stream to video element when rendered
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      }, 50);
    } catch (err) {
      console.warn("Camera access failed:", err);
      setIsStartingCamera(false);
      setCameraActive(false);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setCameraError("Camera permission was denied. Please allow camera access in your browser or select an image file.");
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        setCameraError("No camera found on this device. Please select an image file from your device.");
      } else {
        setCameraError(err.message || "Could not access camera. Please select an image file instead.");
      }
    }
  }

  // Switch between front and rear cameras
  function toggleCamera() {
    const nextMode = facingMode === "user" ? "environment" : "user";
    startCamera(nextMode);
  }

  // Capture snapshot from video stream
  function captureSnapshot() {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    const w = video.videoWidth || 640;
    const h = video.videoHeight || 480;
    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Flip horizontally if front-facing camera for natural mirror reflection
    if (facingMode === "user") {
      ctx.translate(w, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, w, h);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], `photo_${Date.now()}.jpg`, { type: "image/jpeg" });
          setRawFile(file);
          setPreviewSrc(canvas.toDataURL("image/jpeg", 0.92));
          stopCamera();
          setStep(2);
        }
      },
      "image/jpeg",
      0.92
    );
  }

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (file) {
      setRawFile(file);
      const reader = new FileReader();
      reader.onload = () => setPreviewSrc(reader.result);
      reader.readAsDataURL(file);
      stopCamera();
      setStep(2);
    }
  }

  function handleCloseModal() {
    stopCamera();
    onClose();
  }

  function handleBackStep() {
    if (cameraActive) {
      stopCamera();
      return;
    }
    if (step > 1) {
      setStep(step - 1);
    } else {
      handleCloseModal();
    }
  }

  const titles = {
    1: cameraActive ? "Take a photo" : "Add a photo",
    2: "Select tracking area",
    3: "Add a note",
    4: "Review and save",
  };

  return (
    <div
      style={{ background: "rgba(38,40,31,0.45)" }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
    >
      <div
        style={{ background: T.surface, maxHeight: "92vh" }}
        className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl overflow-y-auto shadow-2xl"
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <button
            onClick={handleBackStep}
            aria-label="Back"
            style={{ color: T.inkSoft }}
            className="p-1 rounded-lg hover:bg-black/5"
          >
            <ChevronLeft size={20} />
          </button>
          <span style={{ color: T.ink, fontWeight: 700, fontSize: 15 }}>{titles[step]}</span>
          <button onClick={handleCloseModal} aria-label="Close" className="p-1 rounded-lg hover:bg-black/5">
            <X size={20} color={T.inkSoft} />
          </button>
        </div>

        <div className="px-5 pb-6">
          {step === 1 && !cameraActive && (
            <div className="pt-2">
              <p style={{ color: T.inkSoft, fontSize: 13 }} className="mb-5">
                Choose how you'd like to add today's photo.
              </p>

              {cameraError && (
                <div
                  style={{ background: T.accentSoft, color: T.danger }}
                  className="rounded-2xl p-4 mb-4 text-xs leading-relaxed"
                >
                  <div className="font-semibold mb-1">Camera Notice:</div>
                  {cameraError}
                </div>
              )}

              <button
                onClick={() => startCamera("user")}
                disabled={isStartingCamera}
                style={{
                  border: `1.5px solid ${T.primary}`,
                  background: T.primarySoft,
                }}
                className="w-full rounded-2xl p-4 flex items-center gap-3.5 mb-3 transition-transform active:scale-98"
              >
                <div
                  style={{ background: T.primary, width: 38, height: 38, borderRadius: 12 }}
                  className="flex items-center justify-center text-white flex-shrink-0"
                >
                  <Camera size={20} color="#FFFFFF" />
                </div>
                <div className="text-left">
                  <div style={{ color: T.primaryDark, fontWeight: 700, fontSize: 14 }}>
                    {isStartingCamera ? "Opening camera…" : "Take a photo"}
                  </div>
                  <div style={{ color: T.inkSoft, fontSize: 12 }}>
                    {availableGhostPhotos.length > 0
                      ? "With Ghost Alignment Overlay from previous photo"
                      : "Use your live camera to snap a photo"}
                  </div>
                </div>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                style={{ border: `1px solid ${T.border}`, background: T.surfaceAlt }}
                className="w-full rounded-2xl p-4 flex items-center gap-3.5 transition-transform active:scale-98"
              >
                <div
                  style={{ background: T.surface, width: 38, height: 38, borderRadius: 12, border: `1px solid ${T.border}` }}
                  className="flex items-center justify-center flex-shrink-0"
                >
                  <UploadIcon size={18} color={T.ink} />
                </div>
                <div className="text-left">
                  <div style={{ color: T.ink, fontWeight: 600, fontSize: 14 }}>
                    Choose from device
                  </div>
                  <div style={{ color: T.inkFaint, fontSize: 12 }}>
                    Upload from your gallery or files
                  </div>
                </div>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFile}
                className="hidden"
              />
            </div>
          )}

          {step === 1 && cameraActive && (
            <div className="pt-1 flex flex-col items-center">
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: 320,
                  borderRadius: 22,
                  overflow: "hidden",
                  background: "#000000",
                }}
                className="shadow-md"
              >
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transform: facingMode === "user" ? "scaleX(-1)" : "none",
                  }}
                />

                {/* Ghost Alignment Overlay */}
                {showGhost && activeGhostPhoto && (
                  <img
                    src={activeGhostPhoto.imageUrl}
                    alt="Ghost alignment overlay"
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      opacity: ghostOpacity / 100,
                      pointerEvents: "none",
                      filter: "grayscale(0.75) contrast(1.2)",
                      transform: facingMode === "user" ? "scaleX(-1)" : "none",
                    }}
                  />
                )}

                {/* Facial alignment oval reticle */}
                {showGuide && (
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: "62%",
                      height: "72%",
                      borderRadius: "46%",
                      border: "2px dashed rgba(255, 255, 255, 0.75)",
                      boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.28)",
                      pointerEvents: "none",
                    }}
                  >
                    {/* Eye line alignment */}
                    <div
                      style={{
                        position: "absolute",
                        top: "42%",
                        left: "12%",
                        right: "12%",
                        borderTop: "1px dotted rgba(255, 255, 255, 0.55)",
                      }}
                    />
                    {/* Center cross line */}
                    <div
                      style={{
                        position: "absolute",
                        top: "20%",
                        bottom: "20%",
                        left: "50%",
                        borderLeft: "1px dotted rgba(255, 255, 255, 0.4)",
                      }}
                    />
                  </div>
                )}

                {/* Viewfinder Top Control Bar */}
                <div
                  style={{
                    position: "absolute",
                    top: 12,
                    left: 12,
                    right: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    zIndex: 10,
                  }}
                >
                  {/* Ghost alignment toggle badge */}
                  {activeGhostPhoto ? (
                    <button
                      type="button"
                      onClick={() => setShowGhost(!showGhost)}
                      style={{
                        background: showGhost ? "rgba(63, 107, 87, 0.88)" : "rgba(0, 0, 0, 0.65)",
                        backdropFilter: "blur(6px)",
                        color: "#FFFFFF",
                        border: "1px solid rgba(255, 255, 255, 0.25)",
                        borderRadius: 20,
                        padding: "5px 12px",
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                      className="flex items-center gap-1.5 shadow-sm active:scale-95 transition-transform"
                    >
                      <Layers size={13} color={showGhost ? "#FFFFFF" : "rgba(255,255,255,0.6)"} />
                      <span>Ghost: {showGhost ? "ON" : "OFF"}</span>
                    </button>
                  ) : (
                    <div
                      style={{
                        background: "rgba(0, 0, 0, 0.6)",
                        backdropFilter: "blur(6px)",
                        color: "rgba(255,255,255,0.9)",
                        borderRadius: 20,
                        padding: "5px 12px",
                        fontSize: 11,
                        fontWeight: 500,
                      }}
                    >
                      Alignment Guide Active
                    </div>
                  )}

                  {/* Right side controls (Face Guide & Camera Flip) */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowGuide(!showGuide)}
                      style={{
                        background: showGuide ? "rgba(63, 107, 87, 0.88)" : "rgba(0, 0, 0, 0.6)",
                        backdropFilter: "blur(6px)",
                        color: "#FFFFFF",
                      }}
                      className="p-2 rounded-full border border-white/20 shadow-sm active:scale-95 transition-transform"
                      title="Toggle face alignment guide"
                    >
                      {showGuide ? <Eye size={15} /> : <EyeOff size={15} />}
                    </button>

                    <button
                      type="button"
                      onClick={toggleCamera}
                      style={{
                        background: "rgba(0,0,0,0.6)",
                        backdropFilter: "blur(6px)",
                        color: "#FFFFFF",
                      }}
                      className="p-2 rounded-full border border-white/20 shadow-sm active:scale-95 transition-transform"
                      title="Switch camera"
                      aria-label="Switch camera"
                    >
                      <RefreshCw size={15} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Ghost Opacity Slider (when Ghost is active) */}
              {showGhost && activeGhostPhoto && (
                <div
                  style={{
                    background: T.surfaceAlt,
                    border: `1px solid ${T.border}`,
                    borderRadius: 16,
                    padding: "8px 14px",
                    width: "100%",
                    marginTop: 10,
                  }}
                  className="flex items-center gap-3 text-xs"
                >
                  <Sliders size={14} color={T.primaryDark} className="flex-shrink-0" />
                  <span style={{ color: T.ink, fontWeight: 600, fontSize: 11 }}>Ghost Opacity</span>
                  <input
                    type="range"
                    min="10"
                    max="80"
                    value={ghostOpacity}
                    onChange={(e) => setGhostOpacity(Number(e.target.value))}
                    className="flex-1 accent-emerald-700 h-1.5 cursor-pointer"
                  />
                  <span style={{ color: T.inkSoft, fontWeight: 700, width: 32, textAlign: "right", fontSize: 11 }}>
                    {ghostOpacity}%
                  </span>
                </div>
              )}

              {/* Shutter controls */}
              <div className="flex items-center justify-between w-full mt-4 px-6">
                <button
                  type="button"
                  onClick={() => {
                    stopCamera();
                  }}
                  style={{ color: T.inkSoft, fontSize: 13 }}
                  className="font-medium px-2 py-1 hover:text-black"
                >
                  Cancel
                </button>

                {/* Main Shutter Button */}
                <button
                  type="button"
                  onClick={captureSnapshot}
                  style={{
                    width: 68,
                    height: 68,
                    borderRadius: "50%",
                    border: `4px solid ${T.primary}`,
                    background: "#FFFFFF",
                    padding: 4,
                  }}
                  className="flex items-center justify-center shadow-lg transition-transform active:scale-90"
                  aria-label="Take snapshot"
                >
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      background: `linear-gradient(145deg, ${T.primary} 0%, ${T.primaryDark} 100%)`,
                    }}
                    className="flex items-center justify-center text-white"
                  >
                    <Camera size={26} />
                  </div>
                </button>

                <div style={{ width: 44 }} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="pt-2">
              <div className="grid grid-cols-2 gap-2 mb-5">
                {AREAS.map((a) => (
                  <button
                    key={a}
                    onClick={() => setArea(a)}
                    style={{
                      border: `1px solid ${area === a ? T.primary : T.border}`,
                      background: area === a ? T.primarySoft : T.surface,
                      color: area === a ? T.primaryDark : T.ink,
                    }}
                    className="rounded-xl py-3 text-sm font-medium transition-colors"
                  >
                    {a}
                  </button>
                ))}
              </div>
              <button
                disabled={!area}
                onClick={() => setStep(3)}
                style={{
                  background: area ? T.primary : T.surfaceAlt,
                  color: area ? "#FFFFFF" : T.inkFaint,
                }}
                className="w-full rounded-2xl py-3.5 font-semibold text-sm transition-colors"
              >
                Continue
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="pt-2">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Anything you noticed today (e.g. slight redness, dryness, new skincare routine)"
                rows={4}
                style={{ border: `1px solid ${T.border}`, color: T.ink }}
                className="w-full rounded-2xl p-3 text-sm mb-4 resize-none focus:outline-none"
              />
              <button
                onClick={() => setStep(4)}
                style={{ background: T.primary, color: "#FFFFFF" }}
                className="w-full rounded-2xl py-3.5 font-semibold text-sm"
              >
                Continue
              </button>
            </div>
          )}

          {step === 4 && (
            <div className="pt-2">
              <div style={{ width: 150, margin: "0 auto" }} className="mb-4">
                {previewSrc ? (
                  <img
                    src={previewSrc}
                    alt="Selected preview"
                    style={{ borderRadius: 16, border: `1px solid ${T.border}` }}
                    className="w-full h-40 object-cover shadow-sm"
                  />
                ) : (
                  <PhotoThumb tone={["#E3E6DA", "#CBD3BC"]} imageUrl={null} />
                )}
              </div>
              <div className="text-center mb-1" style={{ color: T.ink, fontWeight: 600, fontSize: 14 }}>
                {fmtLong(new Date().toISOString().slice(0, 10))}
              </div>
              <div className="text-center mb-5" style={{ color: T.inkSoft, fontSize: 13 }}>
                Face — {area}
                {note && (
                  <div style={{ color: T.inkFaint, fontStyle: "italic", marginTop: 4 }}>
                    "{note}"
                  </div>
                )}
              </div>
              <button
                onClick={() => onSave({ area, note, previewSrc, rawFile })}
                style={{ background: T.primary, color: "#FFFFFF" }}
                className="w-full rounded-2xl py-3.5 font-semibold text-sm flex items-center justify-center gap-2 shadow-md transition-transform active:scale-98"
              >
                <Check size={17} />
                Save photo
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   Bottom / top navigation
--------------------------------------------------------- */
const NAV = [
  { id: "dashboard", label: "Dashboard", Icon: Home },
  { id: "upload", label: "Upload", Icon: Camera },
  { id: "timeline", label: "Timeline", Icon: Calendar },
  { id: "compare", label: "Compare", Icon: RefreshCw },
  { id: "profile", label: "Profile", Icon: User },
];

function BottomNav({ active, onSelect }) {
  return (
    <div
      style={{ background: T.surface, borderTop: `1px solid ${T.border}` }}
      className="fixed bottom-0 left-0 right-0 flex md:hidden justify-around py-2 z-30"
    >
      {NAV.map(({ id, label, Icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className="flex flex-col items-center gap-0.5 px-2 py-1.5"
            style={{ minWidth: 56 }}
            aria-label={label}
          >
            <Icon size={21} color={isActive ? T.primary : T.inkFaint} strokeWidth={isActive ? 2.3 : 2} />
            <span
              style={{
                fontSize: 10,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? T.primary : T.inkFaint,
              }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function TopTabs({ active, onSelect }) {
  return (
    <div className="hidden md:flex px-5 gap-2 mb-2">
      {NAV.map(({ id, label, Icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => onSelect(id)}
            style={{
              background: isActive ? T.primarySoft : "transparent",
              color: isActive ? T.primaryDark : T.inkSoft,
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium"
          >
            <Icon size={15} />
            {label}
          </button>
        );
      })}
    </div>
  );
}

/* ---------------------------------------------------------
   Root app
--------------------------------------------------------- */
export default function SkinTrackApp() {
  // Auth state
  const [authView, setAuthView] = useState("login"); // login | signup | forgot | reset
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [resetToken, setResetToken] = useState(null);

  // App state
  const [tab, setTab] = useState("dashboard");
  const [photos, setPhotos] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [savedBanner, setSavedBanner] = useState(false);
  const [selectedDetailPhoto, setSelectedDetailPhoto] = useState(null);
  const [confirmDeletePhoto, setConfirmDeletePhoto] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  function showToast(msg) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  }

  // Check for reset token or openUpload in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("resetToken");
    if (token) {
      setResetToken(token);
      setAuthView("reset");
      window.history.replaceState({}, "", window.location.pathname);
    }
    if (params.get("openUpload") === "true") {
      setShowUpload(true);
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  // Check existing session on mount
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setAuthLoading(false);
      return;
    }
    api.get("/api/auth/me")
      .then((data) => {
        setUser(data.user);
      })
      .catch(() => {
        clearToken();
      })
      .finally(() => setAuthLoading(false));
  }, []);

  // Fetch photos when user is authenticated
  const fetchPhotos = useCallback(() => {
    if (!user) return;
    api.get("/api/photos")
      .then((data) => {
        const enriched = data.photos.map((p, i) => ({
          ...p,
          tone: TONES[i % TONES.length],
        }));
        setPhotos(enriched);
      })
      .catch((err) => console.error("Failed to fetch photos:", err));
  }, [user]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  // Auth handlers
  async function handleLogin(email, password) {
    const data = await api.post("/api/auth/login", { email, password });
    setToken(data.token);
    setUser(data.user);
  }

  async function handleSignup(email, password, name) {
    const data = await api.post("/api/auth/signup", { email, password, name });
    setToken(data.token);
    setUser(data.user);
  }

  async function handleGoogleLogin(email, name) {
    const data = await api.post("/api/auth/google", { email, name });
    setToken(data.token);
    setUser(data.user);
  }

  async function handleForgotPassword(email) {
    return await api.post("/api/auth/forgot-password", { email });
  }

  async function handleResetPassword(token, newPassword) {
    return await api.post("/api/auth/reset-password", { token, newPassword });
  }

  function handleLogout() {
    clearToken();
    setUser(null);
    setPhotos([]);
    setTab("dashboard");
    setAuthView("login");
  }

  function handleNavSelect(id) {
    if (id === "upload") {
      setShowUpload(true);
      return;
    }
    setTab(id);
  }

  async function handleDeletePhoto(id) {
    try {
      await api.delete(`/api/photos/${id}`);
      setPhotos((prev) => prev.filter((p) => p.id !== id));
      setSelectedDetailPhoto(null);
      setConfirmDeletePhoto(null);
      showToast("Photo deleted successfully");
    } catch (err) {
      console.error("Failed to delete photo:", err);
      showToast(err.message || "Failed to delete photo");
    }
  }

  async function handleDeleteAccount() {
    try {
      await api.delete("/api/auth/account");
      clearToken();
      setUser(null);
      setPhotos([]);
      setTab("dashboard");
      setAuthView("login");
      showToast("Account and all data permanently deleted");
    } catch (err) {
      console.error("Failed to delete account:", err);
      showToast(err.message || "Failed to delete account");
    }
  }

  async function handleSave({ area, note, rawFile }) {
    const formData = new FormData();
    if (rawFile) {
      formData.append("image", rawFile);
    } else {
      // Create a small placeholder file if no image was selected
      const blob = new Blob(['<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>'], { type: "image/svg+xml" });
      formData.append("image", blob, "placeholder.svg");
    }
    formData.append("area", area);
    formData.append("note", note || "");
    formData.append("date", new Date().toISOString().slice(0, 10));

    try {
      await api.upload("/api/photos", formData);
      fetchPhotos();
      setShowUpload(false);
      setTab("dashboard");
      setSavedBanner(true);
      setTimeout(() => setSavedBanner(false), 3500);
      showToast("Photo saved to timeline!");
    } catch (err) {
      console.error("Upload failed:", err);
      showToast("Failed to upload photo");
    }
  }

  // Loading state
  if (authLoading) {
    return (
      <div style={{ background: T.bg, minHeight: "100vh", fontFamily: "Inter, sans-serif" }}
        className="flex items-center justify-center">
        <style>{FONT_IMPORT}</style>
        <div style={{ color: T.inkSoft, fontSize: 14 }}>Loading…</div>
      </div>
    );
  }

  // Auth pages (not logged in)
  if (!user) {
    if (authView === "reset" && resetToken) {
      return (
        <>
          <style>{FONT_IMPORT}</style>
          <style>{"@keyframes spin { to { transform: rotate(360deg); } }"}</style>
          <ResetPasswordPage
            token={resetToken}
            onReset={handleResetPassword}
            onGoLogin={() => { setResetToken(null); setAuthView("login"); }}
          />
        </>
      );
    }
    if (authView === "signup") {
      return (
        <>
          <style>{FONT_IMPORT}</style>
          <style>{"@keyframes spin { to { transform: rotate(360deg); } }"}</style>
          <SignupPage
            onSignup={handleSignup}
            onGoogleLogin={handleGoogleLogin}
            onGoLogin={() => setAuthView("login")}
          />
        </>
      );
    }
    if (authView === "forgot") {
      return (
        <>
          <style>{FONT_IMPORT}</style>
          <style>{"@keyframes spin { to { transform: rotate(360deg); } }"}</style>
          <ForgotPasswordPage
            onSubmitEmail={handleForgotPassword}
            onGoLogin={() => setAuthView("login")}
          />
        </>
      );
    }
    return (
      <>
        <style>{FONT_IMPORT}</style>
        <style>{"@keyframes spin { to { transform: rotate(360deg); } }"}</style>
        <LoginPage
          onLogin={handleLogin}
          onGoogleLogin={handleGoogleLogin}
          onGoSignup={() => setAuthView("signup")}
          onGoForgot={() => setAuthView("forgot")}
        />
      </>
    );
  }

  // Authenticated app
  return (
    <div style={{ background: T.bg, minHeight: "100vh", fontFamily: "Inter, sans-serif" }}>
      <style>{FONT_IMPORT}</style>
      <div style={{ maxWidth: 480, margin: "0 auto" }} className="pb-24 md:pb-10">
        <Header user={user} onProfile={() => setTab("profile")} />
        <TopTabs active={tab} onSelect={handleNavSelect} />
        {tab === "dashboard" && (
          <Dashboard
            photos={photos}
            onOpenUpload={() => setShowUpload(true)}
            onGoTimeline={() => setTab("timeline")}
            onGoCompare={() => setTab("compare")}
            onSelectPhoto={setSelectedDetailPhoto}
            onRequestDeletePhoto={setConfirmDeletePhoto}
            savedBanner={savedBanner}
          />
        )}
        {tab === "timeline" && (
          <Timeline
            photos={photos}
            onSelectPhoto={setSelectedDetailPhoto}
            onRequestDeletePhoto={setConfirmDeletePhoto}
          />
        )}
        {tab === "compare" && <Compare photos={photos} />}
        {tab === "profile" && (
          <Profile
            user={user}
            photos={photos}
            onLogout={handleLogout}
            onUpdateUser={setUser}
            onDeleteAccount={handleDeleteAccount}
            onShowToast={showToast}
          />
        )}
      </div>
      <BottomNav active={tab} onSelect={handleNavSelect} />

      {/* Upload modal */}
      {showUpload && (
        <UploadModal
          photos={photos}
          onClose={() => setShowUpload(false)}
          onSave={handleSave}
        />
      )}

      {/* Photo detail modal */}
      {selectedDetailPhoto && (
        <PhotoDetailModal
          photo={selectedDetailPhoto}
          onClose={() => setSelectedDetailPhoto(null)}
          onRequestDelete={(p) => {
            setSelectedDetailPhoto(null);
            setConfirmDeletePhoto(p);
          }}
        />
      )}

      {/* Delete confirmation modal */}
      {confirmDeletePhoto && (
        <DeleteConfirmModal
          photo={confirmDeletePhoto}
          onCancel={() => setConfirmDeletePhoto(null)}
          onConfirm={handleDeletePhoto}
        />
      )}

      {/* Global Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: 74,
            left: "50%",
            transform: "translateX(-50%)",
            background: T.ink,
            color: "#FFFFFF",
            borderRadius: 16,
            padding: "10px 18px",
            fontSize: 13,
            fontWeight: 600,
            zIndex: 60,
            boxShadow: "0 8px 24px rgba(0,0,0,0.28)",
          }}
          className="flex items-center gap-2 animate-fade-in"
        >
          <CheckCircle size={16} color={T.primarySoft} />
          {toastMessage}
        </div>
      )}
    </div>
  );
}
