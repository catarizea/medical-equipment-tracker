const redis = require('redis');
const { RateLimiterRedis } = require('rate-limiter-flexible');

const redisClient = redis.createClient({
  host: '127.0.0.1',
  port: 6379,
  enable_offline_queue: false,
  password: process.env.REDIS_PASSWORD,
});

const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'middleware',
  points: 10, // 10 requests
  duration: 1, // per 1 second by IP
});

const rateLimiterMiddleware = (req, res, next) => {
  rateLimiter
    .consume(req.ip)
    .then(() => {
      next();
    })
    .catch(() => {
      res.status(429).send('Too Many Requests');
    });
};

module.exports = rateLimiterMiddleware;
