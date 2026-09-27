# Week 3 — API Testing, Debugging and Performance Report

## 1. Project Information

Project: Blog REST API

Backend: Node.js and Express.js

Database: SQLite

Testing Tools: Postman and Autocannon

## 2. Objective

To verify the correctness, reliability, and performance of the Blog REST API through functional testing, debugging, error handling, load testing, and regression testing.

## 3. Stage 2 — Baseline API Testing

The initial API testing covered user registration, post management, and comment management.

The tests included successful CRUD operations, input validation, duplicate registration, and missing-resource handling.

Evidence: stage-2-baseline.md

## 4. Stage 3 — Debugging and Error Handling

A centralized error-handling middleware was implemented.

The API was tested for invalid requests, missing routes, and internal server errors.

Evidence: stage-3-debugging.md

## 5. Stage 4 — Performance Testing

Autocannon was used to generate concurrent requests against the API.

The following metrics were collected:

- Request throughput
- Average latency
- Latency percentiles
- Error count
- Timeout count

### Performance Results

Endpoint: GET /api/posts

Connections: 10

Duration: approximately 10 seconds

Successful run: approximately 25,000 requests

Average latency: 3.54 ms

Data received: 20.1 MB

Errors: 0

Timeouts: 0

Note: These measurements represent one local test run and should not be interpreted as production performance.

Evidence: stage-4-performance.md

## 6. Stage 5 — Regression Testing

Regression testing verifies whether existing functionality continues to work after debugging and optimization.

Record the final results for user, post, comment, validation, and error-handling tests.

Evidence: stage-5-regression.md

## 7. Final Verification

Document the following:

- Server startup result
- Database connection result
- Functional test results
- Regression test results
- Performance test results
- Outstanding defects, if any

## 8. Conclusion

The Week 3 project covers API testing, debugging, performance measurement, and regression verification.

The final completion status should be determined from the recorded test results and outstanding issues.