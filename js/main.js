/* ============================================================
   ONE TAP PRINT — MAIN.JS (v2)
   Custom cursor · Particles · Counter · Navbar · Mobile · Form
   ============================================================ */

"use strict";

/* ── LOAD CONFIG ─────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  if (typeof SITE_CONFIG !== "undefined") {
    const s = SITE_CONFIG;

    // Location
    const setText = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    const setHref = (id, val) => { const el = document.getElementById(id); if (el) el.href = val; };

    setText("conf-loc-title",   s.location.title);
    setText("conf-loc-address", s.location.address);
    setText("conf-loc-hours",   s.location.hours);
    const mapFrame = document.getElementById("conf-loc-map");
    if (mapFrame) mapFrame.src = s.location.mapEmbedUrl;
    setHref("conf-loc-btn",     s.location.mapEmbedUrl.replace("output=embed", "output=html"));

    // Contact
    const emailCard = document.getElementById("conf-email-card");
    if (emailCard) emailCard.href = "mailto:" + s.contact.email;
    setText("conf-email", s.contact.email);

    const phoneCard = document.getElementById("conf-phone-card");
    if (phoneCard) phoneCard.href = s.contact.whatsappLink;
    setText("conf-phone", s.contact.phone);

    // Social
    setHref("conf-insta", s.social.instagram);
    setHref("conf-twit",  s.social.twitter);
    setHref("conf-link",  s.social.linkedin);
  }
});

/* ── CUSTOM CURSOR ──────────────────────────────────────────── */
const cursorDot  = document.getElementById("cursor-dot");
const cursorRing = document.getElementById("cursor-ring");

if (cursorDot && cursorRing && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener("mousemove", e => {
    mx = e.clientX; my = e.clientY;
    cursorDot.style.left = mx + "px";
    cursorDot.style.top  = my + "px";
  }, { passive: true });

  (function animateRing() {
    rx += (mx - rx) * 0.11;
    ry += (my - ry) * 0.11;
    cursorRing.style.left = rx + "px";
    cursorRing.style.top  = ry + "px";
    requestAnimationFrame(animateRing);
  })();

  document.querySelectorAll("a, button, .step-card, .feat-card, .contact-card").forEach(el => {
    el.addEventListener("mouseenter", () => cursorRing.classList.add("hover"));
    el.addEventListener("mouseleave", () => cursorRing.classList.remove("hover"));
  });
}

/* ── NAVBAR SCROLL + PROGRESS ───────────────────────────────── */
const navbar      = document.getElementById("navbar");
const navProgress = document.getElementById("nav-progress");

window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 40);

  if (navProgress) {
    const total = document.body.scrollHeight - window.innerHeight;
    navProgress.style.width = ((window.scrollY / total) * 100) + "%";
  }
}, { passive: true });

/* ── MOBILE MENU ────────────────────────────────────────────── */
const hamburger = document.querySelector(".hamburger");
const mobileMenu = document.getElementById("mobile-menu");

if (hamburger && mobileMenu) {
  const spans = hamburger.querySelectorAll("span");

  hamburger.addEventListener("click", () => {
    const open = mobileMenu.classList.toggle("open");
    hamburger.setAttribute("aria-expanded", open);
    mobileMenu.setAttribute("aria-hidden", !open);

    if (open) {
      spans[0].style.cssText = "transform: translateY(7px) rotate(45deg)";
      spans[1].style.opacity = "0";
      spans[2].style.cssText = "transform: translateY(-7px) rotate(-45deg)";
    } else {
      spans.forEach(s => s.style.cssText = "");
    }
  });

  mobileMenu.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      mobileMenu.setAttribute("aria-hidden", "true");
      hamburger.setAttribute("aria-expanded", "false");
      spans.forEach(s => s.style.cssText = "");
    });
  });
}

/* ── SCROLL REVEAL ──────────────────────────────────────────── */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: "0px 0px -60px 0px" });

document.querySelectorAll(".reveal").forEach(el => revealObs.observe(el));

