# Stage 4 - Performance Testing and Optimization

## Objective

The objective of Stage 4 is to evaluate the performance of the Blog API under normal
and concurrent workloads, identify database bottlenecks, optimize inefficient
operations, and verify that the optimizations do not break existing functionality.

## Environment

- Runtime: Node.js
- Framework: Express.js
- Database: SQLite
- API Testing: Postman
- Load Testing: Autocannon

## Endpoints Tested

- GET /api/health
- GET /api/users
- GET /api/posts
- GET /api/posts/:id
- GET /api/comments
- GET /api/comments/:id
- POST /api/users/register
- POST /api/posts
- POST /api/comments

## Testing Method

1. Establish baseline response times.
2. Run concurrent requests against the API.
3. Analyze response latency and throughput.
4. Inspect database queries.
5. Identify possible bottlenecks.
6. Apply appropriate optimization.
7. Repeat performance tests.
8. Compare before and after results.