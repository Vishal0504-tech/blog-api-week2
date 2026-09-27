# Blog REST API

## Project Overview

A RESTful Blog API developed using Node.js, Express.js, and SQLite.

The project supports user registration, blog post management, and comment management. It includes input validation, error handling, API testing, debugging, and performance testing.

## Technologies Used

- Node.js — JavaScript runtime
- Express.js — Backend web framework
- SQLite — Relational database
- Postman — API testing
- Autocannon — Performance and load testing
- Git and GitHub — Version control

## Features

### User Management
- Register new users
- Retrieve user information
- Validate registration details
- Handle duplicate email registration

### Post Management
- Create blog posts
- Retrieve all posts
- Retrieve individual posts
- Update existing posts
- Delete posts

### Comment Management
- Create comments
- Retrieve comments
- Update comments
- Delete comments

### Error Handling
- Request validation
- Resource-not-found handling
- Centralized server error handling
- Consistent JSON error responses

## Installation

Clone the repository:

```bash
git clone YOUR_REPOSITORY_URL
```

Navigate to the project:

```bash
cd YOUR_PROJECT_FOLDER
```

Install dependencies:

```bash
npm install
```

Start the server:

```bash
node src/server.js
```

The application runs at:

http://localhost:3000

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/health | Check server health |
| GET | /api/users | Retrieve users |
| POST | /api/users/register | Register user |
| GET | /api/posts | Retrieve posts |
| GET | /api/posts/:id | Retrieve individual post |
| POST | /api/posts | Create post |
| PUT | /api/posts/:id | Update post |
| DELETE | /api/posts/:id | Delete post |
| GET | /api/comments | Retrieve comments |
| GET | /api/comments/:id | Retrieve individual comment |
| POST | /api/comments | Create comment |
| PUT | /api/comments/:id | Update comment |
| DELETE | /api/comments/:id | Delete comment |

## Testing

API testing is performed using Postman.

Testing covers successful requests, invalid input, missing resources, and error responses.

## Performance Testing

Autocannon is used to measure API performance under concurrent requests.

Example:

```bash
npx autocannon -c 10 -d 10 http://localhost:3000/api/posts
```

Performance measurements include request throughput, latency, errors, and timeouts.

## Project Documentation

Additional documentation is available in the `docs` directory.

## Author

Vishal VR

Week 3 Internship Project