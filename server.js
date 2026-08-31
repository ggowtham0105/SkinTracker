import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";

// Automatically load .env if present
try {
  if (typeof process.loadEnvFile === "function") {
    process.loadEnvFile();
  }
} catch {
  // .env file not found, use default/process environment variables
}

/* ---------------------------------------------------------
   Paths & constants
--------------------------------------------------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, "data");
const UPLOADS_DIR = path.join(__dirname, "uploads");
const PORT = Number(process.env.PORT) || 3001;
const JWT_SECRET = process.env.JWT_SECRET || "skintrack-dev-secret-change-in-prod";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// Ensure directories exist
fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

/* ---------------------------------------------------------
   Database setup
--------------------------------------------------------- */
const db = new Database(path.join(DATA_DIR, "skintrack.db"));
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT DEFAULT 'You',
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS photos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    area TEXT NOT NULL,
    note TEXT DEFAULT '',
    filename TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS reset_tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires_at TEXT NOT NULL,
    used INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS user_settings (
    user_id INTEGER PRIMARY KEY,
    reminder_frequency TEXT DEFAULT 'Daily',
    reminder_time TEXT DEFAULT '09:00',
    email_reminders INTEGER DEFAULT 1,
    browser_reminders INTEGER DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

// Migration: Ensure avatar column exists in users table
try {
  db.exec("ALTER TABLE users ADD COLUMN avatar TEXT DEFAULT ''");
} catch {}

/* ---------------------------------------------------------
   Seed demo data (runs once)
--------------------------------------------------------- */
function seedDemoData() {
  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get("demo@skintrack.com");
  if (existing) return;

  const hash = bcrypt.hashSync("password123", 10);
  const result = db.prepare("INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)").run(
    "demo@skintrack.com",
    hash,
    "Demo User"
  );
  const userId = result.lastInsertRowid;

  const seedPhotos = [
    { date: "2026-08-27", area: "Face — Forehead", note: "Slight redness" },
    { date: "2026-08-20", area: "Face — Left cheek", note: "" },
    { date: "2026-08-13", area: "Face — Forehead", note: "Used new moisturizer this week" },
    { date: "2026-08-06", area: "Face — Chin", note: "" },
    { date: "2026-07-30", area: "Face — Right cheek", note: "Slightly dry" },
    { date: "2026-07-23", area: "Face — Forehead", note: "" },
    { date: "2026-07-19", area: "Face — Jawline", note: "Consistent lighting check" },
    { date: "2026-07-16", area: "Face — Left cheek", note: "" },
    { date: "2026-07-09", area: "Face — Chin", note: "Morning light" },
    { date: "2026-07-02", area: "Face — Neck", note: "" },
    { date: "2026-06-25", area: "Face — Forehead", note: "Starting new routine" },
    { date: "2026-06-18", area: "Face — Forehead", note: "First photo" },
  ];

  // Create placeholder SVG images for seed data
  const TONES = [
    ["#E9DED2", "#D9C6B4"],
    ["#E3E6DA", "#CBD3BC"],
    ["#EADCDC", "#D8BFC0"],
    ["#DEE4E1", "#C3D0CB"],
    ["#EBE1CF", "#D9C7A5"],
    ["#E1DFE8", "#C7C3D6"],
  ];

  const insertPhoto = db.prepare(
    "INSERT INTO photos (user_id, date, area, note, filename) VALUES (?, ?, ?, ?, ?)"
  );

  for (let i = 0; i < seedPhotos.length; i++) {
    const p = seedPhotos[i];
    const tone = TONES[i % TONES.length];
    const filename = `seed_${i + 1}.svg`;
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${tone[0]}"/>
      <stop offset="100%" style="stop-color:${tone[1]}"/>
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="url(#g)" rx="8"/>
  <text x="200" y="200" text-anchor="middle" dominant-baseline="middle"
        font-family="sans-serif" font-size="14" fill="#FFFFFF" opacity="0.6">
    ${p.date}
  </text>
</svg>`;
    fs.writeFileSync(path.join(UPLOADS_DIR, filename), svgContent);
    insertPhoto.run(userId, p.date, p.area, p.note, filename);
  }

  console.log("✓ Seeded demo user (demo@skintrack.com / password123) with 12 photos");
}

seedDemoData();

/* ---------------------------------------------------------
   Email dispatcher (Resend API or Nodemailer SMTP)
--------------------------------------------------------- */
let mailTransporter = null;

async function getMailTransporter() {
  if (mailTransporter) return mailTransporter;

  const smtpUser = process.env.SMTP_USER ? process.env.SMTP_USER.trim() : "";
  const smtpPass = process.env.SMTP_PASS ? process.env.SMTP_PASS.trim() : "";
  const smtpHost = process.env.SMTP_HOST ? process.env.SMTP_HOST.trim() : "";
  const smtpPort = Number(process.env.SMTP_PORT) || 587;

  if (smtpUser && smtpPass) {
    const isGmail = smtpHost === "smtp.gmail.com" || smtpUser.endsWith("@gmail.com");
    if (isGmail) {
      mailTransporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });
      console.log(`✓ Real Gmail SMTP transporter configured for ${smtpUser}`);
    } else {
      mailTransporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });
      console.log(`✓ Real SMTP transporter configured with ${smtpHost}:${smtpPort} (${smtpUser})`);
    }
  } else {
    // Development: use Ethereal (free fake SMTP)
    const testAccount = await nodemailer.createTestAccount();
    mailTransporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log("✓ Ethereal test email account created:", testAccount.user);
  }

  return mailTransporter;
}

async function dispatchEmail({ to, subject, html }) {
  let resendError = null;

  // Option 1: Resend HTTP API (works on cloud hosts where SMTP ports might be blocked)
  if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.RESEND_API_KEY.trim()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM || "SkinTrack <onboarding@resend.dev>",
          to: [to],
          subject,
          html,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        console.log(`✉️ Email successfully dispatched via Resend API to ${to} (ID: ${data.id})`);
        return { id: data.id, provider: "resend" };
      } else {
        resendError = data.message || `Resend error (${res.status})`;
        console.warn(`⚠️ Resend API notice: ${resendError}. Attempting SMTP delivery...`);
      }
    } catch (err) {
      resendError = err.message;
      console.warn(`⚠️ Resend fetch failed: ${err.message}. Attempting SMTP delivery...`);
    }
  }

  // Option 2: Nodemailer SMTP (Gmail / Custom SMTP / Ethereal)
  const transporter = await getMailTransporter();
  const info = await transporter.sendMail({
    from: process.env.SMTP_USER ? `"SkinTrack" <${process.env.SMTP_USER.trim()}>` : '"SkinTrack" <noreply@skintrack.app>',
    to,
    subject,
    html,
  });
  console.log(`✉️ Email successfully dispatched via SMTP to ${to} (MessageId: ${info.messageId})`);
  return { id: info.messageId, provider: "smtp" };
}

/* ---------------------------------------------------------
   Multer (file upload)
--------------------------------------------------------- */
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || ".jpg";
    cb(null, `photo_${Date.now()}_${crypto.randomUUID().slice(0, 8)}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"));
  },
});

