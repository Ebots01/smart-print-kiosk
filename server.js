/**
 * ============================================================
 *  SWIFTPRINT — BACKEND SERVER (server.js)
 *  Node.js + Express
 *  Handles contact form submissions and serves static files
 *
 *  Install dependencies:  npm install
 *  Start server:          node server.js
 *  Production start:      npm start
 * ============================================================
 */

const express    = require("express");
const path       = require("path");
const nodemailer = require("nodemailer");
const rateLimit  = require("express-rate-limit");
const helmet     = require("helmet");
const cors       = require("cors");
require("dotenv").config();

const app  = express();
const PORT = process.env.PORT || 3000;

// ── SECURITY MIDDLEWARE ──────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc:  ["'self'", "https://fonts.googleapis.com"],
      styleSrc:   ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc:    ["'self'", "https://fonts.gstatic.com"],
      frameSrc:   ["https://maps.google.com"],
      imgSrc:     ["'self'", "data:", "https:"],
    },
  },
}));

app.use(cors({ origin: process.env.ALLOWED_ORIGIN || "*" }));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// ── RATE LIMITING ────────────────────────────────────────────
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,                    // 5 submissions per window per IP
  message: { error: "Too many requests. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// ── SERVE STATIC FRONTEND ────────────────────────────────────
app.use(express.static(path.join(__dirname, ".."))); // serves index.html & assets

// ── EMAIL TRANSPORTER ────────────────────────────────────────
// Configure via .env file (see .env.example)
const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST   || "smtp.gmail.com",
  port:   Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
  },
});

// ── CONTACT FORM ENDPOINT ────────────────────────────────────
app.post("/api/contact", contactLimiter, async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email and message are required." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email address." });
  }

  if (message.length > 2000) {
    return res.status(400).json({ error: "Message too long." });
  }

  try {
    const toAddress = process.env.CONTACT_EMAIL || "hello@swiftprint.in";

    // Send notification email to the business
    await transporter.sendMail({
      from:    `"SwiftPrint Website" <${process.env.SMTP_USER}>`,
      to:      toAddress,
      replyTo: email,
      subject: `[SwiftPrint Contact] ${subject || "New Enquiry"} — ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #010810; padding: 24px; border-radius: 8px 8px 0 0;">
            <h2 style="color: #00d4ff; margin: 0; font-size: 22px;">SwiftPrint — New Contact</h2>
          </div>
          <div style="background: #071628; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #0057ff33;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #aaa; width: 100px;">Name</td><td style="padding: 8px 0; color: #fff; font-weight: 600;">${name}</td></tr>
              <tr><td style="padding: 8px 0; color: #aaa;">Email</td><td style="padding: 8px 0; color: #1a8cff;">${email}</td></tr>
              <tr><td style="padding: 8px 0; color: #aaa;">Phone</td><td style="padding: 8px 0; color: #fff;">${phone || "—"}</td></tr>
              <tr><td style="padding: 8px 0; color: #aaa;">Subject</td><td style="padding: 8px 0; color: #fff;">${subject || "—"}</td></tr>
            </table>
            <hr style="border: none; border-top: 1px solid #0057ff33; margin: 16px 0;">
            <p style="color: #aaa; margin: 0 0 8px;">Message:</p>
            <p style="color: #fff; background: #010810; padding: 12px; border-radius: 4px; border-left: 3px solid #0057ff;">${message.replace(/\n/g, "<br>")}</p>
          </div>
        </div>
      `,
    });

    // Send confirmation email to the user
    await transporter.sendMail({
      from:    `"SwiftPrint" <${process.env.SMTP_USER}>`,
      to:      email,
      subject: "Thanks for reaching out — SwiftPrint",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #010810; padding: 24px; border-radius: 8px 8px 0 0;">
            <h2 style="color: #00d4ff; margin: 0;">SwiftPrint</h2>
            <p style="color: #666; margin: 4px 0 0; font-size: 12px;">FAST & SECURE PRINT</p>
          </div>
          <div style="background: #071628; padding: 24px; border-radius: 0 0 8px 8px;">
            <p style="color: #fff;">Hi <strong>${name}</strong>,</p>
            <p style="color: #aaa;">Thank you for contacting SwiftPrint. We've received your message and will get back to you within 24 hours.</p>
            <p style="color: #aaa;">For urgent matters, WhatsApp us directly.</p>
            <p style="color: #666; font-size: 12px; margin-top: 24px;">Because time and privacy matter.<br>— Team SwiftPrint</p>
          </div>
        </div>
      `,
    });

    return res.status(200).json({ success: true, message: "Message sent successfully!" });
  } catch (err) {
    console.error("Email error:", err.message);
    return res.status(500).json({ error: "Failed to send email. Please try again or email us directly." });
  }
});

// ── HEALTH CHECK ─────────────────────────────────────────────
app.get("/api/health", (_, res) => res.json({ status: "ok", uptime: process.uptime() }));

// ── 404 FALLBACK → index.html ────────────────────────────────
app.use((_, res) => res.sendFile(path.join(__dirname, "..", "index.html")));

// ── START SERVER ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n  🚀  SwiftPrint server running on http://localhost:${PORT}\n`);
});

module.exports = app;
