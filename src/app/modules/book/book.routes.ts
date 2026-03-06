import { Router } from "express";
import {
    createBook,
    getAllBooks,
    getSingleBook,
    updateBook,
} from "./book.controller.js";

const bookRouter = Router();

bookRouter.get("/", getAllBooks);
bookRouter.post("/", createBook);
bookRouter.get("/:bookId", getSingleBook);
bookRouter.put("/:bookId", updateBook);

export default bookRouter;
