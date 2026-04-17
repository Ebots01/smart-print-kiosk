/* ============================================================
   SWIFTPRINT — MAIN.JS
   Animations, particles, scroll effects, interactions
   ============================================================ */

"use strict";

// ── LOADER ──────────────────────────────────────────────────
window.addEventListener("load", () => {
  setTimeout(() => {
    const loader = document.getElementById("loader");
    if (loader) loader.classList.add("hidden");
  }, 1900);
});

// ── CUSTOM CURSOR ────────────────────────────────────────────
const cursorDot  = document.querySelector(".cursor-dot");
const cursorRing = document.querySelector(".cursor-ring");
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener("mousemove", e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (cursorDot) {
    cursorDot.style.left = mouseX + "px";
    cursorDot.style.top  = mouseY + "px";
  }
});

function animateCursor() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  if (cursorRing) {
    cursorRing.style.left = ringX + "px";
    cursorRing.style.top  = ringY + "px";
  }
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll("a, button, .step-card, .feature-item, .social-pill").forEach(el => {
  el.addEventListener("mouseenter", () => cursorRing?.classList.add("hover"));
  el.addEventListener("mouseleave", () => cursorRing?.classList.remove("hover"));
});

// ── SCROLL PROGRESS BAR ──────────────────────────────────────
const scrollBar = document.getElementById("scroll-bar");
window.addEventListener("scroll", () => {
  const total  = document.body.scrollHeight - window.innerHeight;
  const pct    = (window.scrollY / total) * 100;
  if (scrollBar) scrollBar.style.width = pct + "%";
}, { passive: true });

// ── NAVBAR SCROLL ────────────────────────────────────────────
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 50);
}, { passive: true });

// ── MOBILE NAV ───────────────────────────────────────────────
const hamburger = document.querySelector(".nav-hamburger");
const navLinks  = document.querySelector(".nav-links");

if (hamburger && navLinks) {
  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("open");
    const spans = hamburger.querySelectorAll("span");
    if (navLinks.classList.contains("open")) {
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
      hamburger.querySelectorAll("span").forEach(s => { s.style.transform = ""; s.style.opacity = ""; });
    })
  );
}

// ── PARTICLES CANVAS ─────────────────────────────────────────
(function initParticles() {
  const canvas = document.getElementById("particles-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener("resize", resize, { passive: true });

  const COUNT = window.innerWidth < 768 ? 40 : 80;

  for (let i = 0; i < COUNT; i++) {
    particles.push({
      x: Math.random() * 1000,
      y: Math.random() * 1000,
      r: Math.random() * 1.8 + 0.4,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      opacity: Math.random() * 0.5 + 0.15,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 150, 255, ${p.opacity})`;
      ctx.fill();
    });

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 100, 255, ${(1 - dist / 120) * 0.18})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

// ── SCROLL REVEAL ────────────────────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const delay = el.dataset.delay || 0;
      setTimeout(() => el.classList.add("visible"), Number(delay));
      observer.unobserve(el);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

// ── COUNTER ANIMATION ────────────────────────────────────────
function animateCounter(el, target, suffix) {
  let start = 0;
  const duration = 1800;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const pct = Math.min((timestamp - start) / duration, 1);
    const ease = 1 - Math.pow(1 - pct, 3); // ease out cubic
    el.textContent = Math.floor(ease * target);
    if (pct < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el    = entry.target;
      const value = parseInt(el.dataset.count, 10);
      const suf   = el.dataset.suffix || "";
      animateCounter(el, value, suf);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll(".stat-num").forEach(el => counterObserver.observe(el));

// ── TICKER DUPLICATION ───────────────────────────────────────
const track = document.querySelector(".ticker-track");
if (track) {
  track.innerHTML += track.innerHTML; // duplicate for seamless loop
}

// ── TYPED TAGLINE ────────────────────────────────────────────
const typedEl = document.getElementById("typed-sub");
if (typedEl) {
  const text = typedEl.getAttribute("data-text") || typedEl.textContent;
  typedEl.textContent = "";
  let i = 0;
  function typeNext() {
    if (i < text.length) {
      typedEl.textContent += text[i++];
      setTimeout(typeNext, 40);
    }
  }
  setTimeout(typeNext, 1400);
}

// ── CONTACT FORM HANDLER ─────────────────────────────────────
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector(".btn-submit");
    btn.textContent = "Sending...";
    btn.disabled = true;

    const data = {
      name:    contactForm.name?.value || "",
      email:   contactForm.email?.value || "",
      phone:   contactForm.phone?.value || "",
      subject: contactForm.subject?.value || "",
      message: contactForm.message?.value || "",
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        contactForm.style.display = "none";
        document.getElementById("form-success").style.display = "block";
      } else {
        btn.textContent = "Try Again";
        btn.disabled = false;
        alert("Something went wrong. Please email us directly.");
      }
    } catch {
      // Fallback: open email client
      const body = `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\nMessage: ${data.message}`;
      window.location.href = `mailto:hello@swiftprint.in?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(body)}`;
      btn.textContent = "Send Message";
      btn.disabled = false;
    }
  });
}

// ── GLITCH EFFECT on Logo ────────────────────────────────────
const glitchEl = document.querySelector(".hero-title .line-blue");
if (glitchEl) {
  setInterval(() => {
    glitchEl.style.textShadow = `
      ${(Math.random() - 0.5) * 6}px 0 rgba(0, 212, 255, 0.8),
      ${(Math.random() - 0.5) * 6}px 0 rgba(0, 87, 255, 0.6)
    `;
    setTimeout(() => {
      glitchEl.style.textShadow = "";
    }, 120);
  }, 3000);
}
