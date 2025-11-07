// Simple in-memory cache for API responses
// In production, consider using Redis/Upstash

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class SimpleCache {
  private cache: Map<string, CacheEntry<any>> = new Map();

  set<T>(key: string, data: T, ttlMinutes: number = 30): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMinutes * 60 * 1000,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > entry.ttl;

    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    // Clean expired entries first
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
    return this.cache.size;
  }
}

export const cache = new SimpleCache();

// Cache key generators
export const cacheKeys = {
  property: (address: string) => `property:${address.toLowerCase().trim()}`,
  places: (lat: number, lng: number, type: string) => `places:${lat},${lng}:${type}`,
  geocode: (address: string) => `geocode:${address.toLowerCase().trim()}`,
  climate: (lat: number, lng: number) => `climate:${lat.toFixed(2)},${lng.toFixed(2)}`,
  commute: (from: string, to: string) => `commute:${from}:${to}`,
};
