import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import redis from '../config/redis';
import { CONSTANTS } from '../utils/constants';

// Create Redis store with error handling
let redisStore: any = null;

try {
    /* Only create store if Redis client is available */
    const redisClient = redis.getClient();
    if (redisClient) {
        redisStore = new RedisStore({
            sendCommand: (...args: string[]) => redisClient.sendCommand(args),
        });
    }
} catch (error) {
    console.warn('Redis not available, using memory store for rate limiting');
}

/* Auth rate limiter */
export const authLimiter = rateLimit({
    store: redisStore || undefined,
    windowMs: CONSTANTS.RATE_LIMIT.AUTH.WINDOW_MS,
    max: CONSTANTS.RATE_LIMIT.AUTH.MAX,
    message: {
        success: false,
        message: 'Too many attempts, please try again after 15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true
});

/* API rate limiter */
export const apiLimiter = rateLimit({
    store: redisStore || undefined,
    windowMs: CONSTANTS.RATE_LIMIT.API.WINDOW_MS,
    max: CONSTANTS.RATE_LIMIT.API.MAX,
    message: {
        success: false,
        message: 'Too many requests, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false
});