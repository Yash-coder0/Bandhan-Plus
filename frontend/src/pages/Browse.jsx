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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
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