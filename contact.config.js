/**
 * ============================================================
 *  PRINT KIOSK — CONTACT & LOCATION CONFIGURATION
 *  Edit this file to update all contact info, social links,
 *  kiosk location, and brand details across the entire site.
 * ============================================================
 */

const SITE_CONFIG = {

  // ── BRAND ──────────────────────────────────────────────────
  brand: {
    name: "SwiftPrint",           // Your company/kiosk name
    tagline: "Fast & Secure Print",
    subtagline: "Because time and privacy matter.",
    logo_text: "Swift",           // Text used in logo
    logo_accent: "Print",         // Accent part of logo
    established_year: "2024",
  },

  // ── CONTACT DETAILS ────────────────────────────────────────
  contact: {
    email_primary: "hello@swiftprint.in",       // Main contact email
    email_support: "support@swiftprint.in",     // Support email
    phone: "+91 98765 43210",                   // Contact phone
    whatsapp: "919876543210",                   // WhatsApp number (no + or spaces)
    address: "Ground Floor, Tech Hub Building, MG Road, Raipur, Chhattisgarh – 492001",
  },

  // ── SOCIAL MEDIA HANDLES ───────────────────────────────────
  social: {
    instagram: "https://instagram.com/swiftprint.in",   // Instagram profile URL
    twitter: "https://twitter.com/swiftprintin",         // Twitter/X profile URL
    linkedin: "https://linkedin.com/company/swiftprint", // LinkedIn page URL
    youtube: "https://youtube.com/@swiftprint",          // YouTube channel URL
    facebook: "https://facebook.com/swiftprintin",      // Facebook page URL
  },

  // ── KIOSK LOCATION (Google Maps) ───────────────────────────
  // Replace latitude and longitude with your exact kiosk coordinates
  // To find coordinates: Google Maps → right-click location → "What's here?"
  kiosk: {
    name: "SwiftPrint Kiosk — Raipur Main",
    address: "Tech Hub Building, MG Road, Raipur, CG",
    latitude: "21.2514",         // ← Replace with your exact latitude
    longitude: "81.6296",        // ← Replace with your exact longitude
    // Google Maps Embed URL — Replace the q= value with your coordinates
    // Format: https://maps.google.com/maps?q=LAT,LNG&z=17&output=embed
    embed_url: "https://maps.google.com/maps?q=21.2514,81.6296&z=17&output=embed",
    // Operating hours
    hours: "24 Hours / 7 Days",
  },

  // ── KIOSK PHOTO ────────────────────────────────────────────
  // Place your kiosk photo in /assets/images/ and update filename below
  kiosk_photo: {
    src: "assets/images/kiosk-photo.jpg",   // ← Replace with your kiosk image path
    alt: "SwiftPrint Kiosk Machine",
    // Fallback placeholder shown if image not yet added
    placeholder_text: "[ Place your kiosk photo here ]\nUpdate src in config/contact.config.js",
  },

  // ── STATS (shown in hero section) ──────────────────────────
  stats: [
    { value: "60", suffix: "sec", label: "Print Time" },
    { value: "100", suffix: "%", label: "Secure & Encrypted" },
    { value: "24", suffix: "/7", label: "Always Open" },
  ],
};

// Export for use in main.js
if (typeof module !== "undefined") module.exports = SITE_CONFIG;
