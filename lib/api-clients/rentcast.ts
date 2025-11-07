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
      throw new Error(`RentCast API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data || !data[0]) return null;

    const property = data[0];

    const propertyData: PropertyData = {
      address: property.formattedAddress || address,
      estimatedValue: property.price || property.assessedValue,
      squareFeet: property.squareFootage,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      yearBuilt: property.yearBuilt,
      propertyType: property.propertyType,
      lastSaleDate: property.lastSaleDate,
      lastSalePrice: property.lastSalePrice,
      lotSize: property.lotSize,
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
  return {
    address,
    estimatedValue: 425000,
    squareFeet: 1850,
    bedrooms: 3,
    bathrooms: 2.5,
    yearBuilt: 1998,
    propertyType: 'Single Family',
    lastSaleDate: '2019-03-15',
    lastSalePrice: 380000,
    lotSize: 7200,
  };
}
