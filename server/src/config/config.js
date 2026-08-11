import dotenv from "dotenv";
dotenv.config();

const config = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRE: process.env.JWT_EXPIRES_IN,
  REFRESH_SECRET: process.env.REFRESH_SECRET,
  REFRESH_EXPIRE: process.env.REFRESH_EXPIRES_IN,
  IMAGEKIT_PUBLIC_KEY: process.env.IMAGEKIT_PUBLIC_KEY,
  IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY,
  IMAGEKIT_URL_ENDPOINT: process.env.IMAGEKIT_URL_ENDPOINT,
  PUBLICKEY: process.env.IMAGEKIT_PUBLIC_KEY,
  PRIVATEKEY: process.env.IMAGEKIT_PRIVATE_KEY,
  URLENDPOINT: process.env.IMAGEKIT_URL_ENDPOINT,
};

export default config;
