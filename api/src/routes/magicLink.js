// /api/src/routes/magicLink.js (Hardened Implementation)
const express = require("express");
const rateLimit = require("express-rate-limit");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { z } = require("zod");
const { Resend } = require("resend");
const config = require("../config");
const { query } = require("../db");

function setSessionCookie(res, sessionJwt) {
  const cookieDomain = config.COOKIE_DOMAIN || ".icholding.cloud";
  const isProd = process.env.NODE_ENV === "production";

  res.cookie("bhh_session", sessionJwt, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    domain: isProd ? cookieDomain : undefined,
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

module.exports = function registerMagicLinkRoutes(app) {
  const router = express.Router();
  const resend = new Resend(config.RESEND_API_KEY);

  const sendLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 8,
    standardHeaders: true,
    legacyHeaders: false,
  });

  const emailSchema = z.object({
    email: z.string().email().max(254),
  });

  // POST /auth/magic-link (Unified endpoint name)
  router.post("/magic-link", sendLimiter, async (req, res) => {
    try {
      const parsed = emailSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ ok: false, error: "Invalid email" });

      const email = parsed.data.email.toLowerCase();
      const jti = crypto.randomUUID();

      // 1. JWT Link Signing
      const magicSecret = config.MAGICLINK_SECRET_CURRENT || config.MAGICLINK_SECRET;
      const token = jwt.sign(
        { sub: email, jti, typ: "magic" },
        magicSecret,
        { expiresIn: "15m", issuer: "bhh-api", audience: "bhh-web" }
      );

      // 2. JTI Persistence (One-time check)
      await query(
        `insert into auth_magic_links (jti, email, expires_at)
         values ($1, $2, now() + interval '15 minutes')`,
        [jti, email]
      );

      // 3. Email Dispatch
      const appOrigin = config.APP_ORIGIN || process.env.PUBLIC_WEB_URL || "https://bhh.icholding.cloud";
      // Redirect to a frontend callback page which will then call /auth/verify
      const link = `${appOrigin}/auth/callback?token=${encodeURIComponent(token)}`;

      const from = process.env.MAIL_FROM || process.env.FROM_EMAIL || config.EMAIL_FROM || "BHH <no-reply@send.icholding.cloud>";
      
      const result = await resend.emails.send({
        from,
        reply_to: "support@icholding.cloud",
        to: email,
        subject: "Your BHH sign-in link",
        text: `Sign in to BHH: ${link}\n\nThis link expires in 15 minutes.`,
        html: `
          <div style="font-family:system-ui, sans-serif; max-width: 400px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 12px;">
            <h2 style="margin-top:0;">Sign in to BHH</h2>
            <p>Click the button below to sign in as <b>${email}</b>. This link expires in 15 minutes.</p>
            <p style="margin: 25px 0;">
              <a href="${link}" style="background:#000; color:#fff; padding:12px 24px; text-decoration:none; border-radius:8px; display:inline-block; font-weight:bold;">Sign in to BHH</a>
            </p>
            <p style="color:#666;font-size:12px;margin-bottom:0;">If you didn’t request this, ignore this email.</p>
          </div>
        `,
      });

      console.log(`✅ [AUTH] Email sent to ${email}. ID: ${result?.data?.id}`);
      return res.json({ ok: true });
    } catch (err) {
      console.error("❌ [AUTH] magic/send error:", err);
      // Return 200 to prevent email enumeration
      return res.json({ ok: true }); 
    }
  });

  // POST /auth/verify (Frontend /auth/callback calls this)
  router.post("/verify", async (req, res) => {
    try {
      const { token } = req.body;
      if (!token) return res.status(400).json({ ok: false, error: "Token required" });

      const magicSecret = config.MAGICLINK_SECRET_CURRENT || config.MAGICLINK_SECRET;
      let payload;
      try {
        payload = jwt.verify(token, magicSecret, {
          issuer: "bhh-api",
          audience: "bhh-web",
        });
      } catch (e) {
        return res.status(401).json({ ok: false, error: "Link expired or invalid" });
      }

      if (!payload || payload.typ !== "magic" || !payload.jti) {
        return res.status(401).json({ ok: false, error: "Invalid token structure" });
      }

      // Check JTI
      const { rows } = await query(
        `select used_at, expires_at from auth_magic_links where jti=$1`,
        [payload.jti]
      );

      if (rows.length === 0) return res.status(401).json({ ok: false, error: "Invalid link" });
      if (rows[0].used_at) return res.status(401).json({ ok: false, error: "Link already used" });

      // Mark used
      await query(`update auth_magic_links set used_at=now() where jti=$1`, [payload.jti]);

      // Create session
      const sessionJwt = jwt.sign(
        { sub: String(payload.sub), typ: "session" },
        config.JWT_SECRET,
        { expiresIn: "7d", issuer: "bhh-api", audience: "bhh-web" }
      );

      setSessionCookie(res, sessionJwt);
      return res.json({ ok: true, email: payload.sub });
    } catch (err) {
      console.error("❌ [AUTH] verify error:", err);
      return res.status(500).json({ ok: false, error: "Server error" });
    }
  });

  // GET /auth/me - check session
  router.get("/me", (req, res) => {
      const token = req.cookies?.bhh_session;
      if (!token) return res.status(401).json({ ok: false });
      
      try {
          const payload = jwt.verify(token, config.JWT_SECRET, { issuer: "bhh-api", audience: "bhh-web" });
          if (payload.typ !== "session") return res.status(401).json({ ok: false });
          return res.json({ ok: true, email: payload.sub });
      } catch {
          return res.status(401).json({ ok: false });
      }
  });

  // POST /auth/logout
  router.post("/logout", (req, res) => {
    const isProd = process.env.NODE_ENV === "production";
    res.clearCookie("bhh_session", {
        domain: isProd ? (config.COOKIE_DOMAIN || ".icholding.cloud") : undefined,
        path: "/"
    });
    res.json({ ok: true });
  });

  app.use("/auth", router);
};
