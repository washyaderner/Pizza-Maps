'use client';

import { motion } from 'framer-motion';

interface MapEmbedProps {
  address: string;
  latitude: number;
  longitude: number;
}

export default function MapEmbed({ address, latitude, longitude }: MapEmbedProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const embedUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(address)}&maptype=satellite&zoom=18`;
  const openMapUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}&basemap=satellite`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 border border-gray-700"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white">Satellite View</h2>
        <a
          href={openMapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-blue-600 text-white rounded-md
                   hover:bg-blue-700 active:bg-blue-800
                   transition-colors duration-200 text-sm font-medium"
        >
          Open in Maps
        </a>
      </div>

      <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
        <iframe
          src={embedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full"
        />
      </div>
    </motion.div>
  );
}
