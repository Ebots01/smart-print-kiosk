/* ============================================================
   ONETAPPRINT — MAIN.JS
   Reads from SITE_CONFIG (config.js) and drives the whole page.
   ============================================================ */

"use strict";

/* ── 1. INJECT CONFIG INTO DOM ─────────────────────────────── */
(function applyConfig() {
  if (typeof SITE_CONFIG === "undefined") return;
  const C = SITE_CONFIG;

  // Page title & meta
  document.title = `${C.brand.name} — ${C.brand.tagline}`;

  // Location section
  _setText("loc-title",    C.location.title);
  _setText("loc-address",  C.location.address);
  _setText("loc-hours",    C.location.hours + " — Always Available");
  _setHref("loc-phone",    "tel:" + C.contact.phone, C.contact.phone);
  _setHref("loc-whatsapp", C.contact.whatsappLink, "Message us on WhatsApp →");

  // Map iframe
  const mapIframe = document.getElementById("map-iframe");
  if (mapIframe) mapIframe.src = C.location.mapEmbedUrl;
  _setText("map-label", `${C.brand.name} — ${C.location.title}`);

  // Contact cards
  _setHref("cc-email",         "mailto:" + C.contact.email,        C.contact.email);
  _setHref("cc-email-support",  "mailto:" + C.contact.emailSupport, C.contact.emailSupport);
  _setHref("cc-phone",          "tel:" + C.contact.phone,           C.contact.phone);
  if (C.contact.whatsappLink) {
    const wa = document.getElementById("cc-whatsapp");
    if (wa) wa.href = C.contact.whatsappLink;
  }
  _setText("cc-address", C.location.address);

  // Footer copyright
  _setText("footer-copy", `© ${C.brand.year} ${C.brand.name}. All rights reserved.`);

  // Social links — contact card
  const socialDefs = [
    { key: "instagram", icon: "📸", label: "Instagram" },
    { key: "twitter",   icon: "🐦", label: "Twitter / X" },
    { key: "linkedin",  icon: "💼", label: "LinkedIn" },
    { key: "youtube",   icon: "▶️", label: "YouTube" },
    { key: "facebook",  icon: "👤", label: "Facebook" },
  ];

  const socialRow = document.getElementById("social-row");
  if (socialRow) {
    socialRow.innerHTML = "";
    socialDefs.forEach(({ key, icon, label }) => {
      const url = C.social[key];
      if (!url) return;
      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.className = "social-pill";
      a.innerHTML = `${icon} ${label}`;
      socialRow.appendChild(a);
    });
  }

  // Footer social column
  const footerSocial = document.getElementById("footer-social-col");
  if (footerSocial) {
    footerSocial.innerHTML = "<h4>Connect</h4>";
    socialDefs.forEach(({ key, icon, label }) => {
      const url = C.social[key];
      if (!url) return;
      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = `${icon} ${label}`;
      footerSocial.appendChild(a);
    });
  }

  function _setText(id, text) {
    const el = document.getElementById(id);
    if (el && text) el.textContent = text;
  }
  function _setHref(id, href, text) {
    const el = document.getElementById(id);
    if (!el) return;
    if (href) el.href = href;
    if (text) {
      const span = el.querySelector("span");
      if (span) span.textContent = text;
      else if (!el.querySelector("div")) el.textContent = text;
    }
  }
})();

/* ── 2. LOADER ──────────────────────────────────────────────── */
window.addEventListener("load", () => {
  setTimeout(() => {
    const loader = document.getElementById("loader");
    if (loader) loader.classList.add("hidden");
  }, 1900);
});

/* ── 3. CUSTOM CURSOR ───────────────────────────────────────── */
const cursorDot  = document.querySelector(".cursor-dot");
const cursorRing = document.querySelector(".cursor-ring");
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener("mousemove", e => {
  mouseX = e.clientX; mouseY = e.clientY;
  if (cursorDot) {
    cursorDot.style.left = mouseX + "px";
    cursorDot.style.top  = mouseY + "px";
  }
});

(function animateCursor() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  if (cursorRing) {
    cursorRing.style.left = ringX + "px";
    cursorRing.style.top  = ringY + "px";
  }
  requestAnimationFrame(animateCursor);
})();

document.querySelectorAll("a, button, .step-card, .feature-item, .social-pill").forEach(el => {
  el.addEventListener("mouseenter", () => cursorRing?.classList.add("hover"));
  el.addEventListener("mouseleave", () => cursorRing?.classList.remove("hover"));
});

/* ── 4. SCROLL PROGRESS BAR ─────────────────────────────────── */
const scrollBar = document.getElementById("scroll-bar");
window.addEventListener("scroll", () => {
  const total = document.body.scrollHeight - window.innerHeight;
  if (scrollBar) scrollBar.style.width = ((window.scrollY / total) * 100) + "%";
}, { passive: true });

