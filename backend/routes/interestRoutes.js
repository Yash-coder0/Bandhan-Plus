const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { sendInterest, getReceivedInterests, getSentInterests, getMatches } = require('../controllers/interestController');

router.post('/send/:profileId', protect, sendInterest);
router.get('/received', protect, getReceivedInterests);
router.get('/sent', protect, getSentInterests);
router.get('/matches', protect, getMatches);

module.exports = router;