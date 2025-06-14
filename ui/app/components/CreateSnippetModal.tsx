import { motion } from 'framer-motion';

export default function CreateSnippetModal({
  show,
  onClose,
  onCreate,
  loading,
  error,
  newText,
  setNewText,
}: {
  show: boolean;
  onClose: () => void;
  onCreate: () => void;
  loading: boolean;
  error: string | null;
  newText: string;
  setNewText: (t: string) => void;
}) {
  if (!show) return null;
  return (
    <motion.div
      key="create"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-[#22113a] rounded-2xl p-8 w-full min-w-[320px] min-h-[300px] max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl md:min-h-[400px] lg:min-h-[500px] xl:min-h-[600px] max-h-[90vh] shadow-2xl border border-purple-900 flex flex-col relative"
        style={{ maxHeight: '90vh' }}
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-purple-700 text-white hover:bg-purple-800 text-xl font-bold shadow"
          onClick={onClose}
          aria-label="Close"
          type="button"
        >
          ×
        </button>
        <h3 className="text-xl font-bold text-purple-200 mb-4">Create a new Snippet</h3>
        <textarea
          className="w-full min-h-[120px] rounded bg-purple-900 text-white p-4 border border-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-600 mb-4"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="Paste or type your text here..."
        />
        {error && <div className="text-red-400 mb-2">{error}</div>}
        <button
          className="w-full py-3 rounded bg-purple-700 hover:bg-purple-600 text-white font-semibold shadow-lg transition-colors"
          onClick={onCreate}
          disabled={loading || !newText.trim()}
        >
          {loading ? 'Creating...' : 'Make Snippet'}
        </button>
      </motion.div>
    </motion.div>
  );
}