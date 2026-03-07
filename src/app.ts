import express, { type Application } from "express";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler.js";
import bookRouter from "./app/modules/book/book.routes.js";
import borrowRouter from "./app/modules/borrow/borrow.routes.js";

export const app: Application = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Welcome to the library!");
});

app.use("/api/books", bookRouter);
app.use("/api/borrow", borrowRouter);

app.use(globalErrorHandler);

export default app;
