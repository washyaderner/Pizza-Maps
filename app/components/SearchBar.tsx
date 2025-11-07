'use client';

import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';

interface SearchBarProps {
  onSearch: (address: string) => void;
  isLoading?: boolean;
}

export default function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="w-full"
    >
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter a US property address..."
          disabled={isLoading}
          className="w-full px-6 py-4 text-lg bg-gray-800 border-2 border-gray-700 rounded-lg
                   text-white placeholder-gray-400
                   focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-all duration-200"
          autoComplete="off"
          autoFocus
        />

        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2
                   px-6 py-2 bg-blue-600 text-white rounded-md
                   hover:bg-blue-700 active:bg-blue-800
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-colors duration-200
                   font-medium"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>

      <div className="mt-3 text-sm text-gray-400 text-left">
        Example: 1600 Pennsylvania Avenue NW, Washington, DC
      </div>
    </motion.form>
  );
}
