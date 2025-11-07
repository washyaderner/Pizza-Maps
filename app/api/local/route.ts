// Local intelligence API (restaurants and attractions)
import { NextRequest, NextResponse } from 'next/server';
import { searchNearbyPlaces } from '@/lib/api-clients/google-maps';
import { getClimateData } from '@/lib/api-clients/open-meteo';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get('lat') || '');
    const lng = parseFloat(searchParams.get('lng') || '');
    const type = searchParams.get('type');

    if (isNaN(lat) || isNaN(lng)) {
      return NextResponse.json(
        { error: 'Valid latitude and longitude required' },
        { status: 400 }
      );
    }

    // Get restaurants, attractions, and climate data
    const [restaurants, attractions, climate] = await Promise.all([
      searchNearbyPlaces(lat, lng, 'restaurant'),
      searchNearbyPlaces(lat, lng, 'tourist_attraction'),
      getClimateData(lat, lng),
    ]);

    return NextResponse.json({
      restaurants,
      attractions,
      climate,
    });
  } catch (error) {
    console.error('Local intelligence API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
