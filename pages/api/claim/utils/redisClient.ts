import Redis from "ioredis";
import RedisMock from "ioredis-mock";

// Setup redis client
const client =
  process.env.NODE_ENV !== "test" && process.env.REDIS_ENDPOINT
    ? new Redis(process.env.REDIS_ENDPOINT)
    : new RedisMock();

export default client;
