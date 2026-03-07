import { Router } from "express";
import { borrowBook, getBorrowedBooksSummary } from "./borrow.controller.js";

const borrowRouter = Router();

borrowRouter.get("/", getBorrowedBooksSummary);
borrowRouter.post("/", borrowBook);

export default borrowRouter;
