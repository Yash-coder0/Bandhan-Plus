// Browse and smart-match profiles
const Profile = require('../models/Profile');

// @route  GET /api/matches/browse
// @access Private — browse all profiles with filters
const browseProfiles = async (req, res) => {
  try {
    // Get current user's profile to exclude from results
    const myProfile = await Profile.findOne({ user: req.user._id });

    // Build filter object from query params
    const filter = {
      user: { $ne: req.user._id }, // Exclude own profile
      isActive: true
    };

    // Gender filter
    if (req.query.gender) filter.gender = req.query.gender;

    // Age range filter (convert to DOB range)
    if (req.query.ageMin || req.query.ageMax) {
      const today = new Date();
      filter.dateOfBirth = {};
      
      // If someone is AT LEAST ageMin years old, they were born ON OR BEFORE (today - ageMin years)
      if (req.query.ageMin) {
        filter.dateOfBirth.$lte = new Date(today.getFullYear() - parseInt(req.query.ageMin), today.getMonth(), today.getDate());
      }
      
      // If someone is AT MOST ageMax years old, they were born ON OR AFTER (today - ageMax years - 1 year to include the full trailing year)
      if (req.query.ageMax) {
        // e.g. ageMax = 25. Born after today - 26 years.
        filter.dateOfBirth.$gte = new Date(today.getFullYear() - parseInt(req.query.ageMax) - 1, today.getMonth(), today.getDate());
      }
    }

    // Religion filter
    if (req.query.religion) filter.religion = req.query.religion;

    // City filter
    if (req.query.city) filter.city = { $regex: req.query.city, $options: 'i' };

    // Education filter
    if (req.query.education) filter.education = req.query.education;

    // Profession filter
    if (req.query.profession) filter.profession = { $regex: req.query.profession, $options: 'i' };

    // Verified only filter
    if (req.query.verified === 'true') filter.isVerified = true;

    // Marital status
    if (req.query.maritalStatus) filter.maritalStatus = req.query.maritalStatus;

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Sort
    const sort = req.query.sort === 'newest' ? { createdAt: -1 } : { trustScore: -1 };

    const profiles = await Profile.find(filter)
      .select('-verificationDocs -interestsSent -interestsReceived') // Hide sensitive fields
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Profile.countDocuments(filter);

    res.json({
      profiles,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/matches/suggested
// @access Private — smart suggested matches based on preferences
const getSuggestedMatches = async (req, res) => {
  try {
    const myProfile = await Profile.findOne({ user: req.user._id });
    if (!myProfile) return res.status(404).json({ message: 'Complete your profile first' });

    // Build smart filter based on partner preferences
    const filter = {
      user: { $ne: req.user._id },
      isActive: true,
      gender: myProfile.gender === 'Male' ? 'Female' : 'Male' // Opposite gender
    };

    // Age preference
    if (myProfile.partnerAgeMin && myProfile.partnerAgeMax) {
      const today = new Date();
      filter.dateOfBirth = {
        $gte: new Date(today.getFullYear() - myProfile.partnerAgeMax, 0, 1),
        $lte: new Date(today.getFullYear() - myProfile.partnerAgeMin, 11, 31)
      };
    }

    // Religion preference
    if (myProfile.partnerReligion?.length > 0) {
      filter.religion = { $in: myProfile.partnerReligion };
    }

    // Location preference
    if (myProfile.partnerLocation?.length > 0) {
      filter.city = { $in: myProfile.partnerLocation };
    }

    const profiles = await Profile.find(filter)
      .select('-verificationDocs')
      .sort({ trustScore: -1, isVerified: -1 })
      .limit(8);

    res.json(profiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/matches/compatibility/:profileId
// @access Private — calculate compatibility score with a profile
const getCompatibility = async (req, res) => {
  try {
    const myProfile = await Profile.findOne({ user: req.user._id });
    const theirProfile = await Profile.findById(req.params.profileId);

    if (!myProfile || !theirProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Calculate compatibility score (0-100 per category)
    let scores = { religion: 0, location: 0, lifestyle: 0, values: 0, education: 0 };

    // Religion match
    if (myProfile.religion === theirProfile.religion) scores.religion = 100;
    else if (myProfile.partnerReligion?.includes(theirProfile.religion)) scores.religion = 70;
    else scores.religion = 30;

    // Location match
    if (myProfile.city === theirProfile.city) scores.location = 100;
    else if (myProfile.state === theirProfile.state) scores.location = 70;
    else scores.location = 30;

    // Lifestyle match (diet)
    if (myProfile.diet === theirProfile.diet) scores.lifestyle = 100;
    else if (['Vegetarian', 'Vegan', 'Jain'].includes(myProfile.diet) && ['Vegetarian', 'Vegan', 'Jain'].includes(theirProfile.diet)) scores.lifestyle = 80;
    else scores.lifestyle = 50;

    // Family values match
    if (myProfile.familyValues === theirProfile.familyValues) scores.values = 100;
    else scores.values = 60;

    // Education level match (simplified)
    if (myProfile.education === theirProfile.education) scores.education = 100;
    else scores.education = 70;

    // Overall weighted score
    const overall = Math.round(
      (scores.religion * 0.2) +
      (scores.location * 0.2) +
      (scores.lifestyle * 0.2) +
      (scores.values * 0.25) +
      (scores.education * 0.15)
    );

    res.json({ scores, overall });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { browseProfiles, getSuggestedMatches, getCompatibility };