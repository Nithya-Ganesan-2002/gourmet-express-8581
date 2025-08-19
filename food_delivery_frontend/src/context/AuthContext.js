/**
 * Authentication context for managing JWT tokens and current user.
 */
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';

// PUBLIC_INTERFACE
export const AuthContext = createContext(null);

/** PUBLIC_INTERFACE
 * Provides authentication state and actions to the app.
 */
export function AuthProvider({ children }) {
  /** This is a public provider component for auth. */
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(token));

  // Load current user if token exists
  useEffect(() => {
    let cancelled = false;
    async function loadUser() {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const me = await api.me();
        if (!cancelled) setUser(me);
      } catch (e) {
        localStorage.removeItem('token');
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadUser();
    return () => { cancelled = true; };
  }, [token]);

  // PUBLIC_INTERFACE
  const login = async (email, password) => {
    /** Logs in a user and sets token and user state. */
    const data = await api.login({ email, password });
    // Expecting backend to return token and maybe user
    if (data && data.token) {
      localStorage.setItem('token', data.token);
      setToken(data.token);
      try {
        const me = await api.me();
        setUser(me);
      } catch {
        setUser(null);
      }
    } else {
      throw new Error('Invalid login response');
    }
  };

  // PUBLIC_INTERFACE
  const register = async (payload) => {
    /** Registers a new user. */
    await api.register(payload);
  };

  // PUBLIC_INTERFACE
  const logout = () => {
    /** Clears auth token and user state. */
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({
    token,
    user,
    loading,
    isAuthenticated: Boolean(token && user),
    login,
    register,
    logout,
    setUser,
  }), [token, user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// PUBLIC_INTERFACE
export const useAuth = () => useContext(AuthContext);
