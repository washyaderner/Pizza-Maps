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

    // Check for billing-related errors
    if (data.status === 'REQUEST_DENIED') {
      const errorMsg = data.error_message || '';
      if (errorMsg.includes('billing') || errorMsg.includes('Billing')) {
        console.error('Google Maps API billing error:', errorMsg);
        throw new Error('Google Maps API billing is not enabled. Please enable billing in Google Cloud Console. Changes may take 5-10 minutes to propagate.');
      }
      console.error('Google Maps API request denied:', errorMsg);
      throw new Error('API request denied. Please check your API key configuration.');
    }

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
    // Re-throw billing/configuration errors so they can be displayed to the user
    if (error instanceof Error && (error.message.includes('billing') || error.message.includes('API'))) {
      throw error;
    }
    return null;
  }
}

// Common chain restaurant patterns to filter out
const CHAIN_RESTAURANT_PATTERNS = [
  /mcdonald/i, /burger king/i, /wendy/i, /taco bell/i, /kfc/i, /subway/i,
  /pizza hut/i, /domino/i, /papa john/i, /little caesar/i,
  /starbucks/i, /dunkin/i, /tim hortons/i,
  /olive garden/i, /applebee/i, /chili/i, /outback/i, /red lobster/i,
  /chipotle/i, /qdoba/i, /moe/i, /panera/i, /jimmy john/i,
  /arby/i, /hardee/i, /jack in the box/i, /in-n-out/i, /five guys/i,
  /denny/i, /ihop/i, /waffle house/i, /cracker barrel/i,
  /buffalo wild wings/i, /wingstop/i, /hooter/i,
  /panda express/i, /pf chang/i, /pepper/i,
];

function isChainRestaurant(name: string): boolean {
  return CHAIN_RESTAURANT_PATTERNS.some(pattern => pattern.test(name));
}

export async function searchQualityRestaurants(
  latitude: number,
  longitude: number,
  radius: number = 5000 // 3 miles in meters
): Promise<Restaurant[]> {
  const cacheKey = `quality_restaurants_${latitude}_${longitude}`;
  const cached = cache.get<Restaurant[]>(cacheKey);
  if (cached) return cached;

  try {
    // Search for specific restaurant types: steakhouse, Mexican, Thai, and Chinese
    const searchQueries = [
      `steakhouse near ${latitude},${longitude}`,
      `Mexican restaurant near ${latitude},${longitude}`,
      `Thai restaurant near ${latitude},${longitude}`,
      `Chinese restaurant near ${latitude},${longitude}`,
    ];

    const allResults: any[] = [];
    const seenPlaceIds = new Set<string>();
    const resultsByType: { [key: string]: any[] } = {
      steakhouse: [],
      mexican: [],
      thai: [],
      chinese: [],
    };

    // Search with multiple queries to get diverse results
    for (let i = 0; i < searchQueries.length; i++) {
      const query = searchQueries[i];
      const response = await fetch(
        `${BASE_URL}/place/textsearch/json?query=${encodeURIComponent(query)}&location=${latitude},${longitude}&radius=${radius}&type=restaurant&key=${API_KEY}`
      );

      if (!response.ok) continue;

      const data = await response.json();

      if (data.status === 'OK' && data.results) {
        // Determine type based on query index
        const typeKey = i === 0 ? 'steakhouse' : i === 1 ? 'mexican' : i === 2 ? 'thai' : 'chinese';
        
        for (const place of data.results) {
          // Skip if we've already seen this place
          if (seenPlaceIds.has(place.place_id)) continue;
          
          // Filter out chains and low-rated places
          if (!isChainRestaurant(place.name) && place.rating >= 4.0) {
            seenPlaceIds.add(place.place_id);
            allResults.push(place);
            resultsByType[typeKey].push(place);
          }
        }
      }
    }

    // Prioritize: get best from each type, then fill remaining slots
    const prioritizedResults: any[] = [];
    
    // Get best from each category
    Object.keys(resultsByType).forEach(type => {
      if (resultsByType[type].length > 0) {
        const best = resultsByType[type].sort((a, b) => (b.rating || 0) - (a.rating || 0))[0];
        if (!prioritizedResults.find(r => r.place_id === best.place_id)) {
          prioritizedResults.push(best);
        }
      }
    });

    // Fill remaining slots with highest rated from all results
    const remaining = allResults
      .filter(r => !prioritizedResults.find(pr => pr.place_id === r.place_id))
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 4 - prioritizedResults.length);
    
    const sortedResults = [...prioritizedResults, ...remaining];

    // If we don't have enough results, fall back to nearby search but filter chains
    if (sortedResults.length < 4) {
      const nearbyResponse = await fetch(
        `${BASE_URL}/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=restaurant&key=${API_KEY}`
      );

      if (nearbyResponse.ok) {
        const nearbyData = await nearbyResponse.json();
        if (nearbyData.status === 'OK' && nearbyData.results) {
          for (const place of nearbyData.results) {
            if (seenPlaceIds.has(place.place_id)) continue;
            if (!isChainRestaurant(place.name) && place.rating >= 4.0) {
              seenPlaceIds.add(place.place_id);
              sortedResults.push(place);
            }
          }
        }
      }
    }

    // Final sort and limit to top 4 (one of each type)
    const finalResults = sortedResults
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 4)
      .map((place: any) => ({
        name: place.name,
        rating: place.rating || 0,
        userRatingsTotal: place.user_ratings_total || 0,
        priceLevel: place.price_level,
        address: place.formatted_address || place.vicinity,
        types: place.types || [],
        photoUrl: place.photos?.[0]
          ? `${BASE_URL}/place/photo?maxwidth=400&photo_reference=${place.photos[0].photo_reference}&key=${API_KEY}`
          : undefined,
      }));

    cache.set(cacheKey, finalResults, 1440); // Cache for 24 hours
    return finalResults;
  } catch (error) {
    console.error('Quality restaurant search error:', error);
    return [];
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
