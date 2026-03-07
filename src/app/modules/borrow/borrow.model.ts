import { model, Schema } from "mongoose";
import type { IBorrow } from "./borrow.interface.js";

const borrowSchema = new Schema<IBorrow>(
    {
        book: {
            type: Schema.Types.ObjectId,
            ref: "Book",
            required: [true, "Book is required"],
        },
        quantity: {
            type: Number,
            required: [true, "Quantity is required"],
            min: [1, "Quantity must be least 1"],
            validate: {
                validator: Number.isInteger,
                message: "{VALUE} is not an integer",
            },
        },
        dueDate: {
            type: Date,
            required: true,
            default: () => new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        },
    },
    { timestamps: true, versionKey: false },
);

export const Borrow = model<IBorrow>("Borrow", borrowSchema);
