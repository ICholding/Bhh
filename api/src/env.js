// /api/src/env.js
function optional(name, fallback = null) {
  return process.env[name] || fallback;
}

const env = {
  NODE_ENV: process.env.NODE_ENV || "production",

  // URLs
  APP_ORIGIN: optional("APP_ORIGIN", "https://bhh.icholding.cloud"),
  API_ORIGIN: optional("API_ORIGIN", "https://api-bhh.icholding.cloud"),

  // Auth (Resilient Mode)
  MAGICLINK_SECRET: optional("MAGICLINK_SECRET", "default-magic-secret"),
  JWT_SECRET: optional("JWT_SECRET", "bhh-sovereign-default-secret"),

  // Email
  RESEND_API_KEY: optional("RESEND_API_KEY"),
  EMAIL_FROM: optional("EMAIL_FROM", "BHH <no-reply@send.icholding.cloud>"),

  // DB
  DATABASE_URL: optional("DATABASE_URL"),

  // Cookies
  COOKIE_DOMAIN: process.env.COOKIE_DOMAIN || ".icholding.cloud",
};

module.exports = { env };
