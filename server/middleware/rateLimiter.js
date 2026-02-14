const rateLimit = require('express-rate-limit');

/**
 * Rate Limiting Middleware
 * Protects API from abuse while allowing legitimate usage
 * Uses Redis for distributed rate limiting when available, falls back to memory
 */

let createRedisStore = null;

// Try to initialize Redis store if REDIS_URL is configured
if (process.env.REDIS_URL) {
    try {
        const RedisStore = require('rate-limit-redis').default;
        const { createClient } = require('redis');

        const redisClient = createClient({
            url: process.env.REDIS_URL,
            socket: {
                reconnectStrategy: (retries) => {
                    if (retries > 3) {
                        console.warn('Redis connection failed, using memory-based rate limiting');
                        return new Error('Redis max retries reached');
                    }
                    return Math.min(retries * 100, 3000);
                }
            }
        });

        redisClient.on('error', (err) => {
            console.warn('Redis client error:', err.message);
        });

        redisClient.on('connect', () => {
            console.log('✓ Redis connected for rate limiting');
        });

        redisClient.connect().catch((err) => {
            console.warn('Redis connection failed, using memory-based rate limiting:', err.message);
        });

        // Helper to create unique store instances (required by rate-limit-redis v3)
        // Sharing the same client connection
        createRedisStore = (prefix) => new RedisStore({
            sendCommand: (...args) => redisClient.sendCommand(args),
            prefix: 'fastdeal:ratelimit:' + prefix
        });

    } catch (error) {
        console.warn('Redis store initialization failed, using memory-based rate limiting:', error.message);
    }
}

// Search endpoint rate limiter (more generous for core feature)
const searchLimiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000, // 1 minute
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 10,
    message: {
        error: 'Too many search requests',
        retryAfter: '1 minute'
    },
    standardHeaders: true,
    legacyHeaders: false,
    store: createRedisStore ? createRedisStore('search:') : undefined
});

// General API rate limiter
const apiLimiter = rateLimit({
    windowMs: 60000, // 1 minute
    max: 30, // Higher limit for general endpoints
    message: {
        error: 'Too many requests',
        retryAfter: '1 minute'
    },
    standardHeaders: true,
    legacyHeaders: false,
    store: createRedisStore ? createRedisStore('api:') : undefined
});

module.exports = {
    searchLimiter,
    apiLimiter
};
