'use client';

import { useState } from 'react';
import SearchBar from './components/SearchBar';
import PropertyCard from './components/PropertyCard';
import MapEmbed from './components/MapEmbed';
import LocalIntelligence from './components/LocalIntelligence';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import { Address, PropertyData, Restaurant, Attraction, ClimateData } from '@/lib/types';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [address, setAddress] = useState<Address | null>(null);
  const [property, setProperty] = useState<PropertyData | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [climate, setClimate] = useState<ClimateData | null>(null);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setError(null);
    setAddress(null);
    setProperty(null);
    setRestaurants([]);
    setAttractions([]);
    setClimate(null);

    try {
      // Step 1: Geocode the address
      const addressResponse = await fetch(
        `/api/address?q=${encodeURIComponent(query)}`
      );

      if (!addressResponse.ok) {
        throw new Error('Address not found. Please check and try again.');
      }

      const addressData: Address = await addressResponse.json();
      setAddress(addressData);

      // Step 2: Fetch property data and local intelligence in parallel
      const [propertyResponse, localResponse] = await Promise.all([
        fetch(
          `/api/property?address=${encodeURIComponent(addressData.formatted)}&mock=true`
        ),
        fetch(
          `/api/local?lat=${addressData.latitude}&lng=${addressData.longitude}`
        ),
      ]);

      if (propertyResponse.ok) {
        const propertyData: PropertyData = await propertyResponse.json();
        setProperty(propertyData);
      }

      if (localResponse.ok) {
        const localData = await localResponse.json();
        setRestaurants(localData.restaurants || []);
        setAttractions(localData.attractions || []);
        setClimate(localData.climate || null);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An error occurred. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-white">
            Pizza Maps
          </h1>
          <p className="text-gray-400 mt-1">
            Property search and local intelligence for US addresses
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-12">
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {/* Loading State */}
        {isLoading && <LoadingSpinner />}

        {/* Error State */}
        {error && !isLoading && <ErrorMessage message={error} />}

        {/* Results */}
        {!isLoading && !error && address && (
          <div className="space-y-6">
            {/* Property and Map Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {property && <PropertyCard property={property} />}
              <MapEmbed
                address={address.formatted}
                latitude={address.latitude}
                longitude={address.longitude}
              />
            </div>

            {/* Local Intelligence */}
            <LocalIntelligence
              restaurants={restaurants}
              attractions={attractions}
              climate={climate}
            />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && !address && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍕</div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Welcome to Pizza Maps
            </h2>
            <p className="text-gray-400 max-w-md mx-auto">
              Search for any US property address to view property details,
              satellite imagery, nearby restaurants, and local climate data.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-black/50 backdrop-blur-sm mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-gray-400 text-sm">
          <p>
            Powered by Google Maps, RentCast, and Open-Meteo APIs
          </p>
        </div>
      </footer>
    </div>
  );
}
