// src/middlewares/errorHandler.ts
import type { Request, Response } from "express";

// define the error interface
interface AppError extends Error {
    statusCode?: number;
    status?: string;
    code?: number;
    keyValue?: Record<string, unknown>;
    errors?: Record<string, unknown>;
    path?: string;
    value?: string;
}

export const globalErrorHandler = (
    error: AppError,
    req: Request,
    res: Response,
) => {
    if (error.name === "ValidationError") {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            error: {
                name: error.name,
                errors: error.errors,
            },
        });
    }

    if (error.code === 11000) {
        return res.status(400).json({
            success: false,
            message: "Duplicate value entered",
            error: {
                name: "DuplicateKeyError",
                errors: error.keyValue,
            },
        });
    }

    if (error.name === "CastError") {
        return res.status(400).json({
            success: false,
            message: "Invalid ID format",
            error: {
                name: error.name,
                path: error.path,
                value: error.value,
            },
        });
    }

    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Something went wrong",
        error: error,
    });
};
