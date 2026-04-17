# SwiftPrint — Website Setup Guide

> **Fast & Secure Print** | Because time and privacy matter.

---

## 📁 File Structure

```
printsite/
├── index.html                  ← Main website (frontend)
├── package.json                ← Node.js dependencies
├── .env.example                ← Environment variables template
│
├── config/
│   └── contact.config.js       ← ⭐ EDIT THIS FIRST — all your contact/brand details
│
├── css/
│   └── styles.css              ← All styling (dark blue theme)
│
├── js/
│   └── main.js                 ← Animations, particles, interactions
│
├── backend/
│   └── server.js               ← Node.js + Express backend
│
└── assets/
    └── images/
        └── kiosk-photo.jpg     ← ⭐ ADD YOUR KIOSK PHOTO HERE
```

---

## ⭐ Quick Customization (5 minutes)

### Step 1 — Update your details
Open `config/contact.config.js` and edit:
- **Brand name** — your company name
- **Contact emails & phone**
- **Social media URLs**
- **Kiosk GPS coordinates** (latitude/longitude)
- **Kiosk address**

### Step 2 — Add your kiosk photo
Place your kiosk photo at:
```
assets/images/kiosk-photo.jpg
```
Then in `index.html`, find the kiosk photo section and:
1. Remove the `<div class="kiosk-photo-placeholder">` block
2. Uncomment the `<img>` tag above it

### Step 3 — Update the map
In `index.html`, find the `<iframe>` inside the map section and update the `src`:
```html
src="https://maps.google.com/maps?q=YOUR_LAT,YOUR_LNG&z=17&output=embed"
```
Replace `YOUR_LAT` and `YOUR_LNG` with your kiosk's GPS coordinates.

Also update the contact address text blocks in the HTML to match your real address.

---

## 🚀 Running the Website

### Option A — Static only (no contact form backend)
Just open `index.html` in a browser, or upload all files to any web host (Netlify, Vercel, cPanel, etc.).

The contact form will fall back to opening the user's email client if the backend isn't running.

### Option B — With contact form backend (Node.js)

**Prerequisites:** Node.js 18+ installed

```bash
# Install dependencies
npm install

# Copy and configure environment
cp .env.example .env
# Edit .env with your SMTP email credentials

# Start the server
npm start

# Development mode (auto-restart)
npm run dev
```

Server runs at `http://localhost:3000`

**Gmail SMTP setup:**
1. Go to Google Account → Security → 2-Step Verification → App passwords
2. Create an app password for "Mail"
3. Use that as `SMTP_PASS` in `.env`

---

## 🌐 Deployment

### Netlify / Vercel (static, no backend)
Upload everything except `backend/` and `package.json`. Contact form will use email fallback.

### VPS / DigitalOcean / Railway (with backend)
```bash
npm install
cp .env.example .env   # fill in your values
npm start
```
Use PM2 for production:
```bash
npm install -g pm2
pm2 start backend/server.js --name swiftprint
pm2 save
```

### cPanel shared hosting
Upload all files via File Manager or FTP. The site works as a static site without the Node.js backend.

---

## 🎨 Theme Customization

All colors are CSS variables in `css/styles.css` under `:root {}`.
Main colors to change if you want a different accent:
```css
--blue-primary:  #0057ff;   /* Main blue */
--blue-electric: #00d4ff;   /* Neon blue */
--accent-cyan:   #00e5ff;   /* Cyan accent */
```

---

## 📋 Sections in index.html

| Section | ID | Description |
|---|---|---|
| Navbar | `#navbar` | Fixed top navigation |
| Hero | `#hero` | Full-screen hero with particles |
| Ticker | — | Scrolling info strip |
| How It Works | `#how-it-works` | 4-step process cards |
| Why Us | `#why-us` | Feature list with illustration |
| Comparison | `#comparison` | SwiftPrint vs traditional |
| Location | `#location` | Kiosk photo + Google Map |
| Contact | `#contact` | Form + contact details |
| Footer | `footer` | Links + copyright |
