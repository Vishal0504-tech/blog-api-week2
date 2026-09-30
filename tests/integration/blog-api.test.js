const request = require("supertest");
const { expect } = require("chai");

const app = require("../../src/app");

describe("Blog API Integration Tests", function () {

    let userId;
    let postId;

    describe("Health Check", function () {

        it("should return API health status", async function () {

            const response = await request(app)
                .get("/api/health");

            expect(response.status).to.equal(200);
            expect(response.body.success).to.equal(true);
            expect(response.body.message)
                .to.equal("Blog API is running");
        });

    });

    describe("User Registration", function () {

        it("should register a new user", async function () {

            const uniqueEmail =
                `week5_${Date.now()}@example.com`;

            const response = await request(app)
                .post("/api/users/register")
                .send({
                    name: "Week5 Integration User",
                    email: uniqueEmail,
                    password: "Test@12345"
                });

            expect(response.status).to.equal(201);
            expect(response.body.success).to.equal(true);
            expect(response.body.data).to.have.property("id");

            userId = response.body.data.id;
        });

        it("should reject registration with missing fields", async function () {

            const response = await request(app)
                .post("/api/users/register")
                .send({
                    name: "Invalid User"
                });

            expect(response.status).to.equal(400);
            expect(response.body.success).to.equal(false);
        });

        it("should reject a short password", async function () {

            const response = await request(app)
                .post("/api/users/register")
                .send({
                    name: "Short Password User",
                    email: `short_${Date.now()}@example.com`,
                    password: "123"
                });

            expect(response.status).to.equal(400);
            expect(response.body.success).to.equal(false);
        });

    });

    describe("Post Management", function () {

        it("should create a post for the registered user", async function () {

            const response = await request(app)
                .post("/api/posts")
                .send({
                    title: "Week 5 Integration Test Post",
                    content: "Testing integration between users, posts and database.",
                    userId: userId
                });

            expect(response.status).to.equal(201);
            expect(response.body.success).to.equal(true);
            expect(response.body.data).to.have.property("id");

            postId = response.body.data.id;
        });

        it("should retrieve all posts", async function () {

            const response = await request(app)
                .get("/api/posts");

            expect(response.status).to.equal(200);
            expect(response.body.success).to.equal(true);
            expect(response.body.data).to.be.an("array");
        });

        it("should retrieve the created post", async function () {

            const response = await request(app)
                .get(`/api/posts/${postId}`);

            expect(response.status).to.equal(200);
            expect(response.body.success).to.equal(true);
            expect(response.body.data.id).to.equal(postId);
        });

        it("should update the created post", async function () {

            const response = await request(app)
                .put(`/api/posts/${postId}`)
                .send({
                    title: "Updated Week 5 Integration Post",
                    content: "Updated content for integration testing."
                });

            expect(response.status).to.equal(200);
            expect(response.body.success).to.equal(true);
        });

        it("should delete the created post", async function () {

            const response = await request(app)
                .delete(`/api/posts/${postId}`);

            expect(response.status).to.equal(200);
            expect(response.body.success).to.equal(true);
        });

    });

    describe("Error Handling", function () {

        it("should return 404 for an invalid route", async function () {

            const response = await request(app)
                .get("/api/invalid-route");

            expect(response.status).to.equal(404);
            expect(response.body.success).to.equal(false);
            expect(response.body.message)
                .to.equal("Route not found");
        });

        it("should return 404 for a non-existent post", async function () {

            const response = await request(app)
                .get("/api/posts/99999999");

            expect(response.status).to.equal(404);
            expect(response.body.success).to.equal(false);
        });

    });

});