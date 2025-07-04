import { Outlet, useNavigate } from '@remix-run/react';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

export default function User() {
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate('/auth/sign_in', { replace: true });
    }
  }, [navigate, user]);
  if (!user) return null;
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#1a0025]">
      <Outlet />
    </div>
  );
}
