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
  poolDeck:   { src: "images/willow/IMG_0205.JPG",          alt: "Glossy timber deck wrapping a backyard pool",                   cap: "Poolside deck" },
  courtyard:  { src: "images/willow/IMG_0206.JPG",          alt: "Compact courtyard deck with lounge chairs",                     cap: "Courtyard deck" },
  cladDeck:   { src: "images/willow/IMG_0204.JPG",          alt: "Glossy timber deck against matching timber cladding",           cap: "Deck & cladding" },
  raisedDeck: { src: "images/willow/IMG_0203.JPG",          alt: "Raised timber deck and steps beside a two-storey home",         cap: "Raised deck & steps" },
};

// Gallery = the full collection, each image exactly once (data-driven order).
export const GALLERY = [
  "poolDeck", "p1After", "raisedDeck", "p2After", "cladDeck", "courtyard",
  "heroDeck", "p1Before", "frontStep", "p2Before", "planter",
];

// Reference map of where each image is featured (single source for placement).
export const SECTIONS = {
  hero: "heroDeck",
  moodband: "poolDeck",                                   // never the hero image
  transformation: [
    { before: "p1Before", after: "p1After" },             // before/after pair only
    { before: "p2Before", after: "p2After" },             // before/after pair only
  ],
  services: ["p1After", "p2After", "courtyard", "p1Before", "p2Before", "planter"],
  craft: ["frontStep", "cladDeck", "planter"],            // unique detail cards
  final: "raisedDeck",
};
