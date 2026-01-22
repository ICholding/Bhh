const logger = require("../logger");

exports.logClientError = (req, res) => {
  const { level, message, context, stack } = req.body;
  const severity = level || 'error';
  
  logger[severity === 'error' ? 'error' : 'info']({
    type: 'client_telemetry',
    context,
    stack
  }, message || 'Frontend Log Received');
  
  res.sendStatus(204);
};

exports.healthCheck = async (req, res) => {
  const { query } = require("../db");
  let dbActive = false;
  try {
    const result = await query("SELECT 1");
    dbActive = result.rowCount > 0;
  } catch (e) {}
  
  res.json({ 
    ok: true, 
    timestamp: new Date().toISOString(),
    db: dbActive ? "connected" : "disconnected",
    version: "2.2.0-modular"
  });
};
