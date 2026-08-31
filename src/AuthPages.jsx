import React, { useState } from "react";
import { ChevronLeft, Mail, Lock, User, Eye, EyeOff, Check, AlertCircle, X } from "lucide-react";

/* ---------------------------------------------------------
   Design tokens (shared with App.jsx)
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
        <linearGradient id={`bmGrad_auth_${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3F6B57" />
          <stop offset="100%" stopColor="#244434" />
        </linearGradient>
        <linearGradient id={`bmLeaf_auth_${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E4EDE6" />
        </linearGradient>
        <linearGradient id={`bmAccent_auth_${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F2A6AC" />
          <stop offset="100%" stopColor="#B97D82" />
        </linearGradient>
      </defs>

      {/* Squircle Container */}
      <rect x="1" y="1" width="32" height="32" rx="9.5" fill={`url(#bmGrad_auth_${size})`} stroke="#4E7E68" strokeWidth="1" />

      {/* Botanical Leaf / Droplet Contour */}
      <path
        d="M17 7 C23 11 25.5 18 21.5 24 C19 27.5 13 27.5 9.5 24 C6.5 20.5 8.5 14 17 7 Z"
        fill={`url(#bmLeaf_auth_${size})`}
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
      <circle cx="20.5" cy="20.5" r="3.2" fill={`url(#bmAccent_auth_${size})`} />
      <circle cx="21.3" cy="19.7" r="0.9" fill="#FFFFFF" opacity="0.9" />
    </svg>
  );
}

/* ---------------------------------------------------------
   Shared form components
--------------------------------------------------------- */
function FormInput({ icon: Icon, type: initialType, placeholder, value, onChange, autoComplete }) {
  const [showPw, setShowPw] = useState(false);
  const isPw = initialType === "password";
  const type = isPw ? (showPw ? "text" : "password") : initialType;

  return (
    <div
      style={{ border: `1px solid ${T.border}`, background: T.surface }}
      className="flex items-center gap-3 rounded-2xl px-4 py-3 mb-3"
    >
      <Icon size={18} color={T.inkFaint} className="flex-shrink-0" />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        style={{ color: T.ink, fontSize: 14, outline: "none", background: "transparent" }}
        className="flex-1 min-w-0"
      />
      {isPw && (
        <button onClick={() => setShowPw(!showPw)} type="button" className="flex-shrink-0">
          {showPw ? (
            <EyeOff size={18} color={T.inkFaint} />
          ) : (
            <Eye size={18} color={T.inkFaint} />
          )}
        </button>
      )}
    </div>
  );
}

function FormError({ message }) {
  if (!message) return null;
  return (
    <div
      style={{ background: T.accentSoft, color: T.danger }}
      className="rounded-xl px-4 py-2.5 mb-4 flex items-center gap-2 text-sm"
    >
      <AlertCircle size={16} className="flex-shrink-0" />
      {message}
    </div>
  );
}

function FormSuccess({ message }) {
  if (!message) return null;
  return (
    <div
      style={{ background: T.primarySoft, color: T.primaryDark }}
      className="rounded-xl px-4 py-2.5 mb-4 flex items-center gap-2 text-sm"
    >
      <Check size={16} className="flex-shrink-0" />
      {message}
    </div>
  );
}

function PrimaryButton({ children, onClick, disabled, loading }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        background: disabled ? T.surfaceAlt : T.primary,
        color: disabled ? T.inkFaint : "#FFFFFF",
        opacity: loading ? 0.7 : 1,
      }}
      className="w-full rounded-2xl py-3.5 font-semibold text-sm flex items-center justify-center gap-2"
    >
      {loading ? (
        <div
          style={{
            width: 18,
            height: 18,
            border: `2px solid rgba(255,255,255,0.3)`,
            borderTopColor: "#FFFFFF",
            borderRadius: "50%",
            animation: "spin 0.6s linear infinite",
          }}
        />
      ) : (
        children
      )}
    </button>
  );
}

