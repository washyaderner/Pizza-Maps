'use client';

import { motion } from 'framer-motion';

interface SearchHistoryProps {
  searches: string[];
  onSelectSearch: (query: string) => void;
}

export default function SearchHistory({ searches, onSelectSearch }: SearchHistoryProps) {
  if (searches.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="mt-4 bg-gray-800/50 rounded-lg p-4 border border-gray-700"
    >
      <h3 className="text-sm font-semibold text-gray-400 mb-2">Recent Searches</h3>
      <div className="flex flex-wrap gap-2">
        {searches.map((search, idx) => (
          <button
            key={idx}
            onClick={() => onSelectSearch(search)}
            className="px-3 py-1.5 text-sm text-gray-300 bg-gray-700/50 rounded-md
                     hover:bg-gray-700 hover:text-white transition-colors
                     border border-gray-600 hover:border-gray-500"
          >
            {search}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

