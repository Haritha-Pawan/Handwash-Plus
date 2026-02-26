import dotenv from "dotenv";
dotenv.config();
import { setServers } from "node:dns/promises";
setServers(["1.1.1.1", "8.8.8.8"]);


const config = {
  port: process.env.PORT || 5000,
  database: {
    url: process.env.MONGODB_URI,
  },
};

export default config;