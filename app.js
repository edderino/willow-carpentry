// Willow Carpentry — interactions. Dependency-free (no CDN), so the page can
// never be left blank by a failed import. Reveals use IntersectionObserver with
// a hard fail-safe; everything degrades to fully-visible.
import { IMAGES, GALLERY } from "./images.js";

window.__willowRevealed = true;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Gallery: rendered from the single source of truth (images.js) ----------
   Each image appears once; add/remove gallery images by editing GALLERY there. */
const galleryEl = document.querySelector(".gallery");
if (galleryEl) {
  galleryEl.innerHTML = GALLERY.map((key) => {
    const im = IMAGES[key];
    if (!im) {
      // placeholder tile for further work not yet photographed
      return `<div class="g-item g-ph" aria-hidden="true"><span>More work<br>coming soon</span></div>`;
    }
    return (
      `<button class="g-item" type="button" aria-label="View larger: ${im.alt}">` +
      `<img src="${im.src}" alt="${im.alt}" loading="lazy" />` +
      `<span class="g-cap">${im.cap}</span></button>`
    );
  }).join("");
}

/* ---------- Nav background on scroll ---------- */
const nav = document.getElementById("nav");
const onScroll = () => nav && nav.classList.toggle("scrolled", window.scrollY > 40);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

/* ---------- Mobile menu ---------- */
const burger = document.getElementById("burger");
const menu = document.getElementById("mobileMenu");
const toggleMenu = (open) => {
  menu.classList.toggle("open", open);
  burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  burger.setAttribute("aria-expanded", String(open));
  document.body.style.overflow = open ? "hidden" : "";
};
if (burger && menu) {
  burger.addEventListener("click", () => toggleMenu(!menu.classList.contains("open")));
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => toggleMenu(false)));
}

/* ---------- Scroll reveals (robust) ----------
   Default state hides [data-reveal]; we add .is-in to show. If anything goes
   wrong (or reduced motion), revealAll() guarantees visibility. */
const reveals = Array.from(document.querySelectorAll("[data-reveal]"));
const revealAll = () => reveals.forEach((el) => el.classList.add("is-in"));

if (reduceMotion || !("IntersectionObserver" in window)) {
  revealAll();
} else {
  const io = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );
  reveals.forEach((el) => io.observe(el));
  // Reveal anything already in view on first paint (above the fold / tall viewports).
  requestAnimationFrame(() =>
    reveals.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) el.classList.add("is-in");
    })
  );
  // Hard fail-safe: nothing stays invisible past 1.6s no matter what.
  setTimeout(revealAll, 1600);
}

/* ---------- Hero background parallax (transform-only) ---------- */
if (!reduceMotion) {
  const heroBg = document.querySelector(".hero-bg img");
  if (heroBg) {
    let ticking = false;
    const parallax = () => {
      const y = Math.min(window.scrollY, window.innerHeight) * 0.16;
      heroBg.style.transform = `scale(1.06) translate3d(0, ${y}px, 0)`;
      ticking = false;
    };
    window.addEventListener(
      "scroll",
      () => { if (!ticking) { requestAnimationFrame(parallax); ticking = true; } },
      { passive: true }
    );
    parallax();
  }
}

/* ---------- Gallery lightbox (click + keyboard) ---------- */
const lightbox = document.getElementById("lightbox");
const lbImg = document.getElementById("lbImg");
const lbClose = document.getElementById("lbClose");
let lastFocused = null;

const openLb = (img) => {
  lastFocused = document.activeElement;
  lbImg.src = img.src;
  lbImg.alt = img.alt;
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  lbClose.focus();
};
const closeLb = () => {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  lbImg.src = "";
  if (lastFocused) lastFocused.focus();
};

document.querySelectorAll(".gallery .g-item").forEach((btn) => {
  const img = btn.querySelector("img");
  if (!img) return; // placeholder tile — no lightbox
  btn.addEventListener("click", () => openLb(img));
});
if (lightbox) {
  lbClose.addEventListener("click", closeLb);
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLb(); });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("open")) closeLb();
  });
}

/* ---------- Smooth anchor offset for fixed nav ---------- */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    if (id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - 62,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  });
});
