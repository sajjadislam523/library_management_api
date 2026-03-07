import { Schema } from "mongoose";
import type { IBorrow } from "./borrow.interface.js";

const borrowSchema = new Schema<IBorrow>({
    book: { type: Schema.Types.ObjectId, ref: "Book", required: true },
    quantity: { type: Number, required: true },
    dueDate: { type: Date, required: true },
});
