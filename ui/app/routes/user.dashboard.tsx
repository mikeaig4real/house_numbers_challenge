import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import DashboardNav from '../components/DashboardNav';
import SnippetList from '../components/SnippetList';
import SnippetModal from '../components/SnippetModal';
import FloatingPlusButton from '../components/FloatingPlusButton';
import CreateSnippetModal from '../components/CreateSnippetModal';
import Loader from '../components/Loader';

interface Snippet {
  id: string;
  summary: string;
  text: string;
}

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [selected, setSelected] = useState<Snippet | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newText, setNewText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useSSE, setUseSSE] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3000/api/snippets', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => setSnippets(data || []));
  }, []);

  async function handleCreateSnippet() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:3000/api/snippets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ text: newText }),
      });
      if (!res.ok) throw new Error('Failed to create snippet');
      const data = await res.json();
      // optimistically update the UI
      setSnippets((s) => [data, ...s]);
      setSelected(data);
      setShowCreate(false);
      setNewText('');
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#1a0025]">
      <DashboardNav
        userEmail={user?.email}
        onLogout={logout}
        useSSE={useSSE}
        setUseSSE={setUseSSE}
      />
      <div className="flex flex-1 overflow-hidden">
        <SnippetList snippets={snippets} selectedId={selected?.id || null} onSelect={setSelected} />
        <AnimatePresence>
          {selected && (
            <SnippetModal snippet={selected} onClose={() => setSelected(null)} useSSE={useSSE} />
          )}
        </AnimatePresence>
        <FloatingPlusButton onClick={() => setShowCreate(true)} />
        <AnimatePresence>
          <CreateSnippetModal
            show={showCreate}
            onClose={() => setShowCreate(false)}
            onCreate={handleCreateSnippet}
            loading={loading}
            error={error}
            newText={newText}
            setNewText={setNewText}
          />
        </AnimatePresence>
        <Loader loading={loading} />
      </div>
    </div>
  );
}
