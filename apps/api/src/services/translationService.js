import 'dotenv/config';
import logger from '../utils/logger.js';
import { getFromCache, setInCache } from '../utils/translationCache.js';
import crypto from 'crypto';

// Configuration
const FETCH_TIMEOUT = 10000; // 10 seconds
const DEEPL_API_URL = 'https://api-free.deepl.com/v2/translate';
const MAX_RETRIES = 2;
const RETRY_DELAYS = [1000, 2000]; // Exponential backoff: 1s, 2s
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

// Request deduplication map: tracks in-flight requests
const inFlightRequests = new Map();

/**
 * Generate a hash key for caching
 * @param {string} text - Text to hash
 * @param {string} sourceLanguage - Source language code
 * @param {string} targetLanguage - Target language code
 * @returns {string} - Hash key
 */
function generateCacheKey(text, sourceLanguage, targetLanguage) {
  const normalizedSource = sourceLanguage ? sourceLanguage.toUpperCase() : 'AUTO';
  const normalizedTarget = targetLanguage ? targetLanguage.toUpperCase() : targetLanguage;
  const textHash = crypto.createHash('sha256').update(text).digest('hex');
  return `${textHash}|${normalizedSource}|${normalizedTarget}`;
}

/**
 * Helper function to fetch with timeout
 * @param {string} url - URL to fetch
 * @param {Object} options - Fetch options
 * @returns {Promise<Response>} - Fetch response
 */
async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      logger.error(`[DeepL] Request timeout after ${FETCH_TIMEOUT}ms`);
      throw new Error(`DeepL API request timeout after ${FETCH_TIMEOUT}ms`);
    }

    logger.error(`[DeepL] Fetch error: ${error.message}`);
    throw error;
  }
}

/**
 * Retry logic with exponential backoff
 * @param {Function} fn - Async function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {Array<number>} delays - Delay array for exponential backoff
 * @returns {Promise} - Result of function
 */
async function retryWithBackoff(fn, maxRetries = MAX_RETRIES, delays = RETRY_DELAYS) {
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry on validation errors (4xx)
      if (error.message && error.message.includes('400')) {
        throw error;
      }

      if (attempt < maxRetries) {
        const delay = delays[attempt];
        logger.warn(
          `[DeepL] Attempt ${attempt + 1} failed: ${error.message}. Retrying in ${delay}ms...`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  logger.error(`[DeepL] All ${maxRetries + 1} attempts failed`);
  throw lastError;
}

/**
 * Translate text using DeepL API v2 (Free Tier) with deduplication and caching
 * @param {string} text - Text to translate
 * @param {string} targetLanguage - Target language code (e.g., 'EN', 'ES', 'FR')
 * @param {string} sourceLanguage - Source language code (optional, omitted for auto-detection)
 * @returns {Object} - { translatedText, detectedLanguage }
 */
export async function translateWithDeepL(text, targetLanguage, sourceLanguage) {
  // Normalize language codes to uppercase
  const normalizedTargetLang = targetLanguage ? targetLanguage.toUpperCase() : targetLanguage;
  const normalizedSourceLang = sourceLanguage ? sourceLanguage.toUpperCase() : null;

  // Generate cache key
  const cacheKey = generateCacheKey(text, normalizedSourceLang, normalizedTargetLang);

  // Check cache first (before deduplication)
  const cached = getFromCache(cacheKey);
  if (cached) {
    logger.info(
      `[DeepL] Cache HIT for key: ${cacheKey.substring(0, 20)}... | ` +
      `Returning cached translation: "${cached.translatedText.substring(0, 50)}..."`
    );
    return cached;
  }

  logger.info(`[DeepL] Cache MISS for key: ${cacheKey.substring(0, 20)}...`);

  // Check if this request is already in-flight (deduplication)
  if (inFlightRequests.has(cacheKey)) {
    logger.info(
      `[DeepL] Request deduplication: Returning existing in-flight promise for key: ${cacheKey.substring(0, 20)}...`
    );
    return inFlightRequests.get(cacheKey);
  }

  // Create the translation promise
  const translationPromise = (async () => {
    try {
      // Build JSON request body - DeepL expects text as an array of strings
      const requestBody = {
        text: [text],
        target_lang: normalizedTargetLang,
      };

      // Only include source_lang if provided (omit for auto-detection)
      if (normalizedSourceLang) {
        requestBody.source_lang = normalizedSourceLang;
      }

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `DeepL-Auth-Key ${process.env.DEEPL_API_KEY}`,
      };

      logger.info(
        `[DeepL] Sending request to DeepL API | ` +
        `Target: ${normalizedTargetLang}, Source: ${normalizedSourceLang || 'AUTO'}, ` +
        `Text length: ${text.length} chars`
      );

      // Fetch with retry logic
      const response = await retryWithBackoff(async () => {
        return await fetchWithTimeout(DEEPL_API_URL, {
          method: 'POST',
          headers,
          body: JSON.stringify(requestBody),
        });
      });

      // Read raw response body for logging
      const responseText = await response.text();

      if (!response.ok) {
        logger.error(
          `[DeepL] API error: ${response.status} ${response.statusText} | ` +
          `Response: ${responseText.substring(0, 200)}`
        );
        throw new Error(
          `DeepL API error: ${response.status} ${response.statusText} - ${responseText}`
        );
      }

      // Parse the response
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        logger.error(`[DeepL] Failed to parse response JSON: ${parseError.message}`);
        throw new Error(`DeepL API response parsing error: ${parseError.message}`);
      }

      if (!data.translations || !Array.isArray(data.translations) || data.translations.length === 0) {
        throw new Error('DeepL API response missing or empty translations array');
      }

      const translation = data.translations[0];
      if (!translation.text) {
        throw new Error('DeepL API translation object missing text field');
      }

      const translatedText = translation.text;
      const detectedLanguage = translation.detected_source_language;

      const result = {
        translatedText,
        detectedLanguage,
      };

      // Cache the result with 24-hour TTL
      setInCache(cacheKey, result, CACHE_TTL);
      logger.info(
        `[DeepL] Successfully translated and cached | ` +
        `Result: "${translatedText.substring(0, 50)}..." | ` +
        `Detected language: ${detectedLanguage}`
      );

      return result;
    } finally {
      // Remove from in-flight requests when done
      inFlightRequests.delete(cacheKey);
    }
  })();

  // Store the promise in in-flight requests
  inFlightRequests.set(cacheKey, translationPromise);

  return translationPromise;
}
