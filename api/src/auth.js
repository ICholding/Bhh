const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('./config');
const { query } = require('./db');
const { Resend } = require('resend');
const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');

const resend = new Resend(config.RESEND_API_KEY);
const s3 = new S3Client({
    endpoint: config.B2_ENDPOINT_S3, 
    credentials: {
        accessKeyId: config.B2_KEY_ID,
        secretAccessKey: config.B2_APP_KEY,
    },
    region: 'us-east-1',
});

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

// Email magic link request
const requestMagicLink = async (req, res) => {
    const { email } = req.body;
    console.log(`[AUTH] Magic link request for: ${email}`);
    
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const normalizedEmail = email.toLowerCase().trim();
    
    try {
        // Upsert user
        let userRes = await query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);
        let userId;
        if (userRes.rowCount === 0) {
            console.log(`[AUTH] Creating new user for: ${normalizedEmail}`);
            const newUser = await query('INSERT INTO users (email) VALUES ($1) RETURNING id', [normalizedEmail]);
            userId = newUser.rows[0].id;
        } else {
            userId = userRes.rows[0].id;
        }

        // Create token
        const rawToken = crypto.randomBytes(32).toString('hex');
        const tokenHash = hashToken(rawToken);
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

        await query('INSERT INTO login_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)', [userId, tokenHash, expiresAt]);

        const magicLink = `${config.APP_ORIGIN}/AuthCallback?token=${rawToken}`;
        
        console.log(`[AUTH] Attempting to send magic link via Resend. From: ${config.MAIL_FROM}`);

        const sendResult = await resend.emails.send({
            from: config.MAIL_FROM,
            reply_to: config.MAIL_REPLY_TO,
            to: normalizedEmail,
            subject: 'Login to Blessed Hope Healthcare',
            html: `<p>Click the link below to sign in. Link expires in 15 minutes.</p>
                   <a href="${magicLink}" style="padding: 10px 20px; background: #2563eb; color: white; text-decoration: none; border-radius: 5px;">Login to BHH</a>`
        });

        if (sendResult.error) {
            console.error('[AUTH] Resend returned an error:', sendResult.error);
            return res.status(500).json({ error: 'Email delivery failed', details: sendResult.error });
        }

        console.log(`[AUTH] Magic link sent successfully. ID: ${sendResult.data?.id}`);
        res.json({ message: 'Magic link sent' });
    } catch (err) {
        console.error('[AUTH] Fatal error in requestMagicLink:', err);
        res.status(500).json({ error: 'Internal server error during email dispatch' });
    }
};

// Verify magic link
const verifyMagicLink = async (req, res) => {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: 'Token is required' });

    const tokenHash = hashToken(token);

    try {
        const tokenRes = await query(`
            SELECT lt.*, u.email, u.role 
            FROM login_tokens lt 
            JOIN users u ON lt.user_id = u.id 
            WHERE lt.token_hash = $1 AND lt.used_at IS NULL AND lt.expires_at > NOW()
        `, [tokenHash]);

        if (tokenRes.rowCount === 0) {
            return res.status(401).json({ error: 'Invalid or expired magic link' });
        }

        const user = tokenRes.rows[0];

        // Mark token used
        await query('UPDATE login_tokens SET used_at = NOW() WHERE id = $1', [user.id]);

        // Issue JWT
        const sessionToken = jwt.sign({ userId: user.user_id, email: user.email, role: user.role }, config.JWT_SECRET, { expiresIn: '7d' });

        res.json({ 
            token: sessionToken, 
            user: { id: user.user_id, email: user.email, role: user.role } 
        });
    } catch (err) {
        console.error('Verify error:', err);
        res.status(500).json({ error: 'Verification failed' });
    }
};

// Middlewares
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, config.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

const roleGuard = (roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Access denied: insufficient permissions' });
    }
    next();
};

// B2 Helpers
const saveMetadataB2 = async (userId, key, data) => {
    const timestamp = Date.now();
    const uuid = crypto.randomUUID();
    const b2Path = `users/${userId}/metadata/${timestamp}-${uuid}.json`;

    const command = new PutObjectCommand({
        Bucket: config.B2_BUCKET_NAME,
        Key: b2Path,
        Body: JSON.stringify(data),
        ContentType: 'application/json',
    });

    await s3.send(command);
    
    // Index in DB
    await query('INSERT INTO metadata_index (user_id, key, b2_path) VALUES ($1, $2, $3)', [userId, key, b2Path]);
    
    return b2Path;
};

const getLatestMetadata = async (userId, key) => {
    const res = await query('SELECT b2_path FROM metadata_index WHERE user_id = $1 AND key = $2 ORDER BY created_at DESC LIMIT 1', [userId, key]);
    if (res.rowCount === 0) return null;

    const b2Path = res.rows[0].b2_path;
    const command = new GetObjectCommand({
        Bucket: config.B2_BUCKET_NAME,
        Key: b2Path,
    });
    const response = await s3.send(command);
    const body = await response.Body.transformToString();
    return JSON.parse(body);
};

module.exports = {
    requestMagicLink,
    verifyMagicLink,
    authMiddleware,
    roleGuard,
    saveMetadataB2,
    getLatestMetadata
};
