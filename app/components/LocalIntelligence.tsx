'use client';

import { motion } from 'framer-motion';
import { Restaurant, Attraction, ClimateData } from '@/lib/types';

interface LocalIntelligenceProps {
  restaurants: Restaurant[];
  attractions: Attraction[];
  climate?: ClimateData | null;
}

export default function LocalIntelligence({
  restaurants,
  attractions,
  climate,
}: LocalIntelligenceProps) {
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

  return (
    <div className="space-y-6">
      {/* Restaurants */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 border border-gray-700"
      >
        <h2 className="text-2xl font-bold text-white mb-4">
          Top Restaurants Nearby
        </h2>

        {restaurants.length === 0 ? (
          <p className="text-gray-400">No restaurants found nearby</p>
        ) : (
          <div className="space-y-4">
            {restaurants.map((restaurant, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-4 bg-gray-800/50 rounded-lg
                         border border-gray-700 hover:border-gray-600 transition-colors"
              >
                <div className="flex-1">
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
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Attractions */}
      {attractions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 border border-gray-700"
        >
          <h2 className="text-2xl font-bold text-white mb-4">
            Notable Attractions
          </h2>

          <div className="space-y-3">
            {attractions.map((attraction, idx) => (
              <div
                key={idx}
                className="p-4 bg-gray-800/50 rounded-lg border border-gray-700"
              >
                <h3 className="text-lg font-semibold text-white mb-1">
                  {attraction.name}
                </h3>
                {attraction.rating && getRatingStars(attraction.rating)}
                <p className="text-gray-400 text-sm mt-2">
                  {attraction.address}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Climate Data */}
      {climate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 border border-gray-700"
        >
          <h2 className="text-2xl font-bold text-white mb-4">
            Climate Summary
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <div className="text-gray-400 text-sm mb-1">Avg High Temp</div>
              <div className="text-white text-2xl font-bold">
                {climate.averageHighTemp}°{climate.temperatureUnit}
              </div>
            </div>

            <div>
              <div className="text-gray-400 text-sm mb-1">Avg Low Temp</div>
              <div className="text-white text-2xl font-bold">
                {climate.averageLowTemp}°{climate.temperatureUnit}
              </div>
            </div>

            <div>
              <div className="text-gray-400 text-sm mb-1">Annual Precipitation</div>
              <div className="text-white text-2xl font-bold">
                {climate.annualPrecipitation} in
              </div>
            </div>
          </div>

          <p className="text-gray-400 text-sm mt-4">
            Based on last 12 months of weather data
          </p>
        </motion.div>
      )}
    </div>
  );
}
