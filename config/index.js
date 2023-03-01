import dotenv from "dotenv";
dotenv.config();

export const config = {
    DB_URL: process.env.DB_URL,
    PORT: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET,
    COOKIE_TIME: process.env.COOKIE_TIME,
    NODE_ENV: process.env.NODE_ENV,
};
