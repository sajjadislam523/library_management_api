import { Router } from "express";
import { borrowBook, getBorrowedBooksSummary } from "./borrow.controller.js";

const borrowRouter = Router();

borrowRouter.get("/", borrowBook);
borrowRouter.post("/", getBorrowedBooksSummary);

export default borrowRouter;
