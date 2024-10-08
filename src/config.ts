import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export const appPort = parseInt(process.env.APP_PORT || '4000', 10);
export const databaseUrl = process.env.DATABASE_URL;
export const jwtSecret = process.env.JWT_SECRET;

export const emailConfig = {
    admin: process.env.EMAIL_ADMIN,
    password: process.env.EMAIL_PASSWORD,
};

export const cloudinaryConfig = {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
};

export const redisConfig = {
    password: process.env.REDIS_PASSWORD,
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '0', 10),
};