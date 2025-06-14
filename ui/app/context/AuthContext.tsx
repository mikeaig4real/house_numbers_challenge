import { useNavigate } from "@remix-run/react";
import { createContext, useContext, useState, useEffect } from 'react';

export interface AuthUser {
  id: string;
  email: string;
}

interface AuthContextType {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_KEY = 'snipify_user';

function persistUser(user: AuthUser | null) {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [ user, setUserState ] = useState<AuthUser | null>( null );
  const navigate = useNavigate();

  useEffect(() => {
    // Load user from localStorage on mount
    const stored = localStorage.getItem( USER_KEY );
    if (stored) {
      try {
        setUserState( JSON.parse( stored ) );
        navigate( '/user/dashboard' );
      } catch
      {
        localStorage.removeItem(USER_KEY);
      }
    }
  }, [navigate]);

  const setUser = (user: AuthUser | null) => {
    setUserState(user);
    persistUser(user);
  };

  const logout = async () => {
    await fetch('http://localhost:3000/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    setUser( null );
    navigate('/auth/login');
  };

  return <AuthContext.Provider value={{ user, setUser, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
