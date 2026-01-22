const B2 = require('backblaze-b2');
const fs = require('fs');
const path = require('path');
const logger = require('./logger');

const b2 = new B2({
  applicationKeyId: process.env.B2_KEY_ID,
  applicationKey: process.env.B2_APP_KEY
});

async function uploadLogs() {
  if (!process.env.B2_KEY_ID || !process.env.B2_APP_KEY || !process.env.B2_BUCKET_ID) {
    return;
  }

  try {
    const logPath = '/tmp/logs/api.log';
    if (!fs.existsSync(logPath)) return;

    await b2.authorize();
    const data = fs.readFileSync(logPath);

    const { data: upload } = await b2.getUploadUrl({
      bucketId: process.env.B2_BUCKET_ID
    });

    const fileName = `logs/api-${new Date().toISOString().replace(/[:.]/g, '-')}.log`;

    await b2.uploadFile({
      uploadUrl: upload.uploadUrl,
      uploadAuthToken: upload.authorizationToken,
      fileName: fileName,
      data
    });

    logger.info({ fileName }, 'Logs uploaded to Backblaze');
  } catch (err) {
    logger.error({ err: err.message }, 'Log upload failed');
  }
}

module.exports = uploadLogs;
