const fs = require('fs');
const path = require('path');
const pino = require('pino');

// Use /tmp/logs for Render compatibility
const logDir = '/tmp/logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const streams = [
  { stream: process.stdout },
  { stream: pino.destination({ dest: path.join(logDir, 'api.log'), sync: true }) }
];

const logger = pino({
  level: 'info',
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "*.password",
      "*.token",
      "*.id_token",
      "*.password_hash"
    ],
    remove: true
  }
}, pino.multistream(streams));

module.exports = logger;
