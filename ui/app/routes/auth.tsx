import { Outlet } from '@remix-run/react';

export default function AuthLayout() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#1a0025]">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-2xl bg-purple-950/90 border border-purple-900 flex flex-col items-center">
        <Outlet />
      </div>
    </div>
  );
}
