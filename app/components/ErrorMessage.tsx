'use client';

import { motion } from 'framer-motion';

interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-red-900/20 border border-red-700 rounded-lg p-6 max-w-2xl mx-auto"
    >
      <div className="flex items-center gap-3">
        <div className="text-red-500 text-2xl">⚠</div>
        <div>
          <h3 className="text-white font-semibold mb-1">Error</h3>
          <p className="text-gray-300">{message}</p>
        </div>
      </div>
    </motion.div>
  );
}
