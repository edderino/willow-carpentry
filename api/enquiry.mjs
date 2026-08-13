// Enquiry form handler. Posts the quote form through to Mailgun.
//
// Required env vars (set in Vercel project settings and .env.local):
//   MAILGUN_API_KEY   private API key — server-side only, never exposed to the browser
//   MAILGUN_DOMAIN    sending domain, e.g. mg.example.com.au
//   MAILGUN_TO_EMAIL  where enquiries land
// Optional:
//   MAILGUN_FROM      sender address; defaults to enquiries@MAILGUN_DOMAIN
//   MAILGUN_API_BASE  set to https://api.eu.mailgun.net for EU-region domains

const PROJECT_TYPES = [
  "Deck or pergola",
  "Renovation or carpentry",
  "Cladding or exterior detail",
  "Other",
];

// Best-effort per-IP limiting. Serverless instances are recycled and requests can
// land on separate instances, so this thins out casual abuse rather than
// guaranteeing a ceiling. Mailgun's own sending limits are the real backstop.
const RATE_LIMIT = { max: 5, windowMs: 10 * 60 * 1000 };
const hits = new Map();

function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_LIMIT.windowMs);
  recent.push(now);
  hits.set(ip, recent);

  if (hits.size > 500) {
    for (const [key, times] of hits) {
      if (!times.some((t) => now - t < RATE_LIMIT.windowMs)) hits.delete(key);
    }
  }
  return recent.length > RATE_LIMIT.max;
}

// Strip CR/LF so nothing can break out of a header line, drop other control
// characters, collapse runaway whitespace and cap the length.
function clean(value, maxLength) {
  if (typeof value !== "string") return "";
  return value
    .replace(/[\r\n]+/g, " ")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .replace(/[ \t]{2,}/g, " ")
    .trim()
    .slice(0, maxLength);
}

function cleanMultiline(value, maxLength) {
  if (typeof value !== "string") return "";
  return value
    .replace(/\r\n?/g, "\n")
    .replace(/[\u0000-\u0009\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim()
    .slice(0, maxLength);
}

function validate(body) {
  const errors = {};

  const name = clean(body.name, 100);
  if (name.length < 2) errors.name = "Please enter your name.";

  // Australian numbers, tolerant of spaces, dashes, brackets and +61.
  const phone = clean(body.phone, 30);
  const phoneDigits = phone.replace(/[^\d+]/g, "");
  if (!/^(\+?61|0)[2-478]\d{8}$/.test(phoneDigits)) {
    errors.phone = "Please enter a valid Australian phone number.";
  }

  const email = clean(body.email, 150);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    errors.email = "Please enter a valid email address.";
  }

  const projectType = clean(body.projectType, 60);
  if (!PROJECT_TYPES.includes(projectType)) {
    errors.projectType = "Please choose a project type.";
  }

  const details = cleanMultiline(body.details, 2000);

  return { errors, fields: { name, phone, email, projectType, details } };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const { MAILGUN_API_KEY, MAILGUN_DOMAIN, MAILGUN_TO_EMAIL } = process.env;
  if (!MAILGUN_API_KEY || !MAILGUN_DOMAIN || !MAILGUN_TO_EMAIL) {
    console.error("Enquiry form: Mailgun environment variables are not configured.");
    return res.status(500).json({ error: "The enquiry form is not available right now." });
  }

  const forwarded = req.headers["x-forwarded-for"];
  const ip = (Array.isArray(forwarded) ? forwarded[0] : forwarded || "").split(",")[0].trim() || "unknown";
  if (rateLimited(ip)) {
    return res.status(429).json({ error: "Too many enquiries. Please try again shortly, or call us." });
  }

  const body = typeof req.body === "string" ? safeParse(req.body) : req.body || {};

  // Honeypot. Bots fill every field they find; humans never see this one.
  if (clean(body.website, 100)) {
    return res.status(200).json({ ok: true });
  }

  const { errors, fields } = validate(body);
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ error: "Please check the form and try again.", errors });
  }

  const from = process.env.MAILGUN_FROM || `Willow Carpentry Website <enquiries@${MAILGUN_DOMAIN}>`;
  const apiBase = process.env.MAILGUN_API_BASE || "https://api.mailgun.net";

  const lines = [
    `Name: ${fields.name}`,
    `Phone: ${fields.phone}`,
    `Email: ${fields.email || "(not supplied)"}`,
    `Project type: ${fields.projectType}`,
    "",
    fields.details || "(no extra details)",
    "",
    `Sent from the website enquiry form on ${new Date().toLocaleString("en-AU", { timeZone: "Australia/Sydney" })}.`,
  ];

  const params = new URLSearchParams({
    from,
    to: MAILGUN_TO_EMAIL,
    subject: `Website enquiry — ${fields.projectType} — ${fields.name}`,
    text: lines.join("\n"),
  });
  if (fields.email) params.set("h:Reply-To", fields.email);

  try {
    const response = await fetch(`${apiBase}/v3/${MAILGUN_DOMAIN}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`api:${MAILGUN_API_KEY}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });

    if (!response.ok) {
      // Log the detail server-side; the visitor gets a generic message.
      console.error("Mailgun rejected the enquiry:", response.status, await response.text());
      return res.status(502).json({ error: "We could not send that just now. Please call us instead." });
    }
  } catch (error) {
    console.error("Enquiry send failed:", error);
    return res.status(502).json({ error: "We could not send that just now. Please call us instead." });
  }

  return res.status(200).json({ ok: true });
}

function safeParse(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}
