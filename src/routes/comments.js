const express = require("express");
const db = require("../database");

const router = express.Router();

// CREATE COMMENT
router.post("/", (req, res) => {
    const { content, userId, postId } = req.body;

    if (!content || !userId || !postId) {
        return res.status(400).json({
            success: false,
            message: "Content, userId and postId are required"
        });
    }

    // Check user exists
    db.get(
        "SELECT id FROM users WHERE id = ?",
        [userId],
        (err, user) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    success: false,
                    message: "Database error"
                });
            }

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            // Check post exists
            db.get(
                "SELECT id FROM posts WHERE id = ?",
                [postId],
                (err, post) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({
                            success: false,
                            message: "Database error"
                        });
                    }

                    if (!post) {
                        return res.status(404).json({
                            success: false,
                            message: "Post not found"
                        });
                    }

                    // Insert comment
                    db.run(
                        `
                        INSERT INTO comments
                        (content, user_id, post_id)
                        VALUES (?, ?, ?)
                        `,
                        [content, userId, postId],
                        function (err) {
                            if (err) {
                                console.error(err);
                                return res.status(500).json({
                                    success: false,
                                    message: "Failed to create comment"
                                });
                            }

                            res.status(201).json({
                                success: true,
                                message: "Comment created successfully",
                                data: {
                                    id: this.lastID,
                                    content: content,
                                    userId: userId,
                                    postId: postId
                                }
                            });
                        }
                    );
                }
            );
        }
    );
});


// GET ALL COMMENTS
router.get("/", (req, res) => {
    db.all(
        `
        SELECT
            comments.id,
            comments.content,
            comments.user_id,
            comments.post_id,
            users.name AS author,
            comments.created_at,
            comments.updated_at
        FROM comments
        JOIN users
        ON comments.user_id = users.id
        ORDER BY comments.id DESC
        `,
        [],
        (err, comments) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    success: false,
                    message: "Database error"
                });
            }

            res.status(200).json({
                success: true,
                data: comments
            });
        }
    );
});


// GET ONE COMMENT
router.get("/:id", (req, res) => {
    const commentId = Number(req.params.id);

    if (!Number.isInteger(commentId) || commentId <= 0) {
        return res.status(400).json({
            success: false,
            message: "Invalid comment ID"
        });
    }

    db.get(
        `
        SELECT
            comments.id,
            comments.content,
            comments.user_id,
            comments.post_id,
            users.name AS author,
            comments.created_at,
            comments.updated_at
        FROM comments
        JOIN users
        ON comments.user_id = users.id
        WHERE comments.id = ?
        `,
        [commentId],
        (err, comment) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    success: false,
                    message: "Database error"
                });
            }

            if (!comment) {
                return res.status(404).json({
                    success: false,
                    message: "Comment not found"
                });
            }

            res.status(200).json({
                success: true,
                data: comment
            });
        }
    );
});


// UPDATE COMMENT
router.put("/:id", (req, res) => {
    const commentId = Number(req.params.id);
    const { content } = req.body;

    if (!Number.isInteger(commentId) || commentId <= 0) {
        return res.status(400).json({
            success: false,
            message: "Invalid comment ID"
        });
    }

    if (!content) {
        return res.status(400).json({
            success: false,
            message: "Content is required"
        });
    }

    db.get(
        "SELECT id FROM comments WHERE id = ?",
        [commentId],
        (err, comment) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    success: false,
                    message: "Database error"
                });
            }

            if (!comment) {
                return res.status(404).json({
                    success: false,
                    message: "Comment not found"
                });
            }

            db.run(
                `
                UPDATE comments
                SET
                    content = ?,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
                `,
                [content, commentId],
                function (err) {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({
                            success: false,
                            message: "Failed to update comment"
                        });
                    }

                    res.status(200).json({
                        success: true,
                        message: "Comment updated successfully"
                    });
                }
            );
        }
    );
});


// DELETE COMMENT
router.delete("/:id", (req, res) => {
    const commentId = Number(req.params.id);

    if (!Number.isInteger(commentId) || commentId <= 0) {
        return res.status(400).json({
            success: false,
            message: "Invalid comment ID"
        });
    }

    db.get(
        "SELECT id FROM comments WHERE id = ?",
        [commentId],
        (err, comment) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    success: false,
                    message: "Database error"
                });
            }

            if (!comment) {
                return res.status(404).json({
                    success: false,
                    message: "Comment not found"
                });
            }

            db.run(
                "DELETE FROM comments WHERE id = ?",
                [commentId],
                function (err) {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({
                            success: false,
                            message: "Failed to delete comment"
                        });
                    }

                    res.status(200).json({
                        success: true,
                        message: "Comment deleted successfully"
                    });
                }
            );
        }
    );
});

module.exports = router;