/* ── 5. NAVBAR SCROLL ───────────────────────────────────────── */
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 50);
}, { passive: true });

/* ── 6. MOBILE NAV ──────────────────────────────────────────── */
const hamburger = document.querySelector(".nav-hamburger");
const navLinks  = document.querySelector(".nav-links");

if (hamburger && navLinks) {
  hamburger.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    hamburger.setAttribute("aria-expanded", String(open));
    const spans = hamburger.querySelectorAll("span");
    if (open) {
      spans[0].style.transform = "translateY(7px) rotate(45deg)";
      spans[1].style.opacity   = "0";
      spans[2].style.transform = "translateY(-7px) rotate(-45deg)";
    } else {
      spans.forEach(s => { s.style.transform = ""; s.style.opacity = ""; });
    }
  });
  navLinks.querySelectorAll("a").forEach(a =>
    a.addEventListener("click", () => {
      navLinks.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
      hamburger.querySelectorAll("span").forEach(s => { s.style.transform = ""; s.style.opacity = ""; });
    })
  );
}

/* ── 7. PARTICLES CANVAS ────────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById("particles-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let W, H;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener("resize", resize, { passive: true });

  const COUNT = window.innerWidth < 768 ? 40 : 80;
  const particles = Array.from({ length: COUNT }, () => ({
    x:  Math.random() * 1200,
    y:  Math.random() * 900,
    r:  Math.random() * 1.8 + 0.4,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    o:  Math.random() * 0.5 + 0.15,
  }));

  (function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x = (p.x + p.vx + W) % W;
      p.y = (p.y + p.vy + H) % H;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,150,255,${p.o})`;
      ctx.fill();
    });
    // connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,100,255,${(1 - d / 120) * 0.18})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  })();
})();

/* ── 8. SCROLL REVEAL ───────────────────────────────────────── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    setTimeout(() => el.classList.add("visible"), Number(el.dataset.delay) || 0);
    revealObserver.unobserve(el);
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

/* ── 9. COUNTER ANIMATION ───────────────────────────────────── */
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el  = entry.target;
    const max = parseInt(el.dataset.count, 10);
    let start = null;
    (function tick(ts) {
      if (!start) start = ts;
      const pct  = Math.min((ts - start) / 1800, 1);
      const ease = 1 - Math.pow(1 - pct, 3);
      el.textContent = Math.floor(ease * max);
      if (pct < 1) requestAnimationFrame(tick);
      else el.textContent = max;
    })(performance.now());
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });

document.querySelectorAll(".stat-num").forEach(el => counterObserver.observe(el));

/* ── 10. TICKER DUPLICATION ─────────────────────────────────── */
const track = document.querySelector(".ticker-track");
if (track) track.innerHTML += track.innerHTML;

/* ── 11. TYPED TEXT ─────────────────────────────────────────── */
const typedEl = document.getElementById("typed-sub");
if (typedEl) {
  const text = typedEl.getAttribute("data-text") || typedEl.textContent;
  typedEl.textContent = "";
  let i = 0;
  const type = () => {
    if (i < text.length) { typedEl.textContent += text[i++]; setTimeout(type, 38); }
  };
  setTimeout(type, 1600);
}

/* ── 12. CONTACT FORM ───────────────────────────────────────── */
const form = document.getElementById("contact-form");
if (form) {
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const btn = form.querySelector(".btn-submit");
    btn.disabled = true;
    btn.innerHTML = "<span>⏳</span> Sending…";

    const data = {
      name:    form.name?.value    || "",
      email:   form.email?.value   || "",
      phone:   form.phone?.value   || "",
      subject: form.subject?.value || "",
      message: form.message?.value || "",
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        form.style.display = "none";
        document.getElementById("form-success").style.display = "block";
      } else { throw new Error("server"); }
    } catch {
      const to   = (typeof SITE_CONFIG !== "undefined") ? SITE_CONFIG.contact.email : "hello@onetapprint.in";
      const body = `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\nMessage: ${data.message}`;
      window.location.href = `mailto:${to}?subject=${encodeURIComponent(data.subject || "Enquiry")}&body=${encodeURIComponent(body)}`;
      btn.disabled = false;
      btn.innerHTML = "<span>✉️</span> Send Message";
    }
  });
}

/* ── 13. HERO GLITCH ────────────────────────────────────────── */
const glitchEl = document.querySelector(".hero-title .line-blue");
if (glitchEl) {
  setInterval(() => {
    glitchEl.style.textShadow = `
      ${(Math.random() - 0.5) * 8}px 0 rgba(0,212,255,.8),
      ${(Math.random() - 0.5) * 8}px 0 rgba(0,87,255,.6)`;
    setTimeout(() => { glitchEl.style.textShadow = ""; }, 110);
  }, 3200);
}
