import { Outlet } from '@remix-run/react';

export default function User() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#1a0025]">
      <Outlet />
    </div>
  );
}
