const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const LOG_DIR = path.join(process.cwd(), "logs");
const LOG_FILE = path.join(LOG_DIR, "client.log");

function ensureDir() {
  if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });
}

router.post("/client", (req, res) => {
  ensureDir();
  const line = JSON.stringify(req.body) + "\n";
  fs.appendFile(LOG_FILE, line, (err) => {
    if (err) console.error("Failed to write to client log:", err);
  });
  res.json({ ok: true });
});

router.get("/client", (req, res) => {
  ensureDir();
  if (!fs.existsSync(LOG_FILE)) return res.type("text").send("");
  res.type("text").send(fs.readFileSync(LOG_FILE, "utf8"));
});

module.exports = router;
