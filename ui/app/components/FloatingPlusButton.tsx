import { motion } from 'framer-motion';

export default function FloatingPlusButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      className="fixed bottom-8 right-8 z-50 p-0 w-16 h-16 rounded-full bg-purple-700 hover:bg-purple-600 shadow-2xl flex items-center justify-center border-4 border-purple-900 group"
      whileHover={{ scale: 1.1 }}
      onClick={onClick}
    >
      <span className="text-white text-4xl">+</span>
      <motion.span
        className="absolute bottom-20 right-0 bg-purple-800 text-white px-4 py-2 rounded shadow-lg text-sm opacity-0 group-hover:opacity-100 pointer-events-none"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        Create Snippet
      </motion.span>
    </motion.button>
  );
}
