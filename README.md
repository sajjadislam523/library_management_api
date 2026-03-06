# 📚 Library Management API

A RESTful API for managing a library system built with **Express**, **TypeScript**, and **MongoDB (Mongoose)**.

---

## 🗂️ Project Structure

```
library-management-api/
├── src/
│   ├── app.ts                  # Express app setup
│   ├── server.ts               # Server entry point
│   ├── config/
│   │   └── db.ts               # MongoDB connection
│   ├── modules/
│   │   ├── book/
│   │   │   ├── book.model.ts   # Mongoose schema + methods
│   │   │   ├── book.controller.ts
│   │   │   ├── book.route.ts
│   │   │   └── book.interface.ts
│   │   └── borrow/
│   │       ├── borrow.model.ts
│   │       ├── borrow.controller.ts
│   │       ├── borrow.route.ts
│   │       └── borrow.interface.ts
│   └── middlewares/
│       └── errorHandler.ts     # Global error handler
├── .env
├── .env.example
├── tsconfig.json
├── package.json
└── README.md
```

---

## ⚙️ Setup & Installation

### Prerequisites

- Node.js (v18+)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### 1. Initialize the Project

```bash
mkdir library-management-api
cd library-management-api
npm init -y
```

### 2. Install Dependencies

```bash
# Production dependencies
npm install express mongoose dotenv cors

# Development dependencies
npm install -D typescript ts-node nodemon @types/express @types/node @types/cors
```

### 3. Initialize TypeScript

```bash
npx tsc --init
```

Update `tsconfig.json`:

```json
{
    "compilerOptions": {
        "target": "ES2020",
        "module": "commonjs",
        "rootDir": "./src",
        "outDir": "./dist",
        "strict": true,
        "esModuleInterop": true,
        "skipLibCheck": true
    },
    "include": ["src/**/*"],
    "exclude": ["node_modules", "dist"]
}
```

### 4. Add Scripts to `package.json`

```json
"scripts": {
  "dev": "nodemon --exec ts-node src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js"
}
```

### 5. Configure Environment Variables

Create a `.env` file:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/library_db
```

### 6. Run the Project

```bash
# Development
npm run dev

