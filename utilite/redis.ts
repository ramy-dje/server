import { Redis } from "ioredis";
require("dotenv").config();
const connectRedis = () => {
  if (process.env.REDIS_URL) {
    console.log("connect Redis");
    return process.env.REDIS_URL;
  }
  throw Error("Redis not failed");
};
const redis = new Redis("rediss://default:AZywAAIjcDE1NjBkYzcyNDEyMmQ0ZWIzOGQzZTM1MTUwMDkyMjFiOXAxMA@credible-dove-40112.upstash.io:6379");

export default redis






