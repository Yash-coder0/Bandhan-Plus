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