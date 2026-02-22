import dotenv from "dotenv";

dotenv.config(); 

const config = {
  port: process.env.PORT || 5000,
  database: {
    url: process.env.MONGODB_URI,
  },
};

export default config;