const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../database");

const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });
        }

        // 2. Validate password length
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters"
            });
        }

        // 3. Check whether email already exists
        db.get(
            "SELECT id FROM users WHERE email = ?",
            [email],
            async (err, user) => {

                if (err) {
                    console.error(err);

                    return res.status(500).json({
                        success: false,
                        message: "Database error"
                    });
                }

                if (user) {
                    return res.status(409).json({
                        success: false,
                        message: "Email already registered"
                    });
                }

                // 4. Hash password
                const hashedPassword =
                    await bcrypt.hash(password, 10);

                // 5. Insert user
                db.run(
                    `INSERT INTO users
                    (name, email, password)
                    VALUES (?, ?, ?)`,
                    [name, email, hashedPassword],
                    function (err) {

                        if (err) {
                            console.error(err);

                            return res.status(500).json({
                                success: false,
                                message: "Failed to create user"
                            });
                        }

                        // 6. Send response
                        res.status(201).json({
                            success: true,
                            message: "User registered successfully",
                            data: {
                                id: this.lastID,
                                name: name,
                                email: email
                            }
                        });
                    }
                );
            }
        );

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

module.exports = router;