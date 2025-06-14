import { motion } from 'framer-motion';
import { useState } from 'react';
import { FiCopy, FiCheck } from 'react-icons/fi';
import SSESummary from './SSESummary';

interface Snippet {
  id: string;
  summary: string;
  text: string;
}

export default function SnippetModal({
  snippet,
  onClose,
  useSSE = false,
}: {
  snippet: Snippet;
  onClose: () => void;
  useSSE?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(snippet.summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };
  return (
    <motion.div
      key="modal"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <motion.div
        className="flex w-[90vw] max-w-4xl h-[70vh] bg-[#22113a] rounded-2xl shadow-2xl overflow-hidden border border-purple-900 relative"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        {/* Summary (left) */}
        <div className="w-1/2 p-8 overflow-y-auto border-r border-purple-900 flex flex-col relative">
          {useSSE ? (
            <SSESummary text={snippet.text} />
          ) : (
            <>
              <h3 className="text-xl font-bold text-purple-200 mb-4 flex items-center justify-between">
                <span>Summary</span>
                <button
                  className="ml-2 p-2 rounded bg-purple-800 hover:bg-purple-700 text-white text-lg"
                  onClick={handleCopy}
                  aria-label="Copy summary"
                  type="button"
                >
                  {copied ? <FiCheck className="text-green-400" /> : <FiCopy />}
                </button>
              </h3>
              <div className="text-white whitespace-pre-line flex-1">{snippet.summary}</div>
            </>
          )}
        </div>
        {/* Full text (right) */}
        <div className="w-1/2 p-8 overflow-y-auto flex flex-col">
          <h3 className="text-xl font-bold text-purple-200 mb-4">Full Text</h3>
          <div className="text-purple-100 whitespace-pre-line flex-1">{snippet.text}</div>
        </div>
        {/* Close button */}
        <button
          className="absolute top-4 right-6 text-purple-300 hover:text-white text-2xl font-bold z-50"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
      </motion.div>
    </motion.div>
  );
}
