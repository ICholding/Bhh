const { env } = require("../env");
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');
const config = require('../config');
const { query } = require('../db');
const { extractSignupMeta } = require('../lib/metadata');
const logger = require('../logger');
const { z } = require('zod');

let googleClient = null;
if (config.GOOGLE_CLIENT_ID) {
  googleClient = new OAuth2Client(config.GOOGLE_CLIENT_ID);
}

function normalizeCookieDomain(raw) {
  if (!raw) return null;
  const d = String(raw).trim().replace(/^\./, "").toLowerCase();
  if (!/^[a-z0-9.-]+$/.test(d) || d.includes("..") || d.startsWith("-") || d.endsWith("-")) {
    return null;
  }
  return d;
}

function pickCookieDomain(req) {
  const host = (req.headers.host || "").split(":")[0].toLowerCase();
  const configuredValue = process.env.COOKIE_DOMAIN || config.COOKIE_DOMAIN;
  const configured = normalizeCookieDomain(configuredValue);

  if (!configured) return null;
  if (host === configured || host.endsWith("." + configured)) {
    return configured;
  }
  return null;
}

const setAuthCookie = (req, res, token) => {
  const cookieDomain = pickCookieDomain(req);
  const isProd = config.NODE_ENV === "production" || process.env.NODE_ENV === "production";

  const cookieOptions = {
    httpOnly: true,
    secure: true, // Always secure for SSL routes in prod
    sameSite: isProd ? 'none' : 'lax', // Use none for cross-subdomain
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  if (cookieDomain) {
     cookieOptions.domain = cookieDomain;
  }

  res.cookie('auth_token', token, cookieOptions);
};

router.post('/google', async (req, res) => {
  const { id_token } = req.body;
  try {
    if (!googleClient) {
      logger.warn("Google Sign-In attempted but not configured.");
      return res.status(501).json({ error: 'Google Sign-In disabled' });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: id_token,
      audience: config.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, sub, name, picture } = payload;

    let userRes = await query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
    let user;
    let isNewUser = false;

    if (userRes.rowCount === 0) {
      const newUser = await query(
        'INSERT INTO users (email, full_name, avatar_url, provider, provider_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [email.toLowerCase(), name, picture, 'google', sub]
      );
      user = newUser.rows[0];
      isNewUser = true;
    } else {
      user = userRes.rows[0];
      await query('UPDATE users SET full_name = $1, avatar_url = $2, provider_id = $3 WHERE id = $4', [name, picture, sub, user.id]);
    }

    if (isNewUser) {
      const meta = extractSignupMeta(req, req.body);
      await query(
        `INSERT INTO auth_signup_events (user_id, email, ip_hash, user_agent, accept_language, referer, origin, tz, screen, platform) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
        [user.id, user.email, meta.ip_hash, meta.user_agent, meta.accept_language, meta.referer, meta.origin, meta.tz, meta.screen, meta.platform]
      );
    }

    const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, config.JWT_SECRET, { expiresIn: '7d' });
    setAuthCookie(req, res, token);
    res.json({ user: { id: user.id, email: user.email, role: user.role, name: user.full_name } });
  } catch (err) {
    logger.error({ err: err.message, stack: err.stack }, 'Google auth failed');
    res.status(401).json({ error: 'Invalid Google token' });
  }
});

const SignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
  tz: z.string().optional(),
  screen: z.string().optional(),
  platform: z.string().optional()
});

router.post('/register', async (req, res) => {
  logger.info({ body: { ...req.body, password: 'REDACTED' } }, 'Register attempt');
  try {
    const result = SignupSchema.safeParse(req.body);
    if (!result.success) return res.status(400).json({ error: 'Invalid input', details: result.error.format() });

    const { email, password, name, tz, screen, platform } = result.data;
    const existing = await query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (existing.rowCount > 0) return res.status(400).json({ error: 'User already exists' });

    const hash = await bcrypt.hash(password, 10);
    const dbRes = await query('INSERT INTO users (email, password_hash, full_name) VALUES ($1, $2, $3) RETURNING *', [email.toLowerCase(), hash, name]);
    const user = dbRes.rows[0];

    const meta = extractSignupMeta(req, { tz, screen, platform });
    await query(
      `INSERT INTO auth_signup_events (user_id, email, ip_hash, user_agent, accept_language, referer, origin, tz, screen, platform) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [user.id, user.email, meta.ip_hash, meta.user_agent, meta.accept_language, meta.referer, meta.origin, meta.tz, meta.screen, meta.platform]
    );

    const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, config.JWT_SECRET, { expiresIn: '7d' });
    setAuthCookie(req, res, token);
    res.status(201).json({ user: { id: user.id, email: user.email, role: user.role, name: user.full_name } });
  } catch (err) {
    logger.error({ err: err.message, stack: err.stack }, 'Registration failed');
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const userRes = await query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
    if (userRes.rowCount === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const user = userRes.rows[0];
    if (!user.password_hash) return res.status(401).json({ error: 'Use Google Sign-In' });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, config.JWT_SECRET, { expiresIn: '7d' });
    setAuthCookie(req, res, token);
    res.json({ user: { id: user.id, email: user.email, role: user.role, name: user.full_name } });
  } catch (err) {
    logger.error({ err: err.message, stack: err.stack }, 'Login failed');
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/me', async (req, res) => {
  const token = req.cookies.auth_token;
  if (!token) return res.status(401).json({ error: 'Unauthenticated' });
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    const userRes = await query('SELECT id, email, role, full_name, avatar_url FROM users WHERE id = $1', [decoded.userId]);
    if (userRes.rowCount === 0) return res.status(401).json({ error: 'User not found' });
    res.json({ user: userRes.rows[0] });
  } catch (err) {
    res.status(401).json({ error: 'Invalid session' });
  }
});

router.post('/logout', (req, res) => {
  const cookieDomain = pickCookieDomain(req);
  const cookieOptions = { 
    secure: true, 
    sameSite: 'none', 
    path: "/"
  };
  if (cookieDomain) cookieOptions.domain = cookieDomain;

  res.clearCookie('auth_token', cookieOptions);
  res.json({ message: 'Logged out' });
});

module.exports = router;
