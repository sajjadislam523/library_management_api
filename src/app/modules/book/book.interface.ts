import type { Model } from "mongoose";

export enum Genre {
    FICTION = "FICTION",
    NON_FICTION = "NON_FICTION",
    SCIENCE = "SCIENCE",
    HISTORY = "HISTORY",
    BIOGRAPHY = "BIOGRAPHY",
    FANTASY = "FANTASY",
}

export interface IBook {
    title: string;
    author: string;
    genre: Genre;
    isbn: string;
    description?: string;
    copies: number;
    available: boolean;
}

export interface IBookMethods {
    updateAvailability(): Promise<void>;
}

export interface IBookModel extends Model<IBook, {}, IBookMethods> {}
