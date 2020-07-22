const redis = require('redis');
const { RateLimiterRedis } = require('rate-limiter-flexible');
const Boom = require('@hapi/boom');

let rateLimiterMiddleware = (req, res, next) => {
  next();
};

if (process.env.NODE_ENV !== 'test') {
  const redisClient = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    enable_offline_queue: false,
    password: process.env.REDIS_PASSWORD,
  });

  const rateLimiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'middleware',
    points: 5, // 5 requests
    duration: 1, // per 1 second by IP
  });

  rateLimiterMiddleware = (req, res, next) => {
    rateLimiter
      .consume(req.ip)
      .then(() => {
        next();
      })
      .catch(() => {
        next(Boom.tooManyRequests('Too Many Requests'));
      });
  };
}

module.exports = rateLimiterMiddleware;
