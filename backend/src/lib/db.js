import mongoose from "mongoose";
import { ENV } from "../lib/env.js";

export const connectDB = async() => {
    try {
        const con = await mongoose.connect(ENV.MONGO_URI)
        console.log("MONGODB CONNECTED:", con.connection.host);
    } catch (error) {
        console.error("Error in MONGODB Connection:", error);
        process.exit(1) // 1 means failure, 0 means success
    }
}