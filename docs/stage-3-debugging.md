# Week 3 - Stage 3
# Bug Discovery and Static Code Analysis

## Objective

The objective of Stage 3 is to identify functional,
validation, security, error-handling, and performance
issues in the backend API before applying fixes.

## Baseline

Stage 2 baseline testing was completed before debugging.

Total baseline tests: 21
Passed: 21
Failed: 0

## Important Rule

No source-code fixes are applied during Stage 3.
All discovered issues are documented for Stage 4.

### F-02 — Error Handler Ignores Custom HTTP Status

File:
src/middleware/errorHandler.js

Problem:
The global error handler always returns HTTP 500 regardless
of the actual error status.

Test:
GET /api/test-error

Test error:
error.status = 400

Expected:
HTTP 400 Bad Request

Actual:
HTTP 500 Internal Server Error

Response:
{
    "success": false,
    "message": "Internal server error"
}

Result:
FAIL

Root Cause:
The error handler uses a hard-coded status code:

res.status(500)

instead of using the status supplied by the error.

Severity:
Medium

Fix:
Use the error's status when available and fall back to 500
for unexpected errors.