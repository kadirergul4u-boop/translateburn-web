import { Router } from 'express';
import healthCheck from './health-check.js';
import translateRouter from './translate.js';

const router = Router();

export default () => {
    router.get('/health', healthCheck);
    router.use('/translate', translateRouter);

    return router;
};