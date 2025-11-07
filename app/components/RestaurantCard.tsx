'use client';

import { motion } from 'framer-motion';
import { Restaurant } from '@/lib/types';

interface RestaurantCardProps {
  restaurants: Restaurant[];
}

export default function RestaurantCard({ restaurants }: RestaurantCardProps) {
  const getRatingStars = (rating: number) => {
    const filled = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    const empty = 5 - filled - half;

    return (
      <div className="flex items-center gap-1">
        {[...Array(filled)].map((_, i) => (
          <span key={`filled-${i}`} className="text-yellow-400">★</span>
        ))}
        {half > 0 && <span className="text-yellow-400">★</span>}
        {[...Array(empty)].map((_, i) => (
          <span key={`empty-${i}`} className="text-gray-600">★</span>
        ))}
        <span className="text-gray-400 text-sm ml-1">({rating.toFixed(1)})</span>
      </div>
    );
  };

  if (restaurants.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 border border-gray-700 mt-6"
    >
      <h2 className="text-2xl font-bold text-white mb-4">
        Top Restaurants Nearby
      </h2>

      <div className="space-y-3">
        {restaurants.map((restaurant, idx) => {
          const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${restaurant.name} ${restaurant.address}`)}`;
          
          return (
            <a
              key={idx}
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 bg-gray-800/50 rounded-lg border border-gray-700
                       hover:border-blue-500 hover:bg-gray-800 transition-all cursor-pointer"
            >
              <h3 className="text-lg font-semibold text-white mb-1">
                {restaurant.name}
              </h3>
              {getRatingStars(restaurant.rating)}
              <p className="text-gray-400 text-sm mt-2">
                {restaurant.address}
              </p>
              {restaurant.priceLevel && (
                <p className="text-gray-500 text-sm mt-1">
                  {'$'.repeat(restaurant.priceLevel)}
                </p>
              )}
            </a>
          );
        })}
      </div>
    </motion.div>
  );
}

