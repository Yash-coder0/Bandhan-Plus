import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import ProfileCard from '../components/ProfileCard';
import { Heart, Send, Users, Star, Camera, Video, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const DEMO_PROFILES = [
  {
    _id: 'demo1',
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
    photos: [],
    compatibilityScore: 91,
    avatar: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=C0392B&color=fff&size=200&bold=true'
  },
  {
    _id: 'demo2',
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
    photos: [],
    compatibilityScore: 85,
    avatar: 'https://ui-avatars.com/api/?name=Sneha+Patil&background=8E44AD&color=fff&size=200&bold=true'
  },
  {
    _id: 'demo3',
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
    photos: [],
    compatibilityScore: 78,
    avatar: 'https://ui-avatars.com/api/?name=Kavya+Desai&background=27AE60&color=fff&size=200&bold=true'
  },
  {
    _id: 'demo4',
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
    photos: [],
    compatibilityScore: 82,
    avatar: 'https://ui-avatars.com/api/?name=Ananya+Joshi&background=E67E22&color=fff&size=200&bold=true'
  },
  {
    _id: 'demo5',
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
    photos: [],
    compatibilityScore: 74,
    avatar: 'https://ui-avatars.com/api/?name=Rahul+Kulkarni&background=2980B9&color=fff&size=200&bold=true'
  },
  {
    _id: 'demo6',
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
    photos: [],
    compatibilityScore: 88,
    avatar: 'https://ui-avatars.com/api/?name=Arjun+Mehta&background=16A085&color=fff&size=200&bold=true'
  },
  {
    _id: 'demo7',
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
    photos: [],
    compatibilityScore: 94,
    avatar: 'https://ui-avatars.com/api/?name=Dev+Singhania&background=C0392B&color=fff&size=200&bold=true'
  },
  {
    _id: 'demo8',
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
    photos: [],
    compatibilityScore: 79,
    avatar: 'https://ui-avatars.com/api/?name=Vikram+Nair&background=6C3483&color=fff&size=200&bold=true'
  }
];

const Dashboard = () => {
  const { profile, user } = useAuth();
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
        
        if (sugRes.data) {
          setSuggested(sugRes.data);
        }

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
    { icon: Heart, label: 'Interests Received', value: stats.received || '12', color: 'text-rose-600 bg-rose-100', trend: '+2 this week' },
    { icon: Send, label: 'Interests Sent', value: stats.sent || '4', color: 'text-blue-600 bg-blue-100', trend: '+1 this week' },
    { icon: Users, label: 'Mutual Matches', value: stats.matches || '3', color: 'text-green-600 bg-green-100', trend: '+2 this week' },
    { icon: Star, label: 'Trust Score', value: `${profile?.trustScore || 75}%`, color: 'text-amber-600 bg-amber-100', trend: '+5% this week' },
  ];

  const greetingName = profile?.name ? profile.name.split(' ')[0] : (user?.email ? user.email.split('@')[0].charAt(0).toUpperCase() + user.email.split('@')[0].slice(1) : 'User');
  const trustScore = profile?.trustScore || 75;

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* ── WELCOME BANNER ── */}
        <div className="bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 rounded-3xl p-8 text-white mb-10 shadow-lg relative overflow-hidden flex justify-between items-center">
          <div className="relative z-10 max-w-xl">
            <h1 className="text-3xl font-extrabold mb-2">Good Morning, {greetingName}! ☀️</h1>
            <p className="opacity-95 text-lg mb-5 font-medium">3 new profiles match your preferences today</p>
            
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1">
                ✓ Profile 75% complete
              </span>
              <span className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1">
                🔥 4 active matches
              </span>
              <span className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1">
                ⭐ Trending in {profile?.city || 'Pune'}
              </span>
            </div>

            <Link to="/browse" className="inline-block bg-white text-rose-600 px-6 py-3 rounded-xl font-bold hover:bg-rose-50 hover:scale-105 transition-transform shadow-md">
              Explore Matches →
            </Link>
          </div>
          
          {/* Right floating preview (desktop only) */}
          <div className="hidden lg:block relative z-10 mr-10">
            <div className="w-48 h-56 bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl p-2 transform rotate-6 shadow-2xl">
              <img src={suggested.length > 0 && suggested[0].photos?.[0]?.startsWith('http') ? suggested[0].photos[0] : (suggested.length > 0 && suggested[0].photos?.[0] ? `${import.meta.env.VITE_API_URL.replace('/api', '')}/uploads/${suggested[0].photos[0]}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(suggested[0]?.name || 'Match')}&background=C0392B&color=fff&size=200`)} alt="Preview" className="w-full h-full object-cover rounded-xl" />
            </div>
            {/* Decorative element behind */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 blur-3xl rounded-full pointer-events-none"></div>
          </div>
        </div>

        {/* ── STATS ROW ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {statCards.map(({ icon: Icon, label, value, color, trend }) => (
            <div key={label} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col justify-between h-full">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center shrink-0`}>
                  <Icon size={24} />
                </div>
                <div className="text-green-600 text-xs font-bold pt-1">{trend}</div>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-gray-900 mb-1">{value}</div>
                <div className="text-sm font-medium text-gray-500">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── PROFILE COMPLETION BANNER ── */}
        {trustScore < 80 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1 w-full relative">
              <h3 className="font-bold text-amber-900 text-lg mb-2 flex items-center gap-2">
                ⚡ Complete your profile to get 3x more matches
              </h3>
              {/* Progress bar */}
              <div className="w-full bg-amber-100 rounded-full h-2.5 mb-1">
                <div className="bg-gradient-to-r from-amber-400 to-amber-500 h-2.5 rounded-full" style={{ width: '65%' }}></div>
              </div>
              <p className="text-amber-700 text-xs font-semibold text-right">65% Completed</p>
            </div>
            
            <div className="flex flex-wrap gap-3 shrink-0">
              <button className="flex items-center gap-1 border border-amber-300 text-amber-700 px-3 py-2 rounded-lg text-sm hover:bg-amber-100 transition-colors bg-white">
                <Camera size={14} /> Add Photos +20pts
              </button>
              <button className="flex items-center gap-1 border border-amber-300 text-amber-700 px-3 py-2 rounded-lg text-sm hover:bg-amber-100 transition-colors bg-white">
                <Video size={14} /> Record Video +20pts
              </button>
              <button className="flex items-center gap-1 border border-amber-300 text-amber-700 px-3 py-2 rounded-lg text-sm hover:bg-amber-100 transition-colors bg-white">
                <ShieldCheck size={14} /> Verify ID +25pts
              </button>
            </div>
          </div>
        )}

        {/* ── SUGGESTED FOR YOU ── */}
        <div className="mb-12">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-xl font-extrabold text-gray-900">✨ Suggested For You</h2>
              <p className="text-sm text-gray-500 mt-1 font-medium">Based on your preferences • Updated daily</p>
            </div>
            <Link to="/browse" className="text-rose-600 text-sm font-bold hover:text-rose-700 hover:underline">View All →</Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-md h-[400px] animate-pulse">
                  <div className="h-52 bg-gray-200 rounded-t-2xl" />
                  <div className="p-4 space-y-3 mt-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {suggested.slice(0, 4).map(p => <ProfileCard key={p._id} profile={p} showCompatibility />)}
            </div>
          )}
        </div>

        {/* ── RECENTLY JOINED (NEW PROFILES) ── */}
        <div className="mb-12">
          <h2 className="text-xl font-extrabold text-gray-900 mb-6">🆕 Recently Joined</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
            {suggested.slice(0, 6).map(p => (
              <div key={`new-${p._id}`} className="bg-white rounded-full shadow-sm hover:shadow-md transition-shadow flex items-center gap-3 px-2 py-2 pr-5 shrink-0 snap-start border border-gray-100 group cursor-pointer">
                <img src={p.photos?.[0]?.startsWith('http') ? p.photos[0] : (p.photos?.[0] ? `${import.meta.env.VITE_API_URL.replace('/api', '')}/uploads/${p.photos[0]}` : `https://ui-avatars.com/api/?name=${p.name}&background=6C3483&color=fff`)} alt={p.name} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
                <div>
                  <div className="font-bold text-gray-800 text-sm">{p.name}</div>
                  <div className="text-xs text-gray-500">{p.city}</div>
                </div>
                <div className="ml-2 bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  New
                </div>
                <div className="ml-2 text-rose-300 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all">
                  →
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── QUICK TIPS BANNER ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 text-center hover:shadow-sm transition-shadow">
            <div className="text-xl mb-1">📸</div>
            <p className="text-sm font-semibold text-gray-800">Add 3+ photos → 5x more views</p>
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-center hover:shadow-sm transition-shadow">
            <div className="text-xl mb-1">🎥</div>
            <p className="text-sm font-semibold text-gray-800">Record intro video → 3x more interest</p>
          </div>
          <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center hover:shadow-sm transition-shadow">
            <div className="text-xl mb-1">✅</div>
            <p className="text-sm font-semibold text-gray-800">Verify profile → Shown at top of searches</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;