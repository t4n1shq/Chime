import express from "express";
import cookieParser from "cookie-parser";
import { ENV } from "./lib/env.js";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";

const PORT = ENV.PORT || 3000;

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

app.listen(PORT, () => {
    console.log("Server running on port: " + PORT);
    connectDB();
});