import express, { type Application } from "express";
import bookRouter from "./app/modules/book/book.routes.js";

export const app: Application = express();
app.use(express.json());

app.use("/api/books", bookRouter);

app.get("/", (req, res) => {
    res.send("Welcome to the library!");
});

export default app;
