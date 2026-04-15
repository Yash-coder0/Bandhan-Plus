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