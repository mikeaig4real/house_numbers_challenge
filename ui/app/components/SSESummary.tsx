import { useEffect, useRef, useState } from 'react';

interface SSESummaryProps {
  text: string;
  onDone?: () => void;
}

export default function SSESummary({ text, onDone }: SSESummaryProps) {
  const [summary, setSummary] = useState('');
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    setSummary('');
    setError(null);
    if (!text) return;
    const url = `http://localhost:3000/api/sse/stream/${encodeURIComponent(text)}`;
    const es = new EventSource(url);
    eventSourceRef.current = es;
    es.onmessage = (e) => {
      setSummary((prev) => prev + e.data);
    };
    es.addEventListener('end', () => {
      es.close();
      if (onDone) onDone();
    });
    es.addEventListener('error', () => {
      setError('Failed to summarize via SSE.');
      es.close();
    });
    return () => {
      es.close();
    };
  }, [text, onDone]);

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-xl font-bold text-purple-200 mb-4">Summary (Live)</h3>
      <div className="flex-1 bg-purple-950 rounded p-4 text-purple-100 whitespace-pre-line overflow-y-auto border border-purple-900 min-h-[120px]">
        {error ? (
          <span className="text-red-400">{error}</span>
        ) : (
          summary || <span className="text-purple-500">Summarizing...</span>
        )}
      </div>
    </div>
  );
}
