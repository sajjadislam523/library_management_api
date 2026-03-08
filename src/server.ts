import "dotenv/config";
import type { Request, Response } from "express";
import mongoose from "mongoose";
import dns from "node:dns/promises";
import app from "./app.js";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const PORT = process.env.PORT;
const DB_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.owq8r.mongodb.net/library?appName=Cluster0`;

let isConnected = false;

async function connectDB() {
    if (isConnected) return;

    try {
        await mongoose.connect(DB_URI);
        isConnected = true;
        console.log("MongoDB connected");
    } catch (error) {
        console.error("DB Connection Error:", error);
        throw error;
    }
}

if (process.env.NODE_ENV !== "production") {
    connectDB().then(() => {
        app.listen(PORT, () => console.log(`Server running on ${PORT}`));
    });
}

export default async (req: Request, res: Response) => {
    await connectDB();
    return app(req, res);
};
