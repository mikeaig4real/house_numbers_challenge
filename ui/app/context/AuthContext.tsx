import { useNavigate } from "@remix-run/react";
import { createContext, useContext, useState, useEffect } from 'react';
import { UserType } from "../types";
import { AuthAPI } from "../api";

interface AuthContextType {
  user: UserType.User | null;
  setUser: (user: UserType.User | null) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_KEY = 'snipify_user';

function persistUser(user: UserType.User | null) {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [ user, setUserState ] = useState<UserType.User | null>( null );
  const navigate = useNavigate();

  useEffect(() => {
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

  const setUser = (user: UserType.User | null) => {
    setUserState(user);
    persistUser(user);
  };

  const logout = async () => {
    await AuthAPI.logout();
    setUser( null );
    navigate('/auth/signin', { replace: true });
  };

  return <AuthContext.Provider value={{ user, setUser, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
