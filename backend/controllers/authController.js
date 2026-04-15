// Handles user registration and login
const User = require('../models/User');
const Profile = require('../models/Profile');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @route  POST /api/auth/register
// @access Public
const register = async (req, res) => {
  const { email, password, ...profileData } = req.body;

  try {
    // Check if user already exists
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    // Create user
    const user = await User.create({ email, password });

    // Create a basic profile linked to user
    const profile = await Profile.create({
      user: user._id,
      ...profileData
    });

    // Link profile to user
    user.profile = profile._id;
    await user.save();

    res.status(201).json({
      _id: user._id,
      email: user.email,
      profileId: profile._id,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// @route  POST /api/auth/login
// @access Public
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).populate('profile');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: user._id,
      email: user.email,
      profileId: user.profile?._id,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login' });
  }
};

// @route  GET /api/auth/me
// @access Private
const getMe = async (req, res) => {
  const user = await User.findById(req.user._id).populate('profile');
  res.json(user);
};

module.exports = { register, login, getMe };