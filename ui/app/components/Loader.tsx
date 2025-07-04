import { motion } from 'framer-motion';

export default function Loader({ state, message }: { state: boolean; message: string }) {
  if (!state) return null;
  return (
    <motion.div
      className="fixed bottom-8 right-8 z-50 flex items-center gap-2 bg-purple-900 text-white px-4 py-2 rounded shadow-lg"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
    >
      <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
        />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
      {message}
    </motion.div>
  );
}