/* ---------------------------------------------------------
   Auth middleware
--------------------------------------------------------- */
function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  try {
    const payload = jwt.verify(header.slice(7), JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

/* ---------------------------------------------------------
   Express app
--------------------------------------------------------- */
const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(UPLOADS_DIR));

/* ---------- Auth routes ---------- */

// Signup
app.post("/api/auth/signup", (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }

  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (existing) {
    return res.status(409).json({ error: "Email already registered" });
  }

  const hash = bcrypt.hashSync(password, 10);
  const result = db.prepare("INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)").run(
    email,
    hash,
    name || "You"
  );

  const token = jwt.sign({ userId: result.lastInsertRowid }, JWT_SECRET, { expiresIn: "7d" });
  res.status(201).json({
    token,
    user: { id: result.lastInsertRowid, email, name: name || "You", avatar: "" },
  });
});

// Login
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
  res.json({
    token,
    user: { id: user.id, email: user.email, name: user.name, avatar: user.avatar || "" },
  });
});

// Google Sign-In
app.post("/api/auth/google", (req, res) => {
  const { email, name, sub } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Google email is required" });
  }

  const cleanEmail = email.trim().toLowerCase();
  let user = db.prepare("SELECT * FROM users WHERE email = ?").get(cleanEmail);

  if (!user) {
    const defaultName = name || cleanEmail.split("@")[0];
    const dummyHash = bcrypt.hashSync("google_oauth_" + (sub || Date.now()), 10);
    const result = db.prepare(
      "INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)"
    ).run(cleanEmail, dummyHash, defaultName);
    user = db.prepare("SELECT * FROM users WHERE id = ?").get(result.lastInsertRowid);
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "30d" });
  console.log(`✓ User signed in via Google: ${user.email} (ID: ${user.id})`);
  res.json({
    token,
    user: { id: user.id, email: user.email, name: user.name, avatar: user.avatar || "" },
  });
});

