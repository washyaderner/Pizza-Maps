# Pizza Maps - API Selection & Implementation Guide

## Selected API Stack (3 Dependencies)

### 1. Google Maps Platform (Primary - Mapping & Local Data)
- **Maps Embed API**: Free, unlimited usage, satellite view support
- **Places API**: Nearby search for restaurants, ratings, photos
- **Geocoding API**: Convert addresses to coordinates
- **Distance Matrix API**: Calculate commute times
- **Pricing**: Free tier includes $200/month credit (~28,000 map loads)

### 2. RentCast (Property Data)
- **Formerly**: Realty Mole API
- **Coverage**: US properties with rental estimates, property records
- **Pricing**: Pay-as-you-go starting at $0.005/request
- **Data**: Property value, sqft, beds/baths, year built, last sale
- **Alternative**: Estated API (similar pricing)

### 3. Open-Meteo (Climate Data)
- **Type**: Free, open-source, no API key required
- **Data**: Historical weather (80+ years), temperature, precipitation
- **Resolution**: 10km grid resolution
- **Pricing**: Completely free for commercial use

## Additional Features Implementation

### ✅ Included in MVP
1. **Property Data**: RentCast API
2. **Restaurants & Local**: Google Places API
3. **Maps Integration**: Google Maps Embed API
4. **Climate Summary**: Open-Meteo API
5. **Commute Calculator**: Google Distance Matrix API

### ⚠️ Deferred (Cost/Availability Issues)
1. **School Ratings**: GreatSchools API requires paid subscription (14-day trial available)
2. **ISP Availability**: No reliable free API available; recommend manual data or skip
3. **Moving Checklist**: Can implement with static data (no API needed)

## API Keys Required

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
RENTCAST_API_KEY=your_rentcast_key
# Open-Meteo requires no API key
```

## Rate Limits & Caching Strategy

### Google Maps Platform
- **Embed API**: Unlimited
- **Places API**: 150,000 requests/month free
- **Cache**: 30 days for Places data

### RentCast
- **Pay-per-use**: ~$0.005 per request
- **Cache**: 24 hours for property data

### Open-Meteo
- **No official limit**: Consider caching for 30 days
- **Cache**: Climate data by zip code

## Implementation Priority

1. **Phase 1** (Core MVP):
   - Address autocomplete (Google Geocoding)
   - Property data display (RentCast)
   - Map embed (Google Maps)

2. **Phase 2** (Local Intelligence):
   - Nearby restaurants (Google Places)
   - Local attractions (Google Places)

3. **Phase 3** (Additional Features):
   - Climate summary (Open-Meteo)
   - Commute calculator (Google Distance Matrix)

## Cost Estimate (per 1000 searches)

- Google Maps: ~$7 (within free tier initially)
- RentCast: ~$5
- Open-Meteo: $0
- **Total**: ~$12/1000 searches (after free tier exhausted)

## Notes

- All APIs support HTTPS/REST
- JSON responses across all services
- No CORS issues with Next.js API routes
- Consider implementing Redis/Upstash for production caching
