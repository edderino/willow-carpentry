// ─────────────────────────────────────────────────────────────────────────
// Willow Carpentry — SINGLE SOURCE OF TRUTH for all project imagery.
// Every image is declared exactly once in IMAGES. The gallery is rendered
// from GALLERY (each image once). SECTIONS documents where each image is
// featured so placement is controlled here, not hardcoded across components.
// To add/replace an image: edit it here only.
// ─────────────────────────────────────────────────────────────────────────

export const IMAGES = {
  heroDeck:   { src: "images/hero-finished-deck.jpg",       alt: "Finished timber deck wrapping a Canberra home at golden hour", cap: "" },
  p1Before:   { src: "images/project-1-before-frame.png",   alt: "Timber deck subframe before decking boards",                 cap: "" },
  p1After:    { src: "images/project-1-after-finished.png", alt: "Finished wraparound timber deck in daylight",                 cap: "" },
  frontStep:  { src: "images/detail-front-step.png",        alt: "Small timber entry step and landing",                         cap: "" },
  p2Before:   { src: "images/project-2-before-frame.png",   alt: "Raised deck framing and stair stringers under construction",   cap: "" },
  p2After:    { src: "images/project-2-after-finished.png", alt: "Finished raised deck with wide cascading steps",               cap: "" },
  planter:    { src: "images/detail-planter-box.png",       alt: "Exterior timber detail with clean board lines",                cap: "" },
  poolDeck:   { src: "images/willow/IMG_0205.JPG",          alt: "Timber deck wrapping a backyard pool",                        cap: "" },
  courtyard:  { src: "images/willow/IMG_0206.JPG",          alt: "Compact courtyard deck with lounge chairs",                    cap: "" },
  cladDeck:   { src: "images/willow/IMG_0204.JPG",          alt: "Timber exterior detail beside an outdoor area",                cap: "" },
  raisedDeck: { src: "images/willow/IMG_0203.JPG",          alt: "Raised timber deck and steps beside a two-storey home",        cap: "" },
  deck20:     { src: "images/willow/deck-20.jpg",           alt: "Compact timber deck off a townhouse sliding door",             cap: "" },
  deck21:     { src: "images/willow/deck-21.jpg",           alt: "Timber balcony deck overlooking the street",                   cap: "" },
  deck22:     { src: "images/willow/deck-22.jpg",           alt: "Freshly oiled timber deck overlooking the backyard",           cap: "" },
};

// Gallery = curated project showcase. Captions are intentionally blank/hidden;
// the photos stand on their own and still keep useful alt text for accessibility.
export const GALLERY = ["poolDeck", "courtyard", "deck20", "deck21", "deck22"];

export const SECTIONS = {
  hero: "heroDeck",
  transformation: [
    { before: "p1Before", after: "p1After" },
    { before: "p2Before", after: "p2After" },
  ],
  gallery: ["poolDeck", "courtyard", "deck20", "deck21", "deck22"],
  final: "raisedDeck",
};
