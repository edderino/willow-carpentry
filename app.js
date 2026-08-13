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

/* Quote form — validation, honeypot and submission to /api/enquiry. */
(function () {
  var form = document.getElementById("quoteForm");
  if (!form) return;

  var submit = document.getElementById("quoteSubmit");
  var status = document.getElementById("quoteStatus");
  var fields = Array.prototype.slice.call(
    form.querySelectorAll("input[name], select[name], textarea[name]")
  ).filter(function (el) { return el.name !== "website"; });

  function messageFor(el) {
    var v = el.validity;
    if (v.valid) return "";
    if (v.valueMissing) {
      return el.tagName === "SELECT" ? "Please choose an option." : "This one's needed.";
    }
    if (v.typeMismatch && el.type === "email") return "Please enter a valid email address.";
    if (v.tooShort) return "Please enter at least " + el.minLength + " characters.";
    if (v.patternMismatch) return el.title || "Please check this format.";
    return "Please check this field.";
  }

  function showError(el) {
    var slot = form.querySelector('[data-error-for="' + el.name + '"]');
    var message = messageFor(el);
    if (slot) slot.textContent = message;
    el.setAttribute("aria-invalid", message ? "true" : "false");
    return !message;
  }

  function clearError(el) {
    var slot = form.querySelector('[data-error-for="' + el.name + '"]');
    if (slot) slot.textContent = "";
    el.removeAttribute("aria-invalid");
  }

  function refreshSubmit() {
    submit.disabled = !form.checkValidity();
  }

  fields.forEach(function (el) {
    el.addEventListener("input", function () { clearError(el); refreshSubmit(); });
    el.addEventListener("change", refreshSubmit);
    el.addEventListener("blur", function () { if (el.value) showError(el); });
  });

  refreshSubmit();

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var firstInvalid = null;
    fields.forEach(function (el) {
      if (!showError(el) && !firstInvalid) firstInvalid = el;
    });
    if (firstInvalid) {
      status.textContent = "";
      firstInvalid.focus();
      return;
    }

    var payload = {};
    Array.prototype.forEach.call(
      form.querySelectorAll("input[name], select[name], textarea[name]"),
      function (el) { payload[el.name] = el.value; }
    );

    submit.disabled = true;
    status.className = "form-status";
    status.textContent = "Sending your enquiry…";

    fetch(form.action, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (data) {
          return { ok: res.ok, data: data };
        });
      })
      .then(function (result) {
        if (result.ok) {
          form.reset();
          status.className = "form-status is-ok";
          status.textContent = "Thanks — we've got your enquiry and will be in touch shortly.";
          return;
        }
        var errors = result.data.errors || {};
        Object.keys(errors).forEach(function (name) {
          var slot = form.querySelector('[data-error-for="' + name + '"]');
          if (slot) slot.textContent = errors[name];
        });
        status.className = "form-status is-error";
        status.textContent = result.data.error || "Something went wrong. Please call us on 0434 459 704.";
      })
      .catch(function () {
        status.className = "form-status is-error";
        status.textContent = "We could not send that. Please call us on 0434 459 704.";
      })
      .then(function () { refreshSubmit(); });
  });
})();
