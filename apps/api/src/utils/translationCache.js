/**
 * In-memory cache for translations with TTL support
 * Stores translations with timestamps for 24-hour expiration
 */

const MAX_CACHE_SIZE = 50;
const DEFAULT_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const cache = new Map();

// Cache statistics
let hitCount = 0;
let missCount = 0;

/**
 * Get a translation from cache
 * @param {string} key - Cache key (textHash|sourceLanguage|targetLanguage)
 * @returns {Object|null} - Cached result { translatedText, detectedLanguage } or null if not found or expired
 */
export function getFromCache(key) {
  const cached = cache.get(key);
  
  if (!cached) {
    missCount++;
    return null;
  }

  // Check if cache entry has expired
  const now = Date.now();
  if (now - cached.timestamp > cached.ttl) {
    // Cache expired, remove it
    cache.delete(key);
    missCount++;
    return null;
  }

  // Cache hit
  hitCount++;
  return cached.data;
}

/**
 * Set a translation in cache with TTL
 * Maintains a maximum of 50 entries (FIFO)
 * @param {string} key - Cache key (textHash|sourceLanguage|targetLanguage)
 * @param {Object} value - Result object { translatedText, detectedLanguage }
 * @param {number} ttl - Time to live in milliseconds (default: 24 hours)
 */
export function setInCache(key, value, ttl = DEFAULT_TTL) {
  // If cache is full, remove the oldest entry (first one)
  if (cache.size >= MAX_CACHE_SIZE) {
    const firstKey = cache.keys().next().value;
    cache.delete(firstKey);
  }

  cache.set(key, {
    data: value,
    timestamp: Date.now(),
    ttl: ttl,
  });
}

/**
 * Clear the entire cache
 */
export function clearCache() {
  cache.clear();
  hitCount = 0;
  missCount = 0;
}

/**
 * Get cache statistics
 * @returns {Object} - { hitCount, missCount, cacheSize, maxSize, hitRate }
 */
export function getCacheStats() {
  const totalRequests = hitCount + missCount;
  const hitRate = totalRequests > 0 ? ((hitCount / totalRequests) * 100).toFixed(2) : 0;

  return {
    hitCount,
    missCount,
    cacheSize: cache.size,
    maxSize: MAX_CACHE_SIZE,
    hitRate: `${hitRate}%`,
    totalRequests,
  };
}

/**
 * Reset statistics (useful for testing)
 */
export function resetStats() {
  hitCount = 0;
  missCount = 0;
}
