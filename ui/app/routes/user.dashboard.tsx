import { useAuth } from '../context/AuthContext';
import DashboardNav from '../components/DashboardNav';
import SnippetList from '../components/SnippetList';
export default function UserDashboard ()
{
  const { user, logout } = useAuth();
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  return (
    <div className="min-h-screen w-full flex flex-col bg-[#1a0025]">
      <DashboardNav
        userEmail={user?.email}
        onLogout={logout}
      />
       <div className="flex flex-1 overflow-hidden">
        <SnippetList snippets={snippets} />
      </div>
    </div>
  );
}
