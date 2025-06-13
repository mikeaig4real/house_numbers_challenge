import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import DashboardNav from '../components/DashboardNav';
import SnippetList from '../components/SnippetList';
import SnippetModal from '../components/SnippetModal';
export default function UserDashboard ()
{
  const { user, logout } = useAuth();
  const [ snippets, setSnippets ] = useState<Snippet[]>( [] );
  const [selected, setSelected] = useState<Snippet | null>(null);
  useEffect(() => {
    fetch('http://localhost:3000/api/snippets', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => setSnippets(data || []));
  }, []);
  return (
    <div className="min-h-screen w-full flex flex-col bg-[#1a0025]">
      <DashboardNav
        userEmail={user?.email}
        onLogout={logout}
      />
       <div className="flex flex-1 overflow-hidden">
        <SnippetList snippets={ snippets } selectedId={ selected?.id || null } onSelect={ setSelected } />
        <AnimatePresence>
          {selected && (
            <SnippetModal snippet={selected} onClose={() => setSelected(null)} useSSE={useSSE} />
          ) }
        </AnimatePresence>
      </div>
    </div>
  );
}
