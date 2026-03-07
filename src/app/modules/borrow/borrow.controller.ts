import type { NextFunction, Request, Response } from "express";
import { Book } from "../book/book.model.js";
import { Borrow } from "./borrow.model.js";

export const getBorrowedBooksSummary = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const summary = await Borrow.aggregate([
            {
                $group: {
                    _id: "$book",
                    totalQuantity: { $sum: "$quantity" },
                },
            },
            {
                $lookup: {
                    from: "books",
                    localField: "_id",
                    foreignField: "_id",
                    as: "book",
                },
            },
            {
                $unwind: "$book",
            },
            {
                $project: {
                    _id: 0,
                    book: {
                        title: "$book.title",
                        isbn: "$book.isbn",
                    },
                    totalQuantity: 1,
                },
            },
        ]);

        res.status(200).json({
            success: true,
            message: "Borrowed books summary retrieved successfully",
            data: summary,
        });
    } catch (error) {
        next(error);
    }
};

export const borrowBook = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { book: bookId, quantity, dueDate } = req.body;

        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found",
            });
        }

        if (!book.available || book.copies < quantity) {
            return res.status(400).json({
                success: false,
                message: "Not enough copies available",
            });
        }

        book.copies -= quantity;

        await book.updateAvailability();

        const borrow = await Borrow.create({ book: bookId, quantity, dueDate });

        res.status(201).json({
            message: "Book borrowed successfully",
            success: true,
            data: borrow,
        });
    } catch (error) {
        next(error);
    }
};
