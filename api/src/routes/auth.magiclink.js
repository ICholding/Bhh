const express = require("express");
const rateLimit = require("express-rate-limit");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { Resend } = require("resend");
const { z } = require("zod");
const { env } = require("../env");
const { pool } = require("../db"); // Adjusted to match your db.js export

const router = express.Router();
const resend = new Resend(env.RESEND_API_KEY);

const sendLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
});

const emailSchema = z.object({
  email: z.string().email().max(254),
});

function setSessionCookie(res, sessionJwt) {
  const isProd = env.NODE_ENV === "production";
  res.cookie("bhh_session", sessionJwt, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    domain: isProd ? env.COOKIE_DOMAIN : undefined,
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

// POST /auth/magic/send
router.post("/magic/send", sendLimiter, express.json(), async (req, res) => {
  try {
    const parsed = emailSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ ok: false, error: "Invalid email" });

    const email = parsed.data.email.toLowerCase();
    const jti = crypto.randomUUID();
    const expiresInSeconds = 15 * 60;

    const token = jwt.sign(
      { sub: email, jti, typ: "magic" },
      env.MAGICLINK_SECRET,
      { expiresIn: expiresInSeconds, issuer: "bhh-api", audience: "bhh-web" }
    );

    await pool.query(
      `insert into auth_magic_links (jti, email, expires_at)
       values ($1, $2, now() + interval '15 minutes')`,
      [jti, email]
    );

    const link = `${env.APP_ORIGIN}/auth/callback?token=${encodeURIComponent(token)}`;

    const result = await resend.emails.send({
      from: env.EMAIL_FROM,
      to: email,
      subject: "Your BHH sign-in link",
      html: `
        <div style="font-family:system-ui,Segoe UI,Roboto,Arial; max-width: 400px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 12px;">
          <h2 style="margin-top:0;">Sign in to BHH</h2>
          <p>Click the button below to sign in as <b>${email}</b>. This link expires in 15 minutes.</p>
          <p style="margin: 25px 0;">
            <a href="${link}" style="background:#000; color:#fff; padding:12px 24px; text-decoration:none; border-radius:8px; display:inline-block; font-weight:bold;">Sign in to BHH</a>
          </p>
          <p style="color:#666;font-size:12px;margin-bottom:0;">If you didn’t request this, ignore this email.</p>
        </div>
      `,
    });

    console.log(`✅ [AUTH] Email dispatched. ID: ${result?.data?.id}. To: ${email}`);
    return res.json({ ok: true });
  } catch (err) {
    console.error("❌ [AUTH] magic/send error:", err);
    // Anti-enumeration: always return ok:true
    return res.json({ ok: true });
  }
});

// POST /auth/magic/verify
router.post("/magic/verify", express.json(), async (req, res) => {
  try {
    const bodySchema = z.object({ token: z.string().min(20) });
    const parsed = bodySchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ ok: false, error: "Invalid token" });

    let payload;
    try {
      payload = jwt.verify(parsed.data.token, env.MAGICLINK_SECRET, {
        issuer: "bhh-api",
        audience: "bhh-web",
      });
    } catch (e) {
      return res.status(401).json({ ok: false, error: "Link expired or invalid" });
    }

    if (!payload || payload.typ !== "magic" || !payload.jti || !payload.sub) {
      return res.status(401).json({ ok: false, error: "Invalid token structure" });
    }

    const { rows } = await pool.query(
      `select used_at, expires_at from auth_magic_links where jti=$1`,
      [payload.jti]
    );
    if (rows.length === 0) return res.status(401).json({ ok: false, error: "Invalid link" });
    if (rows[0].used_at) return res.status(401).json({ ok: false, error: "Link already used" });

    await pool.query(`update auth_magic_links set used_at=now() where jti=$1`, [payload.jti]);

    const sessionJwt = jwt.sign(
      { sub: String(payload.sub), typ: "session" },
      env.JWT_SECRET,
      { expiresIn: "7d", issuer: "bhh-api", audience: "bhh-web" }
    );

    setSessionCookie(res, sessionJwt);
    return res.json({ ok: true, email: payload.sub });
  } catch (err) {
    console.error("❌ [AUTH] magic/verify error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

// GET /auth/me
router.get("/me", (req, res) => {
  const token = req.cookies?.bhh_session;
  if (!token) return res.status(401).json({ ok: false });
  try {
    const payload = jwt.verify(token, env.JWT_SECRET, {
      issuer: "bhh-api",
      audience: "bhh-web",
    });
    return res.json({ ok: true, email: payload.sub });
  } catch {
    return res.status(401).json({ ok: false });
  }
});

module.exports = { authMagicLinkRouter: router };
