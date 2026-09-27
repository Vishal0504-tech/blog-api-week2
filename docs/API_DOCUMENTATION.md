Register user
POST
 http://localhost:3000/api/users/register
Request body:
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "Test@12345"
}


Successful response:
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "name": "Test User",
    "email": "test@example.com"
  }
}


Status: 201 Created
Duplicate email response:
{
  "success": false,
  "message": "Email already registered"
}


Status: 409 Conflict
Follow the same format for all your user, post, and comment endpoints.
Include the HTTP method, endpoint URL, request body, expected status code, successful response, and possible error responses.
Your previous Postman screenshots already contain much of this information.