import { Redis } from "ioredis";
require("dotenv").config();
const connectRedis = () => {
  if (process.env.REDIS_URL) {
    console.log("connect Redis");
    return process.env.REDIS_URL;
  }
  throw Error("Redis not failed");
};
const redis =  new Redis("rediss://default:AW78AAIjcDEyNDM0OTQ0YmI3YzI0YjkwOWU2YjdhNDViNzQ1OWRlOHAxMA@brave-marten-28412.upstash.io:6379");
export default redis




