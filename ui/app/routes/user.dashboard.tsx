import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import DashboardNav from '../components/DashboardNav';
import SnippetList from '../components/SnippetList';
import SnippetModal from '../components/SnippetModal';
import FloatingPlusButton from '../components/FloatingPlusButton';
import CreateSnippetModal from '../components/CreateSnippetModal';
import Loader from '../components/Loader';
import { SnippetAPI } from '../api';
import { AxiosError } from 'axios';
import { SnippetType } from '../types';

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const [snippets, setSnippets] = useState<SnippetType.Snippet[]>([]);
  const [selected, setSelected] = useState<SnippetType.Snippet | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newText, setNewText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useSSE, setUseSSE] = useState(false);

  const getSnippets = async () => {
    const data = await SnippetAPI.getSnippets();
    setSnippets(data);
  };

  useEffect(() => {
    getSnippets();
  }, []);

  async function handleCreateSnippet() {
    setLoading(true);
    setError(null);
    try {
      const data = await SnippetAPI.createSnippet( newText );
      setSnippets((s) => [data, ...s]);
      setSelected(data);
      setShowCreate(false);
      setNewText('');
    } catch (e) {
      const axiosError = e as AxiosError;
      setError(axiosError.message || 'Creating Snippet failed');
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
