// Core type definitions for Pizza Maps

export interface Address {
  formatted: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  latitude: number;
  longitude: number;
}

export interface PropertyData {
  address: string;
  estimatedValue?: number;
  squareFeet?: number;
  bedrooms?: number;
  bathrooms?: number;
  yearBuilt?: number;
  propertyType?: string;
  lastSaleDate?: string;
  lastSalePrice?: number;
  lotSize?: number;
  zoning?: string;
}

export interface Restaurant {
  name: string;
  rating: number;
  userRatingsTotal: number;
  priceLevel?: number;
  address: string;
  types: string[];
  distance?: number;
  photoUrl?: string;
}

export interface Attraction {
  name: string;
  rating?: number;
  types: string[];
  address: string;
  distance?: number;
  photoUrl?: string;
}

export interface ClimateData {
  averageHighTemp: number;
  averageLowTemp: number;
  annualPrecipitation: number;
  snowfall?: number;
  sunnyDays?: number;
  temperatureUnit: 'F' | 'C';
}

export interface CommuteDestination {
  name: string;
  address: string;
  driveTime?: string;
  distance?: string;
}

export interface SearchResult {
  address: Address;
  property?: PropertyData;
  restaurants?: Restaurant[];
  attractions?: Attraction[];
  climate?: ClimateData;
  commutes?: CommuteDestination[];
}
