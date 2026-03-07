import type { NextFunction, Request, Response } from "express";

export const globalErrorHandler = (
    error: any,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (error.name === "ValidationError") {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            error: error,
        });
    }

    if (error.code === 11000) {
        return res.status(400).json({
            success: false,
            message: "Duplicate value entered",
            error: error,
        });
    }

    if (error.name === "CastError") {
        return res.status(400).json({
            success: false,
            message: "Invalid ID format",
            error: error,
        });
    }

    res.status(500).json({
        success: false,
        message: error.message || "Something went wrong",
        error: error,
    });
};
