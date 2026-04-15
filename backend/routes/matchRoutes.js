const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { browseProfiles, getSuggestedMatches, getCompatibility } = require('../controllers/matchController');

router.get('/browse', protect, browseProfiles);
router.get('/suggested', protect, getSuggestedMatches);
router.get('/compatibility/:profileId', protect, getCompatibility);

module.exports = router;