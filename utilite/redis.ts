import { Redis } from "ioredis";
require("dotenv").config();
const connectRedis = () => {
  if (process.env.REDIS_URL) {
    console.log("connect Redis");
    return process.env.REDIS_URL;
  }
  throw Error("Redis not failed");
};
const redis = new Redis(connectRedis());
export default redis;
