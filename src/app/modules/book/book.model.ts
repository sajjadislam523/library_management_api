import { model, Schema } from "mongoose";
import { Genre, type IBook } from "./book.interface.js";

const bookSchema = new Schema<IBook>(
    {
        title: {
            type: String,
            required: [true, "Title is reqired"],
            minlength: [1, "Title cannot be empty"],
        },
        author: {
            type: String,
            required: [true, "Author is required"],
            trim: true,
            minlength: [1, "Author cannot be empty"],
        },
        genre: {
            type: String,
            enum: {
                values: Object.values(Genre),
                message: "{VALUE} is not a valid genre",
            },
            required: [true, "Genre is required"],
        },
        isbn: {
            type: String,
            required: [true, "ISBN is required"],
            unique: true,
            trim: true,
            validate: {
                validator: (v: string) => /^[0-9]{10,13}$/.test(v),
                message: "{VALUE} is not a valid ISBN",
            },
        },
        description: {
            type: String,
            default: "",
            maxlength: [500, "Description cannot exceed 500 characters"],
        },
        copies: {
            type: Number,
            required: [true, "Copies is required"],
            min: [0, "Copies must be a non-negative number"],
            validate: {
                validator: Number.isInteger,
                message: "{VALUE} is not an integer",
            },
        },
        available: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true, versionKey: false },
);

export const Book = model<IBook>("Book", bookSchema);
