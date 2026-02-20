import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AUTH_STORAGE_KEY = 'auralmind.auth.user.v1';
const AuthContext = createContext(null);

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const rawUser = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!rawUser) return;
      const parsed = JSON.parse(rawUser);
      if (parsed && parsed.email) {
        setUser({ email: parsed.email });
      }
    } catch (error) {
      console.warn('Failed to hydrate auth state from storage.', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const signIn = async (email, password) => {
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const normalizedPassword = String(password || '');

    setLoading(true);
    try {
      await wait(900);

      if (!normalizedEmail.includes('@')) {
        throw new Error('Enter a valid email address.');
      }
      if (normalizedPassword.length < 6) {
        throw new Error('Password must be at least 6 characters.');
      }

      const nextUser = { email: normalizedEmail };
      setUser(nextUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextUser));
      return nextUser;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await wait(250);
      setUser(null);
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      signIn,
      signOut,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider.');
  }
  return context;
}
