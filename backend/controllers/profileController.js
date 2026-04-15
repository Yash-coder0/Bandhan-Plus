// CRUD for matrimony profiles
const Profile = require('../models/Profile');
const User = require('../models/User');

// @route  GET /api/profile/me
// @access Private — get logged-in user's own profile
const getMyProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  PUT /api/profile/me
// @access Private — update own profile
const updateMyProfile = async (req, res) => {
  try {
    const profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      { ...req.body },
      { new: true, runValidators: true }
    );

    // Recalculate trust score based on filled fields
    let score = 0;
    if (profile.photos.length > 0) score += 25;
    if (profile.videoIntro) score += 20;
    if (profile.education) score += 10;
    if (profile.profession) score += 10;
    if (profile.aboutMe) score += 10;
    if (profile.isVerified) score += 25;

    profile.trustScore = score;
    await profile.save();

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/profile/:id
// @access Private — view another user's profile
const getProfileById = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile || !profile.isActive) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  POST /api/profile/upload-photos
// @access Private — upload profile photos
const uploadPhotos = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const filenames = req.files.map(f => f.filename);

    const profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      { $push: { photos: { $each: filenames } } }, // Add new photos to array
      { new: true }
    );

    res.json({ photos: profile.photos });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  POST /api/profile/upload-video
// @access Private — upload 30-sec intro video
const uploadVideo = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No video uploaded' });

    const profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      { videoIntro: req.file.filename },
      { new: true }
    );

    res.json({ videoIntro: profile.videoIntro });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMyProfile, updateMyProfile, getProfileById, uploadPhotos, uploadVideo };