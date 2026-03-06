import { Router } from "express";
import { createBook, getAllBooks, getSingleBook } from "./book.controller.js";

const bookRouter = Router();

bookRouter.get("/", getAllBooks);
bookRouter.post("/", createBook);
bookRouter.get("/:id", getSingleBook);

export default bookRouter;
