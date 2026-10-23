'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type LocalUser = {
  id: string;
  email: string;
  role: string;
};

export type LocalSession = {
  access_token: string;
  user: LocalUser;
};

type AuthContextValue = {
  user: LocalUser | null;
  session: LocalSession | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_SESSION_KEY = 'foundry_local_session';
const STORAGE_USERS_KEY = 'foundry_local_users';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LocalUser | null>(null);
  const [session, setSession] = useState<LocalSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SESSION_KEY);
      if (saved) {
        const parsed: LocalSession = JSON.parse(saved);
        setSession(parsed);
        setUser(parsed.user);
      }
    } catch (e) {
      console.error('Failed to load local auth session:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  async function signIn(email: string, password: string): Promise<{ error: string | null }> {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      return { error: 'Please enter both email and password.' };
    }

    // Check custom saved users in localStorage
    try {
      const savedUsersRaw = localStorage.getItem(STORAGE_USERS_KEY);
      const savedUsers: Record<string, string> = savedUsersRaw ? JSON.parse(savedUsersRaw) : {};

      // If user was created via SignUp, check password
      if (savedUsers[cleanEmail] && savedUsers[cleanEmail] !== cleanPassword) {
        return { error: 'Invalid password. Please check your credentials.' };
      }

      // Allow login (either matches saved user, default admin, or any authorized local login)
      const localUser: LocalUser = {
        id: 'user_' + cleanEmail.replace(/[^a-zA-Z0-9]/g, '_'),
        email: cleanEmail,
        role: 'authenticated',
      };
      const newSession: LocalSession = {
        access_token: 'local_token_' + Date.now(),
        user: localUser,
      };

      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(newSession));
      setUser(localUser);
      setSession(newSession);

      return { error: null };
    } catch (err: any) {
      return { error: err?.message || 'Login failed' };
    }
  }

  async function signUp(email: string, password: string): Promise<{ error: string | null }> {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      return { error: 'Please enter both email and password.' };
    }
    if (cleanPassword.length < 6) {
      return { error: 'Password must be at least 6 characters.' };
    }

    try {
      const savedUsersRaw = localStorage.getItem(STORAGE_USERS_KEY);
      const savedUsers: Record<string, string> = savedUsersRaw ? JSON.parse(savedUsersRaw) : {};
      savedUsers[cleanEmail] = cleanPassword;
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(savedUsers));

      const localUser: LocalUser = {
        id: 'user_' + cleanEmail.replace(/[^a-zA-Z0-9]/g, '_'),
        email: cleanEmail,
        role: 'authenticated',
      };
      const newSession: LocalSession = {
        access_token: 'local_token_' + Date.now(),
        user: localUser,
      };

      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(newSession));
      setUser(localUser);
      setSession(newSession);

      return { error: null };
    } catch (err: any) {
      return { error: err?.message || 'Registration failed' };
    }
  }

  async function signOut(): Promise<void> {
    localStorage.removeItem(STORAGE_SESSION_KEY);
    setUser(null);
    setSession(null);
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
