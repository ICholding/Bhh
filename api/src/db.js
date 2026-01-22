const { Pool } = require('pg');
const config = require('./config');
const logger = require('./logger');

const pool = new Pool({
  connectionString: config.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const query = (text, params) => pool.query(text, params);

const initDb = async () => {
  try {
    logger.info('Syncing database schema...');
    
    // Core users table with absolute column definitions
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const cols = await query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users'
    `);
    const existing = cols.rows.map(r => r.column_name);

    const needed = {
      'password_hash': 'VARCHAR(255)',
      'full_name': 'VARCHAR(255)',
      'role': "VARCHAR(50) DEFAULT 'user'",
      'avatar_url': 'TEXT',
      'provider': "VARCHAR(50) DEFAULT 'email'",
      'provider_id': 'VARCHAR(255)'
    };

    for (const [col, type] of Object.entries(needed)) {
      if (!existing.includes(col)) {
        logger.info(`Adding missing column: users.${col}`);
        await query(`ALTER TABLE users ADD COLUMN ${col} ${type}`);
      }
    }

    await query(`
      CREATE TABLE IF NOT EXISTS auth_signup_events (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        email VARCHAR(255),
        ip_hash VARCHAR(255),
        user_agent TEXT,
        accept_language TEXT,
        referer TEXT,
        origin TEXT,
        tz VARCHAR(100),
        screen VARCHAR(100),
        platform VARCHAR(100),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    logger.info('✅ Database schema is up to date');
  } catch (err) {
    logger.error({ err: err.message }, 'Failed to initialize database');
    throw err;
  }
};

module.exports = { query, initDb };
