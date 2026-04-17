/* ============================================================
   ONE TAP PRINT — MAIN.JS
   Scroll reveal · Navbar · Counter · Mobile menu · Form
   ============================================================ */

"use strict";

/* ── NAVBAR SCROLL ──────────────────────────────────────────── */
const navbar = document.getElementById("navbar");
let lastScrollY = 0;

window.addEventListener("scroll", () => {
  const y = window.scrollY;
  navbar.classList.toggle("scrolled", y > 40);
  lastScrollY = y;
}, { passive: true });

/* ── MOBILE MENU ────────────────────────────────────────────── */
const hamburger = document.querySelector(".hamburger");
const mobileMenu = document.getElementById("mobile-menu");

if (hamburger && mobileMenu) {
  hamburger.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("open");
    hamburger.setAttribute("aria-expanded", isOpen);
    mobileMenu.setAttribute("aria-hidden", !isOpen);

    const [s1, , s3] = hamburger.querySelectorAll("span");
    if (isOpen) {
      s1.style.cssText = "transform: translateY(7px) rotate(45deg)";
      hamburger.querySelectorAll("span")[1].style.opacity = "0";
      s3.style.cssText = "transform: translateY(-7px) rotate(-45deg)";
    } else {
      hamburger.querySelectorAll("span").forEach(s => s.style.cssText = "");
    }
  });

  mobileMenu.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      mobileMenu.setAttribute("aria-hidden", "true");
      hamburger.setAttribute("aria-expanded", "false");
      hamburger.querySelectorAll("span").forEach(s => s.style.cssText = "");
    });
  });
}

/* ── SCROLL REVEAL ──────────────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: "0px 0px -60px 0px" });

document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

/* ── COUNTER ANIMATION ──────────────────────────────────────── */
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function animateCounter(el, target, suffix = "") {
  const duration = 1600;
  let startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const value = Math.floor(easeOutCubic(progress) * target);
    el.textContent = value + suffix;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target + suffix;
  }

  requestAnimationFrame(step);
}

/* Hero stats counter */
const heroStatObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const unit = el.nextElementSibling?.textContent || "";
      animateCounter(el, target);
      heroStatObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll(".stat-num").forEach(el => heroStatObserver.observe(el));

/* Big card stat counter */
const bigStatObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || "";
      animateCounter(el, target, suffix);
      bigStatObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll(".big-stat-num").forEach(el => bigStatObserver.observe(el));

/* ── TICKER ─────────────────────────────────────────────────── */
// Ticker runs via pure CSS; this just ensures it's duplicated for seamless loop
const tickerTrack = document.querySelector(".ticker-track");
if (tickerTrack && !tickerTrack.dataset.duplicated) {
  tickerTrack.innerHTML += tickerTrack.innerHTML;
  tickerTrack.dataset.duplicated = "true";
}

/* ── FOOTER YEAR ────────────────────────────────────────────── */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ── SMOOTH SCROLL OFFSET (for fixed nav) ───────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (href === "#") return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const navHeight = navbar?.offsetHeight || 72;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
    window.scrollTo({ top, behavior: "smooth" });
  });
});

/* ── CONTACT FORM ───────────────────────────────────────────── */
const contactForm = document.getElementById("contact-form");
const formSuccess = document.getElementById("form-success");

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector(".btn-submit");

    const data = {
      name:    contactForm.name?.value?.trim() || "",
      email:   contactForm.email?.value?.trim() || "",
      subject: contactForm.subject?.value?.trim() || "",
      message: contactForm.message?.value?.trim() || "",
    };

    if (!data.name || !data.email || !data.message) {
      showFormError("Please fill in your name, email, and message.");
      return;
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
    if (!emailOk) {
      showFormError("Please enter a valid email address.");
      return;
    }

    btn.textContent = "Sending…";
    btn.disabled = true;

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        contactForm.hidden = true;
        if (formSuccess) formSuccess.hidden = false;
      } else {
        btn.innerHTML = "Try Again";
        btn.disabled = false;
        showFormError("Something went wrong. Try emailing us directly.");
      }
    } catch {
      // Fallback: open email client
      const body = `Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}`;
      window.location.href =
        `mailto:hello@onetapprint.in?subject=${encodeURIComponent(data.subject || "Enquiry")}&body=${encodeURIComponent(body)}`;
      btn.innerHTML = "Send Message";
      btn.disabled = false;
    }
  });
}

function showFormError(msg) {
  let errEl = contactForm.querySelector(".form-error");
  if (!errEl) {
    errEl = document.createElement("p");
    errEl.className = "form-error";
    errEl.style.cssText = "color:#f87171;font-size:0.85rem;margin-top:-0.5rem;";
    contactForm.insertBefore(errEl, contactForm.querySelector(".btn-submit"));
  }
  errEl.textContent = msg;
  setTimeout(() => errEl?.remove(), 5000);
}

/* ── SUBTLE PARALLAX on hero orbs (mouse move) ──────────────── */
const orb1 = document.querySelector(".orb-1");
const orb2 = document.querySelector(".orb-2");

if (orb1 && orb2 && window.matchMedia("(pointer: fine)").matches) {
  document.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    orb1.style.transform = `translate(${x * 0.6}px, ${y * 0.6}px)`;
    orb2.style.transform = `translate(${-x * 0.4}px, ${-y * 0.4}px)`;
  }, { passive: true });
}
