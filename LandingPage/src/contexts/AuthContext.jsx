// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [token, setToken]     = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Helper: persist token + user
  const loginWithToken = (newToken, newUser) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(newUser);
  };

  // Credential login
  const login = async (identifier, password) => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password })
    });
    const data = await res.json();
    if (!res.ok) throw data;
    // store preliminary token for PIN step
    localStorage.setItem('token', data.token);
    setToken(data.token);
    return data;
  };

  // Wallet + PIN login
  const walletLogin = async (walletAddress, pin) => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/wallet-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ walletAddress, pin })
    });
    const data = await res.json();
    if (!res.ok) throw data;
    loginWithToken(data.token, data.user);
    return data;
  };

  // Fetch /me
  const fetchMe = async () => {
    if (!token) throw new Error('No token');
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Invalid session');
    const me = await res.json();
    setUser(me);
    return me;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    (async () => {
      try {
        await fetchMe();
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      walletLogin,
      loginWithToken,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