/* ── PARTICLE SYSTEM ────────────────────────────────────────── */
(function initParticles() {
  const container = document.getElementById("hero-particles");
  if (!container) return;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  container.appendChild(canvas);

  let W, H, particles = [];
  const COUNT = window.innerWidth < 768 ? 35 : 70;

  function resize() {
    W = canvas.width  = container.offsetWidth;
    H = canvas.height = container.offsetHeight;
  }

  resize();
  window.addEventListener("resize", resize, { passive: true });

  for (let i = 0; i < COUNT; i++) {
    particles.push({
      x: Math.random() * 1000,
      y: Math.random() * 800,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.4 + 0.1,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(100, 255, 218, ${p.opacity})`;
      ctx.fill();
    });

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(100, 255, 218, ${(1 - dist / 130) * 0.12})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }
  draw();
})();

/* ── COUNTER ANIMATION ──────────────────────────────────────── */
function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

function animateCounter(el, target) {
  const duration = 1800;
  let startTime = null;

  function step(ts) {
    if (!startTime) startTime = ts;
    const prog = Math.min((ts - startTime) / duration, 1);
    el.textContent = Math.floor(easeOutCubic(prog) * target);
    if (prog < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}

const counterObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      if (!isNaN(target)) animateCounter(el, target);
      counterObs.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll(".hstat-num[data-target]").forEach(el => counterObs.observe(el));

/* ── TICKER DUPLICATION ─────────────────────────────────────── */
const tickerTrack = document.querySelector(".ticker-track");
if (tickerTrack && !tickerTrack.dataset.duped) {
  tickerTrack.innerHTML += tickerTrack.innerHTML;
  tickerTrack.dataset.duped = "1";
}

/* ── FOOTER YEAR ────────────────────────────────────────────── */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ── SMOOTH SCROLL WITH NAV OFFSET ─────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (href === "#") return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const offset = (navbar?.offsetHeight || 75) + 12;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  });
});

/* ── HERO ORBS PARALLAX (mouse) ─────────────────────────────── */
const orbs = document.querySelectorAll(".orb");
if (orbs.length && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  document.addEventListener("mousemove", e => {
    const x = (e.clientX / window.innerWidth - 0.5);
    const y = (e.clientY / window.innerHeight - 0.5);
    orbs.forEach((orb, i) => {
      const strength = (i + 1) * 12;
      const sign = i % 2 === 0 ? 1 : -1;
      orb.style.transform = `translate(${x * strength * sign}px, ${y * strength * sign}px)`;
    });
  }, { passive: true });
}

/* ── STEP CARDS STAGGER ON SCROLL ───────────────────────────── */
document.querySelectorAll(".step-card").forEach((card, i) => {
  card.style.transitionDelay = (0.08 * i) + "s";
});

/* ── CONTACT FORM ───────────────────────────────────────────── */
const contactForm = document.getElementById("contact-form");
const formSuccess = document.getElementById("form-success");

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector("button[type=submit]");

    const name    = contactForm.querySelector('input[name="name"]')?.value?.trim() || "";
    const email   = contactForm.querySelector('input[name="email"]')?.value?.trim() || "";
    const message = contactForm.querySelector('textarea[name="message"]')?.value?.trim() || "";

    if (!name || !email || !message) {
      showFormError("Please fill in all fields.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showFormError("Please enter a valid email address.");
      return;
    }

    btn.textContent = "Sending…";
    btn.disabled = true;

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (res.ok) {
        contactForm.hidden = true;
        if (formSuccess) formSuccess.hidden = false;
      } else {
        btn.textContent = "Try Again";
        btn.disabled = false;
        showFormError("Something went wrong. Email us directly.");
      }
    } catch {
      const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
      window.location.href = `mailto:hello@onetapprint.in?subject=Enquiry&body=${encodeURIComponent(body)}`;
      btn.textContent = "Send Message";
      btn.disabled = false;
    }
  });
}

function showFormError(msg) {
  let el = document.querySelector(".form-error");
  if (!el) {
    el = document.createElement("p");
    el.className = "form-error";
    el.style.cssText = "color:#f87171;font-size:0.84rem;";
    contactForm.insertBefore(el, contactForm.querySelector("button"));
  }
  el.textContent = msg;
  setTimeout(() => el?.remove(), 5000);
}
