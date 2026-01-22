const { env } = require("./env");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
const { initDb } = require("./db");
const authRouter = require("./routes/auth");
const systemRouterV1 = require("./routes/v1/system");
const logger = require("./logger");
const uploadLogs = require("./logUploader");

const app = express();

const allowedOrigins = [
  "https://bhh.icholding.cloud",
  "https://api-bhh.icholding.cloud",
  "https://bhh-ojy2.onrender.com",
  "https://bhh-api-latest.onrender.com",
  "http://localhost:5173"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const isAllowed = allowedOrigins.some(o => origin.startsWith(o));
    if (isAllowed || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked for origin: ${origin}`));
    }
  },
  credentials: true,
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Idempotency-Key", "Cookie"],
}));

app.options("*", cors());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/auth", authRouter);
app.use("/", systemRouterV1); // System legacy routes
app.use("/v1", systemRouterV1); // Versioned routes

app.get("/", (req, res) => {
  res.json({ 
    service: "Blessed-Hope-Healthcare-Core-API", 
    status: "operational", 
    version: "2.2.0-modular",
    uptime: `${Math.floor(process.uptime())}s`
  });
});

app.use((err, req, res, next) => {
  logger.error({ err: err.message, stack: err.stack, path: req.path }, 'Critical router failure');
  res.status(500).json({ error: 'Internal Server Error' });
});

setInterval(() => {
  uploadLogs().catch(() => {});
}, 5 * 60 * 1000);

const start = async () => {
  try {
    await initDb();
    const port = process.env.PORT || 10000;
    app.listen(port, () => {
      logger.info(`🚀 BHH Core Production API live on ${port}`);
    });
  } catch (err) {
    logger.error("❌ Startup Aborted:", err);
    process.exit(1);
  }
};

start();