// Get current user
app.get("/api/auth/me", authMiddleware, (req, res) => {
  const user = db.prepare("SELECT id, email, name, avatar, created_at FROM users WHERE id = ?").get(req.userId);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ user: { ...user, avatar: user.avatar || "" } });
});

// Upload profile avatar
app.post("/api/auth/avatar", authMiddleware, upload.single("avatar"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Avatar image file is required" });
  }

  const avatarUrl = `/uploads/${req.file.filename}`;
  db.prepare("UPDATE users SET avatar = ? WHERE id = ?").run(avatarUrl, req.userId);
  const user = db.prepare("SELECT id, email, name, avatar, created_at FROM users WHERE id = ?").get(req.userId);

  console.log(`✓ Updated profile picture for user ${user.email}`);
  res.json({ user });
});

// Delete/reset profile avatar
app.delete("/api/auth/avatar", authMiddleware, (req, res) => {
  db.prepare("UPDATE users SET avatar = '' WHERE id = ?").run(req.userId);
  const user = db.prepare("SELECT id, email, name, avatar, created_at FROM users WHERE id = ?").get(req.userId);
  console.log(`✓ Removed profile picture for user ${user.email}`);
  res.json({ user });
});

// Delete account (Permanent removal of user, photos, and files)
app.delete("/api/auth/account", authMiddleware, (req, res) => {
  const userId = req.userId;
  const user = db.prepare("SELECT id, email FROM users WHERE id = ?").get(userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  // Delete all user's uploaded photo files from disk
  const userPhotos = db.prepare("SELECT filename FROM photos WHERE user_id = ?").all(userId);
  for (const p of userPhotos) {
    if (!p.filename.startsWith("seed_")) {
      const filePath = path.join(UPLOADS_DIR, p.filename);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (err) {
          console.warn("Could not delete file during account deletion:", err.message);
        }
      }
    }
  }

  // Delete database records
  db.prepare("DELETE FROM photos WHERE user_id = ?").run(userId);
  db.prepare("DELETE FROM reset_tokens WHERE user_id = ?").run(userId);
  db.prepare("DELETE FROM user_settings WHERE user_id = ?").run(userId);
  db.prepare("DELETE FROM users WHERE id = ?").run(userId);

  console.log(`✓ Permanently deleted account and all data for user ${user.email} (ID: ${userId})`);
  res.json({ message: "Account and all associated photos permanently deleted" });
});

