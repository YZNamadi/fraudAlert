const redis = require('redis');
require('dotenv').config();



const redisClient = redis.createClient();

redisClient.on("error", (err) => {
  console.error("Redis connection error:", err);
});

redisClient.on("connect", () => {
  console.log("Redis connected");
});

redisClient.connect();

const cacheTransaction = async (reference, data) => {
  await redisClient.set(reference, JSON.stringify(data), {
    EX: 3600 // expires in 1 hour
  });
};

const getCachedTransaction = async (reference) => {
  const cached = await redisClient.get(reference);
  return cached ? JSON.parse(cached) : null;
};

module.exports = {
  redisClient,
  cacheTransaction,
  getCachedTransaction
};

