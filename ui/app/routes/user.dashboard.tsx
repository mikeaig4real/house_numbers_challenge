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
import Error from '../components/Error';
import { socket, connectSocket } from '../utils/socket';
import EVENTS from '../constants/events';

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const [snippets, setSnippets] = useState<SnippetType.Snippet[]>([]);
  const [selected, setSelected] = useState<SnippetType.Snippet | null>(null);
  const [streamSelected, setStreamSelected] = useState<SnippetType.Snippet | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newText, setNewText] = useState('');
  const [loading, setLoading] = useState({ state: false, message: '' });
  const [error, setError] = useState<string>('');
  const [useStreaming, setUseStreaming] = useState(false);

  const getSnippets = async () => {
    setLoading({ state: true, message: 'Loading snippets...' });
    setError('');
    try {
      const data = await SnippetAPI.getSnippets();
      setSnippets(data);
    } catch ( e )
    {
      console.log('Error loading snippets:', e);
      const axiosError = e as AxiosError;
      setError(axiosError.message || 'Loading Snippets failed');
    } finally {
      setLoading({ state: false, message: '' });
    }
  };

  async function handleCreateSnippet() {
    if (!newText.trim()) {
      setError('Snippet text cannot be empty');
      return;
    }
    setLoading({ state: true, message: 'Creating snippet...' });
    setError('');
    setStreamSelected(null);
    setSelected(null);
    try {
      if (!useStreaming) {
        const data = await SnippetAPI.createSnippet(newText);
        setSnippets((s) => [data, ...s]);
        setSelected(data);
      } else {
        socket.emit(
          EVENTS.GET_SUMMARY,
          { text: newText },
          ({
            data,
            error,
            message,
          }: {
            data: SnippetType.Snippet;
            error: boolean;
            message: string;
          }) => {
            if (error) {
              console.error('Error creating snippet:', message);
              setError(message);
              return;
            }
            setStreamSelected((prev) => {
              return { ...prev, ...data };
            });
            setSnippets((s) => [data, ...s]);
          },
        );
      }
      setShowCreate(false);
      setNewText('');
    } catch ( e )
    {
      console.log('Error creating snippet:', e);
      const axiosError = e as AxiosError;
      setError(axiosError.message || 'Creating Snippet failed');
    } finally {
      setLoading({ state: false, message: '' });
    }
  }
  const onSendSummary = ( { data }: { data: { text: string; summary: string; }; } ) =>
  {
    setStreamSelected((prev) =>
      prev
        ? { ...prev, summary: prev.summary + data.summary }
        : { id: 'streaming', text: data.text, summary: data.summary }
    );
  };
  useEffect(() => {
    getSnippets();
    connectSocket();
    socket.on(EVENTS.SEND_SUMMARY, onSendSummary);
    return () => {
      socket.off(EVENTS.SEND_SUMMARY, onSendSummary);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#1a0025]">
      <DashboardNav
        userEmail={user?.email}
        onLogout={logout}
        useStreaming={useStreaming}
        setUseStreaming={setUseStreaming}
      />
      <div className="flex flex-1 overflow-hidden">
        <SnippetList snippets={snippets} selectedId={selected?.id || null} onSelect={setSelected} />
        <AnimatePresence>
          {(streamSelected || selected) && (
            <SnippetModal
              snippet={(streamSelected || selected)!}
              onClose={ () =>
              {
                if (selected) setSelected( null );
                if (streamSelected) setStreamSelected( null );
              }}
            />
          )}
        </AnimatePresence>
        <FloatingPlusButton onClick={() => setShowCreate(true)} />
        <AnimatePresence>
          <CreateSnippetModal
            show={showCreate}
            onClose={() => setShowCreate(false)}
            onCreate={handleCreateSnippet}
            loading={loading}
            newText={newText}
            setNewText={setNewText}
          />
        </AnimatePresence>
        <Loader state={loading.state} message={loading.message} />
      </div>
      <Error message={error} />
    </div>
  );
}
