// Address autocomplete and geocoding API
import { NextRequest, NextResponse } from 'next/server';
import { geocodeAddress } from '@/lib/api-clients/google-maps';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('q');

    if (!address) {
      return NextResponse.json(
        { error: 'Address query parameter required' },
        { status: 400 }
      );
    }

    const result = await geocodeAddress(address);

    if (!result) {
      return NextResponse.json(
        { error: 'Address not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Address API error:', error);
    // Pass through billing/configuration errors with their messages
    if (error instanceof Error && (error.message.includes('billing') || error.message.includes('API'))) {
      return NextResponse.json(
        { error: error.message },
        { status: 503 } // Service Unavailable for configuration issues
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
