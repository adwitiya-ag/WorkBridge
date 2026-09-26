import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api';
import { ROLES, STORAGE_KEYS } from '../config/api.config';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user profile on startup if token exists
  const fetchProfile = useCallback(async (currentRole) => {
    try {
      if (currentRole === ROLES.JOB_SEEKER) {
        const res = await authApi.getUserProfile();
        if (res?.data) {
          setUser(res.data);
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(res.data));
        }
      } else if (currentRole === ROLES.EMPLOYER) {
        const res = await authApi.getEmployerProfile();
        if (res?.data) {
          setUser(res.data);
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(res.data));
        }
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
      // If token expired or invalid, clear local auth
      logout();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const savedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const savedRole = localStorage.getItem(STORAGE_KEYS.ROLE);
    const savedUser = localStorage.getItem(STORAGE_KEYS.USER);

    if (savedToken && savedRole) {
      setToken(savedToken);
      setRole(savedRole);
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          setUser(null);
        }
      }
      fetchProfile(savedRole);
    } else {
      setLoading(false);
    }
  }, [fetchProfile]);

  // JobSeeker Login
  const loginJobSeeker = async (credentials) => {
    const res = await authApi.loginUser(credentials);
    const loggedInUser = res?.data?.user;
    const accessToken = res?.data?.accessToken;

    if (accessToken) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, accessToken);
      localStorage.setItem(STORAGE_KEYS.ROLE, ROLES.JOB_SEEKER);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(loggedInUser));

      setToken(accessToken);
      setRole(ROLES.JOB_SEEKER);
      setUser(loggedInUser);
    }
    return res;
  };

  // JobSeeker Register
  const registerJobSeeker = async (formData) => {
    const res = await authApi.registerUser(formData);
    return res;
  };

  // Employer Login
  const loginEmployer = async (credentials) => {
    const res = await authApi.loginEmployer(credentials);
    const loggedInEmployer = res?.data?.user;
    const accessToken = res?.data?.accessToken;

    if (accessToken) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, accessToken);
      localStorage.setItem(STORAGE_KEYS.ROLE, ROLES.EMPLOYER);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(loggedInEmployer));

      setToken(accessToken);
      setRole(ROLES.EMPLOYER);
      setUser(loggedInEmployer);
    }
    return res;
  };

  // Employer Register
  const registerEmployer = async (data) => {
    const res = await authApi.registerEmployer(data);
    return res;
  };

  // Logout
  const logout = async () => {
    try {
      if (role === ROLES.JOB_SEEKER) {
        await authApi.logoutUser();
      } else if (role === ROLES.EMPLOYER) {
        await authApi.logoutEmployer();
      }
    } catch (err) {
      console.warn('Logout API error:', err);
    } finally {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.ROLE);
      localStorage.removeItem(STORAGE_KEYS.USER);
      setToken(null);
      setRole(null);
      setUser(null);
    }
  };

  // Refresh profile (e.g., after applying to a job or posting a job)
  const refreshProfile = async () => {
    if (role) {
      await fetchProfile(role);
    }
  };

  const isJobSeeker = role === ROLES.JOB_SEEKER;
  const isEmployer = role === ROLES.EMPLOYER;
  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        token,
        loading,
        isAuthenticated,
        isJobSeeker,
        isEmployer,
        loginJobSeeker,
        registerJobSeeker,
        loginEmployer,
        registerEmployer,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
