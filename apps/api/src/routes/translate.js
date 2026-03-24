import express from 'express';
import logger from '../utils/logger.js';
import { translateWithDeepL } from '../services/translationService.js';
import { getCacheStats } from '../utils/translationCache.js';

const router = express.Router();

// POST /translate - Translate text using DeepL API
router.post('/', async (req, res) => {
  const { text, targetLanguage, sourceLanguage } = req.body;

  logger.info(`[Translate Route] Incoming request | Target: ${targetLanguage}, Source: ${sourceLanguage || 'AUTO'}`);

  // Input validation
  if (!text) {
    logger.warn('[Translate Route] Missing text parameter');
    return res.status(400).json({ error: 'text is required' });
  }
  if (!targetLanguage) {
    logger.warn('[Translate Route] Missing targetLanguage parameter');
    return res.status(400).json({ error: 'targetLanguage is required' });
  }

  // Translate the text - errors will bubble up to errorMiddleware
  const result = await translateWithDeepL(text, targetLanguage, sourceLanguage);

  const responsePayload = {
    success: true,
    ...result,
  };

  logger.info(
    `[Translate Route] Response sent | ` +
    `Translated text: "${result.translatedText.substring(0, 50)}..."`
  );

  res.json(responsePayload);
});

// GET /translate/stats - Get cache statistics
router.get('/stats', (req, res) => {
  const stats = getCacheStats();
  logger.info(`[Translate Route] Cache stats requested | ${JSON.stringify(stats)}`);
  res.json(stats);
});

export default router;
