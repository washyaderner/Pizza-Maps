// RentCast API client (formerly Realty Mole)
import { PropertyData } from '../types';
import { cache, cacheKeys } from '../utils/cache';

const API_KEY = process.env.RENTCAST_API_KEY;
const BASE_URL = 'https://api.rentcast.io/v1';

export async function getPropertyData(address: string): Promise<PropertyData | null> {
  const cacheKey = cacheKeys.property(address);
  const cached = cache.get<PropertyData>(cacheKey);
  if (cached) return cached;

  if (!API_KEY) {
    console.warn('RentCast API key not configured');
    return null;
  }

  try {
    const response = await fetch(
      `${BASE_URL}/properties?address=${encodeURIComponent(address)}`,
      {
        headers: {
          'X-Api-Key': API_KEY,
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) return null;
      // Check for subscription/billing errors
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 401 && errorData.error?.includes('subscription')) {
        console.warn('RentCast API subscription inactive - falling back to mock data');
        return null; // Will trigger fallback to mock data
      }
      throw new Error(`RentCast API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data || !data[0]) return null;

    const property = data[0];

    // Map RentCast API fields (check multiple possible field names)
    const propertyData: PropertyData = {
      address: property.formattedAddress || property.address || address,
      estimatedValue: property.price || property.estimatedValue || property.assessedValue || property.marketValue,
      squareFeet: property.squareFootage || property.squareFeet || property.livingArea,
      bedrooms: property.bedrooms || property.beds,
      bathrooms: property.bathrooms || property.baths,
      yearBuilt: property.yearBuilt || property.yearConstructed,
      propertyType: property.propertyType || property.type,
      lastSaleDate: property.lastSaleDate || property.saleDate,
      lastSalePrice: property.lastSalePrice || property.salePrice,
      lotSize: property.lotSize || property.lotSquareFeet,
      zoning: property.zoning,
    };

    cache.set(cacheKey, propertyData, 1440); // Cache for 24 hours
    return propertyData;
  } catch (error) {
    console.error('RentCast API error:', error);
    return null;
  }
}

// Alternative: Mock data generator for development/demo
export function getMockPropertyData(address: string): PropertyData {
  // Note: This is placeholder data. For real property data, activate RentCast API subscription.
  // Mock data matches example property: 273 NW 182nd Ave, Beaverton, OR 97006
  // Estimated value calculated at ~$378/sqft for Beaverton area (typical range $300-450/sqft)
  return {
    address,
    estimatedValue: 425000, // Estimated based on sqft and Beaverton market (~$378/sqft)
    squareFeet: 1125,
    bedrooms: 3,
    bathrooms: 2,
    yearBuilt: 1998, // Typical for this area/type
    propertyType: 'Single Family',
    lastSaleDate: '2019-03-15', // Example date
    lastSalePrice: 380000, // Example sale price
    lotSize: 7200, // Typical lot size for this area
  };
}
