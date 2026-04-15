// Send, receive, and accept interests
const Profile = require('../models/Profile');

// @route  POST /api/interests/send/:profileId
// @access Private — send interest to a profile
const sendInterest = async (req, res) => {
  try {
    const myProfile = await Profile.findOne({ user: req.user._id });
    const theirProfile = await Profile.findById(req.params.profileId);

    if (!myProfile || !theirProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Check if interest already sent
    if (myProfile.interestsSent.includes(theirProfile._id)) {
      return res.status(400).json({ message: 'Interest already sent' });
    }

    // Add to interestsSent of my profile
    myProfile.interestsSent.push(theirProfile._id);
    await myProfile.save();

    // Add to interestsReceived of their profile
    theirProfile.interestsReceived.push(myProfile._id);
    await theirProfile.save();

    // Check for mutual interest (MATCH!)
    if (theirProfile.interestsSent.includes(myProfile._id)) {
      // Add to both matches arrays
      myProfile.matches.push(theirProfile._id);
      theirProfile.matches.push(myProfile._id);
      await myProfile.save();
      await theirProfile.save();
      return res.json({ message: "It's a Match! 🎉", isMatch: true });
    }

    res.json({ message: 'Interest sent successfully!', isMatch: false });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/interests/received
// @access Private — see who sent interest to me
const getReceivedInterests = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id })
      .populate('interestsReceived', 'name age city profession photos trustScore isVerified gender dateOfBirth');
    res.json(profile.interestsReceived);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/interests/sent
// @access Private — see who I sent interest to
const getSentInterests = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id })
      .populate('interestsSent', 'name age city profession photos trustScore isVerified gender dateOfBirth');
    res.json(profile.interestsSent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/interests/matches
// @access Private — see mutual matches
const getMatches = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id })
      .populate('matches', 'name city profession photos trustScore isVerified dateOfBirth');
    res.json(profile.matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { sendInterest, getReceivedInterests, getSentInterests, getMatches };