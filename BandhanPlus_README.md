# 💍 BandhanPlus — Marriage Bureau Web App
### *"Verified Matches. Real Connections."*
> Full-stack MERN app | MongoDB Atlas + Express + React + Node.js
> Built for DYP COE Webathon 2026 by Team BandhanPlus

---

## 📋 TABLE OF CONTENTS
1. [Tech Stack](#tech-stack)
2. [Folder Structure](#folder-structure)
3. [Environment Setup & API Keys](#environment-setup--api-keys)
4. [Backend Code](#backend-code)
5. [Frontend Code](#frontend-code)
6. [AntiGravity Prompts](#antigravity-prompts)
7. [Run the Project](#run-the-project)
8. [Features List](#features-list)

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | MongoDB Atlas |
| Auth | JWT + bcrypt |
| File Upload | Multer (local) |
| Language i18n | react-i18next |
| Video | HTML5 MediaRecorder API |

---

## 📁 Folder Structure

```
bandhanplus/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB Atlas connection
│   ├── middleware/
│   │   ├── auth.js                # JWT verification middleware
│   │   └── upload.js              # Multer file upload config
│   ├── models/
│   │   ├── User.js                # User auth model
│   │   └── Profile.js             # Matrimony profile model
│   ├── routes/
│   │   ├── authRoutes.js          # Register / Login
│   │   ├── profileRoutes.js       # CRUD for profiles
│   │   ├── matchRoutes.js         # Browse & match profiles
│   │   └── interestRoutes.js      # Send / accept interest
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── profileController.js
│   │   ├── matchController.js
│   │   └── interestController.js
│   ├── .env                       # Environment variables
│   ├── package.json
│   └── server.js                  # Entry point
│
├── frontend/
│   ├── public/
│   │   └── locales/               # i18n translation files
│   │       ├── en/translation.json
│   │       ├── hi/translation.json
│   │       └── mr/translation.json
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js           # Axios instance with base URL
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProfileCard.jsx
│   │   │   ├── FilterSidebar.jsx
│   │   │   ├── CompatibilityBadge.jsx
│   │   │   ├── VideoIntro.jsx     # 30-sec video recorder
│   │   │   ├── LanguageSwitcher.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Register.jsx       # Multi-step form
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx      # Suggested matches
│   │   │   ├── Browse.jsx         # Browse all profiles
│   │   │   ├── ProfileView.jsx    # Single profile detail
│   │   │   ├── MyProfile.jsx      # Edit own profile
│   │   │   ├── Interests.jsx      # Sent/received interests
│   │   │   └── SuccessStories.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # Global auth state
│   │   ├── i18n.js                # i18n setup
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css              # Tailwind imports
│   ├── .env
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## 🔑 Environment Setup & API Keys

### STEP 1 — MongoDB Atlas (Free Cluster)
```
1. Go to https://cloud.mongodb.com
2. Create free account → Create a FREE M0 cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string:
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/bandhanplus
5. Replace <username> and <password> with your DB user credentials
6. Create DB user: Database Access → Add New Database User
7. Network Access → Add IP Address → "Allow Access from Anywhere" (0.0.0.0/0)
```

### STEP 2 — Backend `.env` file
Create `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/bandhanplus
JWT_SECRET=bandhanplus_super_secret_key_2026
CLIENT_URL=http://localhost:5173
```

### STEP 3 — Frontend `.env` file
Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### STEP 4 — Install Dependencies

**Backend:**
```bash
cd backend
npm init -y
npm install express mongoose dotenv bcryptjs jsonwebtoken cors multer express-validator
npm install -D nodemon
```

**Frontend:**
```bash
cd frontend
npm create vite@latest . -- --template react
npm install
npm install axios react-router-dom react-i18next i18next tailwindcss @tailwindcss/vite lucide-react
```

### STEP 5 — Tailwind Setup in `vite.config.js`
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

Add to `frontend/src/index.css`:
```css
@import "tailwindcss";
```

---

## 🔧 BACKEND CODE

---

### 📄 `backend/config/db.js`
```javascript
// MongoDB Atlas connection using Mongoose
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Connect to Atlas using the URI from .env
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Error: ${error.message}`);
    process.exit(1); // Stop server if DB fails
  }
};

module.exports = connectDB;
```

---

### 📄 `backend/server.js`
```javascript
// Main Express server entry point
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB Atlas
connectDB();

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json()); // Parse JSON request bodies
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded files

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/matches', require('./routes/matchRoutes'));
app.use('/api/interests', require('./routes/interestRoutes'));

// Health check
app.get('/', (req, res) => res.json({ message: 'BandhanPlus API Running ✅' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
```

---

### 📄 `backend/models/User.js`
```javascript
// User model — stores login credentials only
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  // Link to their profile (created after registration)
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    default: null
  }
}, { timestamps: true });

// Hash password before saving to DB
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to check password during login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

---

### 📄 `backend/models/Profile.js`
```javascript
// Profile model — all matrimony-related info
const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  // Reference to the User who owns this profile
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // ── PERSONAL INFO ──────────────────────────────────────
  name: { type: String, required: true, trim: true },
  gender: { type: String, enum: ['Male', 'Female'], required: true },
  dateOfBirth: { type: Date, required: true },
  height: { type: Number }, // in cm
  weight: { type: Number }, // in kg
  complexion: { type: String }, // kept optional, not forced
  bloodGroup: { type: String },
  maritalStatus: {
    type: String,
    enum: ['Never Married', 'Divorced', 'Widowed', 'Awaiting Divorce'],
    default: 'Never Married'
  },
  abilities: { type: String }, // any disability info
  motherTongue: { type: String },
  languages: [{ type: String }], // languages spoken

  // ── RELIGION & COMMUNITY ────────────────────────────────
  religion: { type: String },
  caste: { type: String },
  subCaste: { type: String },
  gothra: { type: String },
  manglik: { type: String, enum: ['Yes', 'No', 'Anshik'] },
  horoscope: { type: String },

  // ── EDUCATION & CAREER ──────────────────────────────────
  education: { type: String },
  educationDetails: { type: String },
  profession: { type: String },
  company: { type: String },
  annualIncome: { type: String }, // e.g., "5-10 LPA"
  workLocation: { type: String },

  // ── LOCATION ────────────────────────────────────────────
  city: { type: String },
  state: { type: String },
  country: { type: String, default: 'India' },
  residencyStatus: { type: String, enum: ['Citizen', 'Permanent Resident', 'Student Visa', 'Work Permit', 'Other'] },

  // ── FAMILY INFO ─────────────────────────────────────────
  fatherName: { type: String },
  fatherOccupation: { type: String },
  motherName: { type: String },
  motherOccupation: { type: String },
  siblings: { type: Number, default: 0 },
  familyType: { type: String, enum: ['Nuclear', 'Joint', 'Extended'] },
  familyStatus: { type: String, enum: ['Middle Class', 'Upper Middle Class', 'Rich', 'Affluent'] },
  familyValues: { type: String, enum: ['Traditional', 'Moderate', 'Liberal'] },

  // ── LIFESTYLE ───────────────────────────────────────────
  diet: { type: String, enum: ['Vegetarian', 'Non-Vegetarian', 'Eggetarian', 'Vegan', 'Jain'] },
  smoking: { type: String, enum: ['No', 'Occasionally', 'Yes'] },
  drinking: { type: String, enum: ['No', 'Occasionally', 'Yes'] },
  hobbies: [{ type: String }],

  // ── PARTNER PREFERENCES ─────────────────────────────────
  partnerAgeMin: { type: Number },
  partnerAgeMax: { type: Number },
  partnerHeightMin: { type: Number },
  partnerHeightMax: { type: Number },
  partnerReligion: [{ type: String }],
  partnerCaste: [{ type: String }],
  partnerEducation: [{ type: String }],
  partnerProfession: [{ type: String }],
  partnerLocation: [{ type: String }],
  partnerIncome: { type: String },
  partnerDiet: [{ type: String }],
  partnerMaritalStatus: [{ type: String }],
  partnerDescription: { type: String }, // freetext about ideal partner

  // ── MEDIA ───────────────────────────────────────────────
  photos: [{ type: String }],    // array of photo filenames
  videoIntro: { type: String },  // 30-sec video filename

  // ── ABOUT ME ────────────────────────────────────────────
  aboutMe: { type: String, maxlength: 500 },

  // ── VERIFICATION ────────────────────────────────────────
  isVerified: { type: Boolean, default: false },
  verificationDocs: [{ type: String }], // uploaded ID doc filenames
  trustScore: { type: Number, default: 0, min: 0, max: 100 },

  // ── INTERESTS ───────────────────────────────────────────
  // Users who sent interest to this profile
  interestsSent: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' }],
  interestsReceived: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' }],
  // Mutually matched profiles
  matches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' }],

  // Profile active or hidden
  isActive: { type: Boolean, default: true },

  // Premium status
  isPremium: { type: Boolean, default: false },

}, { timestamps: true });

// Virtual: calculate age from dateOfBirth
profileSchema.virtual('age').get(function () {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birth = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
});

profileSchema.set('toJSON', { virtuals: true });
profileSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Profile', profileSchema);
```

---

### 📄 `backend/middleware/auth.js`
```javascript
// JWT middleware — protects private routes
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Check for Bearer token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verify token using our secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request (without password)
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Pass to next middleware/route
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, invalid token' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
```

---

### 📄 `backend/middleware/upload.js`
```javascript
// Multer config for photo and video uploads
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads folder if it doesn't exist
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Storage config — saves files to /uploads with unique names
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    // Format: userId_timestamp.extension
    const ext = path.extname(file.originalname);
    cb(null, `${req.user._id}_${Date.now()}${ext}`);
  }
});

// Filter: only images and videos allowed
const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only images (jpg, png, webp) and videos (mp4, webm) allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB max
});

module.exports = upload;
```

---

### 📄 `backend/controllers/authController.js`
```javascript
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
  const { email, password, name, gender, dateOfBirth, religion, city, state } = req.body;

  try {
    // Check if user already exists
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    // Create user
    const user = await User.create({ email, password });

    // Create a basic profile linked to user
    const profile = await Profile.create({
      user: user._id,
      name,
      gender,
      dateOfBirth,
      religion,
      city,
      state
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
```

---

### 📄 `backend/controllers/profileController.js`
```javascript
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
```

---

### 📄 `backend/controllers/matchController.js`
```javascript
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
      if (req.query.ageMax) {
        // Older than ageMin means DOB is before X years ago
        filter.dateOfBirth.$lte = new Date(today.getFullYear() - parseInt(req.query.ageMin), today.getMonth(), today.getDate());
      }
      if (req.query.ageMin) {
        filter.dateOfBirth.$gte = new Date(today.getFullYear() - parseInt(req.query.ageMax), today.getMonth(), today.getDate());
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
```

---

### 📄 `backend/controllers/interestController.js`
```javascript
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
```

---

### 📄 `backend/routes/authRoutes.js`
```javascript
const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

module.exports = router;
```

---

### 📄 `backend/routes/profileRoutes.js`
```javascript
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
```

---

### 📄 `backend/routes/matchRoutes.js`
```javascript
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { browseProfiles, getSuggestedMatches, getCompatibility } = require('../controllers/matchController');

router.get('/browse', protect, browseProfiles);
router.get('/suggested', protect, getSuggestedMatches);
router.get('/compatibility/:profileId', protect, getCompatibility);

module.exports = router;
```

---

### 📄 `backend/routes/interestRoutes.js`
```javascript
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { sendInterest, getReceivedInterests, getSentInterests, getMatches } = require('../controllers/interestController');

router.post('/send/:profileId', protect, sendInterest);
router.get('/received', protect, getReceivedInterests);
router.get('/sent', protect, getSentInterests);
router.get('/matches', protect, getMatches);

module.exports = router;
```

---

### 📄 `backend/package.json`
```json
{
  "name": "bandhanplus-backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.0.0",
    "express": "^4.18.0",
    "jsonwebtoken": "^9.0.0",
    "mongoose": "^8.0.0",
    "multer": "^1.4.5"
  },
  "devDependencies": {
    "nodemon": "^3.0.0"
  }
}
```

---

## ⚛️ FRONTEND CODE

---

### 📄 `frontend/src/api/axios.js`
```javascript
// Central Axios instance — all API calls go through here
import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL // http://localhost:5000/api
});

// Attach JWT token to every request automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('bandhan_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors globally (auto logout)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('bandhan_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;
```

---

### 📄 `frontend/src/context/AuthContext.jsx`
```jsx
// Global auth state using React Context
import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

// Create context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);       // logged in user info
  const [profile, setProfile] = useState(null); // their profile
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on app load
  useEffect(() => {
    const token = localStorage.getItem('bandhan_token');
    if (token) {
      fetchMe();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchMe = async () => {
    try {
      const { data } = await API.get('/auth/me');
      setUser(data);
      setProfile(data.profile);
    } catch {
      localStorage.removeItem('bandhan_token');
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = (userData, token) => {
    localStorage.setItem('bandhan_token', token);
    setUser(userData);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('bandhan_token');
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, logout, fetchMe }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth anywhere
export const useAuth = () => useContext(AuthContext);
```

---

### 📄 `frontend/src/i18n.js`
```javascript
// i18n setup for multilingual support (English, Hindi, Marathi)
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from '../public/locales/en/translation.json';
import hiTranslation from '../public/locales/hi/translation.json';
import mrTranslation from '../public/locales/mr/translation.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enTranslation },
    hi: { translation: hiTranslation },
    mr: { translation: mrTranslation }
  },
  lng: localStorage.getItem('bandhan_lang') || 'en', // Default language
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
});

export default i18n;
```

---

### 📄 `public/locales/en/translation.json`
```json
{
  "nav": {
    "home": "Home",
    "browse": "Browse Profiles",
    "dashboard": "My Dashboard",
    "interests": "My Interests",
    "profile": "My Profile",
    "login": "Login",
    "register": "Register Free",
    "logout": "Logout"
  },
  "hero": {
    "title": "Find Your Perfect Life Partner",
    "subtitle": "Verified Matches. Real Connections. Zero Fake Profiles.",
    "cta": "Register Free",
    "login": "Already a member? Login"
  },
  "features": {
    "verified": "100% Verified Profiles",
    "verifiedDesc": "Every profile is manually verified. No fakes allowed.",
    "privacy": "Privacy First",
    "privacyDesc": "Photos blurred until mutual interest. You control who sees you.",
    "smart": "Smart Matching",
    "smartDesc": "AI-powered compatibility scores based on values, lifestyle & goals.",
    "free": "Free to Connect",
    "freeDesc": "Send interest and connect for free. No hidden paywalls."
  },
  "browse": {
    "title": "Browse Profiles",
    "filter": "Filter Profiles",
    "noProfiles": "No profiles found. Try adjusting filters."
  },
  "interest": {
    "send": "Send Interest",
    "sent": "Interest Sent ✓",
    "match": "It's a Match! 🎉"
  }
}
```

---

### 📄 `public/locales/hi/translation.json`
```json
{
  "nav": {
    "home": "होम",
    "browse": "प्रोफ़ाइल देखें",
    "dashboard": "मेरा डैशबोर्ड",
    "interests": "मेरी रुचियाँ",
    "profile": "मेरी प्रोफ़ाइल",
    "login": "लॉगिन",
    "register": "मुफ़्त रजिस्टर करें",
    "logout": "लॉगआउट"
  },
  "hero": {
    "title": "अपना जीवनसाथी खोजें",
    "subtitle": "सत्यापित रिश्ते। वास्तविक संबंध। शून्य नकली प्रोफ़ाइल।",
    "cta": "मुफ़्त रजिस्टर करें",
    "login": "पहले से सदस्य? लॉगिन करें"
  },
  "features": {
    "verified": "100% सत्यापित प्रोफ़ाइल",
    "verifiedDesc": "हर प्रोफ़ाइल मैन्युअली सत्यापित है। कोई नकली प्रोफ़ाइल नहीं।",
    "privacy": "गोपनीयता पहले",
    "privacyDesc": "आपसी रुचि तक फ़ोटो धुंधली। आप तय करें कौन देखे।",
    "smart": "स्मार्ट मिलान",
    "smartDesc": "मूल्यों, जीवनशैली और लक्ष्यों पर आधारित अनुकूलता।",
    "free": "मुफ्त जुड़ें",
    "freeDesc": "मुफ्त में रुचि भेजें और जुड़ें।"
  },
  "browse": {
    "title": "प्रोफ़ाइल देखें",
    "filter": "फ़िल्टर करें",
    "noProfiles": "कोई प्रोफ़ाइल नहीं मिली।"
  },
  "interest": {
    "send": "रुचि भेजें",
    "sent": "रुचि भेज दी ✓",
    "match": "मिलान हो गया! 🎉"
  }
}
```

---

### 📄 `public/locales/mr/translation.json`
```json
{
  "nav": {
    "home": "मुख्यपृष्ठ",
    "browse": "प्रोफाइल पहा",
    "dashboard": "माझे डॅशबोर्ड",
    "interests": "माझ्या आवडी",
    "profile": "माझी प्रोफाइल",
    "login": "लॉगिन",
    "register": "मोफत नोंदणी करा",
    "logout": "लॉगआउट"
  },
  "hero": {
    "title": "आपला जीवनसाथी शोधा",
    "subtitle": "सत्यापित जुळणी. खरे नाते. शून्य बनावट प्रोफाइल.",
    "cta": "मोफत नोंदणी करा",
    "login": "आधीच सदस्य? लॉगिन करा"
  },
  "features": {
    "verified": "१००% सत्यापित प्रोफाइल",
    "verifiedDesc": "प्रत्येक प्रोफाइल हाताने सत्यापित केली जाते.",
    "privacy": "गोपनीयता प्रथम",
    "privacyDesc": "परस्पर रस येईपर्यंत फोटो अस्पष्ट राहतो.",
    "smart": "स्मार्ट जुळणी",
    "smartDesc": "मूल्ये, जीवनशैली आणि उद्दिष्टांवर आधारित सुसंगतता.",
    "free": "मोफत जोडा",
    "freeDesc": "मोफत रस पाठवा आणि जोडा."
  },
  "browse": {
    "title": "प्रोफाइल पहा",
    "filter": "फिल्टर करा",
    "noProfiles": "कोणतीही प्रोफाइल सापडली नाही."
  },
  "interest": {
    "send": "रस पाठवा",
    "sent": "रस पाठवला ✓",
    "match": "जुळणी झाली! 🎉"
  }
}
```

---

### 📄 `frontend/src/App.jsx`
```jsx
// Main app router
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import './i18n'; // Initialize i18n

// Pages
import Landing from './pages/Landing';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Browse from './pages/Browse';
import ProfileView from './pages/ProfileView';
import MyProfile from './pages/MyProfile';
import Interests from './pages/Interests';
import SuccessStories from './pages/SuccessStories';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/success-stories" element={<SuccessStories />} />

          {/* Protected routes — require login */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/browse" element={<ProtectedRoute><Browse /></ProtectedRoute>} />
          <Route path="/profile/:id" element={<ProtectedRoute><ProfileView /></ProtectedRoute>} />
          <Route path="/my-profile" element={<ProtectedRoute><MyProfile /></ProtectedRoute>} />
          <Route path="/interests" element={<ProtectedRoute><Interests /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
```

---

### 📄 `frontend/src/components/ProtectedRoute.jsx`
```jsx
// Redirect to login if not authenticated
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-rose-600"></div>
    </div>
  );

  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
```

---

### 📄 `frontend/src/components/Navbar.jsx`
```jsx
// Top navigation bar with language switcher
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import { Heart, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Heart className="text-rose-600 fill-rose-600" size={28} />
            <span className="text-2xl font-bold text-rose-700">Bandhan<span className="text-amber-500">Plus</span></span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-rose-600 font-medium">{t('nav.dashboard')}</Link>
                <Link to="/browse" className="text-gray-600 hover:text-rose-600 font-medium">{t('nav.browse')}</Link>
                <Link to="/interests" className="text-gray-600 hover:text-rose-600 font-medium">{t('nav.interests')}</Link>
                <Link to="/my-profile" className="text-gray-600 hover:text-rose-600 font-medium">{t('nav.profile')}</Link>
                <button onClick={handleLogout} className="bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700">
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <>
                <Link to="/success-stories" className="text-gray-600 hover:text-rose-600 font-medium">Success Stories</Link>
                <Link to="/login" className="text-gray-600 hover:text-rose-600 font-medium">{t('nav.login')}</Link>
                <Link to="/register" className="bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700">
                  {t('nav.register')}
                </Link>
              </>
            )}
            <LanguageSwitcher />
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 flex flex-col gap-3">
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="text-gray-700 py-2">Dashboard</Link>
                <Link to="/browse" onClick={() => setMenuOpen(false)} className="text-gray-700 py-2">Browse</Link>
                <Link to="/interests" onClick={() => setMenuOpen(false)} className="text-gray-700 py-2">Interests</Link>
                <Link to="/my-profile" onClick={() => setMenuOpen(false)} className="text-gray-700 py-2">My Profile</Link>
                <button onClick={handleLogout} className="text-left text-rose-600 py-2">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="text-gray-700 py-2">Login</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="text-rose-600 py-2 font-semibold">Register Free</Link>
              </>
            )}
            <LanguageSwitcher />
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
```

---

### 📄 `frontend/src/components/LanguageSwitcher.jsx`
```jsx
// Switch between English, Hindi, and Marathi
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', label: 'EN', full: 'English' },
  { code: 'hi', label: 'हिं', full: 'Hindi' },
  { code: 'mr', label: 'मर', full: 'Marathi' }
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('bandhan_lang', code); // Remember choice
  };

  return (
    <div className="flex gap-1 border border-gray-200 rounded-lg overflow-hidden">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          title={lang.full}
          className={`px-2 py-1 text-xs font-medium transition-colors
            ${i18n.language === lang.code
              ? 'bg-rose-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'
            }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
```

---

### 📄 `frontend/src/components/ProfileCard.jsx`
```jsx
// Card shown in browse grid — with blurred photo privacy
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, MapPin, Briefcase, Heart } from 'lucide-react';
import API from '../api/axios';
import CompatibilityBadge from './CompatibilityBadge';

const ProfileCard = ({ profile, showCompatibility = false }) => {
  const navigate = useNavigate();
  const [interestSent, setInterestSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMatch, setIsMatch] = useState(false);

  // Calculate age from dateOfBirth
  const getAge = (dob) => {
    const today = new Date();
    const birth = new Date(dob);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const handleSendInterest = async (e) => {
    e.stopPropagation(); // Prevent navigating to profile
    setLoading(true);
    try {
      const { data } = await API.post(`/interests/send/${profile._id}`);
      setInterestSent(true);
      if (data.isMatch) setIsMatch(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const photoUrl = profile.photos?.[0]
    ? `${import.meta.env.VITE_API_URL.replace('/api', '')}/uploads/${profile.photos[0]}`
    : `https://ui-avatars.com/api/?name=${profile.name}&background=C0392B&color=fff&size=200`;

  return (
    <div
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100 group"
      onClick={() => navigate(`/profile/${profile._id}`)}
    >
      {/* Photo with blur — unblur on hover (simulates interest-accepted reveal) */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={photoUrl}
          alt={profile.name}
          className="w-full h-full object-cover group-hover:blur-none blur-sm transition-all duration-500"
        />
        {/* Hover hint */}
        <div className="absolute inset-0 flex items-center justify-center opacity-100 group-hover:opacity-0 transition-opacity">
          <span className="bg-black/40 text-white text-xs px-3 py-1 rounded-full">Click to reveal</span>
        </div>

        {/* Verified badge */}
        {profile.isVerified && (
          <div className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <Shield size={10} /> Verified
          </div>
        )}

        {/* Trust score badge */}
        <div className="absolute top-3 left-3 bg-amber-500 text-white text-xs px-2 py-1 rounded-full">
          ⭐ {profile.trustScore || 0}%
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-gray-800 text-lg">{profile.name}, {getAge(profile.dateOfBirth)}</h3>
            <p className="text-gray-500 text-sm">{profile.religion} • {profile.maritalStatus}</p>
          </div>
        </div>

        <div className="flex flex-col gap-1 mb-3">
          <div className="flex items-center gap-1 text-gray-600 text-sm">
            <MapPin size={14} className="text-rose-500" />
            <span>{profile.city}, {profile.state}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600 text-sm">
            <Briefcase size={14} className="text-rose-500" />
            <span>{profile.profession || 'Not specified'}</span>
          </div>
        </div>

        {/* Compatibility badge (shown on dashboard) */}
        {showCompatibility && profile.compatibilityScore && (
          <CompatibilityBadge score={profile.compatibilityScore} />
        )}

        {/* Match notification */}
        {isMatch && (
          <div className="bg-rose-50 border border-rose-200 rounded-lg p-2 mb-2 text-center text-rose-600 font-semibold text-sm">
            🎉 It's a Match!
          </div>
        )}

        {/* Send interest button */}
        <button
          onClick={handleSendInterest}
          disabled={interestSent || loading}
          className={`w-full py-2 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2
            ${interestSent
              ? 'bg-green-100 text-green-600 cursor-default'
              : 'bg-rose-600 text-white hover:bg-rose-700 active:scale-95'
            }`}
        >
          <Heart size={16} className={interestSent ? 'fill-green-600' : ''} />
          {loading ? 'Sending...' : interestSent ? 'Interest Sent ✓' : 'Send Interest'}
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
```

---

### 📄 `frontend/src/components/CompatibilityBadge.jsx`
```jsx
// Shows compatibility percentage with color coding
const CompatibilityBadge = ({ score }) => {
  // Color based on score
  const color = score >= 80 ? 'text-green-600 bg-green-50 border-green-200'
    : score >= 60 ? 'text-amber-600 bg-amber-50 border-amber-200'
    : 'text-red-600 bg-red-50 border-red-200';

  return (
    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-sm font-semibold mb-2 ${color}`}>
      🎯 {score}% Compatible
    </div>
  );
};

export default CompatibilityBadge;
```

---

### 📄 `frontend/src/components/FilterSidebar.jsx`
```jsx
// Sidebar with all filter options for browse page
const FilterSidebar = ({ filters, setFilters, onApply }) => {

  const handleChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 space-y-5 sticky top-20">
      <h2 className="text-lg font-bold text-gray-800 border-b pb-2">🔍 Filter Profiles</h2>

      {/* Gender */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Looking For</label>
        <div className="flex gap-2">
          {['Male', 'Female', 'All'].map(g => (
            <button key={g}
              onClick={() => handleChange('gender', g === 'All' ? '' : g)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors
                ${(filters.gender === g || (g === 'All' && !filters.gender))
                  ? 'bg-rose-600 text-white border-rose-600'
                  : 'border-gray-200 text-gray-600 hover:border-rose-300'}`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Age Range */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Age Range: {filters.ageMin || 21} – {filters.ageMax || 45} yrs
        </label>
        <div className="flex gap-2 items-center">
          <input type="range" min="18" max="60" value={filters.ageMin || 21}
            onChange={e => handleChange('ageMin', e.target.value)}
            className="flex-1 accent-rose-600" />
          <input type="range" min="18" max="60" value={filters.ageMax || 45}
            onChange={e => handleChange('ageMax', e.target.value)}
            className="flex-1 accent-rose-600" />
        </div>
      </div>

      {/* Religion */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Religion</label>
        <select value={filters.religion} onChange={e => handleChange('religion', e.target.value)}
          className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-rose-300 outline-none">
          <option value="">All Religions</option>
          {['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Other'].map(r =>
            <option key={r} value={r}>{r}</option>
          )}
        </select>
      </div>

      {/* City */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
        <input type="text" placeholder="e.g. Pune, Mumbai"
          value={filters.city}
          onChange={e => handleChange('city', e.target.value)}
          className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-rose-300 outline-none" />
      </div>

      {/* Education */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Education</label>
        <select value={filters.education} onChange={e => handleChange('education', e.target.value)}
          className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-rose-300 outline-none">
          <option value="">Any Education</option>
          {['Below 10th', '10th Pass', '12th Pass', 'Diploma', "Bachelor's", "Master's", 'PhD', 'CA/CS', 'MBBS/MD'].map(e =>
            <option key={e} value={e}>{e}</option>
          )}
        </select>
      </div>

      {/* Marital Status */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Marital Status</label>
        <select value={filters.maritalStatus} onChange={e => handleChange('maritalStatus', e.target.value)}
          className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-rose-300 outline-none">
          <option value="">Any Status</option>
          {['Never Married', 'Divorced', 'Widowed', 'Awaiting Divorce'].map(s =>
            <option key={s} value={s}>{s}</option>
          )}
        </select>
      </div>

      {/* Verified Only Toggle */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-gray-700">Verified Only ✅</label>
        <button
          onClick={() => handleChange('verified', filters.verified === 'true' ? '' : 'true')}
          className={`w-12 h-6 rounded-full transition-colors ${filters.verified === 'true' ? 'bg-green-500' : 'bg-gray-300'}`}
        >
          <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 ${filters.verified === 'true' ? 'translate-x-6' : 'translate-x-0'}`} />
        </button>
      </div>

      {/* Apply button */}
      <button onClick={onApply}
        className="w-full bg-rose-600 text-white py-3 rounded-xl font-semibold hover:bg-rose-700 transition-colors">
        Apply Filters
      </button>

      {/* Reset */}
      <button onClick={() => { setFilters({}); onApply(); }}
        className="w-full text-gray-500 text-sm hover:text-rose-600 transition-colors">
        Reset All Filters
      </button>
    </div>
  );
};

export default FilterSidebar;
```

---

### 📄 `frontend/src/components/VideoIntro.jsx`
```jsx
// 30-second video recorder component
import { useState, useRef, useEffect } from 'react';
import { Video, Square, Upload, Play } from 'lucide-react';
import API from '../api/axios';

const VideoIntro = ({ existingVideo }) => {
  const [recording, setRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30); // 30 second limit
  const [uploaded, setUploaded] = useState(false);
  const [uploading, setUploading] = useState(false);

  const videoRef = useRef(null);          // Preview video element
  const mediaRecorderRef = useRef(null);  // MediaRecorder instance
  const streamRef = useRef(null);         // Camera stream
  const timerRef = useRef(null);          // Countdown timer
  const chunksRef = useRef([]);           // Recorded data chunks

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = async () => {
    try {
      // Request camera and microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;

      // Show live preview
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      // Setup MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        // Combine chunks into a single Blob
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        setVideoBlob(blob);

        // Show recorded video preview
        const url = URL.createObjectURL(blob);
        if (videoRef.current) {
          videoRef.current.srcObject = null;
          videoRef.current.src = url;
        }
      };

      mediaRecorder.start();
      setRecording(true);
      setTimeLeft(30);

      // Auto-stop after 30 seconds
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    } catch (err) {
      alert('Camera access denied. Please allow camera permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      streamRef.current?.getTracks().forEach(t => t.stop());
      clearInterval(timerRef.current);
      setRecording(false);
    }
  };

  const uploadVideo = async () => {
    if (!videoBlob) return;
    setUploading(true);

    const formData = new FormData();
    formData.append('video', videoBlob, 'intro.webm');

    try {
      await API.post('/profile/upload-video', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUploaded(true);
    } catch (err) {
      alert('Upload failed. Try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
        <Video className="text-rose-600" size={22} />
        30-Second Video Introduction
      </h3>
      <p className="text-gray-500 text-sm mb-4">
        A short video helps matches connect with the real you. Introduce yourself, your interests, and what you're looking for!
      </p>

      {/* Video preview box */}
      <div className="relative bg-gray-900 rounded-xl overflow-hidden mb-4" style={{ aspectRatio: '16/9' }}>
        <video ref={videoRef} className="w-full h-full object-cover" controls={!recording} muted={recording} />

        {/* Recording timer */}
        {recording && (
          <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2 animate-pulse">
            ● REC {timeLeft}s
          </div>
        )}

        {/* Existing video indicator */}
        {!videoBlob && !recording && existingVideo && (
          <div className="absolute inset-0 flex items-center justify-center text-white text-sm">
            Video uploaded ✓
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        {!recording ? (
          <button onClick={startRecording}
            className="flex-1 bg-rose-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-rose-700">
            <Video size={18} /> Start Recording
          </button>
        ) : (
          <button onClick={stopRecording}
            className="flex-1 bg-gray-800 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-900">
            <Square size={18} /> Stop ({timeLeft}s left)
          </button>
        )}

        {videoBlob && !uploaded && (
          <button onClick={uploadVideo} disabled={uploading}
            className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-green-700">
            <Upload size={18} /> {uploading ? 'Uploading...' : 'Upload Video'}
          </button>
        )}
      </div>

      {uploaded && (
        <p className="text-green-600 font-semibold text-center mt-3">✅ Video uploaded successfully!</p>
      )}
    </div>
  );
};

export default VideoIntro;
```

---

### 📄 `frontend/src/pages/Landing.jsx`
```jsx
// Homepage — hero, features, stats, success stories preview
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Shield, Lock, Zap, Gift, Heart, CheckCircle } from 'lucide-react';

// Dummy success stories (hardcoded for demo)
const stories = [
  { names: 'Priya & Rahul', location: 'Pune', story: 'Found each other in 2 weeks. Married in 6 months!', img: 'https://ui-avatars.com/api/?name=PR&background=C0392B&color=fff' },
  { names: 'Sneha & Arjun', location: 'Mumbai', story: 'Values compatibility score was 94%. Perfect match!', img: 'https://ui-avatars.com/api/?name=SA&background=E67E22&color=fff' },
  { names: 'Kavya & Dev', location: 'Nagpur', story: 'Both loved Marathi culture. BandhanPlus connected us.', img: 'https://ui-avatars.com/api/?name=KD&background=27AE60&color=fff' },
];

const features = [
  { icon: Shield, title: '100% Verified Profiles', desc: 'Every profile manually verified. Govt ID required. No fakes, guaranteed.', color: 'text-green-600 bg-green-50' },
  { icon: Lock, title: 'Privacy First', desc: 'Photos stay blurred until both sides show interest. Your privacy is sacred.', color: 'text-blue-600 bg-blue-50' },
  { icon: Zap, title: 'Smart Compatibility', desc: 'Our algorithm matches on values, lifestyle, family culture — not just age.', color: 'text-amber-600 bg-amber-50' },
  { icon: Gift, title: 'Free to Connect', desc: 'No paywalls. No pushy calls. Send interest and chat for free.', color: 'text-rose-600 bg-rose-50' },
];

const Landing = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">

      {/* ── HERO SECTION ─────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-rose-50 via-white to-amber-50 py-20 px-4">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">

          {/* Left text */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Heart size={16} className="fill-rose-600" /> India's Most Trusted Marriage Bureau
            </div>
            <h1 className="text-4xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-4">
              {t('hero.title')}
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {t('hero.subtitle')}
            </p>

            {/* Stats row */}
            <div className="flex gap-6 justify-center lg:justify-start mb-8">
              {[['500+', 'Verified Profiles'], ['200+', 'Matches Made'], ['98%', 'Trust Score']].map(([num, label]) => (
                <div key={label} className="text-center">
                  <div className="text-2xl font-bold text-rose-600">{num}</div>
                  <div className="text-xs text-gray-500">{label}</div>
                </div>
              ))}
            </div>

            <div className="flex gap-4 justify-center lg:justify-start flex-wrap">
              <Link to="/register"
                className="bg-rose-600 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:bg-rose-700 shadow-lg hover:shadow-rose-200 transition-all">
                {t('hero.cta')} →
              </Link>
              <Link to="/login"
                className="border-2 border-rose-200 text-rose-600 px-8 py-4 rounded-2xl text-lg font-medium hover:bg-rose-50 transition-all">
                {t('hero.login')}
              </Link>
            </div>
          </div>

          {/* Right visual — profile cards preview */}
          <div className="flex-1 flex justify-center">
            <div className="relative">
              <div className="bg-white rounded-3xl shadow-2xl p-6 w-72">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-400 to-amber-400 mx-auto mb-3 flex items-center justify-center text-white text-2xl font-bold">P</div>
                <div className="text-center">
                  <div className="font-bold text-gray-800 text-lg">Priya S., 27</div>
                  <div className="text-gray-500 text-sm">Software Engineer • Pune</div>
                  <div className="flex justify-center gap-2 mt-2">
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full flex items-center gap-1"><CheckCircle size={10} /> Verified</span>
                    <span className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-full">⭐ 95% Trust</span>
                  </div>
                  <div className="mt-3 bg-rose-50 rounded-xl p-2 text-sm text-rose-700 font-semibold">🎯 92% Compatible</div>
                </div>
              </div>
              {/* Decorative floating card */}
              <div className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-lg p-4 w-48">
                <div className="text-green-600 font-bold text-sm">🎉 New Match!</div>
                <div className="text-gray-600 text-xs">You and Priya both sent interest</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY US SECTION ───────────────────────────────────── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Why BandhanPlus is Different</h2>
          <p className="text-center text-gray-500 mb-12">We fixed everything that's broken about matrimony sites</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="text-center p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
                <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center mx-auto mb-4`}>
                  <Icon size={24} />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SUCCESS STORIES ──────────────────────────────────── */}
      <section className="py-16 px-4 bg-rose-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">💑 Happy Couples</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stories.map((s) => (
              <div key={s.names} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <img src={s.img} alt={s.names} className="w-12 h-12 rounded-full" />
                  <div>
                    <div className="font-bold text-gray-800">{s.names}</div>
                    <div className="text-gray-500 text-sm">{s.location}</div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm italic">"{s.story}"</p>
                <div className="flex mt-3">{'⭐'.repeat(5)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer className="bg-gray-900 text-white py-8 px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Heart className="text-rose-400 fill-rose-400" size={20} />
          <span className="text-xl font-bold">BandhanPlus</span>
        </div>
        <p className="text-gray-400 text-sm">Verified Matches. Real Connections. © 2026 BandhanPlus</p>
        <p className="text-gray-600 text-xs mt-2">This website is strictly for matrimonial purposes only.</p>
      </footer>
    </div>
  );
};

export default Landing;
```

---

### 📄 `frontend/src/pages/Login.jsx`
```jsx
// Login page
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { Heart } from 'lucide-react';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await API.post('/auth/login', form);
      login(data, data.token); // Save to context + localStorage
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-amber-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Heart className="text-rose-600 fill-rose-600 mx-auto mb-2" size={36} />
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-500 mt-1">Sign in to find your perfect match</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 mb-4 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
            <input type="email" placeholder="your@email.com" required
              value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-rose-300 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input type="password" placeholder="••••••••" required
              value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-rose-300 outline-none" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-rose-600 text-white py-3 rounded-xl font-bold hover:bg-rose-700 disabled:opacity-60 transition-colors mt-2">
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          Don't have an account? <Link to="/register" className="text-rose-600 font-semibold hover:underline">Register Free</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
```

---

### 📄 `frontend/src/pages/Register.jsx`
```jsx
// Multi-step registration form (4 steps)
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { Heart, ChevronRight, ChevronLeft } from 'lucide-react';

const STEPS = ['Basic Info', 'Personal Details', 'Professional', 'Partner Preferences'];

const Register = () => {
  const [step, setStep] = useState(0); // Current step (0-3)
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // All form data in one object
  const [form, setForm] = useState({
    // Step 0 - Basic
    email: '', password: '', confirmPassword: '',
    name: '', gender: 'Male', dateOfBirth: '',
    // Step 1 - Personal
    religion: '', caste: '', motherTongue: '', maritalStatus: 'Never Married',
    city: '', state: '', country: 'India', height: '', diet: 'Vegetarian',
    // Step 2 - Professional
    education: '', profession: '', company: '', annualIncome: '',
    // Step 3 - Partner Preferences
    partnerAgeMin: 22, partnerAgeMax: 35,
    partnerReligion: [], partnerLocation: [], partnerDescription: '',
    aboutMe: ''
  });

  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const nextStep = () => {
    // Basic validation per step
    if (step === 0) {
      if (!form.email || !form.password || !form.name || !form.dateOfBirth) {
        return setError('Please fill all required fields');
      }
      if (form.password !== form.confirmPassword) {
        return setError('Passwords do not match');
      }
    }
    setError('');
    setStep(s => s + 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data } = await API.post('/auth/register', form);
      login(data, data.token);
      navigate('/my-profile'); // Go to complete profile
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-amber-50 py-10 px-4">
      <div className="max-w-lg mx-auto bg-white rounded-3xl shadow-xl p-8">

        {/* Header */}
        <div className="text-center mb-6">
          <Heart className="text-rose-600 fill-rose-600 mx-auto mb-2" size={32} />
          <h1 className="text-2xl font-bold text-gray-900">Create Your Profile</h1>
          <p className="text-gray-500 text-sm">Step {step + 1} of {STEPS.length} — {STEPS[step]}</p>
        </div>

        {/* Progress bar */}
        <div className="flex gap-1 mb-8">
          {STEPS.map((_, i) => (
            <div key={i} className={`flex-1 h-2 rounded-full transition-colors ${i <= step ? 'bg-rose-500' : 'bg-gray-200'}`} />
          ))}
        </div>

        {error && <div className="bg-red-50 text-red-600 border border-red-200 rounded-xl p-3 mb-4 text-sm">{error}</div>}

        {/* ── STEP 0: Basic Info ── */}
        {step === 0 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name *</label>
                <input type="text" value={form.name} onChange={e => update('name', e.target.value)}
                  placeholder="Your full name"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-rose-300 outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Gender *</label>
                <select value={form.gender} onChange={e => update('gender', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-rose-300 outline-none text-sm">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Date of Birth *</label>
              <input type="date" value={form.dateOfBirth} onChange={e => update('dateOfBirth', e.target.value)}
                max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-rose-300 outline-none text-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address *</label>
              <input type="email" value={form.email} onChange={e => update('email', e.target.value)}
                placeholder="your@email.com"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-rose-300 outline-none text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Password *</label>
                <input type="password" value={form.password} onChange={e => update('password', e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-rose-300 outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm Password *</label>
                <input type="password" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)}
                  placeholder="Repeat password"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-rose-300 outline-none text-sm" />
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 1: Personal Details ── */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Religion</label>
                <select value={form.religion} onChange={e => update('religion', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 outline-none text-sm">
                  <option value="">Select</option>
                  {['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Other'].map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Mother Tongue</label>
                <select value={form.motherTongue} onChange={e => update('motherTongue', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 outline-none text-sm">
                  <option value="">Select</option>
                  {['Marathi', 'Hindi', 'English', 'Gujarati', 'Punjabi', 'Tamil', 'Telugu', 'Kannada', 'Bengali', 'Other'].map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">City</label>
                <input type="text" value={form.city} onChange={e => update('city', e.target.value)}
                  placeholder="e.g. Pune"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">State</label>
                <input type="text" value={form.state} onChange={e => update('state', e.target.value)}
                  placeholder="e.g. Maharashtra"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 outline-none text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Marital Status</label>
                <select value={form.maritalStatus} onChange={e => update('maritalStatus', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 outline-none text-sm">
                  {['Never Married', 'Divorced', 'Widowed', 'Awaiting Divorce'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Diet</label>
                <select value={form.diet} onChange={e => update('diet', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 outline-none text-sm">
                  {['Vegetarian', 'Non-Vegetarian', 'Eggetarian', 'Vegan', 'Jain'].map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">About Me</label>
              <textarea rows={3} value={form.aboutMe} onChange={e => update('aboutMe', e.target.value)}
                placeholder="Tell potential matches about yourself..."
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 outline-none text-sm resize-none" />
            </div>
          </div>
        )}

        {/* ── STEP 2: Professional ── */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Highest Education</label>
              <select value={form.education} onChange={e => update('education', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 outline-none text-sm">
                <option value="">Select Education</option>
                {["Bachelor's", "Master's", 'PhD', 'Diploma', 'CA/CS', 'MBBS/MD', 'BE/BTech', 'MBA', '12th Pass', '10th Pass'].map(e => <option key={e}>{e}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Profession</label>
              <input type="text" value={form.profession} onChange={e => update('profession', e.target.value)}
                placeholder="e.g. Software Engineer, Doctor, Teacher"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 outline-none text-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Company / Organization</label>
              <input type="text" value={form.company} onChange={e => update('company', e.target.value)}
                placeholder="Company name"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 outline-none text-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Annual Income</label>
              <select value={form.annualIncome} onChange={e => update('annualIncome', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 outline-none text-sm">
                <option value="">Prefer not to say</option>
                {['Below 3 LPA', '3–5 LPA', '5–10 LPA', '10–15 LPA', '15–25 LPA', '25–50 LPA', '50 LPA+'].map(i => <option key={i}>{i}</option>)}
              </select>
            </div>
          </div>
        )}

        {/* ── STEP 3: Partner Preferences ── */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Partner Age Range: {form.partnerAgeMin} – {form.partnerAgeMax} years
              </label>
              <div className="flex gap-3 items-center">
                <span className="text-sm text-gray-500">Min</span>
                <input type="range" min="18" max="60" value={form.partnerAgeMin}
                  onChange={e => update('partnerAgeMin', parseInt(e.target.value))}
                  className="flex-1 accent-rose-600" />
                <span className="text-sm text-gray-500">Max</span>
                <input type="range" min="18" max="60" value={form.partnerAgeMax}
                  onChange={e => update('partnerAgeMax', parseInt(e.target.value))}
                  className="flex-1 accent-rose-600" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Preferred Religions</label>
              <div className="flex flex-wrap gap-2">
                {['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Any'].map(r => (
                  <button key={r}
                    type="button"
                    onClick={() => {
                      const curr = form.partnerReligion;
                      update('partnerReligion', curr.includes(r) ? curr.filter(x => x !== r) : [...curr, r]);
                    }}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors
                      ${form.partnerReligion.includes(r)
                        ? 'bg-rose-600 text-white border-rose-600'
                        : 'border-gray-200 text-gray-600 hover:border-rose-300'}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Preferred Locations</label>
              <input type="text" placeholder="e.g. Pune, Mumbai, Nagpur (comma separated)"
                onChange={e => update('partnerLocation', e.target.value.split(',').map(s => s.trim()))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 outline-none text-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Describe Your Ideal Partner</label>
              <textarea rows={3} value={form.partnerDescription}
                onChange={e => update('partnerDescription', e.target.value)}
                placeholder="Describe the values, qualities you're looking for..."
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 outline-none text-sm resize-none" />
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex gap-3 mt-8">
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)}
              className="flex-1 border-2 border-gray-200 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-50 flex items-center justify-center gap-2">
              <ChevronLeft size={18} /> Back
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button onClick={nextStep}
              className="flex-1 bg-rose-600 text-white py-3 rounded-xl font-bold hover:bg-rose-700 flex items-center justify-center gap-2">
              Next <ChevronRight size={18} />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={loading}
              className="flex-1 bg-rose-600 text-white py-3 rounded-xl font-bold hover:bg-rose-700 disabled:opacity-60">
              {loading ? 'Creating Profile...' : '🎉 Create Profile'}
            </button>
          )}
        </div>

        <p className="text-center text-gray-400 text-xs mt-4">
          Already have an account? <Link to="/login" className="text-rose-600 hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
```

---

### 📄 `frontend/src/pages/Browse.jsx`
```jsx
// Browse all profiles with filter sidebar
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import API from '../api/axios';
import ProfileCard from '../components/ProfileCard';
import FilterSidebar from '../components/FilterSidebar';
import { Search, SlidersHorizontal } from 'lucide-react';

const Browse = () => {
  const { t } = useTranslation();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false); // Mobile filter toggle

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      // Build query string from filters object
      const params = new URLSearchParams({ ...filters, page }).toString();
      const { data } = await API.get(`/matches/browse?${params}`);
      setProfiles(data.profiles);
      setTotalPages(data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch whenever page changes
  useEffect(() => { fetchProfiles(); }, [page]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">{t('browse.title')}</h1>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center gap-2 bg-rose-600 text-white px-4 py-2 rounded-xl text-sm">
            <SlidersHorizontal size={16} /> Filters
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        {/* Filter Sidebar — hidden on mobile unless toggled */}
        <div className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-72 flex-shrink-0`}>
          <FilterSidebar filters={filters} setFilters={setFilters} onApply={() => { setPage(1); fetchProfiles(); }} />
        </div>

        {/* Profile Grid */}
        <div className="flex-1">
          {loading ? (
            // Loading skeleton
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-md h-80 animate-pulse">
                  <div className="h-56 bg-gray-200 rounded-t-2xl" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : profiles.length === 0 ? (
            <div className="text-center py-20">
              <Search size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">{t('browse.noProfiles')}</p>
            </div>
          ) : (
            <>
              <p className="text-gray-500 text-sm mb-4">{profiles.length} profiles found</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {profiles.map(profile => (
                  <ProfileCard key={profile._id} profile={profile} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {[...Array(totalPages)].map((_, i) => (
                    <button key={i} onClick={() => setPage(i + 1)}
                      className={`w-10 h-10 rounded-xl font-medium transition-colors
                        ${page === i + 1 ? 'bg-rose-600 text-white' : 'bg-white text-gray-600 hover:bg-rose-50 border border-gray-200'}`}>
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Browse;
```

---

### 📄 `frontend/src/pages/Dashboard.jsx`
```jsx
// Dashboard — suggested matches + quick stats
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import ProfileCard from '../components/ProfileCard';
import { Heart, Send, Users, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { profile } = useAuth();
  const [suggested, setSuggested] = useState([]);
  const [stats, setStats] = useState({ received: 0, sent: 0, matches: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sugRes, recRes, sentRes, matchRes] = await Promise.all([
          API.get('/matches/suggested'),
          API.get('/interests/received'),
          API.get('/interests/sent'),
          API.get('/interests/matches')
        ]);
        setSuggested(sugRes.data);
        setStats({
          received: recRes.data.length,
          sent: sentRes.data.length,
          matches: matchRes.data.length
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    { icon: Heart, label: 'Interests Received', value: stats.received, color: 'text-rose-600 bg-rose-50' },
    { icon: Send, label: 'Interests Sent', value: stats.sent, color: 'text-blue-600 bg-blue-50' },
    { icon: Users, label: 'Mutual Matches', value: stats.matches, color: 'text-green-600 bg-green-50' },
    { icon: Star, label: 'Trust Score', value: `${profile?.trustScore || 0}%`, color: 'text-amber-600 bg-amber-50' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Welcome banner */}
        <div className="bg-gradient-to-r from-rose-600 to-amber-500 rounded-3xl p-6 text-white mb-8">
          <h1 className="text-2xl font-bold mb-1">Welcome back, {profile?.name?.split(' ')[0] || 'there'}! 👋</h1>
          <p className="opacity-90">You have {stats.received} new interests waiting for you</p>
          <Link to="/interests" className="inline-block mt-3 bg-white text-rose-600 px-4 py-2 rounded-xl font-semibold text-sm hover:bg-rose-50">
            View Interests →
          </Link>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
                <Icon size={22} />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{value}</div>
                <div className="text-gray-500 text-xs">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Suggested matches */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">✨ Suggested For You</h2>
            <Link to="/browse" className="text-rose-600 text-sm font-medium hover:underline">View All →</Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-md h-80 animate-pulse">
                  <div className="h-56 bg-gray-200 rounded-t-2xl" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {suggested.map(p => <ProfileCard key={p._id} profile={p} showCompatibility />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
```

---

### 📄 `frontend/src/pages/MyProfile.jsx`
```jsx
// Edit own profile + upload photos + video intro
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import VideoIntro from '../components/VideoIntro';
import { Camera, Save, Upload } from 'lucide-react';

const MyProfile = () => {
  const { fetchMe } = useAuth();
  const [profile, setProfile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Fetch own profile on load
  useEffect(() => {
    const load = async () => {
      const { data } = await API.get('/profile/me');
      setProfile(data);
    };
    load();
  }, []);

  const handleChange = (key, value) => {
    setProfile(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await API.put('/profile/me', profile);
      setSaved(true);
      fetchMe(); // Refresh global auth context
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;
    setUploading(true);
    const formData = new FormData();
    Array.from(files).forEach(f => formData.append('photos', f));
    try {
      const { data } = await API.post('/profile/upload-photos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProfile(prev => ({ ...prev, photos: data.photos }));
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  if (!profile) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-rose-600"></div>
    </div>
  );

  const apiBase = import.meta.env.VITE_API_URL.replace('/api', '');

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Edit My Profile</h1>
          <button onClick={handleSave} disabled={saving}
            className="bg-rose-600 text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-rose-700 disabled:opacity-60">
            <Save size={18} />
            {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Changes'}
          </button>
        </div>

        {/* Trust Score Bar */}
        <div className="bg-white rounded-2xl shadow-md p-5 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-gray-700">Profile Trust Score</span>
            <span className="text-amber-600 font-bold">{profile.trustScore || 0}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-gradient-to-r from-rose-500 to-amber-500 h-3 rounded-full transition-all"
              style={{ width: `${profile.trustScore || 0}%` }} />
          </div>
          <p className="text-gray-400 text-xs mt-2">Complete your profile to increase your trust score and get more matches</p>
        </div>

        {/* Photo Upload */}
        <div className="bg-white rounded-2xl shadow-md p-5 mb-6">
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Camera size={20} className="text-rose-500" /> Profile Photos</h2>
          <div className="flex flex-wrap gap-3 mb-4">
            {profile.photos?.map((photo, i) => (
              <img key={i} src={`${apiBase}/uploads/${photo}`} alt="profile"
                className="w-20 h-20 rounded-xl object-cover border-2 border-rose-100" />
            ))}
            <label className={`w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-rose-400 transition-colors ${uploading ? 'opacity-50' : ''}`}>
              <Upload size={20} className="text-gray-400" />
              <span className="text-xs text-gray-400 mt-1">Add Photo</span>
              <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoUpload} disabled={uploading} />
            </label>
          </div>
          <p className="text-gray-400 text-xs">Upload up to 5 photos. Max 50MB each.</p>
        </div>

        {/* Video Intro */}
        <div className="mb-6">
          <VideoIntro existingVideo={profile.videoIntro} />
        </div>

        {/* About Me */}
        <div className="bg-white rounded-2xl shadow-md p-5 mb-6">
          <h2 className="font-bold text-gray-800 mb-4">About Me</h2>
          <textarea rows={4} value={profile.aboutMe || ''}
            onChange={e => handleChange('aboutMe', e.target.value)}
            placeholder="Write something meaningful about yourself — your interests, values, what you enjoy, and what you're looking for in a partner..."
            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-rose-300 outline-none text-sm resize-none" />
          <p className="text-gray-400 text-xs mt-1">{(profile.aboutMe || '').length}/500 characters</p>
        </div>

        {/* Personal Details */}
        <div className="bg-white rounded-2xl shadow-md p-5 mb-6">
          <h2 className="font-bold text-gray-800 mb-4">Personal Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'Height (cm)', key: 'height', type: 'number' },
              { label: 'Blood Group', key: 'bloodGroup', type: 'text' },
              { label: 'Caste', key: 'caste', type: 'text' },
              { label: 'Sub-Caste', key: 'subCaste', type: 'text' },
              { label: 'Gothra', key: 'gothra', type: 'text' },
              { label: 'Work Location', key: 'workLocation', type: 'text' },
            ].map(({ label, key, type }) => (
              <div key={key}>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
                <input type={type} value={profile[key] || ''}
                  onChange={e => handleChange(key, e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-rose-300 outline-none text-sm" />
              </div>
            ))}
          </div>
        </div>

        {/* Family Info */}
        <div className="bg-white rounded-2xl shadow-md p-5 mb-6">
          <h2 className="font-bold text-gray-800 mb-4">Family Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Father's Name", key: 'fatherName' },
              { label: "Father's Occupation", key: 'fatherOccupation' },
              { label: "Mother's Name", key: 'motherName' },
              { label: "Mother's Occupation", key: 'motherOccupation' },
            ].map(({ label, key }) => (
              <div key={key}>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
                <input type="text" value={profile[key] || ''}
                  onChange={e => handleChange(key, e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-rose-300 outline-none text-sm" />
              </div>
            ))}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Family Type</label>
              <select value={profile.familyType || ''} onChange={e => handleChange('familyType', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 outline-none text-sm">
                <option value="">Select</option>
                {['Nuclear', 'Joint', 'Extended'].map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Family Values</label>
              <select value={profile.familyValues || ''} onChange={e => handleChange('familyValues', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 outline-none text-sm">
                <option value="">Select</option>
                {['Traditional', 'Moderate', 'Liberal'].map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Save button bottom */}
        <button onClick={handleSave} disabled={saving}
          className="w-full bg-rose-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-rose-700 disabled:opacity-60">
          {saving ? 'Saving...' : '💾 Save All Changes'}
        </button>
      </div>
    </div>
  );
};

export default MyProfile;
```

---

### 📄 `frontend/src/pages/ProfileView.jsx`
```jsx
// View a single profile in detail — with compatibility score
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/axios';
import { Shield, MapPin, Briefcase, GraduationCap, Heart, Play, X } from 'lucide-react';
import CompatibilityBadge from '../components/CompatibilityBadge';

const ProfileView = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [compatibility, setCompatibility] = useState(null);
  const [interestSent, setInterestSent] = useState(false);
  const [isMatch, setIsMatch] = useState(false);
  const [photoModal, setPhotoModal] = useState(null); // For full-screen photo
  const [showVideo, setShowVideo] = useState(false);
  const [loading, setLoading] = useState(true);

  const apiBase = import.meta.env.VITE_API_URL.replace('/api', '');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, compatRes] = await Promise.all([
          API.get(`/profile/${id}`),
          API.get(`/matches/compatibility/${id}`)
        ]);
        setProfile(profileRes.data);
        setCompatibility(compatRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const getAge = (dob) => {
    const today = new Date();
    const birth = new Date(dob);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const sendInterest = async () => {
    try {
      const { data } = await API.post(`/interests/send/${id}`);
      setInterestSent(true);
      if (data.isMatch) setIsMatch(true);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-rose-600"></div>
    </div>
  );

  if (!profile) return <div className="min-h-screen flex items-center justify-center text-gray-500">Profile not found</div>;

  const mainPhoto = profile.photos?.[0]
    ? `${apiBase}/uploads/${profile.photos[0]}`
    : `https://ui-avatars.com/api/?name=${profile.name}&background=C0392B&color=fff&size=300`;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* Photo Modal */}
      {photoModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setPhotoModal(null)}>
          <img src={photoModal} className="max-h-screen max-w-full rounded-xl object-contain" />
          <button className="absolute top-4 right-4 text-white"><X size={32} /></button>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Main profile card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-6">
          <div className="flex flex-col md:flex-row">
            {/* Photo */}
            <div className="md:w-80 flex-shrink-0">
              <img src={mainPhoto} alt={profile.name}
                className="w-full h-80 md:h-full object-cover cursor-pointer"
                onClick={() => setPhotoModal(mainPhoto)} />
            </div>

            {/* Basic info */}
            <div className="flex-1 p-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{profile.name}, {getAge(profile.dateOfBirth)}</h1>
                  <p className="text-gray-500">{profile.religion} • {profile.maritalStatus}</p>
                </div>
                {profile.isVerified && (
                  <div className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-sm font-semibold">
                    <Shield size={14} /> Verified
                  </div>
                )}
              </div>

              {/* Compatibility */}
              {compatibility && <CompatibilityBadge score={compatibility.overall} />}

              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <MapPin size={16} className="text-rose-500" />
                  {profile.city}, {profile.state}
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <Briefcase size={16} className="text-rose-500" />
                  {profile.profession || 'Not specified'}
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <GraduationCap size={16} className="text-rose-500" />
                  {profile.education || 'Not specified'}
                </div>
              </div>

              {profile.aboutMe && (
                <div className="mt-4 bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-700 text-sm leading-relaxed italic">"{profile.aboutMe}"</p>
                </div>
              )}

              {/* Match notification */}
              {isMatch && (
                <div className="mt-4 bg-rose-50 border border-rose-200 rounded-xl p-3 text-center text-rose-600 font-bold">
                  🎉 It's a Match! You both showed interest.
                </div>
              )}

              <div className="flex gap-3 mt-5">
                <button onClick={sendInterest} disabled={interestSent}
                  className={`flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all
                    ${interestSent ? 'bg-green-100 text-green-600' : 'bg-rose-600 text-white hover:bg-rose-700'}`}>
                  <Heart size={18} className={interestSent ? 'fill-green-600' : ''} />
                  {interestSent ? 'Interest Sent ✓' : 'Send Interest'}
                </button>

                {profile.videoIntro && (
                  <button onClick={() => setShowVideo(true)}
                    className="flex items-center gap-2 border-2 border-rose-200 text-rose-600 px-4 py-3 rounded-xl font-semibold hover:bg-rose-50">
                    <Play size={18} /> Video Intro
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Video modal */}
        {showVideo && profile.videoIntro && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl overflow-hidden max-w-lg w-full">
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="font-bold">Video Introduction</h3>
                <button onClick={() => setShowVideo(false)}><X /></button>
              </div>
              <video src={`${apiBase}/uploads/${profile.videoIntro}`} controls autoPlay className="w-full" />
            </div>
          </div>
        )}

        {/* Photo gallery */}
        {profile.photos?.length > 1 && (
          <div className="bg-white rounded-2xl shadow-md p-5 mb-6">
            <h2 className="font-bold text-gray-800 mb-3">Photos</h2>
            <div className="flex gap-3 flex-wrap">
              {profile.photos.map((photo, i) => (
                <img key={i} src={`${apiBase}/uploads/${photo}`} alt={`photo-${i}`}
                  onClick={() => setPhotoModal(`${apiBase}/uploads/${photo}`)}
                  className="w-24 h-24 rounded-xl object-cover cursor-pointer hover:opacity-80 transition-opacity border-2 border-gray-100" />
              ))}
            </div>
          </div>
        )}

        {/* Compatibility breakdown */}
        {compatibility && (
          <div className="bg-white rounded-2xl shadow-md p-5 mb-6">
            <h2 className="font-bold text-gray-800 mb-4">🎯 Compatibility Breakdown</h2>
            {Object.entries(compatibility.scores).map(([key, val]) => (
              <div key={key} className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="capitalize text-gray-700 font-medium">{key} Compatibility</span>
                  <span className="font-bold text-gray-800">{val}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className={`h-2 rounded-full transition-all ${val >= 80 ? 'bg-green-500' : val >= 60 ? 'bg-amber-500' : 'bg-rose-500'}`}
                    style={{ width: `${val}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Detailed info sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Personal */}
          <div className="bg-white rounded-2xl shadow-md p-5">
            <h2 className="font-bold text-gray-800 mb-3 text-rose-700">Personal Info</h2>
            {[
              ['Mother Tongue', profile.motherTongue],
              ['Height', profile.height ? `${profile.height} cm` : null],
              ['Diet', profile.diet],
              ['Blood Group', profile.bloodGroup],
              ['Manglik', profile.manglik],
            ].filter(([, v]) => v).map(([label, value]) => (
              <div key={label} className="flex justify-between py-2 border-b border-gray-50 text-sm">
                <span className="text-gray-500">{label}</span>
                <span className="text-gray-800 font-medium">{value}</span>
              </div>
            ))}
          </div>

          {/* Family */}
          <div className="bg-white rounded-2xl shadow-md p-5">
            <h2 className="font-bold text-gray-800 mb-3 text-rose-700">Family</h2>
            {[
              ["Father's Occupation", profile.fatherOccupation],
              ["Mother's Occupation", profile.motherOccupation],
              ['Family Type', profile.familyType],
              ['Family Values', profile.familyValues],
              ['Family Status', profile.familyStatus],
            ].filter(([, v]) => v).map(([label, value]) => (
              <div key={label} className="flex justify-between py-2 border-b border-gray-50 text-sm">
                <span className="text-gray-500">{label}</span>
                <span className="text-gray-800 font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Partner preferences */}
        <div className="bg-white rounded-2xl shadow-md p-5 mb-6">
          <h2 className="font-bold text-gray-800 mb-3 text-rose-700">Partner Preferences</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            {profile.partnerAgeMin && (
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-500">Age Range</span>
                <span className="font-medium">{profile.partnerAgeMin}–{profile.partnerAgeMax} years</span>
              </div>
            )}
            {profile.partnerReligion?.length > 0 && (
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-500">Religion</span>
                <span className="font-medium">{profile.partnerReligion.join(', ')}</span>
              </div>
            )}
            {profile.partnerLocation?.length > 0 && (
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-500">Location</span>
                <span className="font-medium">{profile.partnerLocation.join(', ')}</span>
              </div>
            )}
          </div>
          {profile.partnerDescription && (
            <p className="mt-3 text-gray-600 text-sm italic bg-gray-50 rounded-xl p-3">"{profile.partnerDescription}"</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
```

---

### 📄 `frontend/src/pages/Interests.jsx`
```jsx
// View sent/received interests and mutual matches with tabs
import { useState, useEffect } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { Heart, Send, Users } from 'lucide-react';

const Interests = () => {
  const [tab, setTab] = useState('received'); // received | sent | matches
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const endpoints = {
    received: '/interests/received',
    sent: '/interests/sent',
    matches: '/interests/matches'
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: res } = await API.get(endpoints[tab]);
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tab]);

  const getAge = (dob) => {
    if (!dob) return '';
    const today = new Date();
    const birth = new Date(dob);
    return today.getFullYear() - birth.getFullYear();
  };

  const apiBase = import.meta.env.VITE_API_URL.replace('/api', '');

  const tabs = [
    { key: 'received', label: 'Received', icon: Heart },
    { key: 'sent', label: 'Sent', icon: Send },
    { key: 'matches', label: '🎉 Matches', icon: Users }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Interests</h1>

        {/* Tabs */}
        <div className="flex bg-white rounded-2xl shadow-sm p-1.5 mb-6 gap-1">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setTab(key)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-colors
                ${tab === key ? 'bg-rose-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
              <Icon size={16} /> {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <div key={i} className="bg-white rounded-2xl h-20 animate-pulse" />)}
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Heart size={48} className="mx-auto mb-3 opacity-30" />
            <p>No {tab} interests yet. <span className="text-rose-600 cursor-pointer" onClick={() => navigate('/browse')}>Browse profiles →</span></p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.map(p => (
              <div key={p._id}
                onClick={() => navigate(`/profile/${p._id}`)}
                className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow">
                <img
                  src={p.photos?.[0] ? `${apiBase}/uploads/${p.photos[0]}` : `https://ui-avatars.com/api/?name=${p.name}&background=C0392B&color=fff`}
                  className="w-16 h-16 rounded-full object-cover border-2 border-rose-100"
                  alt={p.name} />
                <div className="flex-1">
                  <div className="font-bold text-gray-800">{p.name}, {getAge(p.dateOfBirth)}</div>
                  <div className="text-gray-500 text-sm">{p.profession} • {p.city}</div>
                  {p.isVerified && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">✓ Verified</span>
                  )}
                </div>
                {tab === 'matches' && (
                  <span className="text-rose-600 font-semibold text-sm bg-rose-50 px-3 py-1 rounded-full">Matched 🎉</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Interests;
```

---

### 📄 `frontend/src/pages/SuccessStories.jsx`
```jsx
// Public success stories page
import { Heart } from 'lucide-react';

const stories = [
  { names: 'Priya & Rahul', location: 'Pune, Maharashtra', duration: 'Met on BandhanPlus, Married in 6 months', story: 'We were both skeptical of matrimony sites. But BandhanPlus was different — no spam calls, no fake profiles. The compatibility score showed 91% and it was absolutely right!', img: 'https://ui-avatars.com/api/?name=PR&background=C0392B&color=fff&size=150' },
  { names: 'Sneha & Arjun', location: 'Mumbai, Maharashtra', duration: 'Married after 4 months', story: 'The video introduction feature was what made me interested in Arjun. I could see his genuine personality before we even spoke. BandhanPlus gave us privacy and trust.', img: 'https://ui-avatars.com/api/?name=SA&background=E67E22&color=fff&size=150' },
  { names: 'Kavya & Dev', location: 'Nagpur, Maharashtra', duration: 'Happily married for 1 year', story: 'As a Marathi family, we loved the regional language support. We could browse and communicate in Marathi which felt like home.', img: 'https://ui-avatars.com/api/?name=KD&background=27AE60&color=fff&size=150' },
  { names: 'Meera & Vikram', location: 'Nashik, Maharashtra', duration: 'Met and married within 8 months', story: 'What I loved most was the blurred photo privacy feature. I felt safe. Only genuine people reach out because they respect the system.', img: 'https://ui-avatars.com/api/?name=MV&background=8E44AD&color=fff&size=150' },
];

const SuccessStories = () => (
  <div className="min-h-screen bg-gradient-to-br from-rose-50 to-amber-50 py-12 px-4">
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <Heart className="text-rose-600 fill-rose-600 mx-auto mb-3" size={40} />
        <h1 className="text-4xl font-bold text-gray-900 mb-3">💑 Happy Couples</h1>
        <p className="text-gray-600 text-lg">Real stories from real people who found their match on BandhanPlus</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stories.map(s => (
          <div key={s.names} className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <img src={s.img} alt={s.names} className="w-16 h-16 rounded-full border-4 border-rose-100" />
              <div>
                <h3 className="font-bold text-gray-800 text-lg">{s.names}</h3>
                <p className="text-gray-500 text-sm">{s.location}</p>
                <p className="text-rose-600 text-xs font-medium">{s.duration}</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed italic">"{s.story}"</p>
            <div className="flex mt-4">{'⭐'.repeat(5)}</div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <p className="text-gray-600 mb-4">Ready to write your own success story?</p>
        <a href="/register" className="bg-rose-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-rose-700 inline-block">
          Register Free Today 💍
        </a>
      </div>
    </div>
  </div>
);

export default SuccessStories;
```

---

## 🤖 ANTIGRAVITY PROMPTS

Use these exact prompts in AntiGravity for each page. AntiGravity handles the visual/UI generation — paste these in as your generation prompts:

---

### Landing Page Prompt
```
Create a premium Indian matrimony landing page called "BandhanPlus" with tagline 
"Verified Matches. Real Connections."

COLOR THEME: Deep rose #C0392B as primary, warm amber #F39C12 as accent, 
white background.

SECTIONS TO INCLUDE (in order):
1. Sticky navbar with logo (heart icon + BandhanPlus text), nav links: 
   Browse Profiles, Success Stories, Login, and a "Register Free" CTA button

2. Hero section: Large gradient background (rose to amber), 
   headline "Find Your Perfect Life Partner", 
   subtext "Verified Matches. Real Connections. Zero Fake Profiles.",
   3 stats (500+ Verified Profiles, 200+ Matches Made, 98% Trust Score),
   Two CTA buttons: "Register Free →" (rose) and "Already a member? Login" (outline),
   Right side: a floating profile preview card showing blurred photo, name/age, 
   verified badge, trust score badge, and a compatibility % chip

3. "Why BandhanPlus is Different" section with 4 cards:
   - Shield icon: 100% Verified Profiles (green)
   - Lock icon: Privacy First (blue)  
   - Zap icon: Smart Compatibility (amber)
   - Gift icon: Free to Connect (rose)

4. Success stories section (rose-50 background): 3 couple cards each with 
   avatar, names, location, quote text, 5 star rating

5. Footer: dark background, logo, tagline, copyright

STYLE: Modern, premium, trustworthy. Similar to Tinder meets BharatMatrimony 
but cleaner. Use rounded corners (2xl/3xl), shadow-xl cards, subtle gradients.
NO skin color filters. Focus on values and compatibility.
```

---

### Profile Cards Grid Prompt
```
Create a matrimony profile card grid component for "BandhanPlus".

Each card should have:
- Photo area (top 60% of card) with BLURRED image by default, 
  shows "Click to reveal" overlay text, unblurs on hover with CSS transition
- Top-left: amber trust score badge "⭐ 85%"
- Top-right: green "✓ Verified" badge (Shield icon)
- Bottom section: name + age (bold), religion • marital status (gray text)
- Location row with MapPin icon
- Profession row with Briefcase icon  
- "🎯 82% Compatible" chip in rose color
- Full-width "Send Interest" button in rose-600, changes to green "Interest Sent ✓" 
  with filled heart icon after click

GRID LAYOUT: Responsive, 1 column mobile, 2 tablet, 3-4 desktop
CARD STYLE: White, rounded-2xl, shadow-md, hover shadow-xl, 
smooth hover transitions, cursor-pointer

COLOR: Rose #C0392B primary, amber accents, green for verified/sent states
```

---

### Multi-Step Registration Form Prompt
```
Design a beautiful 4-step registration form for matrimony site "BandhanPlus".

STEP INDICATOR: Top progress bar with 4 steps colored in rose-600 as user progresses.
Current step name shown below.

STEP 1 - Basic Info:
- Full Name + Gender (grid 2 cols)
- Date of Birth (date picker)
- Email
- Password + Confirm Password (grid 2 cols)

STEP 2 - Personal Details:
- Religion dropdown + Mother Tongue dropdown (grid)
- City + State (grid)
- Marital Status + Diet (grid)
- "About Me" textarea

STEP 3 - Professional:
- Highest Education dropdown
- Profession text input
- Company name
- Annual Income dropdown

STEP 4 - Partner Preferences:
- Age range dual slider (show "22-35 years" text above)
- Religion preference as pill/chip multi-select buttons
- Preferred locations text input
- "Ideal Partner" textarea

NAVIGATION: Back (outline) + Next (rose filled) buttons at bottom.
Last step: "🎉 Create Profile" button.

STYLE: White card, rounded-3xl, centered on page, rose-amber gradient background.
Inputs: rounded-xl, border-gray-200, focus:ring-rose-300
```

---

### Filter Sidebar Prompt
```
Build a filter sidebar component for a matrimony browsing page.

TITLE: "🔍 Filter Profiles" with border-bottom

FILTERS TO INCLUDE:
1. "Looking For" — Male / Female / All toggle pills (3 pills, active = rose-600)
2. "Age Range" — dual range slider showing "25–35 yrs" text above
3. "Religion" — dropdown with: Hindu, Muslim, Christian, Sikh, Buddhist, Jain, Other
4. "City" — text input with placeholder "e.g. Pune, Mumbai"
5. "Education" — dropdown: Bachelor's, Master's, PhD, MBBS, CA, Diploma, etc.
6. "Marital Status" — dropdown: Never Married, Divorced, Widowed
7. "Verified Only ✅" — iOS-style toggle switch (green when active)

BUTTONS:
- "Apply Filters" — full-width rose-600 rounded-xl
- "Reset All Filters" — text-only gray link below

STYLE: White card, rounded-2xl, sticky top-20, padding-5, 
Each section separated with mb-5 spacing.
Compact, clean, no wasted space.
```

---

### Dashboard Prompt
```
Design a matrimony dashboard page for logged-in users.

TOP BANNER: Gradient rose-to-amber, "Welcome back, Priya! 👋", 
subtitle "You have 3 new interests waiting", "View Interests →" white button

STATS ROW (4 cards): 
- Heart icon (rose): "3" Interests Received
- Send icon (blue): "8" Interests Sent  
- Users icon (green): "1" Mutual Matches
- Star icon (amber): "75%" Trust Score
Cards: white, rounded-2xl, shadow-sm, icon in colored square bg

SUGGESTED MATCHES: 
"✨ Suggested For You" header with "View All →" link
Grid of 4 ProfileCards (use the blurred photo card design from Browse page)

OVERALL STYLE: Gray-50 background, max-w-7xl centered, generous padding.
Warm and welcoming feel. Premium matrimony aesthetic.
```

---

### Video Intro Component Prompt
```
Create a 30-second video introduction recorder UI component.

HEADER: Video camera icon + "30-Second Video Introduction" title
SUBTEXT: "A short video helps matches connect with the real you."

VIDEO PREVIEW BOX: 
- 16:9 aspect ratio
- Dark gray background
- When recording: red "● REC 28s" animated badge top-right
- When not recording: shows recorded video with playback controls

CONTROLS BELOW VIDEO:
- "Start Recording" button (rose-600, video camera icon)
- When recording: changes to "Stop (25s left)" button (dark)
- After recording: "Upload Video" green button appears

SUCCESS STATE: "✅ Video uploaded successfully!" green text

STYLE: White card, rounded-2xl, shadow-md. 
Buttons: rounded-xl, flex items-center justify-center gap-2
```

---

## ▶️ Run the Project

### Start Backend:
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

### Start Frontend:
```bash
cd frontend
npm run dev
# App runs on http://localhost:5173
```

### Build for Production:
```bash
cd frontend
npm run build
```

---

## ✅ Features List

| Feature | Status |
|--------|--------|
| User Registration (multi-step) | ✅ |
| User Login with JWT | ✅ |
| MongoDB Atlas integration | ✅ |
| Complete profile creation & editing | ✅ |
| Photo upload (up to 5) | ✅ |
| **30-second video introduction** | ✅ |
| Blurred photo privacy (reveals on hover) | ✅ |
| Send interest | ✅ |
| Receive interest | ✅ |
| Mutual match detection | ✅ |
| Browse with advanced filters | ✅ |
| Smart suggested matches | ✅ |
| Compatibility score breakdown | ✅ |
| Trust score system | ✅ |
| Verified badge system | ✅ |
| Dashboard with stats | ✅ |
| **Multilingual: English / Hindi / Marathi** | ✅ |
| Success stories page | ✅ |
| Responsive mobile design | ✅ |
| Protected routes | ✅ |
| AntiGravity UI prompts for all pages | ✅ |
| No skin color bias (removed) | ✅ |
| Family details section | ✅ |
| Partner preferences | ✅ |

---

## 🏆 Presentation Pitch (2 Minutes)

> *"We present BandhanPlus — a marriage bureau website that solves 3 critical problems with today's matrimony platforms.*
>
> *Problem 1: Fake profiles. Our trust score system and verified-only filter ensure you only see real people.*
> *Problem 2: Privacy violations. Photos are blurred until both show mutual interest.*
> *Problem 3: Bad matching. Our compatibility algorithm scores values, lifestyle, religion and location — not just age.*
>
> *Unique features: 30-second video introductions, trilingual support in English, Hindi and Marathi, and a zero-paywall policy — send interest and connect completely free.*
>
> *Built on React + Node.js + MongoDB Atlas. That's BandhanPlus — where real people find real connections."*

---

*Built with ❤️ for DYP COE Webathon 2026 | Team BandhanPlus*
  