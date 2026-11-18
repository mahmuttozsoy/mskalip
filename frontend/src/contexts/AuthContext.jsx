import { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const token = localStorage.getItem('shahgroup_token');
      const savedUser = localStorage.getItem('shahgroup_user');
      if (token && savedUser && savedUser !== 'undefined') {
        setUser(JSON.parse(savedUser));
      }
    } catch {
      localStorage.removeItem('shahgroup_token');
      localStorage.removeItem('shahgroup_user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    const res = await api.post('/auth/login', { username, password });
    localStorage.setItem('shahgroup_token', res.data.token);
    localStorage.setItem('shahgroup_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('shahgroup_token');
    localStorage.removeItem('shahgroup_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
