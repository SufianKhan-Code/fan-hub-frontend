import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('fanhub_user')) || null; } catch { return null; }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const restore = async () => {
      const token = localStorage.getItem('fanhub_token');
      if (!token) { setLoading(false); return; }
      try {
        const { data } = await api.get('/auth/me');
        if (mounted) {
          setUser(data.user);
          localStorage.setItem('fanhub_user', JSON.stringify(data.user));
        }
      } catch {
        localStorage.removeItem('fanhub_token');
        localStorage.removeItem('fanhub_user');
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    restore();
    return () => { mounted = false; };
  }, []);

  const persist = (nextUser, token) => {
    setUser(nextUser);
    if (nextUser) localStorage.setItem('fanhub_user', JSON.stringify(nextUser));
    else localStorage.removeItem('fanhub_user');
    if (token) localStorage.setItem('fanhub_token', token);
  };

  const login = async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    persist(data.user, data.token);
    return data;
  };

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    persist(data.user, data.token);
    return data;
  };

  const logout = async () => {
    try { await api.get('/auth/logout'); } catch { /* client logout still succeeds */ }
    localStorage.removeItem('fanhub_token');
    localStorage.removeItem('fanhub_user');
    setUser(null);
  };

  const refreshUser = async () => {
    const { data } = await api.get('/auth/me');
    persist(data.user);
    return data.user;
  };

  const updateProfile = async (payload) => {
    const { data } = await api.put('/auth/profile', payload);
    persist(data.user);
    return data.user;
  };

  const value = useMemo(() => ({
    user, loading, login, register, logout, refreshUser, updateProfile,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === 'admin'
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