function GoogleButton({ onClick, loading, text = "Continue with Google" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      style={{
        background: "#FFFFFF",
        border: `1px solid ${T.border}`,
        color: T.ink,
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
      className="w-full rounded-2xl py-3.5 px-4 font-semibold text-sm flex items-center justify-center gap-3 transition-all hover:bg-black/2 active:scale-98"
    >
      <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.616z" fill="#4285F4"/>
        <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
        <path d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z" fill="#FBBC05"/>
        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
      </svg>
      <span>{text}</span>
    </button>
  );
}

function Divider() {
  return (
    <div className="flex items-center gap-3 my-6">
      <div style={{ height: 1, background: T.border }} className="flex-1" />
      <span style={{ color: T.inkFaint, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em" }}>
        OR
      </span>
      <div style={{ height: 1, background: T.border }} className="flex-1" />
    </div>
  );
}

function GoogleChooserModal({ isOpen, onClose, onSelect, loading }) {
  if (!isOpen) return null;
  const accounts = [
    { email: "gowthamrajb.dev@gmail.com", name: "Gowtham Raj", avatarBg: "#4285F4" },
    { email: "demo@skintrack.com", name: "Demo User", avatarBg: "#3F6B57" },
  ];

  return (
    <div
      style={{ background: "rgba(38,40,31,0.6)", backdropFilter: "blur(4px)" }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        style={{ background: "#FFFFFF", width: "100%", maxWidth: 360, borderRadius: 28 }}
        className="p-6 shadow-2xl animate-fade-in"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <svg width="22" height="22" viewBox="0 0 18 18">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.616z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
              <path d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            <span style={{ color: "#202124", fontWeight: 700, fontSize: 16 }}>Google Sign-In</span>
          </div>
          <button onClick={onClose}><X size={18} color="#5f6368" /></button>
        </div>

        <p style={{ color: "#5f6368", fontSize: 13 }} className="mb-4 leading-relaxed">
          Select an account to continue to <strong>SkinTrack</strong>
        </p>

        <div className="space-y-2 mb-4">
          {accounts.map((acc) => (
            <button
              key={acc.email}
              type="button"
              disabled={loading}
              onClick={() => onSelect(acc.email, acc.name)}
              className="w-full rounded-2xl p-3 text-left flex items-center gap-3 hover:bg-black/5 active:scale-98 transition-all border border-gray-100"
            >
              <div
                style={{ background: acc.avatarBg, width: 38, height: 38, borderRadius: "50%", color: "#FFFFFF" }}
                className="flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-xs"
              >
                {acc.name[0]}
              </div>
              <div className="overflow-hidden">
                <div style={{ color: "#202124", fontWeight: 600, fontSize: 13 }}>{acc.name}</div>
                <div style={{ color: "#5f6368", fontSize: 12 }} className="truncate">{acc.email}</div>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          style={{ color: "#1a73e8", fontWeight: 600, fontSize: 13 }}
          className="w-full py-2 text-center hover:underline"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   Login Page
--------------------------------------------------------- */
export function LoginPage({ onLogin, onGoogleLogin, onGoSignup, onGoForgot }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await onLogin(email, password);
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleSelectGoogleAccount(selectedEmail, selectedName) {
    setError("");
    setGoogleLoading(true);
    try {
      if (onGoogleLogin) {
        await onGoogleLogin(selectedEmail, selectedName);
      }
      setShowGoogleModal(false);
    } catch (err) {
      setError(err.message || "Google sign-in failed");
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <div style={{ background: T.bg, minHeight: "100vh", fontFamily: "Inter, sans-serif" }}>
      <div style={{ maxWidth: 390, margin: "0 auto" }} className="px-6 pt-16 pb-10">
        <div className="flex justify-center mb-6">
          <BrandMark size={46} />
        </div>
        <h1
          style={{
            color: T.ink,
            fontSize: 32,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            fontFamily: "'Playfair Display', Georgia, serif",
          }}
          className="text-center mb-1.5"
        >
          Welcome back.
        </h1>
        <p style={{ color: T.inkSoft, fontSize: 14 }} className="text-center mb-7">
          Sign in to see your spots.
        </p>

        {/* Continue with Google */}
        <GoogleButton onClick={() => setShowGoogleModal(true)} loading={googleLoading} text="Continue with Google" />

        <Divider />

        <form onSubmit={handleSubmit}>
          <FormError message={error} />
          
          <div className="mb-4">
            <label style={{ color: T.ink, fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>
              Email
            </label>
            <FormInput
              icon={Mail}
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={setEmail}
              autoComplete="email"
            />
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-1.5">
              <label style={{ color: T.ink, fontSize: 13, fontWeight: 600 }}>
                Password
              </label>
              <button
                type="button"
                onClick={onGoForgot}
                style={{ color: T.inkSoft, fontSize: 12, fontWeight: 500 }}
                className="hover:underline"
              >
                Forgot?
              </button>
            </div>
            <FormInput
              icon={Lock}
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={setPassword}
              autoComplete="current-password"
            />
          </div>

          <PrimaryButton disabled={!email || !password} loading={loading}>
            Sign in
          </PrimaryButton>
        </form>

        <p style={{ color: T.inkSoft, fontSize: 13 }} className="text-center mt-7">
          Need an account?{" "}
          <button
            onClick={onGoSignup}
            style={{ color: T.primaryDark, fontWeight: 600 }}
            className="hover:underline"
          >
            Sign up.
          </button>
        </p>
      </div>

      <GoogleChooserModal
        isOpen={showGoogleModal}
        onClose={() => setShowGoogleModal(false)}
        onSelect={handleSelectGoogleAccount}
        loading={googleLoading}
      />
    </div>
  );
}

/* ---------------------------------------------------------
   Signup Page
--------------------------------------------------------- */
export function SignupPage({ onSignup, onGoogleLogin, onGoLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await onSignup(email, password, name);
    } catch (err) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleSelectGoogleAccount(selectedEmail, selectedName) {
    setError("");
    setGoogleLoading(true);
    try {
      if (onGoogleLogin) {
        await onGoogleLogin(selectedEmail, selectedName);
      }
      setShowGoogleModal(false);
    } catch (err) {
      setError(err.message || "Google sign-up failed");
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <div style={{ background: T.bg, minHeight: "100vh", fontFamily: "Inter, sans-serif" }}>
      <div style={{ maxWidth: 390, margin: "0 auto" }} className="px-6 pt-16 pb-10">
        <div className="flex justify-center mb-6">
          <BrandMark size={46} />
        </div>
        <h1
          style={{
            color: T.ink,
            fontSize: 32,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            fontFamily: "'Playfair Display', Georgia, serif",
          }}
          className="text-center mb-1.5"
        >
          Create account.
        </h1>
        <p style={{ color: T.inkSoft, fontSize: 14 }} className="text-center mb-7">
          Start tracking your skin progress.
        </p>

        {/* Continue with Google */}
        <GoogleButton onClick={() => setShowGoogleModal(true)} loading={googleLoading} text="Continue with Google" />

        <Divider />

        <form onSubmit={handleSubmit}>
          <FormError message={error} />

          <div className="mb-3">
            <label style={{ color: T.ink, fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>
              Name
            </label>
            <FormInput
              icon={User}
              type="text"
              placeholder="Your full name"
              value={name}
              onChange={setName}
              autoComplete="name"
            />
          </div>

          <div className="mb-3">
            <label style={{ color: T.ink, fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>
              Email
            </label>
            <FormInput
              icon={Mail}
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={setEmail}
              autoComplete="email"
            />
          </div>

          <div className="mb-6">
            <label style={{ color: T.ink, fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>
              Password
            </label>
            <FormInput
              icon={Lock}
              type="password"
              placeholder="Min. 6 characters"
              value={password}
              onChange={setPassword}
              autoComplete="new-password"
            />
          </div>

          <PrimaryButton disabled={!email || !password} loading={loading}>
            Create account
          </PrimaryButton>
        </form>

        <p style={{ color: T.inkSoft, fontSize: 13 }} className="text-center mt-7">
          Already have an account?{" "}
          <button
            onClick={onGoLogin}
            style={{ color: T.primaryDark, fontWeight: 600 }}
            className="hover:underline"
          >
            Sign in.
          </button>
        </p>
      </div>

      <GoogleChooserModal
        isOpen={showGoogleModal}
        onClose={() => setShowGoogleModal(false)}
        onSelect={handleSelectGoogleAccount}
        loading={googleLoading}
      />
    </div>
  );
}

/* ---------------------------------------------------------
   Forgot Password Page
--------------------------------------------------------- */
export function ForgotPasswordPage({ onSubmitEmail, onGoLogin }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [devResetLink, setDevResetLink] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setDevResetLink("");
    setLoading(true);
    try {
      const data = await onSubmitEmail(email);
      setSuccess(data.message || "If that email is registered, a reset link has been sent.");
      if (data.devResetLink) {
        setDevResetLink(data.devResetLink);
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ background: T.bg, minHeight: "100vh", fontFamily: "Inter, sans-serif" }}>
      <div style={{ maxWidth: 400, margin: "0 auto" }} className="px-6 pt-20 pb-10">
        <button
          onClick={onGoLogin}
          className="flex items-center gap-1 mb-8"
          style={{ color: T.inkSoft, fontSize: 13 }}
        >
          <ChevronLeft size={16} />
          Back to sign in
        </button>

        <div className="flex justify-center mb-8">
          <BrandMark size={52} />
        </div>
        <h1
          style={{ color: T.ink, fontSize: 24, fontWeight: 700, letterSpacing: "-0.01em" }}
          className="text-center mb-1"
        >
          Reset password
        </h1>
        <p style={{ color: T.inkSoft, fontSize: 14 }} className="text-center mb-8">
          Enter your email and we'll send you a reset link.
        </p>

        <form onSubmit={handleSubmit}>
          <FormError message={error} />
          <FormSuccess message={success} />

          {devResetLink && (
            <div
              style={{
                background: T.surfaceAlt,
                border: `1px solid ${T.border}`,
                color: T.ink,
              }}
              className="rounded-2xl p-4 mb-4 text-xs"
            >
              <div className="font-semibold text-xs mb-1" style={{ color: T.primaryDark }}>
                🛠️ Local Dev Mode Link:
              </div>
              <a
                href={devResetLink}
                style={{ color: T.primary, wordBreak: "break-all", textDecoration: "underline", fontWeight: 600 }}
              >
                Click here to reset your password directly &rarr;
              </a>
            </div>
          )}

          <FormInput
            icon={Mail}
            type="email"
            placeholder="Email address"
            value={email}
            onChange={setEmail}
            autoComplete="email"
          />

          <div className="mt-3">
            <PrimaryButton disabled={!email} loading={loading}>
              Send reset link
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   Reset Password Page (user arrives via email link)
--------------------------------------------------------- */
export function ResetPasswordPage({ token, onReset, onGoLogin }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const data = await onReset(token, password);
      setSuccess(data.message || "Password has been reset.");
    } catch (err) {
      setError(err.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ background: T.bg, minHeight: "100vh", fontFamily: "Inter, sans-serif" }}>
      <div style={{ maxWidth: 400, margin: "0 auto" }} className="px-6 pt-20 pb-10">
        <div className="flex justify-center mb-8">
          <BrandMark size={52} />
        </div>
        <h1
          style={{ color: T.ink, fontSize: 24, fontWeight: 700, letterSpacing: "-0.01em" }}
          className="text-center mb-1"
        >
          Set new password
        </h1>
        <p style={{ color: T.inkSoft, fontSize: 14 }} className="text-center mb-8">
          Choose a strong new password for your account.
        </p>

        <form onSubmit={handleSubmit}>
          <FormError message={error} />
          <FormSuccess message={success} />

          {!success && (
            <>
              <FormInput
                icon={Lock}
                type="password"
                placeholder="New password (min 6 characters)"
                value={password}
                onChange={setPassword}
                autoComplete="new-password"
              />
              <FormInput
                icon={Lock}
                type="password"
                placeholder="Confirm new password"
                value={confirm}
                onChange={setConfirm}
                autoComplete="new-password"
              />

              <div className="mt-3">
                <PrimaryButton disabled={!password || !confirm} loading={loading}>
                  Reset password
                </PrimaryButton>
              </div>
            </>
          )}

          {success && (
            <div className="mt-4">
              <button
                onClick={onGoLogin}
                style={{ background: T.primary, color: "#FFFFFF" }}
                className="w-full rounded-2xl py-3.5 font-semibold text-sm"
              >
                Back to sign in
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
