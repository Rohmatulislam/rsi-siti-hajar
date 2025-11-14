// cache.ts - Simple in-memory caching utility for SIMRS Khanza data
// This is a basic implementation - in production, you might want to use Redis or similar

interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number; // Time-to-live in milliseconds
}

class SimpleCache {
  private cache: Map<string, CacheEntry> = new Map();

  // Set data in cache with TTL
  set(key: string, data: any, ttl: number = 300000): void { // Default 5 minutes
    const timestamp = Date.now();
    this.cache.set(key, { data, timestamp, ttl });
  }

  // Get data from cache if not expired
  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  // Check if key exists and is not expired
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  // Delete specific key
  delete(key: string): void {
    this.cache.delete(key);
  }

  // Clear all cache
  clear(): void {
    this.cache.clear();
  }

  // Clean expired entries
  clean(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

// Create a single instance of the cache
export const khanzaCache = new SimpleCache();

// Function to create cache key based on function name and parameters
export function createCacheKey(fnName: string, params?: any[] | Record<string, any>): string {
  let paramString = '';
  
  if (params) {
    if (Array.isArray(params)) {
      // Jika params adalah array
      paramString = JSON.stringify(params);
    } else {
      // Jika params adalah object, urutkan key-nya agar konsisten
      const sortedParams = Object.keys(params)
        .sort()
        .reduce((obj, key) => {
          (obj as any)[key] = (params as Record<string, any>)[key];
          return obj;
        }, {} as Record<string, any>);
      paramString = JSON.stringify(sortedParams);
    }
  }
  
  return `${fnName}_${paramString}`;
}