// Forgot password (request reset link)
app.post("/api/auth/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  const cleanEmail = email.trim().toLowerCase();
  const user = db.prepare("SELECT id, email FROM users WHERE LOWER(email) = LOWER(?)").get(cleanEmail);
  if (!user) {
    console.log(`ℹ️ [Password Reset] No user found for: ${cleanEmail}`);
    return res.status(404).json({
      error: "No account found with this email address. Please create an account via Sign Up first.",
    });
  }

  // Invalidate any existing tokens
  db.prepare("UPDATE reset_tokens SET used = 1 WHERE user_id = ? AND used = 0").run(user.id);

  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 3600000).toISOString(); // 1 hour

  db.prepare("INSERT INTO reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)").run(
    user.id,
    token,
    expiresAt
  );

  let baseUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  if (baseUrl === "production") {
    baseUrl = "https://skintracker-36iu.onrender.com";
  } else if (!baseUrl.startsWith("http://") && !baseUrl.startsWith("https://")) {
    baseUrl = `https://${baseUrl}`;
  }

  const resetLink = `${baseUrl}/?resetToken=${token}`;

  console.log(`\n========================================`);
  console.log(`🔑 [Password Reset] Link generated for ${user.email}:`);
  console.log(`🔗 ${resetLink}`);
  console.log(`========================================\n`);

  let emailSent = false;
  let emailError = null;
  try {
    await dispatchEmail({
      to: user.email,
      subject: "Reset your SkinTrack password",
      html: `
        <div style="font-family: 'Inter', sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
          <div style="width: 34px; height: 34px; border-radius: 10px; background: linear-gradient(155deg, #3F6B57 0%, #2E5342 100%); margin-bottom: 24px; display: flex; align-items: center; justify-content: center;">
            <div style="width: 12px; height: 12px; border-radius: 50%; background: #B97D82;"></div>
          </div>
          <h1 style="color: #26281F; font-size: 20px; font-weight: 700; margin: 0 0 8px;">Reset your password</h1>
          <p style="color: #6E7268; font-size: 14px; line-height: 1.6;">
            We received a request to reset your SkinTrack password. Click the button below to choose a new one.
            This link expires in 1 hour.
          </p>
          <a href="${resetLink}"
             style="display: inline-block; margin-top: 20px; padding: 14px 32px; background: #3F6B57; color: #FFFFFF; text-decoration: none; border-radius: 16px; font-weight: 600; font-size: 14px;">
            Reset password
          </a>
          <p style="color: #9A9C93; font-size: 12px; margin-top: 24px; line-height: 1.5;">
            If you didn't request this, you can safely ignore this email.
          </p>
        </div>
      `,
    });
    emailSent = true;
  } catch (err) {
    emailError = err.message;
    console.error("⚠️ Failed to dispatch reset email:", err.message);
  }

  res.json({
    message: `A password reset link has been sent to ${user.email}. Please check your inbox and spam folder.`,
    emailSent,
  });
});

// Reset password
app.post("/api/auth/reset-password", (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    return res.status(400).json({ error: "Token and new password are required" });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }

  const resetToken = db.prepare(
    "SELECT * FROM reset_tokens WHERE token = ? AND used = 0"
  ).get(token);

  if (!resetToken) {
    return res.status(400).json({ error: "Invalid or already-used reset token" });
  }

  if (new Date(resetToken.expires_at) < new Date()) {
    return res.status(400).json({ error: "Reset token has expired" });
  }

  const hash = bcrypt.hashSync(newPassword, 10);
  db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(hash, resetToken.user_id);
  db.prepare("UPDATE reset_tokens SET used = 1 WHERE id = ?").run(resetToken.id);

  res.json({ message: "Password has been reset. You can now log in." });
});

/* ---------- Photo routes ---------- */

// List photos
app.get("/api/photos", authMiddleware, (req, res) => {
  const photos = db.prepare(
    "SELECT id, date, area, note, filename, created_at FROM photos WHERE user_id = ? ORDER BY date DESC, id DESC"
  ).all(req.userId);

  const result = photos.map((p) => ({
    ...p,
    imageUrl: `/uploads/${p.filename}`,
  }));

  res.json({ photos: result });
});

