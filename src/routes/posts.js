const express = require("express");
const db = require("../database");

const router = express.Router();

// =====================================================
// CACHE CONFIGURATION
// =====================================================

let postsCache = null;
let postsCacheTime = 0;

const CACHE_TTL = 5000; // Cache valid for 5 seconds


// =====================================================
// CACHE HELPER
// =====================================================

function invalidatePostsCache() {
    postsCache = null;
    postsCacheTime = 0;
}


// =====================================================
// 1. CREATE POST
// POST /api/posts
// =====================================================

router.post("/", (req, res) => {

    const { title, content, userId } = req.body;

    // Validate required fields
    if (
        typeof title !== "string" ||
        typeof content !== "string" ||
        !title.trim() ||
        !content.trim() ||
        !Number.isInteger(userId) ||
        userId <= 0
    ) {
        return res.status(400).json({
            success: false,
            message: "Valid title, content and userId are required"
        });
    }

    // Check whether user exists
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

            // Insert post
            db.run(
                `
                INSERT INTO posts
                (title, content, user_id)
                VALUES (?, ?, ?)
                `,
                [title, content, userId],
                function (err) {

                    if (err) {
                        console.error(err);

                        return res.status(500).json({
                            success: false,
                            message: "Failed to create post"
                        });
                    }

                    // Invalidate cache because data changed
                    invalidatePostsCache();

                    res.status(201).json({
                        success: true,
                        message: "Post created successfully",
                        data: {
                            id: this.lastID,
                            title: title,
                            content: content,
                            userId: userId
                        }
                    });
                }
            );
        }
    );
});


// =====================================================
// 2. GET ALL POSTS
// GET /api/posts
// =====================================================

router.get("/", (req, res) => {

    const now = Date.now();

    // -------------------------------------------------
    // CHECK CACHE
    // -------------------------------------------------

    if (
        postsCache &&
        (now - postsCacheTime < CACHE_TTL)
    ) {

        return res.status(200).json({
            success: true,
            data: postsCache,
            cached: true
        });
    }


    // -------------------------------------------------
    // CACHE MISS - FETCH FROM DATABASE
    // -------------------------------------------------

    db.all(
        `
        SELECT
            posts.id,
            posts.title,
            posts.content,
            posts.user_id,
            users.name AS author,
            posts.created_at,
            posts.updated_at
        FROM posts
        JOIN users
        ON posts.user_id = users.id
        ORDER BY posts.id DESC
        `,
        [],
        (err, posts) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Database error"
                });
            }


            // -------------------------------------------------
            // STORE RESULT IN CACHE
            // -------------------------------------------------

            postsCache = posts;
            postsCacheTime = Date.now();


            // -------------------------------------------------
            // SEND RESPONSE
            // -------------------------------------------------

            res.status(200).json({
                success: true,
                data: posts,
                cached: false
            });
        }
    );
});


// =====================================================
// 3. GET ONE POST
// GET /api/posts/:id
// =====================================================

router.get("/:id", (req, res) => {

    const postId = Number(req.params.id);

    // Validate ID
    if (!Number.isInteger(postId) || postId <= 0) {
        return res.status(400).json({
            success: false,
            message: "Invalid post ID"
        });
    }


    db.get(
        `
        SELECT
            posts.id,
            posts.title,
            posts.content,
            posts.user_id,
            users.name AS author,
            posts.created_at,
            posts.updated_at
        FROM posts
        JOIN users
        ON posts.user_id = users.id
        WHERE posts.id = ?
        `,
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


            res.status(200).json({
                success: true,
                data: post
            });
        }
    );
});


// =====================================================
// 4. UPDATE POST
// PUT /api/posts/:id
// =====================================================

router.put("/:id", (req, res) => {

    const postId = Number(req.params.id);
    const { title, content } = req.body;


    // Validate ID
    if (!Number.isInteger(postId) || postId <= 0) {
        return res.status(400).json({
            success: false,
            message: "Invalid post ID"
        });
    }


    // Validate title and content
    if (
        typeof title !== "string" ||
        typeof content !== "string" ||
        !title.trim() ||
        !content.trim()
    ) {
        return res.status(400).json({
            success: false,
            message: "Title and content are required"
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


            // Update post
            db.run(
                `
                UPDATE posts
                SET
                    title = ?,
                    content = ?,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
                `,
                [title, content, postId],
                function (err) {

                    if (err) {
                        console.error(err);

                        return res.status(500).json({
                            success: false,
                            message: "Failed to update post"
                        });
                    }


                    // Invalidate cache because data changed
                    invalidatePostsCache();


                    res.status(200).json({
                        success: true,
                        message: "Post updated successfully"
                    });
                }
            );
        }
    );
});


// =====================================================
// 5. DELETE POST
// DELETE /api/posts/:id
// =====================================================

router.delete("/:id", (req, res) => {

    const postId = Number(req.params.id);


    // Validate ID
    if (!Number.isInteger(postId) || postId <= 0) {
        return res.status(400).json({
            success: false,
            message: "Invalid post ID"
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


            // Delete post
            db.run(
                "DELETE FROM posts WHERE id = ?",
                [postId],
                function (err) {

                    if (err) {
                        console.error(err);

                        return res.status(500).json({
                            success: false,
                            message: "Failed to delete post"
                        });
                    }


                    // Invalidate cache because data changed
                    invalidatePostsCache();


                    res.status(200).json({
                        success: true,
                        message: "Post deleted successfully"
                    });
                }
            );
        }
    );
});


module.exports = router;