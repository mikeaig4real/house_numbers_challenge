import { useAuth } from '../context/AuthContext';
import DashboardNav from '../components/DashboardNav';
export default function UserDashboard ()
{
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen w-full flex flex-col bg-[#1a0025]">
      <DashboardNav
        userEmail={user?.email}
        onLogout={logout}
      />
      Dashboard
    </div>
  );
}