// Get single photo
app.get("/api/photos/:id", authMiddleware, (req, res) => {
  const photo = db.prepare(
    "SELECT id, date, area, note, filename, created_at FROM photos WHERE id = ? AND user_id = ?"
  ).get(req.params.id, req.userId);

  if (!photo) return res.status(404).json({ error: "Photo not found" });

  res.json({ photo: { ...photo, imageUrl: `/uploads/${photo.filename}` } });
});

// Upload photo
app.post("/api/photos", authMiddleware, upload.single("image"), (req, res) => {
  const { area, note, date } = req.body;

  if (!req.file) {
    return res.status(400).json({ error: "Image file is required" });
  }
  if (!area) {
    return res.status(400).json({ error: "Area is required" });
  }

  const photoDate = date || new Date().toISOString().slice(0, 10);

  const result = db.prepare(
    "INSERT INTO photos (user_id, date, area, note, filename) VALUES (?, ?, ?, ?, ?)"
  ).run(req.userId, photoDate, `Face — ${area}`, note || "", req.file.filename);

  const photo = db.prepare("SELECT * FROM photos WHERE id = ?").get(result.lastInsertRowid);

  res.status(201).json({
    photo: {
      id: photo.id,
      date: photo.date,
      area: photo.area,
      note: photo.note,
      filename: photo.filename,
      imageUrl: `/uploads/${photo.filename}`,
      created_at: photo.created_at,
    },
  });
});

// Delete photo
app.delete("/api/photos/:id", authMiddleware, (req, res) => {
  const photoId = Number(req.params.id) || req.params.id;
  const photo = db.prepare("SELECT * FROM photos WHERE id = ? AND user_id = ?").get(
    photoId,
    req.userId
  );

  if (!photo) {
    console.warn(`[Delete Photo] Photo ${photoId} not found for user ${req.userId}`);
    return res.status(404).json({ error: "Photo not found or already deleted" });
  }

  // Delete file from disk if not a seed file
  if (!photo.filename.startsWith("seed_")) {
    const filePath = path.join(UPLOADS_DIR, photo.filename);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.warn("Could not remove file:", err.message);
      }
    }
  }

  db.prepare("DELETE FROM photos WHERE id = ?").run(photo.id);
  console.log(`✓ Deleted photo ${photo.id} (${photo.date} - ${photo.area}) for user ${req.userId}`);
  res.json({ message: "Photo deleted", id: photo.id });
});

/* ---------- Reminder routes ---------- */

// Get user reminder settings
app.get("/api/reminders/settings", authMiddleware, (req, res) => {
  let settings = db.prepare("SELECT * FROM user_settings WHERE user_id = ?").get(req.userId);
  if (!settings) {
    db.prepare("INSERT INTO user_settings (user_id) VALUES (?)").run(req.userId);
    settings = db.prepare("SELECT * FROM user_settings WHERE user_id = ?").get(req.userId);
  }
  res.json({ settings });
});

