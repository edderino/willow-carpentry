// ─────────────────────────────────────────────────────────────────────────
// Willow Carpentry — SINGLE SOURCE OF TRUTH for all project imagery.
// Every image is declared exactly once in IMAGES. The gallery is rendered
// from GALLERY (each image once). SECTIONS documents where each image is
// featured so placement is controlled here, not hardcoded across components.
// To add/replace an image: edit it here only.
// ─────────────────────────────────────────────────────────────────────────

export const IMAGES = {
  heroDeck:   { src: "images/hero-finished-deck.jpg",       alt: "Finished jarrah deck wrapping a Canberra home at golden hour", cap: "Evening light" },
  p1Before:   { src: "images/project-1-before-frame.png",   alt: "Steel and timber deck subframe before decking boards",          cap: "Wraparound · The frame" },
  p1After:    { src: "images/project-1-after-finished.png", alt: "Finished glossy wraparound jarrah deck in daylight",            cap: "Wraparound deck · Finished" },
  frontStep:  { src: "images/detail-front-step.png",        alt: "Small glossy timber entry step and landing",                    cap: "Entry step · Detail" },
  p2Before:   { src: "images/project-2-before-frame.png",   alt: "Raised deck framing and stair stringers under construction",    cap: "Raised deck · Framing" },
  p2After:    { src: "images/project-2-after-finished.png", alt: "Finished raised deck with wide cascading steps",                cap: "Raised entertainer · Steps" },
  planter:    { src: "images/detail-planter-box.png",       alt: "Custom timber planter box with clean, even boards",             cap: "Custom planter box" },
  poolDeck:   { src: "images/willow/IMG_0205.JPG",          alt: "Glossy jarrah deck wrapping a backyard pool",                   cap: "Pool surround · Jarrah" },
  courtyard:  { src: "images/willow/IMG_0206.JPG",          alt: "Compact courtyard entertaining deck",                           cap: "Courtyard deck" },
  cladDeck:   { src: "images/willow/IMG_0204.JPG",          alt: "Glossy timber deck under a pergola against matching cladding",  cap: "Deck & pergola" },
  raisedDeck: { src: "images/willow/IMG_0203.JPG",          alt: "Raised timber deck and steps beside a two-storey home",         cap: "Raised deck & steps" },
};

// Gallery = curated finished-deck showcase. Each image appears ONCE on the whole
// site (no cross-section repeats), so the gallery only holds the finished decks
// not featured elsewhere.
export const GALLERY = ["poolDeck", "courtyard", "cladDeck"];

// Where each image is featured. Every image is used exactly once across the site.
export const SECTIONS = {
  hero: "heroDeck",                                       // golden-hour deck — opens the site
  transformation: [
    { before: "p1Before", after: "p1After" },             // wraparound — before/after pair
    { before: "p2Before", after: "p2After" },             // raised entertainer — before/after pair
  ],
  gallery: ["poolDeck", "courtyard", "cladDeck"],         // pool, courtyard, pergola/deck
  // services tiles are typographic cards (no project photos)
  craft: ["frontStep", "planter"],                        // detail / joinery close-ups
  final: "raisedDeck",                                    // raised deck — closes the site
};
