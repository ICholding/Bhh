require("dotenv").config();

function optional(name, fallback = null) {
  return process.env[name] || fallback;
}

function required(name) {
  const v = process.env[name];
  if (!v) {
    if (process.env.NODE_ENV === 'production') {
       console.warn(`⚠️  Warning: Missing environment variable: ${name}. Some features may be disabled.`);
    }
  }
  return v;
}

// Strictly required for the core app to function at all
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL && process.env.NODE_ENV === 'production') {
  console.error("❌ CRITICAL: DATABASE_URL is missing. Service cannot start.");
  process.exit(1);
}

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 10000,
  APP_ORIGIN: process.env.PUBLIC_WEB_URL || process.env.APP_ORIGIN || "https://bhh.icholding.cloud", 
  
  // Auth Core
  JWT_SECRET: optional("JWT_SECRET", "bhh-default-unsecure-secret-change-me"),
  DATABASE_URL: DATABASE_URL || "postgres://localhost:5432/bhh",
  
  // Auth Providers (Optional)
  GOOGLE_CLIENT_ID: optional("GOOGLE_CLIENT_ID"),
  
  // Communication (Optional)
  RESEND_API_KEY: optional("RESEND_API_KEY"),
  MAIL_FROM: optional("MAIL_FROM", "no-reply@send.icholding.cloud"),   
  MAIL_REPLY_TO: optional("MAIL_REPLY_TO", "support@icholding.cloud"),
  
  // Infrastructure
  COOKIE_DOMAIN: optional("COOKIE_DOMAIN", ".icholding.cloud"),
  
  // Storage (Optional)
  B2_ENDPOINT_S3: optional("B2_ENDPOINT_S3"),
  B2_BUCKET_NAME: optional("B2_BUCKET_NAME"),
  B2_KEY_ID: optional("B2_KEY_ID"),
  B2_APP_KEY: optional("B2_APP_KEY"),
};
