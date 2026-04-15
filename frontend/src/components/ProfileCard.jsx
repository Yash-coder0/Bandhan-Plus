import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, MapPin, Briefcase, GraduationCap, Heart } from 'lucide-react';
import API from '../api/axios';

const ProfileCard = ({ profile, showCompatibility = false }) => {
  const navigate = useNavigate();
  const [interestSent, setInterestSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMatch, setIsMatch] = useState(false);

  // Calculate age from dateOfBirth
  const getAge = (dob) => {
    if (!dob) return '';
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
      if (profile._id.startsWith('demo')) {
        // Simulate sending if it's a demo profile
        setTimeout(() => setInterestSent(true), 500);
      } else {
        const { data } = await API.post(`/interests/send/${profile._id}`);
        setInterestSent(true);
        if (data.isMatch) setIsMatch(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Determine Photo URL prioritizing backend photos array, then avatar, then fallback
  let photoUrl = '';
  if (profile.photos && profile.photos.length > 0) {
    if (profile.photos[0].startsWith('http')) {
      photoUrl = profile.photos[0];
    } else {
      const apiBase = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';
      photoUrl = `${apiBase}/uploads/${profile.photos[0]}`;
    }
  } else if (profile.avatar) {
    photoUrl = profile.avatar;
  } else {
    photoUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=C0392B&color=fff&size=200`;
  }


  const age = getAge(profile.dateOfBirth);

  return (
    <div
      className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100 flex flex-col h-full"
      onClick={() => navigate(`/profile/${profile._id}`)}
    >
      {/* Top Photo Area (h-52, relative) */}
      <div className="relative h-52 shrink-0 overflow-hidden group">
        <img
          src={photoUrl}
          alt={profile.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Gradient Overlay bottom to top */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

        {/* Top-Right: Verified Badge */}
        {profile.isVerified && (
          <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1.5 rounded-full flex items-center gap-1 shadow-md">
            <Shield size={12} className="fill-white" /> Verified
          </div>
        )}

        {/* Top-Left: Trust Score Badge */}
        <div className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-bold px-2.5 py-1.5 rounded-full shadow-md">
          ⭐ {profile.trustScore || 0}%
        </div>

        {/* Bottom-Left: Name + Age */}
        <div className="absolute bottom-3 left-3 text-white">
          <div className="font-bold text-lg leading-tight drop-shadow-md">
            {profile.name}{age ? `, ${age}` : ''}
          </div>
        </div>

        {/* Bottom-Right: Compatibility Pill */}
        {showCompatibility && profile.compatibilityScore && (
          <div className="absolute bottom-3 right-3 bg-rose-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
            🎯 {profile.compatibilityScore}% Match
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1">
        
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <MapPin size={16} className="text-rose-500 shrink-0" />
            <span className="truncate">{profile.city || 'Unknown'}, {profile.state || 'Unknown'}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <Briefcase size={16} className="text-rose-500 shrink-0" />
            <span className="truncate">{profile.profession || 'Not specified'}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <GraduationCap size={16} className="text-rose-500 shrink-0" />
            <span className="truncate">{profile.education || 'Not specified'}</span>
          </div>
        </div>

        <hr className="border-t border-gray-100 my-1" />

        {/* Optional: Match Notif (from existing logic) */}
        {isMatch && (
          <div className="bg-rose-50 border border-rose-200 rounded-lg p-2 text-center text-rose-600 font-semibold text-sm mt-3">
            🎉 It's a Mutual Match!
          </div>
        )}

        {/* Button Row */}
        <div className="flex gap-2 mt-auto pt-3">
          <button
            onClick={() => navigate(`/profile/${profile._id}`)}
             className="flex-[4] border-2 border-rose-200 text-rose-600 py-2.5 rounded-xl font-bold text-sm hover:bg-rose-50 hover:border-rose-300 transition-all text-center"
          >
            View Profile
          </button>
          
          <div className="relative group/btn flex-1 flex justify-end">
            <button
              onClick={handleSendInterest}
              disabled={interestSent || loading}
              className={`w-full py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center
                ${interestSent 
                  ? 'bg-green-500 text-white cursor-default scale-100 shadow-inner' 
                  : 'bg-rose-600 text-white hover:bg-rose-700 active:scale-95 hover:shadow-md'
                }`}
            >
              <Heart 
                size={18} 
                className={`transition-all duration-500 ${interestSent ? 'fill-white scale-110' : ''} ${loading ? 'animate-pulse' : ''}`} 
              />
            </button>
            {/* Tooltip on hover if sent */}
            {interestSent && (
              <div className="absolute -top-10 right-0 bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                ✓ Sent
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfileCard;