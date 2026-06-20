# Willow Carpentry & Construction

Premium portfolio website for Willow Carpentry & Construction — a Canberra (ACT)
residential carpentry business specialising in custom decks, pergolas, outdoor
living, renovations, extensions and general carpentry.

Static site (plain HTML / CSS / vanilla JS) — no build step. Photography-led, with
a warm charcoal / off-white / jarrah timber palette.

## Run locally

```bash
python3 -m http.server 8731
# open http://localhost:8731
```

## Structure

- `index.html` — single-page site (hero, frame-to-finish transformation, services,
  project gallery + lightbox, craftsmanship details, on-site reels, why, reviews,
  final CTA, footer)
- `styles.css` — hand-written CSS, design tokens, responsive + reduced-motion
- `app.js` — dependency-free interactions (scroll reveals via IntersectionObserver,
  mobile menu, hero parallax, gallery lightbox)
- `images/` — real project photography

## Notes

- `images/detail-front-step.png` is byte-identical to `images/project-2-after-finished.png`
  (the raised/stepped deck), so it is intentionally left unused to avoid showing the
  same photo twice. Replace it with a genuine front-step photo to add it back.
- Reviews and the on-site video reels are placeholders, ready for real content.
