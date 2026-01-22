// api/src/lib/metadata.js
const crypto = require("crypto");

function hashIp(ip) {
  const salt = process.env.IP_HASH_SALT || "bhh-default-salt";
  return crypto.createHash("sha256").update(`${salt}:${ip || ""}`).digest("hex");
}

function getClientIp(req) {
  const xf = req.headers["x-forwarded-for"];
  if (typeof xf === "string" && xf.length) return xf.split(",")[0].trim();
  return req.socket?.remoteAddress || null;
}

function extractSignupMeta(req, body = {}) {
  const ip = getClientIp(req);

  return {
    ip_hash: ip ? hashIp(ip) : null,
    user_agent: req.headers["user-agent"] || null,
    accept_language: req.headers["accept-language"] || null,
    referer: req.headers["referer"] || null,
    origin: req.headers["origin"] || null,

    tz: body.tz || null,
    screen: body.screen || null,
    platform: body.platform || null
  };
}

module.exports = { extractSignupMeta };
