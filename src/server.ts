import "dotenv/config";
import mongoose from "mongoose";
import dns from "node:dns/promises";
import app from "./app.js";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const PORT = process.env.PORT;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;

async function main() {
    try {
        await mongoose.connect(
            `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.owq8r.mongodb.net/library?appName=Cluster0`,
        );
        console.log("MongoDB connected successfully");

        app.listen(PORT, () => {
            console.log(`Server is listening to ${PORT}`);
        });
    } catch (error) {
        console.log(error);
    }
}

main();
