const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

const databaseDir = path.join(__dirname, "..", "database");

if (!fs.existsSync(databaseDir)) {
    fs.mkdirSync(databaseDir, { recursive: true });
}

const dbPath = path.join(databaseDir, "blog.db");
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Database connection failed:", err);
    } else {
        console.log("SQLite database connected.");
    }
});


// Enable foreign keys
db.run("PRAGMA foreign_keys = ON");


// USERS TABLE
db.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`, (err) => {
    if (err) {
        console.error("Users table creation failed:", err);
    } else {
        console.log("Users table ready.");
    }
});


// POSTS TABLE
db.run(`
    CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        user_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
    )
`, (err) => {
    if (err) {
        console.error("Posts table creation failed:", err);
    } else {
        console.log("Posts table ready.");
    }
});


// COMMENTS TABLE
db.run(`
    CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT NOT NULL,
        user_id INTEGER NOT NULL,
        post_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

        FOREIGN KEY (post_id)
        REFERENCES posts(id)
        ON DELETE CASCADE
    )
`, (err) => {
    if (err) {
        console.error("Comments table creation failed:", err);
    } else {
        console.log("Comments table ready.");
    }
});


module.exports = db;