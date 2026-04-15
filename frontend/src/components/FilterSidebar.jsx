// Sidebar with all filter options for browse page
const FilterSidebar = ({ filters, setFilters, onApply }) => {

  const handleChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 sticky top-20">
      <h2 className="text-lg font-bold text-gray-800 border-b pb-3 mb-5">🔍 Filter Profiles</h2>

      {/* Gender */}
      <div className="mb-5">
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
      <div className="mb-5">
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
      <div className="mb-5">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Religion</label>
        <select value={filters.religion || ''} onChange={e => handleChange('religion', e.target.value)}
          className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-rose-300 outline-none">
          <option value="">All Religions</option>
          {['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Other'].map(r =>
            <option key={r} value={r}>{r}</option>
          )}
        </select>
      </div>

      {/* City */}
      <div className="mb-5">
        <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
        <input type="text" placeholder="e.g. Pune, Mumbai"
          value={filters.city || ''}
          onChange={e => handleChange('city', e.target.value)}
          className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-rose-300 outline-none" />
      </div>

      {/* Education */}
      <div className="mb-5">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Education</label>
        <select value={filters.education || ''} onChange={e => handleChange('education', e.target.value)}
          className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-rose-300 outline-none">
          <option value="">Any Education</option>
          {['Below 10th', '10th Pass', '12th Pass', 'Diploma', "Bachelor's", "Master's", 'PhD', 'CA/CS', 'MBBS/MD'].map(e =>
            <option key={e} value={e}>{e}</option>
          )}
        </select>
      </div>

      {/* Marital Status */}
      <div className="mb-5">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Marital Status</label>
        <select value={filters.maritalStatus || ''} onChange={e => handleChange('maritalStatus', e.target.value)}
          className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-rose-300 outline-none">
          <option value="">Any Status</option>
          {['Never Married', 'Divorced', 'Widowed', 'Awaiting Divorce'].map(s =>
            <option key={s} value={s}>{s}</option>
          )}
        </select>
      </div>

      {/* Verified Only Toggle */}
      <div className="flex items-center justify-between mb-5">
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
        className="w-full bg-rose-600 text-white py-3 rounded-xl font-bold hover:bg-rose-700 transition-all shadow-sm hover:shadow-md mb-3">
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