// Open-Meteo API client for climate data
import { ClimateData } from '../types';
import { cache, cacheKeys } from '../utils/cache';

const BASE_URL = 'https://archive-api.open-meteo.com/v1/archive';

export async function getClimateData(
  latitude: number,
  longitude: number
): Promise<ClimateData | null> {
  const cacheKey = cacheKeys.climate(latitude, longitude);
  const cached = cache.get<ClimateData>(cacheKey);
  if (cached) return cached;

  try {
    // Get last 12 months of data for climate averages
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(endDate.getFullYear() - 1);

    const start = startDate.toISOString().split('T')[0];
    const end = endDate.toISOString().split('T')[0];

    const response = await fetch(
      `${BASE_URL}?latitude=${latitude}&longitude=${longitude}&start_date=${start}&end_date=${end}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&temperature_unit=fahrenheit&timezone=auto`
    );

    if (!response.ok) throw new Error('Open-Meteo API error');

    const data = await response.json();

    if (!data.daily) return null;

    // Calculate averages
    const maxTemps = data.daily.temperature_2m_max.filter((t: number) => t !== null);
    const minTemps = data.daily.temperature_2m_min.filter((t: number) => t !== null);
    const precipitation = data.daily.precipitation_sum.filter((p: number) => p !== null);

    const avgHigh = maxTemps.reduce((a: number, b: number) => a + b, 0) / maxTemps.length;
    const avgLow = minTemps.reduce((a: number, b: number) => a + b, 0) / minTemps.length;
    const totalPrecip = precipitation.reduce((a: number, b: number) => a + b, 0);

    const climateData: ClimateData = {
      averageHighTemp: Math.round(avgHigh),
      averageLowTemp: Math.round(avgLow),
      annualPrecipitation: Math.round(totalPrecip * 10) / 10, // Round to 1 decimal
      temperatureUnit: 'F',
    };

    cache.set(cacheKey, climateData, 10080); // Cache for 7 days
    return climateData;
  } catch (error) {
    console.error('Climate data error:', error);
    return null;
  }
}
