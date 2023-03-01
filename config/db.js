import mongoose from "mongoose";
import { config } from "./index.js";

export const connectDB = async () => {
    try {
        mongoose.set("strictQuery", true);
        const dbRef = await mongoose.connect(config.DB_URL, {
            dbName: "wemeet",
        });
        console.log(`DB Connected to ${dbRef.connection.db.databaseName}`);
    } catch (error) {
        console.log(`DB Connection failed`);
        console.log(error);
    }
};
