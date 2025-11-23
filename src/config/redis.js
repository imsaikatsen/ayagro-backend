// src/config/redis.js
const Redis = require('ioredis');

const redisClient = new Redis({
  host: '127.0.0.1',
  port: 6379,
  // password: process.env.REDIS_PASSWORD || undefined, // only if needed
});

redisClient.on('connect', () => {
  console.log('🟢 Redis connected');
});

redisClient.on('error', (err) => {
  console.error('❌ Redis Error:', err);
});

module.exports = redisClient;
