const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { registerTeam, getPublicStatus } = require('../controllers/registrationController');

/**
 * Multi-part upload handler accepting:
 * - 'paymentScreenshot': 1 file
 * - 'idCards': max 6 files
 */
const registrationUpload = upload.fields([
  { name: 'paymentScreenshot', maxCount: 1 },
  { name: 'idCards', maxCount: 6 },
]);

router.post('/', registrationUpload, registerTeam);
router.get('/:registrationId', getPublicStatus);

module.exports = router;
