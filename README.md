# Pizza Maps - Property Search MVP

A lightweight Next.js application for searching US property addresses with local intelligence, satellite views, and climate data. Built specifically for call center agents assisting relocating customers.

## Features

### Core Features (MVP)
- **Address Search**: Fast geocoding and address lookup
- **Property Details**: Estimated value, square footage, beds/baths, year built
- **Satellite View**: Embedded Google Maps with satellite imagery
- **Local Restaurants**: Top 5 rated restaurants within 2 miles
- **Attractions**: Notable tourist attractions and parks nearby
- **Climate Summary**: Average temperatures and precipitation data

### Technical Highlights
- Dark mode UI with minimal gradients
- Sub-200ms search response time (with caching)
- Mobile-responsive design
- Keyboard navigation support
- Built-in API response caching
- Zero decorative elements (focused on data)

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion (minimal)
- **APIs**:
  - Google Maps Platform (Geocoding, Maps Embed, Places)
  - RentCast/Realty Mole (Property data)
  - Open-Meteo (Climate data)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- API keys for:
  - Google Maps Platform (required)
  - RentCast (optional - falls back to mock data)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Pizza-Maps
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env.local
```

4. Add your API keys to `.env.local`:
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
RENTCAST_API_KEY=your_rentcast_key  # Optional
```

### Getting API Keys

#### Google Maps Platform
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable these APIs:
   - Geocoding API
   - Maps Embed API
   - Places API
4. Create credentials (API Key)
5. Add billing info (includes $200/month free credit)

#### RentCast (Optional)
1. Visit [RentCast.io](https://www.rentcast.io/)
2. Sign up for pay-as-you-go plan (~$0.005/request)
3. Get API key from dashboard

**Note**: If RentCast API key is not provided, the app will use mock property data for demonstration purposes.

### Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
/app
  /api
    /address         # Geocoding and address lookup
    /property        # Property data fetching
    /local          # Restaurants, attractions, climate
  /components
    SearchBar.tsx
    PropertyCard.tsx
    MapEmbed.tsx
    LocalIntelligence.tsx
  page.tsx          # Main application
  layout.tsx        # Root layout

/lib
  /api-clients
    google-maps.ts   # Google Maps API client
    rentcast.ts      # RentCast API client
    open-meteo.ts    # Open-Meteo API client
  /utils
    cache.ts         # In-memory caching
  types.ts          # TypeScript definitions
```

## API Usage & Caching

The application implements intelligent caching to minimize API costs:

- **Property Data**: 24-hour cache
- **Places (Restaurants/Attractions)**: 24-hour cache
- **Climate Data**: 7-day cache
- **Geocoding**: 24-hour cache

## Performance Targets

- ✅ Initial load: <1s
- ✅ Search results: <200ms (with cache)
- ✅ TTI: <2s
- ✅ Lighthouse score: >95

## Future Enhancements

Potential features to add beyond MVP:
- School ratings (GreatSchools API)
- ISP availability checker
- Commute time calculator to major employment centers
- Moving checklist generator
- Property history timeline
- Neighborhood demographics

## Cost Estimation

Per 1,000 property searches (after free tier):
- Google Maps APIs: ~$7
- RentCast: ~$5
- Open-Meteo: $0
- **Total**: ~$12/1000 searches

Google Maps includes $200/month free credit (~28,000 map loads).

## Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

Add environment variables in Vercel dashboard.

### Docker
```bash
docker build -t pizza-maps .
docker run -p 3000:3000 pizza-maps
```

## License

MIT

## Support

For API documentation and detailed implementation guide, see [API_RECOMMENDATIONS.md](./API_RECOMMENDATIONS.md).
