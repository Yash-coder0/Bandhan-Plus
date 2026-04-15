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
        </div>

        {/* Progress bar */}
        <div className="flex gap-2 mb-2">
          {STEPS.map((_, i) => (
            <div key={i} className={`flex-1 h-2 rounded-full transition-all duration-300 ${i <= step ? 'bg-rose-600' : 'bg-gray-200'}`} />
          ))}
        </div>
        <p className="text-center text-rose-600 font-semibold text-sm mb-8">{STEPS[step]}</p>

        {error && <div className="bg-red-50 text-red-600 border border-red-200 rounded-xl p-3 mb-4 text-sm font-medium">{error}</div>}

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
              className="flex-1 border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2">
              <ChevronLeft size={18} /> Back
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button onClick={nextStep}
              className="flex-1 bg-rose-600 text-white py-3 rounded-xl font-bold hover:bg-rose-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
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