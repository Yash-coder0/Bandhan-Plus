const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getMyProfile,
  updateMyProfile,
  getProfileById,
  uploadPhotos,
  uploadVideo
} = require('../controllers/profileController');

router.get('/me', protect, getMyProfile);
router.put('/me', protect, updateMyProfile);
router.get('/:id', protect, getProfileById);
router.post('/upload-photos', protect, upload.array('photos', 5), uploadPhotos); // Max 5 photos
router.post('/upload-video', protect, upload.single('video'), uploadVideo);

module.exports = router;