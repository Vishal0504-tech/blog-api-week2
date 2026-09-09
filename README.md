# Blog API

A simple RESTful Blog API built using Node.js, Express.js, and SQLite.

The API supports user registration, blog post management, and comments with full CRUD operations.

---

## Technologies Used

- Node.js
- Express.js
- SQLite
- JavaScript
- bcryptjs
- Postman

---

## Features

### Users

- User registration
- Email uniqueness validation
- Password hashing

### Posts

- Create a post
- Get all posts
- Get a single post
- Update a post
- Delete a post

### Comments

- Create a comment
- Get all comments
- Get a single comment
- Update a comment
- Delete a comment

### Error Handling

- Input validation
- 400 Bad Request
- 404 Not Found
- 409 Conflict
- 500 Internal Server Error

---

## Project Structure

```text
blog-api/
│
├── database/
│   └── blog.db
│
├── docs/
│   └── API_TEST_CASES.md
│
├── src/
│   ├── middleware/
│   │   └── errorHandler.js
│   │
│   ├── routes/
│   │   ├── users.js
│   │   ├── posts.js
│   │   └── comments.js
│   │
│   ├── database.js
│   └── server.js
│
├── .gitignore
├── package.json
└── README.md