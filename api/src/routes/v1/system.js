const express = require('express');
const router = express.Router();
const aiController = require('../../controllers/aiController');
const telemetryController = require('../../controllers/telemetryController');

router.get('/healthz', telemetryController.healthCheck);
router.post('/ai/invoke', aiController.invokeAI);
router.post('/logs/client', telemetryController.logClientError);

module.exports = router;