// Update user reminder settings
app.post("/api/reminders/settings", authMiddleware, (req, res) => {
  const { reminder_frequency, reminder_time, email_reminders, browser_reminders } = req.body;
  const existing = db.prepare("SELECT user_id FROM user_settings WHERE user_id = ?").get(req.userId);
  if (existing) {
    db.prepare(`
      UPDATE user_settings
      SET reminder_frequency = ?, reminder_time = ?, email_reminders = ?, browser_reminders = ?
      WHERE user_id = ?
    `).run(
      reminder_frequency || "Daily",
      reminder_time || "09:00",
      email_reminders !== undefined ? (email_reminders ? 1 : 0) : 1,
      browser_reminders !== undefined ? (browser_reminders ? 1 : 0) : 1,
      req.userId
    );
  } else {
    db.prepare(`
      INSERT INTO user_settings (user_id, reminder_frequency, reminder_time, email_reminders, browser_reminders)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      req.userId,
      reminder_frequency || "Daily",
      reminder_time || "09:00",
      email_reminders !== undefined ? (email_reminders ? 1 : 0) : 1,
      browser_reminders !== undefined ? (browser_reminders ? 1 : 0) : 1
    );
  }
  res.json({ message: "Reminder settings updated successfully" });
});

// Send instant reminder notification email
app.post("/api/reminders/send-email", authMiddleware, async (req, res) => {
  const user = db.prepare("SELECT id, email, name FROM users WHERE id = ?").get(req.userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  const appLink = `${FRONTEND_URL}/?openUpload=true`;

  try {
    await dispatchEmail({
      to: user.email,
      subject: "🌿 SkinTrack Reminder: Time to log today's photo!",
      html: `
        <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 500px; margin: 0 auto; padding: 32px 24px; background: #FAF9F6; border-radius: 24px; border: 1px solid #E7E4DA;">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px;">
            <div style="width: 36px; height: 36px; border-radius: 11px; background: linear-gradient(155deg, #3F6B57 0%, #2E5342 100%); display: flex; align-items: center; justify-content: center;">
              <div style="width: 12px; height: 12px; border-radius: 50%; background: #B97D82;"></div>
            </div>
            <span style="font-size: 18px; font-weight: 700; color: #26281F; letter-spacing: -0.01em;">SkinTrack</span>
          </div>
          
          <h1 style="color: #26281F; font-size: 22px; font-weight: 700; margin: 0 0 10px; line-height: 1.3;">
            Time for your skin check-in, ${user.name}! 📸
          </h1>
          
          <p style="color: #6E7268; font-size: 14px; line-height: 1.6; margin: 0 0 20px;">
            Taking regular photos under consistent lighting helps you clearly track how your skin responds to routines, products, and seasons over time.
          </p>

          <div style="background: #FFFFFF; border: 1px solid #E7E4DA; border-radius: 16px; padding: 16px; margin-bottom: 24px;">
            <div style="color: #3F6B57; font-weight: 600; font-size: 13px; margin-bottom: 4px;">
              💡 Quick Tracking Tip
            </div>
            <div style="color: #6E7268; font-size: 12px; line-height: 1.5;">
              Use natural, indirect morning light and the same camera angle for the most accurate comparison.
            </div>
          </div>
          
          <a href="${appLink}"
             style="display: inline-block; padding: 14px 28px; background: #3F6B57; color: #FFFFFF; text-decoration: none; border-radius: 16px; font-weight: 600; font-size: 14px; box-shadow: 0 4px 12px rgba(63, 107, 87, 0.25);">
            Open Camera & Log Photo →
          </a>
          
          <p style="color: #9A9C93; font-size: 12px; margin-top: 32px; line-height: 1.5; border-top: 1px solid #E7E4DA; padding-top: 16px;">
            You received this reminder because notifications are enabled in your SkinTrack profile settings.
          </p>
        </div>
      `,
    });

    res.json({ message: `Reminder notification email sent to ${user.email}` });
  } catch (err) {
    console.error("Failed to send reminder email:", err.message);
    res.status(500).json({ error: `Failed to send reminder email: ${err.message}` });
  }
});

/* ---------------------------------------------------------
   Serve static frontend in production
--------------------------------------------------------- */
const DIST_DIR = path.join(__dirname, "dist");
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
  // Express 5 compatible wildcard - serve index.html for all non-API routes
  app.use((req, res, next) => {
    if (req.path.startsWith("/api") || req.path.startsWith("/uploads")) {
      return next();
    }
    res.sendFile(path.join(DIST_DIR, "index.html"));
  });
}

/* ---------------------------------------------------------
   Start
--------------------------------------------------------- */
app.listen(PORT, () => {
  console.log(`\n  🌿 SkinTrack API running at http://localhost:${PORT}\n`);
});
