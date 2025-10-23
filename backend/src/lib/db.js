import mongoose from "mongoose";

export const connectDB = async() => {
    try {
        const con = await mongoose.connect(process.env.MONGO_URI)
        console.log("MONGODB CONNECTED:", con.connection.host);
    } catch (error) {
        console.error("Error in MONGODB Connection:", error);
        process.exit(1) // 1 means failure, 0 means success
    }
}