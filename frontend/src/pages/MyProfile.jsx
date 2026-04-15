// Edit own profile + upload photos + video intro
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import VideoRecorder from '../components/VideoRecorder';
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

  const handleDeleteVideo = async () => {
    try {
      await API.put('/profile/me', { videoIntro: null });
      setProfile(prev => ({ ...prev, videoIntro: null }));
    } catch (err) {
      console.error("Failed to delete video", err);
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
          <VideoRecorder 
            existingVideo={profile.videoIntro} 
            onUploadSuccess={(filename) => setProfile(prev => ({ ...prev, videoIntro: filename }))}
            onDelete={handleDeleteVideo}
          />
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