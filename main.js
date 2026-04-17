"use strict";

/* ── LOAD CONFIG DATA ── */
document.addEventListener("DOMContentLoaded", () => {
  if (typeof SITE_CONFIG !== 'undefined') {
    // Populate Location
    document.getElementById('conf-loc-title').textContent = SITE_CONFIG.location.title;
    document.getElementById('conf-loc-address').textContent = SITE_CONFIG.location.address;
    document.getElementById('conf-loc-hours').textContent = SITE_CONFIG.location.hours;
    document.getElementById('conf-loc-map').src = SITE_CONFIG.location.mapEmbedUrl;
    document.getElementById('conf-loc-btn').href = SITE_CONFIG.location.mapEmbedUrl;

    // Populate Contact
    const emailEl = document.getElementById('conf-email');
    emailEl.textContent = SITE_CONFIG.contact.email;
    emailEl.href = "mailto:" + SITE_CONFIG.contact.email;

    const phoneEl = document.getElementById('conf-phone');
    phoneEl.textContent = SITE_CONFIG.contact.phone;
    phoneEl.href = SITE_CONFIG.contact.whatsappLink;

    // Populate Socials
    document.getElementById('conf-insta').href = SITE_CONFIG.social.instagram;
    document.getElementById('conf-twit').href = SITE_CONFIG.social.twitter;
    document.getElementById('conf-link').href = SITE_CONFIG.social.linkedin;
  }
});

/* ── NAVBAR SCROLL ── */
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  if (window.scrollY > 40) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

/* ── MOBILE MENU ── */
const hamburger = document.querySelector(".hamburger");
const mobileMenu = document.getElementById("mobile-menu");
const mobileLinks = mobileMenu.querySelectorAll("a");

if (hamburger && mobileMenu) {
  hamburger.addEventListener("click", () => {
    mobileMenu.classList.toggle("open");
  });

  mobileLinks.forEach(link => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
    });
  });
}

/* ── SCROLL REVEAL ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

/* ── FOOTER YEAR ── */
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

/* ── SMOOTH SCROLL OFFSET ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (href === "#") return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: "smooth" });
  });
});