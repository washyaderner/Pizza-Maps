// Property data API
import { NextRequest, NextResponse } from 'next/server';
import { getPropertyData, getMockPropertyData } from '@/lib/api-clients/rentcast';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');
    const useMock = searchParams.get('mock') === 'true';

    if (!address) {
      return NextResponse.json(
        { error: 'Address parameter required' },
        { status: 400 }
      );
    }

    // Use mock data if API key not configured or mock requested
    if (useMock || !process.env.RENTCAST_API_KEY) {
      const mockData = getMockPropertyData(address);
      return NextResponse.json(mockData);
    }

    const propertyData = await getPropertyData(address);

    if (!propertyData) {
      // Fall back to mock data if real data unavailable
      const mockData = getMockPropertyData(address);
      return NextResponse.json(mockData);
    }

    return NextResponse.json(propertyData);
  } catch (error) {
    console.error('Property API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
