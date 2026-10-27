import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { api } from '../api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);        // useState: logged-in user
  const [loading, setLoading] = useState(true);  // useState: initial session check

  // useEffect: on first load, ask the server if the cookie session is still valid
  useEffect(() => {
    api('/api/auth/me')
      .then((d) => setUser(d.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const d = await api('/api/auth/login', 'POST', { email, password });
    setUser(d.user);
  }, []);

  const register = useCallback(async (name, email, password) => {
    const d = await api('/api/auth/register', 'POST', { name, email, password });
    setUser(d.user);
  }, []);

  const logout = useCallback(async () => {
    await api('/api/auth/logout', 'POST');
    setUser(null);
  }, []);

  // useMemo: keeps the context value stable so consumers re-render only when needed
  const value = useMemo(
    () => ({ user, loading, login, register, logout }),
    [user, loading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// useContext: custom hook for consuming the auth state anywhere
export const useAuth = () => useContext(AuthContext);
