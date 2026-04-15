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