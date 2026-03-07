import express, { type Application } from "express";
import { connectDB } from "./app/config/db.js";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler.js";
import bookRouter from "./app/modules/book/book.routes.js";
import borrowRouter from "./app/modules/borrow/borrow.routes.js";

export const app: Application = express();
app.use(express.json());

app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        next(error);
    }
});

app.get("/", (req, res) => {
    res.send("Welcome to the library!");
});

app.use("/api/books", bookRouter);
app.use("/api/borrow", borrowRouter);

app.use(globalErrorHandler);

export default app;