# Production build
npm run build
npm start
```

---

## 🗃️ Data Models

### Book Model

| Field         | Type    | Rules                                                                                  |
| ------------- | ------- | -------------------------------------------------------------------------------------- |
| `title`       | String  | Required                                                                               |
| `author`      | String  | Required                                                                               |
| `genre`       | String  | Required. Enum: `FICTION`, `NON_FICTION`, `SCIENCE`, `HISTORY`, `BIOGRAPHY`, `FANTASY` |
| `isbn`        | String  | Required, Unique                                                                       |
| `description` | String  | Optional                                                                               |
| `copies`      | Number  | Required. Non-negative integer                                                         |
| `available`   | Boolean | Defaults to `true`                                                                     |

### Borrow Model

| Field      | Type     | Rules                      |
| ---------- | -------- | -------------------------- |
| `book`     | ObjectId | Required. Ref → Book       |
| `quantity` | Number   | Required. Positive integer |
| `dueDate`  | Date     | Required                   |

---

## 🔌 API Endpoints

### Base URL: `/api`

---

### 📘 Books

#### `POST /api/books` — Create a Book

**Request Body:**

```json
{
    "title": "The Theory of Everything",
    "author": "Stephen Hawking",
    "genre": "SCIENCE",
    "isbn": "9780553380163",
    "description": "An overview of cosmology and black holes.",
    "copies": 5,
    "available": true
}
```

**Success Response `201`:**

```json
{
  "success": true,
  "message": "Book created successfully",
  "data": { ...bookObject }
}
```

---

#### `GET /api/books` — Get All Books

**Query Parameters:**

| Param    | Description                    | Example          |
| -------- | ------------------------------ | ---------------- |
| `filter` | Filter by genre                | `filter=SCIENCE` |
| `sort`   | Sort direction: `asc` / `desc` | `sort=desc`      |
| `limit`  | Number of results (default 10) | `limit=5`        |

**Example:** `/api/books?filter=FANTASY&sort=desc&limit=5`

**Success Response `200`:**

```json
{
  "success": true,
  "message": "Books retrieved successfully",
  "data": [ ...arrayOfBooks ]
}
```

---

#### `GET /api/books/:bookId` — Get Book by ID

**Success Response `200`:**

```json
{
  "success": true,
  "message": "Book retrieved successfully",
  "data": { ...bookObject }
}
```

---

#### `PUT /api/books/:bookId` — Update Book

**Request Body (partial update):**

```json
{ "copies": 50 }
```

**Success Response `200`:**

```json
{
  "success": true,
  "message": "Book updated successfully",
  "data": { ...updatedBookObject }
}
```

---

#### `DELETE /api/books/:bookId` — Delete Book

**Success Response `200`:**

```json
{
    "success": true,
    "message": "Book deleted successfully",
    "data": null
}
```

---

### 📗 Borrow

#### `POST /api/borrow` — Borrow a Book

**Request Body:**

```json
{
    "book": "64ab3f9e2a4b5c6d7e8f9012",
    "quantity": 2,
    "dueDate": "2025-07-18T00:00:00.000Z"
}
```

**Success Response `201`:**

```json
{
  "success": true,
  "message": "Book borrowed successfully",
  "data": { ...borrowRecord }
}
```

---

#### `GET /api/borrow` — Borrowed Books Summary (Aggregation)

Returns total borrowed quantity per book using MongoDB aggregation pipeline.

**Success Response `200`:**

```json
{
    "success": true,
    "message": "Borrowed books summary retrieved successfully",
    "data": [
        {
            "book": {
                "title": "The Theory of Everything",
                "isbn": "9780553380163"
            },
            "totalQuantity": 5
        }
    ]
}
```

---

## ⚠️ Error Response Format

All errors return this structure:

```json
{
  "message": "Validation failed",
  "success": false,
  "error": {
    "name": "ValidationError",
    "errors": { ...validationDetails }
  }
}
```

---

## 🧠 Business Logic

### Borrow a Book — `POST /api/borrow`

1. **Check availability** — Look up the book by `book` ID. Return an error if not found.
2. **Check sufficient copies** — If `book.copies < quantity`, return an error (not enough copies).
3. **Deduct copies** — Subtract the borrowed `quantity` from `book.copies`.
4. **Update availability** — If `book.copies` reaches `0`, set `book.available = false`. _(Implemented via a Mongoose static or instance method on the Book model.)_
5. **Save borrow record** — Create and persist the borrow document with `book`, `quantity`, and `dueDate`.

---

## 🔧 Mongoose Features Used

| Feature                    | Where Used                                                                 |
| -------------------------- | -------------------------------------------------------------------------- |
| **Schema Validation**      | `genre` enum, `copies` min:0, required fields, unique `isbn`               |
| **Instance/Static Method** | `book.updateAvailability()` — sets `available: false` when copies hit 0    |
| **Middleware (pre/post)**  | e.g., `pre('save')` to auto-set `available` based on `copies`              |
| **Aggregation Pipeline**   | `GET /api/borrow` — group by book, sum total quantity, populate title/isbn |

---

## 🔄 Aggregation Pipeline (Borrow Summary)

```
BorrowModel.aggregate([
  { $group: { _id: "$book", totalQuantity: { $sum: "$quantity" } } },
  { $lookup: { from: "books", localField: "_id", foreignField: "_id", as: "book" } },
  { $unwind: "$book" },
  { $project: { "book.title": 1, "book.isbn": 1, totalQuantity: 1 } }
])
```

---

## 📋 Project Checklist

- [x] TypeScript + Express + Mongoose setup
- [ ] Book model with full validation
- [ ] Borrow model with validation
- [ ] `POST /api/books` — Create book
- [ ] `GET /api/books` — Get all books with filter/sort/limit
- [ ] `GET /api/books/:bookId` — Get single book
- [ ] `PUT /api/books/:bookId` — Update book
- [ ] `DELETE /api/books/:bookId` — Delete book
- [ ] `POST /api/borrow` — Borrow a book (with business logic)
- [ ] `GET /api/borrow` — Aggregation summary
- [ ] Mongoose static or instance method (availability update)
- [ ] Mongoose middleware (pre/post hook)
- [ ] Global error handler middleware
- [ ] Correct response format on all endpoints
