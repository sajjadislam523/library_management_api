import type { Request, Response } from "express";
import { Book } from "./book.model.js";

export const getAllBooks = async (req: Request, res: Response) => {
    const { filter, sort, limit } = req.query;

    // filtering
    const filterQuery: Record<string, unknown> = {};
    if (filter) {
        filterQuery.genre = filter;
    }

    // sorting
    const sortOrder = (sort as string) === "asc" ? 1 : -1;
    const sortQuery: Record<string, 1 | -1> = {
        createdAt: sortOrder,
    };

    // limiting
    const limitQuery = limit ? parseInt(limit as string) : 0;

    const books = await Book.find(filterQuery)
        .sort(sortQuery)
        .limit(limitQuery);

    res.status(200).json({
        message: "All books fetched successfully!",
        success: true,
        total: books.length,
        limit: limitQuery,
        filter: filterQuery,
        sort: sortQuery,
        data: books,
    });
};

export const createBook = async (req: Request, res: Response) => {
    const body = req.body;
    const book = await Book.create(body);
    res.status(201).json({
        message: "Book created successfully!",
        success: true,
        data: book,
    });
};

export const getSingleBook = async (req: Request, res: Response) => {
    const bookId = req.params.bookId;

    const book = await Book.findById(bookId);

    if (!book) {
        res.status(404).json({
            message: "Book not found!",
            success: false,
        });
    } else {
        res.status(200).json({
            message: "Book fetched successfully!",
            success: true,
            data: book,
        });
    }
};

export const updateBook = async (req: Request, res: Response) => {
    const bookId = req.params.bookId;
    const body = req.body;

    const book = await Book.findByIdAndUpdate(bookId, body, { new: true });

    if (!book) {
        res.status(404).json({
            message: "Book not found!",
            success: false,
        });
    } else {
        res.status(200).json({
            message: "Book updated successfully!",
            success: true,
            data: book,
        });
    }
};
