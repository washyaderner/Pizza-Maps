'use client';

import { motion } from 'framer-motion';
import { PropertyData } from '@/lib/types';

interface PropertyCardProps {
  property: PropertyData;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const formatCurrency = (value?: number) => {
    if (!value) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (date?: string) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 border border-gray-700"
    >
      <h2 className="text-2xl font-bold text-white mb-4">Property Details</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <div className="text-gray-400 text-sm mb-1">Estimated Value</div>
          <div className="text-white text-xl font-bold">
            {formatCurrency(property.estimatedValue)}
          </div>
        </div>

        <div>
          <div className="text-gray-400 text-sm mb-1">Square Feet</div>
          <div className="text-white text-xl font-bold">
            {property.squareFeet?.toLocaleString() || 'N/A'}
          </div>
        </div>

        <div>
          <div className="text-gray-400 text-sm mb-1">Bedrooms</div>
          <div className="text-white text-xl font-bold">
            {property.bedrooms || 'N/A'}
          </div>
        </div>

        <div>
          <div className="text-gray-400 text-sm mb-1">Bathrooms</div>
          <div className="text-white text-xl font-bold">
            {property.bathrooms || 'N/A'}
          </div>
        </div>

        <div>
          <div className="text-gray-400 text-sm mb-1">Year Built</div>
          <div className="text-white text-xl font-bold">
            {property.yearBuilt || 'N/A'}
          </div>
        </div>

        <div>
          <div className="text-gray-400 text-sm mb-1">Property Type</div>
          <div className="text-white text-xl font-bold">
            {property.propertyType || 'N/A'}
          </div>
        </div>
      </div>

      {property.lastSaleDate && (
        <div className="mt-6 pt-6 border-t border-gray-700">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-gray-400 text-sm mb-1">Last Sale Date</div>
              <div className="text-white font-semibold">
                {formatDate(property.lastSaleDate)}
              </div>
            </div>
            <div>
              <div className="text-gray-400 text-sm mb-1">Last Sale Price</div>
              <div className="text-white font-semibold">
                {formatCurrency(property.lastSalePrice)}
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
