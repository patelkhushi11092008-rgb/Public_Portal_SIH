import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  loginCivilian as apiLogin,
  registerCivilian as apiRegister,
  getMyProfile as apiGetProfile,
  updateCivilianProfile as apiUpdateProfile,
} from '../services/civilianApi';

const CivilianAuthContext = createContext(null);

export function CivilianAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => {
    return localStorage.getItem('civilian_token') || sessionStorage.getItem('civilian_token') || null;
  });
  const [isLoading, setIsLoading] = useState(true);

  // Initialize and verify user on mount
  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const profile = await apiGetProfile();
        setUser(profile);
      } catch (err) {
        console.warn('Session expired or invalid token:', err.message);
        localStorage.removeItem('civilian_token');
        sessionStorage.removeItem('civilian_token');
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    loadUser();
  }, [token]);

  const login = async (username, password) => {
    const data = await apiLogin(username, password);
    const receivedToken = data.accessToken;
    const receivedUser = data.user;
    localStorage.setItem('civilian_token', receivedToken);
    setToken(receivedToken);
    setUser(receivedUser);
    return receivedUser;
  };

  const register = async (formData) => {
    const data = await apiRegister(formData);
    const receivedToken = data.accessToken;
    const receivedUser = data.user;
    localStorage.setItem('civilian_token', receivedToken);
    setToken(receivedToken);
    setUser(receivedUser);
    return receivedUser;
  };

  const logout = () => {
    localStorage.removeItem('civilian_token');
    sessionStorage.removeItem('civilian_token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    const data = await apiUpdateProfile(profileData);
    setUser(data.user);
    return data.user;
  };

  const refreshUser = async () => {
    try {
      const profile = await apiGetProfile();
      setUser(profile);
      return profile;
    } catch (e) {
      console.error('Failed to refresh user profile', e);
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    refreshUser,
  };

  return (
    <CivilianAuthContext.Provider value={value}>
      {children}
    </CivilianAuthContext.Provider>
  );
}

export function useCivilianAuth() {
  const context = useContext(CivilianAuthContext);
  if (!context) {
    throw new Error('useCivilianAuth must be used within a CivilianAuthProvider');
  }
  return context;
}

