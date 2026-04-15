const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const Profile = require('./models/Profile');

const DEMO_PROFILES = [
  {
    email: 'priya.sharma@demo.com',
    name: 'Priya Sharma',
    dateOfBirth: '1997-03-15',
    gender: 'Female',
    religion: 'Hindu',
    city: 'Pune',
    state: 'Maharashtra',
    profession: 'Software Engineer',
    education: "Master's",
    maritalStatus: 'Never Married',
    isVerified: true,
    trustScore: 92,
    photos: ['https://ui-avatars.com/api/?name=Priya+Sharma&background=C0392B&color=fff&size=200&bold=true'],
    compatibilityScore: 91
  },
  {
    email: 'sneha.patil@demo.com',
    name: 'Sneha Patil',
    dateOfBirth: '1998-07-22',
    gender: 'Female',
    religion: 'Hindu',
    city: 'Mumbai',
    state: 'Maharashtra',
    profession: 'Doctor (MBBS)',
    education: 'MBBS/MD',
    maritalStatus: 'Never Married',
    isVerified: true,
    trustScore: 88,
    photos: ['https://ui-avatars.com/api/?name=Sneha+Patil&background=8E44AD&color=fff&size=200&bold=true'],
    compatibilityScore: 85
  },
  {
    email: 'kavya.desai@demo.com',
    name: 'Kavya Desai',
    dateOfBirth: '1996-11-08',
    gender: 'Female',
    religion: 'Hindu',
    city: 'Nashik',
    state: 'Maharashtra',
    profession: 'CA / Chartered Accountant',
    education: 'CA/CS',
    maritalStatus: 'Never Married',
    isVerified: true,
    trustScore: 95,
    photos: ['https://ui-avatars.com/api/?name=Kavya+Desai&background=27AE60&color=fff&size=200&bold=true'],
    compatibilityScore: 78
  },
  {
    email: 'ananya.joshi@demo.com',
    name: 'Ananya Joshi',
    dateOfBirth: '1999-05-30',
    gender: 'Female',
    religion: 'Hindu',
    city: 'Nagpur',
    state: 'Maharashtra',
    profession: 'UI/UX Designer',
    education: "Bachelor's",
    maritalStatus: 'Never Married',
    isVerified: false,
    trustScore: 72,
    photos: ['https://ui-avatars.com/api/?name=Ananya+Joshi&background=E67E22&color=fff&size=200&bold=true'],
    compatibilityScore: 82
  },
  {
    email: 'rahul.kulkarni@demo.com',
    name: 'Rahul Kulkarni',
    dateOfBirth: '1995-09-12',
    gender: 'Male',
    religion: 'Hindu',
    city: 'Pune',
    state: 'Maharashtra',
    profession: 'Civil Engineer',
    education: 'BE/BTech',
    maritalStatus: 'Never Married',
    isVerified: true,
    trustScore: 85,
    photos: ['https://ui-avatars.com/api/?name=Rahul+Kulkarni&background=2980B9&color=fff&size=200&bold=true'],
    compatibilityScore: 74
  },
  {
    email: 'arjun.mehta@demo.com',
    name: 'Arjun Mehta',
    dateOfBirth: '1994-01-25',
    gender: 'Male',
    religion: 'Hindu',
    city: 'Mumbai',
    state: 'Maharashtra',
    profession: 'Business Owner',
    education: 'MBA',
    maritalStatus: 'Never Married',
    isVerified: true,
    trustScore: 90,
    photos: ['https://ui-avatars.com/api/?name=Arjun+Mehta&background=16A085&color=fff&size=200&bold=true'],
    compatibilityScore: 88
  },
  {
    email: 'dev.singhania@demo.com',
    name: 'Dev Singhania',
    dateOfBirth: '1993-06-18',
    gender: 'Male',
    religion: 'Hindu',
    city: 'Aurangabad',
    state: 'Maharashtra',
    profession: 'IAS Officer',
    education: "Master's",
    maritalStatus: 'Never Married',
    isVerified: true,
    trustScore: 98,
    photos: ['https://ui-avatars.com/api/?name=Dev+Singhania&background=C0392B&color=fff&size=200&bold=true'],
    compatibilityScore: 94
  },
  {
    email: 'vikram.nair@demo.com',
    name: 'Vikram Nair',
    dateOfBirth: '1996-12-03',
    gender: 'Male',
    religion: 'Hindu',
    city: 'Kolhapur',
    state: 'Maharashtra',
    profession: 'Data Scientist',
    education: "Master's",
    maritalStatus: 'Never Married',
    isVerified: true,
    trustScore: 87,
    photos: ['https://ui-avatars.com/api/?name=Vikram+Nair&background=6C3483&color=fff&size=200&bold=true'],
    compatibilityScore: 79
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected...');

    for (const data of DEMO_PROFILES) {
      const { email, ...profileData } = data;
      
      // Check if user exists
      let user = await User.findOne({ email });
      if (!user) {
        user = new User({ email, password: 'password123' });
        await user.save();
        console.log(`Created user: ${email}`);
      }
      
      // Check if profile exists
      let profile = await Profile.findOne({ user: user._id });
      if (!profile) {
        profile = new Profile({
          user: user._id,
          ...profileData
        });
        await profile.save();
        
        user.profile = profile._id;
        await user.save();
        console.log(`Created profile for: ${profileData.name}`);
      } else {
        // Update if already exists
        await Profile.updateOne({ _id: profile._id }, { ...profileData });
        console.log(`Updated profile for: ${profileData.name}`);
      }
    }
    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
};

seedData();
