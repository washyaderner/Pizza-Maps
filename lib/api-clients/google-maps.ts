// Google Maps API client
import { Address, Restaurant, Attraction, CommuteDestination } from '../types';
import { cache, cacheKeys } from '../utils/cache';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const BASE_URL = 'https://maps.googleapis.com/maps/api';

export async function geocodeAddress(address: string): Promise<Address | null> {
  const cacheKey = cacheKeys.geocode(address);
  const cached = cache.get<Address>(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(
      `${BASE_URL}/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`
    );

    if (!response.ok) throw new Error('Geocoding failed');

    const data = await response.json();

    if (data.status !== 'OK' || !data.results?.[0]) {
      return null;
    }

    const result = data.results[0];
    const { lat, lng } = result.geometry.location;
    const components = result.address_components;

    const addressData: Address = {
      formatted: result.formatted_address,
      latitude: lat,
      longitude: lng,
      street: components.find((c: any) => c.types.includes('street_number'))?.long_name + ' ' +
              components.find((c: any) => c.types.includes('route'))?.long_name,
      city: components.find((c: any) => c.types.includes('locality'))?.long_name,
      state: components.find((c: any) => c.types.includes('administrative_area_level_1'))?.short_name,
      zipCode: components.find((c: any) => c.types.includes('postal_code'))?.long_name,
    };

    cache.set(cacheKey, addressData, 1440); // Cache for 24 hours
    return addressData;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

export async function searchNearbyPlaces(
  latitude: number,
  longitude: number,
  type: 'restaurant' | 'tourist_attraction' | 'park',
  radius: number = 3200 // 2 miles in meters
): Promise<Restaurant[] | Attraction[]> {
  const cacheKey = cacheKeys.places(latitude, longitude, type);
  const cached = cache.get<Restaurant[] | Attraction[]>(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(
      `${BASE_URL}/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${type}&key=${API_KEY}`
    );

    if (!response.ok) throw new Error('Places search failed');

    const data = await response.json();

    if (data.status !== 'OK' || !data.results) {
      return [];
    }

    const places = data.results.slice(0, 5).map((place: any) => ({
      name: place.name,
      rating: place.rating || 0,
      userRatingsTotal: place.user_ratings_total || 0,
      priceLevel: place.price_level,
      address: place.vicinity,
      types: place.types,
      photoUrl: place.photos?.[0]
        ? `${BASE_URL}/place/photo?maxwidth=400&photo_reference=${place.photos[0].photo_reference}&key=${API_KEY}`
        : undefined,
    }));

    cache.set(cacheKey, places, 1440); // Cache for 24 hours
    return places;
  } catch (error) {
    console.error('Places search error:', error);
    return [];
  }
}

export async function calculateCommute(
  origin: string,
  destinations: string[]
): Promise<CommuteDestination[]> {
  if (!destinations.length) return [];

  try {
    const destString = destinations.join('|');
    const response = await fetch(
      `${BASE_URL}/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destString)}&mode=driving&key=${API_KEY}`
    );

    if (!response.ok) throw new Error('Distance matrix failed');

    const data = await response.json();

    if (data.status !== 'OK' || !data.rows?.[0]?.elements) {
      return [];
    }

    return destinations.map((dest, idx) => {
      const element = data.rows[0].elements[idx];
      return {
        name: dest,
        address: data.destination_addresses[idx],
        driveTime: element.status === 'OK' ? element.duration.text : 'N/A',
        distance: element.status === 'OK' ? element.distance.text : 'N/A',
      };
    });
  } catch (error) {
    console.error('Commute calculation error:', error);
    return [];
  }
}

export function getMapEmbedUrl(address: string): string {
  return `https://www.google.com/maps/embed/v1/place?key=${API_KEY}&q=${encodeURIComponent(address)}&maptype=satellite&zoom=18`;
}

export function getMapLinkUrl(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}&basemap=satellite`;
}
