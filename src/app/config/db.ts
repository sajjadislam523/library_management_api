// src/config/db.ts
import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
    if (isConnected) return;

    const DB_USER = process.env.DB_USER;
    const DB_PASS = process.env.DB_PASS;

    await mongoose.connect(
        `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.owq8r.mongodb.net/library?appName=Cluster0`,
    );

    isConnected = true;
    console.log("MongoDB connected successfully");
};
