# Handwash+ API Endpoint Documentation

## Table of Contents
1. [Overview](#overview)
2. [Authentication & Authorization](#authentication--authorization)
3. [Authentication Module](#1-authentication-module)
4. [Users Module](#2-users-module)
5. [Schools Module](#3-schools-module)
6. [Classrooms Module](#4-classrooms-module)
7. [Students Module](#5-students-module)
8. [Grades Module](#6-grades-module)
9. [Classroom Bottles Module](#7-classroom-bottles-module)
10. [Quiz Module](#8-quiz-module)
11. [Posts Module](#9-posts-module)
12. [World Bank Data Module](#10-world-bank-data-module)
13. [Global Error Handling](#global-error-handling)

---

## Overview

| Property | Value |
|---|---|
| Base URL | `/api` |
| API Versioning | None (all endpoints under `/api/*`) |
| Interactive Docs | `/api-docs` (Swagger UI) |
| Data Format | JSON |
| Authentication | Bearer Token (JWT) |

---

## Authentication & Authorization

### JWT Authentication Middleware

All protected endpoints require a valid JWT access token passed in the `Authorization` header.

**Header Format:**
```
Authorization: Bearer <access_token>
```

**Token Properties:**

| Property | Value |
|---|---|
| Access Token Expiry | 15 minutes |
| Refresh Token Expiry | 7 days |
| Algorithm | JWT (HS256) |

**On Success:** Attaches decoded user object to `req.user`:
```json
{
  "userId": "ObjectId",
  "email": "string",
  "role": "string",
  "school": "ObjectId"
}
```

**On Failure — 401 Unauthorized:**
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

### Role-Based Access Control

| Role | Description |
|---|---|
| `superAdmin` | Full system access across all schools |
| `admin` | School-level administrative access |
| `teacher` | Classroom-level access |
| `student` | Read-only/quiz access |

**On Insufficient Role — 403 Forbidden:**
```json
{
  "success": false,
  "message": "Forbidden"
}
```

---

## 1. Authentication Module

**Base Path:** `/api/auth`

---

### POST `/api/auth/register`

Creates a new user account.

**Authentication:** None (Public)

**Request Body:**
```json
{
  "name": "string (required)",
  "email": "string (required, unique)",
  "password": "string (required)",
  "role": "string (optional)"
}
```

**Example Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response — 201 Created:**
```json
{
  "id": "64f1a2b3c4d5e6f7a8b9c0d1",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "teacher"
}
```

**Error Responses:**

| Code | Message |
|---|---|
| 400 | User already exists |
| 500 | Server error |

---

### POST `/api/auth/login`

Authenticates a user and returns JWT tokens.

**Authentication:** None (Public)

**Request Body:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Example Request:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response — 200 OK:**
```json
{
  "user": {
    "id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "teacher"
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**

| Code | Message |
|---|---|
| 400 | Missing email/password or invalid credentials |
| 401 | Unauthorized |

---

## 2. Users Module

**Base Path:** `/api/users`

---

### POST `/api/users/register`

Registers a new user (alternative registration endpoint).

**Authentication:** None (Public)

**Request Body:**
```json
{
  "name": "string (required)",
  "email": "string (required, unique)",
  "password": "string (required)",
  "role": "string (required)",
  "school": "ObjectId (optional)",
  "class": "string (optional)"
}
```

**Example Request:**
```json
{
  "name": "Jane Smith",
  "email": "jane@school.edu",
  "password": "password123",
  "role": "teacher",
  "school": "64f1a2b3c4d5e6f7a8b9c0d2"
}
```

**Response — 201 Created:**
```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d3",
    "name": "Jane Smith",
    "email": "jane@school.edu",
    "role": "teacher",
    "school": "64f1a2b3c4d5e6f7a8b9c0d2",
    "class": null
  }
}
```

**Error Responses:**

| Code | Message |
|---|---|
| 400 | Email already exists |
| 500 | Server error |

---

### POST `/api/users/login`

Authenticates a user and returns a JWT token.

**Authentication:** None (Public)

**Request Body:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response — 200 OK:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d3",
    "name": "Jane Smith",
    "email": "jane@school.edu",
    "role": "teacher"
  }
}
```

**Error Responses:**

| Code | Message |
|---|---|
| 400 | Invalid email or password |
| 500 | Server error |

---

### GET `/api/users`

Retrieves all users in the system.

**Authentication:** Required  
**Role Required:** `superAdmin`, `admin`

**Example Request:**
```http
GET /api/users
Authorization: Bearer <token>
```

**Response — 200 OK:**
```json
[
  {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d3",
    "name": "Jane Smith",
    "email": "jane@school.edu",
    "role": "teacher"
  }
]
```

> Note: Password field is excluded from all responses.

**Error Responses:**

| Code | Message |
|---|---|
| 401 | Unauthorized |
| 403 | Forbidden |
| 500 | Server error |

---

### GET `/api/users/:id`

Retrieves a single user by ID.

**Authentication:** Required

**Path Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `id` | ObjectId | User ID |

**Response — 200 OK:**
```json
{
  "_id": "64f1a2b3c4d5e6f7a8b9c0d3",
  "name": "Jane Smith",
  "email": "jane@school.edu",
  "role": "teacher"
}
```

**Error Responses:**

| Code | Message |
|---|---|
| 401 | Unauthorized |
| 404 | User not found |
| 500 | Server error |

---

### PUT `/api/users/:id`

Updates a user's information.

**Authentication:** Required

**Path Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `id` | ObjectId | User ID |

**Request Body:**
```json
{
  "name": "string (optional)",
  "email": "string (optional)"
}
```

**Response — 200 OK:**
```json
{
  "message": "User updated successfully",
  "updatedUser": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d3",
    "name": "Jane Updated",
    "email": "jane@school.edu"
  }
}
```

**Error Responses:**

| Code | Message |
|---|---|
| 401 | Unauthorized |
| 404 | User not found |
| 500 | Server error |

---

### DELETE `/api/users/:id`

Deletes a user from the system.

**Authentication:** Required  
**Role Required:** `superAdmin`

**Path Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `id` | ObjectId | User ID |

**Response — 200 OK:**
```json
{
  "message": "User deleted successfully"
}
```

**Error Responses:**

| Code | Message |
|---|---|
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | User not found |
| 500 | Server error |

---

## 3. Schools Module

**Base Path:** `/api/schools`

---

### GET `/api/schools`

Retrieves all schools.

**Authentication:** None (Public)

**Response — 200 OK:**
```json
[
  {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
    "name": "Springfield Elementary",
    "address": "123 Main St",
    "district": "Central District",
    "city": "Springfield",
    "lat": 6.9271,
    "lng": 79.8612,
    "createdBy": "64f1a2b3c4d5e6f7a8b9c0d1",
    "createdAt": "2024-01-15T08:30:00.000Z"
  }
]
```

**Error Responses:**

| Code | Message |
|---|---|
| 500 | Server error |

---

### GET `/api/schools/:id`

Retrieves a single school by ID.

**Authentication:** None (Public)

**Path Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `id` | ObjectId | School ID |

**Response — 200 OK:**
```json
{
  "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
  "name": "Springfield Elementary",
  "address": "123 Main St",
  "district": "Central District",
  "city": "Springfield",
  "lat": 6.9271,
  "lng": 79.8612
}
```

**Error Responses:**

| Code | Message |
|---|---|
| 400 | Invalid school ID format |
| 404 | School not found |
| 500 | Server error |

---

### GET `/api/schools/city/:city`

Retrieves all schools in a specific city.

**Authentication:** None (Public)

**Path Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `city` | string | City name |

**Response — 200 OK:**
```json
[
  { ...school objects }
]
```

**Error Responses:**

| Code | Message |
|---|---|
| 400 | City name required |
| 500 | Server error |

---

### GET `/api/schools/district/:district`

Retrieves all schools in a specific district.

**Authentication:** None (Public)

**Path Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `district` | string | District name |

**Response — 200 OK:**
```json
[
  { ...school objects }
]
```

**Error Responses:**

| Code | Message |
|---|---|
| 400 | District name required |
| 500 | Server error |

---

### POST `/api/schools`

Creates a new school.

**Authentication:** Required  
**Role Required:** `superAdmin`

**Request Body:**
```json
{
  "name": "string (required, 2-100 chars)",
  "address": "string (required, 5-255 chars)",
  "district": "string (required, 2-100 chars)",
  "city": "string (required, 2-100 chars)",
  "lat": "number (required, -90 to 90)",
  "lng": "number (required, -180 to 180)"
}
```

**Example Request:**
```json
{
  "name": "Springfield Elementary",
  "address": "123 Main Street, Springfield",
  "district": "Central District",
  "city": "Springfield",
  "lat": 6.9271,
  "lng": 79.8612
}
```

**Response — 201 Created:**
```json
{
  "message": "School created successfully",
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
    "name": "Springfield Elementary",
    "address": "123 Main Street, Springfield",
    "district": "Central District",
    "city": "Springfield",
    "lat": 6.9271,
    "lng": 79.8612,
    "createdBy": "64f1a2b3c4d5e6f7a8b9c0d1",
    "createdAt": "2024-01-15T08:30:00.000Z"
  }
}
```

**Error Responses:**

| Code | Message |
|---|---|
| 400 | Validation error (field constraints) |
| 401 | Unauthorized |
| 403 | Forbidden |
| 409 | School with this name already exists |
| 500 | Server error |

---

### PUT `/api/schools/:id`

Updates an existing school.

**Authentication:** Required  
**Role Required:** `superAdmin`

**Path Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `id` | ObjectId | School ID |

**Request Body:** *(at least one field required)*
```json
{
  "name": "string (optional)",
  "address": "string (optional)",
  "district": "string (optional)",
  "city": "string (optional)",
  "lat": "number (optional)",
  "lng": "number (optional)"
}
```

**Response — 200 OK:**
```json
{
  "message": "School updated successfully",
  "data": { ...updated school object }
}
```

**Error Responses:**

| Code | Message |
|---|---|
| 400 | Invalid school ID or no valid fields to update |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | School not found |
| 409 | Duplicate name |
| 500 | Server error |

---

### DELETE `/api/schools/:id`

Deletes a school.

**Authentication:** Required  
**Role Required:** `superAdmin`

**Path Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `id` | ObjectId | School ID |

**Response — 200 OK:**
```json
{
  "message": "School deleted successfully"
}
```

**Error Responses:**

| Code | Message |
|---|---|
| 400 | Invalid school ID format |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | School not found |
| 500 | Server error |

---

## 4. Classrooms Module

**Base Path:** `/api/classrooms`

---

### GET `/api/classrooms`

Retrieves all classrooms.

**Authentication:** None

**Response — 200 OK:**
```json
{
  "classrooms": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d4",
      "name": "Class 1A",
      "grade": "1",
      "schoolId": "64f1a2b3c4d5e6f7a8b9c0d2",
      "teacherId": {
        "_id": "64f1a2b3c4d5e6f7a8b9c0d3",
        "name": "Jane Smith",
        "email": "jane@school.edu"
      }
    }
  ]
}
```

**Error Responses:**

| Code | Message |
|---|---|
| 404 | Classrooms not found |
| 500 | Server error |

---

### POST `/api/classrooms`

Creates a new classroom.

**Authentication:** None

**Request Body:**
```json
{
  "name": "string (required)",
  "grade": "string or number (required)",
  "schoolId": "ObjectId (required)",
  "teacherId": "ObjectId (required)"
}
```

**Example Request:**
```json
{
  "name": "Class 1A",
  "grade": "1",
  "schoolId": "64f1a2b3c4d5e6f7a8b9c0d2",
  "teacherId": "64f1a2b3c4d5e6f7a8b9c0d3"
}
```

**Response — 200 OK:**
```json
{
  "classroom": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d4",
    "name": "Class 1A",
    "grade": "1",
    "schoolId": "64f1a2b3c4d5e6f7a8b9c0d2",
    "teacherId": "64f1a2b3c4d5e6f7a8b9c0d3"
  }
}
```

**Error Responses:**

| Code | Message |
|---|---|
| 500 | Unable to add classroom |

---

### GET `/api/classrooms/:id`

Retrieves a single classroom by ID.

**Authentication:** None

**Path Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `id` | ObjectId | Classroom ID |

**Response — 200 OK:**
```json
{
  "classroom": { ...classroom object }
}
```

**Error Responses:**

| Code | Message |
|---|---|
| 404 | Classroom not found |

---

### PUT `/api/classrooms/:id`

Updates a classroom.

**Authentication:** None

**Path Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `id` | ObjectId | Classroom ID |

**Request Body:**
```json
{
  "name": "string (optional)",
  "grade": "string or number (optional)",
  "schoolId": "ObjectId (optional)",
  "teacherId": "ObjectId (optional)"
}
```

**Response — 200 OK:**
```json
{
  "classroom": { ...updated classroom object }
}
```

**Error Responses:**

| Code | Message |
|---|---|
| 404 | Classroom not found |
| 500 | Server error |

---

## 5. Students Module

**Base Path:** `/api/students`

---

### GET `/api/students`

Retrieves all students for the authenticated teacher's classrooms.

**Authentication:** Required  
**Role Required:** `teacher`, `admin`

**Response — 200 OK:**
```json
{
  "students": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d5",
      "regNo": "STU001",
      "name": "Alice Johnson",
      "classroomId": {
        "_id": "64f1a2b3c4d5e6f7a8b9c0d4",
        "name": "Class 1A"
      }
    }
  ]
}
```

> Note: Returns only students from classrooms assigned to the logged-in teacher.

**Error Responses:**

| Code | Message |
|---|---|
| 401 | Unauthorized |
| 404 | Classroom/Students not found |
| 500 | Server error |

---

### POST `/api/students`

Adds a new student to a classroom.

**Authentication:** Required  
**Role Required:** `teacher`

**Request Body:**
```json
{
  "regNo": "string (required)",
  "name": "string (required)",
  "classroomId": "ObjectId (required)"
}
```

**Example Request:**
```json
{
  "regNo": "STU001",
  "name": "Alice Johnson",
  "classroomId": "64f1a2b3c4d5e6f7a8b9c0d4"
}
```

**Response — 200 OK:**
```json
{
  "student": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d5",
    "regNo": "STU001",
    "name": "Alice Johnson",
    "classroomId": "64f1a2b3c4d5e6f7a8b9c0d4"
  }
}
```

**Error Responses:**

| Code | Message |
|---|---|
| 401 | Unauthorized |
| 403 | Not authorized (teacher not assigned to classroom) |
| 404 | Classroom not found |
| 500 | Server error |

---

### GET `/api/students/active`

Retrieves the currently active quiz for a classroom (used by students).

**Authentication:** None (Public)

**Request Body:**
```json
{
  "classroomId": "ObjectId (required)"
}
```

**Response — 200 OK:**
```json
{
  "quiz": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d6",
    "title": "Hygiene Quiz Week 3",
    "classroomId": "64f1a2b3c4d5e6f7a8b9c0d4",
    "isPublished": true,
    "startTime": "2024-03-01T09:00:00.000Z",
    "endTime": "2024-03-01T10:00:00.000Z",
    "questions": [...]
  }
}
```

> Note: Returns only published quizzes within the active time window.

**Error Responses:**

| Code | Message |
|---|---|
| 404 | No active quiz available |
| 500 | Server error |

---

### GET `/api/students/:id`

Retrieves a single student by ID.

**Authentication:** Required  
**Role Required:** `teacher`

**Path Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `id` | ObjectId | Student ID |

**Response — 200 OK:**
```json
{
  "student": { ...student object }
}
```

**Error Responses:**

| Code | Message |
|---|---|
| 401 | Unauthorized |
| 404 | Student not found |

---

### PUT `/api/students/:id`

Updates a student's information.

**Authentication:** Required  
**Role Required:** `teacher`

**Path Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `id` | ObjectId | Student ID |

**Request Body:**
```json
{
  "name": "string (optional)"
}
```

**Validation:** Teacher must be assigned to the student's classroom.

**Response — 200 OK:**
```json
{
  "student": { ...updated student object }
}
```

**Error Responses:**

| Code | Message |
|---|---|
| 401 | Unauthorized |
| 403 | Not authorized |
| 404 | Classroom/Student not found |
| 500 | Server error |

---

### DELETE `/api/students/:id`

Deletes a student.

**Authentication:** Required  
**Role Required:** `teacher`

**Path Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `id` | ObjectId | Student ID |

**Validation:** Teacher must be assigned to the student's classroom.

**Response — 200 OK:**
```json
{
  "student": { ...deleted student object }
}
```

**Error Responses:**

| Code | Message |
|---|---|
| 401 | Unauthorized |
| 403 | Not authorized |
| 404 | Student not found |
| 500 | Server error |

---

## 6. Grades Module

**Base Path:** `/api/grades`

**Authentication:** Required for all endpoints  
**Role Required:** `superAdmin`, `admin`, `teacher`

> Note: For `superAdmin` users, `schoolId` must be passed as a query parameter on all endpoints.

---

### POST `/api/grades`

Creates multiple grades at once for a school.

**Authentication:** Required  
**Role Required:** `superAdmin`, `admin`, `teacher`

**Query Parameters:**

| Parameter | Type | Required For |
|---|---|---|
| `schoolId` | ObjectId | `superAdmin` only |

**Request Body:**
```json
{
  "count": "number (required, 1-13)"
}
```

**Example Request:**
```json
{
  "count": 5
}
```

**Response — 201 Created:**
```json
{
  "success": true,
  "message": "Created 5 grade(s): Grade 1, Grade 2, Grade 3, Grade 4, Grade 5",
  "data": {
    "total": 5,
    "created": [1, 2, 3, 4, 5]
  }
}
```

**Error Responses:**

| Code | Message |
|---|---|
| 400 | Missing/invalid schoolId (for superAdmin) |
| 400 | Validation error — count must be 1-13 |
| 500 | Server error |

---

### POST `/api/grades/individual`

Creates a single grade with optional configuration.

**Authentication:** Required  
**Role Required:** `superAdmin`, `admin`, `teacher`

**Query Parameters:**

| Parameter | Type | Required For |
|---|---|---|
| `schoolId` | ObjectId | `superAdmin` only |

**Request Body:**
```json
{
  "gradeNumber": "number (required, 1-13)",
  "studentCount": "number (optional)",
  "lowThreshold": "number (optional, min 1)"
}
```

**Example Request:**
```json
{
  "gradeNumber": 3,
  "studentCount": 30,
  "lowThreshold": 5
}
```

**Response — 201 Created:**
```json
{
  "success": true,
  "message": "Grade 3 created successfully",
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d7",
    "gradeNumber": 3,
    "studentCount": 30,
    "lowThreshold": 5,
    "currentQuantity": 0,
    "schoolId": "64f1a2b3c4d5e6f7a8b9c0d2",
    "isActive": true
  }
}
```

**Error Responses:**

| Code | Message |
|---|---|
| 400 | Validation error |
| 500 | Server error |

---

### GET `/api/grades`

Retrieves all grades for a school.

**Authentication:** Required  
**Role Required:** `superAdmin`, `admin`, `teacher`

**Query Parameters:**

| Parameter | Type | Required For |
|---|---|---|
| `schoolId` | ObjectId | `superAdmin` only |

**Response — 200 OK:**
```json
{
  "success": true,
  "message": "Grades retrieved successfully",
  "data": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d7",
      "gradeNumber": 1,
      "studentCount": 30,
      "currentQuantity": 15,
      "lowThreshold": 5,
      "isActive": true
    }
  ]
}
```

**Error Responses:**

| Code | Message |
|---|---|
| 400 | Missing schoolId (superAdmin) |
| 401 | Unauthorized |
| 403 | Forbidden |
| 500 | Server error |

---

### GET `/api/grades/:gradeId`

Retrieves a single grade by ID.

**Authentication:** Required  
**Role Required:** `superAdmin`, `admin`, `teacher`

**Path Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `gradeId` | ObjectId | Grade ID |

**Query Parameters:**

| Parameter | Type | Required For |
|---|---|---|
| `schoolId` | ObjectId | `superAdmin` only |

**Response — 200 OK:**
```json
{
  "success": true,
  "message": "Grade retrieved successfully",
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d7",
    "gradeNumber": 1,
    "studentCount": 30,
    "currentQuantity": 15,
    "lowThreshold": 5,
    "isActive": true
  }
}
```

**Error Responses:**

| Code | Message |
|---|---|
| 400 | Missing schoolId |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Grade not found |
| 500 | Server error |

---

### PATCH `/api/grades/:gradeId`

Updates a grade's configuration.

**Authentication:** Required  
**Role Required:** `superAdmin`, `admin`, `teacher`

**Path Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `gradeId` | ObjectId | Grade ID |

**Query Parameters:**

| Parameter | Type | Required For |
|---|---|---|
| `schoolId` | ObjectId | `superAdmin` only |

**Request Body:** *(at least one field required)*
```json
{
  "studentCount": "number (optional)",
  "lowThreshold": "number (optional)",
  "currentQuantity": "number (optional)"
}
```

**Response — 200 OK:**
```json
{
  "success": true,
  "message": "Grade updated successfully",
  "data": { ...updated grade object }
}
```

**Error Responses:**

| Code | Message |
|---|---|
| 400 | Validation error or no valid fields provided |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Grade not found |
| 500 | Server error |

---

### PATCH `/api/grades/:gradeId/deactivate`

Deactivates a grade.

**Authentication:** Required  
**Role Required:** `superAdmin`, `admin`, `teacher`

**Path Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `gradeId` | ObjectId | Grade ID |

**Query Parameters:**

| Parameter | Type | Required For |
|---|---|---|
| `schoolId` | ObjectId | `superAdmin` only |

**Response — 200 OK:**
```json
{
  "success": true,
  "message": "Grade 1 deactivated successfully",
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d7",
    "gradeNumber": 1,
    "isActive": false
  }
}
```

**Error Responses:**

| Code | Message |
|---|---|
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Grade not found |
| 500 | Server error |

---

### POST `/api/grades/:gradeId/distribute-bottles`

Distributes sanitizer bottles to all classrooms in a grade for a given month.

**Authentication:** Required  
**Role Required:** `superAdmin`, `admin`, `teacher`

**Path Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `gradeId` | ObjectId | Grade ID |

**Query Parameters:**

| Parameter | Type | Required For |
|---|---|---|
| `schoolId` | ObjectId | `superAdmin` only |

**Request Body:**
```json
{
  "bottlesPerClassroom": "number (required, min 1)",
  "month": "string (required, YYYY-MM format)"
}
```

**Example Request:**
```json
{
  "bottlesPerClassroom": 10,
  "month": "2024-03"
}
```

**Response — 200 OK:**
```json
{
  "success": true,
  "message": "Distributed 10 bottle(s) to 3 classroom(s) for Grade 1",
  "data": {
    "gradeNumber": 1,
    "bottlesPerClassroom": 10,
    "month": "2024-03",
    "classroomsUpdated": 3
  }
}
```

**Error Responses:**

| Code | Message |
|---|---|
| 400 | Validation error |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Grade not found |
| 500 | Server error |

---

### GET `/api/grades/sanitizer-check`

Generates a sanitizer status report and sends SMS alerts for critical grades.

**Authentication:** Required  
**Role Required:** `superAdmin`, `admin`, `teacher`

**Query Parameters:**

| Parameter | Type | Required For |
|---|---|---|
| `schoolId` | ObjectId | `superAdmin` only |

**Response — 200 OK:**
```json
{
  "success": true,
  "message": "Sanitizer report generated — SMS alert sent for 2 critical grade(s)",
  "data": {
    "summary": {
      "total": 5,
      "critical": 2,
      "empty": 0,
      "adequate": 3,
      "alertSentViaSMS": true
    },
    "grades": [
      {
        "gradeNumber": 1,
        "status": "adequate",
        "currentQuantity": 15,
        "lowThreshold": 5
      },
      {
        "gradeNumber": 2,
        "status": "critical",
        "currentQuantity": 3,
        "lowThreshold": 5
      }
    ]
  }
}
```

**Status Values:**

| Status | Condition |
|---|---|
| `adequate` | `currentQuantity > lowThreshold` |
| `critical` | `0 < currentQuantity <= lowThreshold` |
| `empty` | `currentQuantity == 0` |

**Error Responses:**

| Code | Message |
|---|---|
| 400 | Missing schoolId |
| 401 | Unauthorized |
| 403 | Forbidden |
| 500 | Server error |

---

## 7. Classroom Bottles Module

**Base Path:** `/api/classroomsBottles`

---

### PUT `/api/classroomsBottles/update`

Updates the sanitizer bottle usage for a classroom in a given month.

**Authentication:** Required  
**Role Required:** `teacher`

**Request Body:**
```json
{
  "classroomId": "ObjectId (required)",
  "month": "string (required, YYYY-MM format)",
  "bottleUsed": "number (required)"
}
```

**Example Request:**
```json
{
  "classroomId": "64f1a2b3c4d5e6f7a8b9c0d4",
  "month": "2024-03",
  "bottleUsed": 7
}
```

**Validation:** `bottleUsed` cannot exceed `bottleDistributed` for the given month.

**Response — 200 OK:**
```json
{
  "ClassroomBottles": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d8",
    "classroomId": "64f1a2b3c4d5e6f7a8b9c0d4",
    "month": "2024-03",
    "bottleUsed": 7,
    "bottleRemaining": 3,
    "updatedAt": "2024-03-15T10:00:00.000Z"
  }
}
```

**Error Responses:**

| Code | Message |
|---|---|
| 401 | Unauthorized |
| 403 | Not authorized (teacher not assigned to classroom) |
| 404 | Classroom or distributed bottles not found |
| 500 | Server error |

---

### GET `/api/classroomsBottles/:classroomId`

Retrieves bottle usage history for a classroom.

**Authentication:** Required  
**Role Required:** `teacher`

**Path Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `classroomId` | ObjectId | Classroom ID |

**Response — 200 OK:**
```json
{
  "ClassroomBottles": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d8",
      "classroomId": "64f1a2b3c4d5e6f7a8b9c0d4",
      "month": "2024-03",
      "bottleUsed": 7,
      "bottleRemaining": 3,
      "updatedAt": "2024-03-15T10:00:00.000Z"
    }
  ]
}
```

**Error Responses:**

| Code | Message |
|---|---|
| 401 | Unauthorized |
| 403 | Not authorized |
| 404 | No classroom bottles found |
| 500 | Server error |

---

## 8. Quiz Module

**Base Path:** `/api/quiz`

---

### POST `/api/quiz`

Creates a new quiz for a classroom.

**Authentication:** Required  
**Role Required:** `teacher`

**Request Body:**
```json
{
  "title": "string (required)",
  "classroomId": "ObjectId (required)",
  "questions": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctAnswer": "string"
    }
  ]
}
```

**Example Request:**
```json
{
  "title": "Hygiene Basics Quiz",
  "classroomId": "64f1a2b3c4d5e6f7a8b9c0d4",
  "questions": [
    {
      "question": "How long should you wash your hands?",
      "options": ["5 seconds", "20 seconds", "1 minute", "10 seconds"],
      "correctAnswer": "20 seconds"
    }
  ]
}
```

**Validation:**
- Teacher must be assigned to the specified classroom
- `questions` array must contain at least 1 question

**Response — 201 Created:**
```json
{
  "message": "Quiz created successfully",
  "quiz": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d6",
    "title": "Hygiene Basics Quiz",
    "classroomId": "64f1a2b3c4d5e6f7a8b9c0d4",
    "teacherId": "64f1a2b3c4d5e6f7a8b9c0d3",
    "questions": [...],
    "isPublished": false,
    "createdAt": "2024-03-01T08:00:00.000Z"
  }
}
```

**Error Responses:**

| Code | Message |
|---|---|
| 400 | Missing required fields or empty questions array |
| 401 | Unauthorized |
| 403 | Not authorized (teacher not assigned to classroom) |
| 404 | Classroom not found |
| 500 | Server error |

---

### GET `/api/quiz/classroom/:classroomId`

Retrieves all quizzes for a specific classroom.

**Authentication:** Required  
**Role Required:** `teacher`, `admin`

**Path Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `classroomId` | ObjectId | Classroom ID |

**Response — 200 OK:**
```json
[
  {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d6",
    "title": "Hygiene Basics Quiz",
    "classroomId": "64f1a2b3c4d5e6f7a8b9c0d4",
    "teacherId": "64f1a2b3c4d5e6f7a8b9c0d3",
    "isPublished": true,
    "startTime": "2024-03-01T09:00:00.000Z",
    "endTime": "2024-03-01T10:00:00.000Z",
    "questions": [...],
    "createdAt": "2024-03-01T08:00:00.000Z"
  }
]
```

**Error Responses:**

| Code | Message |
|---|---|
| 401 | Unauthorized |
| 500 | Server error |

---

### PUT `/api/quiz/:id`

Updates a quiz, including publishing it with a time window.

**Authentication:** Required  
**Role Required:** `teacher`

**Path Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `id` | ObjectId | Quiz ID |

**Request Body:**
```json
{
  "title": "string (optional)",
  "questions": "array (optional)",
  "isPublished": "boolean (optional)",
  "startTime": "ISO Date (required if isPublished=true)",
  "endTime": "ISO Date (required if isPublished=true)"
}
```

**Validation:**
- If `isPublished=true`: `startTime` and `endTime` are required
- `endTime` must be after `startTime`
- Teacher must be assigned to the classroom

**Response — 200 OK:**
```json
{
  "message": "Quiz updated",
  "quiz": { ...updated quiz object }
}
```

**Error Responses:**

| Code | Message |
|---|---|
| 400 | Validation errors (missing times, invalid time range) |
| 401 | Unauthorized |
| 403 | Not authorized |
| 404 | Quiz not found |
| 500 | Server error |

---

### DELETE `/api/quiz/:id`

Deletes a quiz.

**Authentication:** Required  
**Role Required:** `teacher`

**Path Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `id` | ObjectId | Quiz ID |

**Validation:** Teacher must be assigned to the classroom.

**Response — 200 OK:**
```json
{
  "message": "Quiz deleted successfully"
}
```

**Error Responses:**

| Code | Message |
|---|---|
| 401 | Unauthorized |
| 403 | Not authorized |
| 404 | Quiz not found |
| 500 | Server error |

---

## 9. Posts Module

**Base Path:** `/api/posts`

---

### POST `/api/posts/create`

Creates a new post.

**Authentication:** Required

**Request Body:**
```json
{
  "title": "string (required)",
  "content": "string (required)"
}
```

**Response — 201 Created:**
```json
{
  "_id": "64f1a2b3c4d5e6f7a8b9c0d9",
  "title": "Handwashing Tips",
  "content": "Always wash your hands before meals...",
  "author": "64f1a2b3c4d5e6f7a8b9c0d3",
  "createdAt": "2024-03-01T08:00:00.000Z",
  "updatedAt": "2024-03-01T08:00:00.000Z"
}
```

**Error Responses:**

| Code | Message |
|---|---|
| 401 | Unauthorized |
| 500 | Server error |

---

### GET `/api/posts/my-posts`

Retrieves all posts created by the authenticated user.

**Authentication:** Required

**Response — 200 OK:**
```json
[
  {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d9",
    "title": "Handwashing Tips",
    "content": "Always wash your hands before meals...",
    "author": {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d3",
      "name": "Jane Smith",
      "email": "jane@school.edu"
    },
    "createdAt": "2024-03-01T08:00:00.000Z"
  }
]
```

> Note: Results are sorted by `createdAt` in descending order (newest first).

**Error Responses:**

| Code | Message |
|---|---|
| 401 | Unauthorized |
| 500 | Server error |

---

### GET `/api/posts`

Retrieves all posts (public feed).

**Authentication:** None (Public)

**Response — 200 OK:**
```json
[
  {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d9",
    "title": "Handwashing Tips",
    "content": "Always wash your hands before meals...",
    "author": {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d3",
      "name": "Jane Smith"
    },
    "createdAt": "2024-03-01T08:00:00.000Z"
  }
]
```

> Note: Results are sorted by `createdAt` in descending order (newest first).

---

### PUT `/api/posts/:id`

Updates a post.

**Authentication:** Required

**Path Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `id` | ObjectId | Post ID |

**Validation:** Requesting user must be the post author.

**Request Body:**
```json
{
  "title": "string (optional)",
  "content": "string (optional)"
}
```

**Response — 200 OK:**
```json
{
  "_id": "64f1a2b3c4d5e6f7a8b9c0d9",
  "title": "Updated Title",
  "content": "Updated content...",
  "author": "64f1a2b3c4d5e6f7a8b9c0d3",
  "updatedAt": "2024-03-02T08:00:00.000Z"
}
```

**Error Responses:**

| Code | Message |
|---|---|
| 401 | Unauthorized |
| 403 | Not authorized (not post author) |
| 404 | Post not found |
| 500 | Server error |

---

### DELETE `/api/posts/:id`

Deletes a post.

**Authentication:** Required

**Path Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `id` | ObjectId | Post ID |

**Validation:** Requesting user must be the post author.

**Response — 200 OK:**
```json
{
  "message": "Post deleted successfully"
}
```

**Error Responses:**

| Code | Message |
|---|---|
| 401 | Unauthorized |
| 403 | Not authorized |
| 404 | Post not found |
| 500 | Server error |

---

## 10. World Bank Data Module

**Base Path:** `/api/world-bank`

---

### GET `/api/world-bank/indicators/:indicatorCode`

Fetches World Bank development indicator data for a country.

**Authentication:** None (Public)

**Path Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `indicatorCode` | string | World Bank indicator code (e.g., `SH.STA.SMSS.ZS`) |

**Query Parameters:**

| Parameter | Type | Default | Description |
|---|---|---|---|
| `country` | string | `LKA` | ISO 3-letter country code |
| `dateRange` | string | `2010:2026` | Date range in `YYYY:YYYY` format |

**Example Request:**
```http
GET /api/world-bank/indicators/SH.STA.SMSS.ZS?country=LKA&dateRange=2015:2024
```

**Response — 200 OK:**
```json
{
  "success": true,
  "message": "Indicator data retrieved successfully",
  "data": {
    "country": "LKA",
    "indicatorCode": "SH.STA.SMSS.ZS",
    "indicatorName": "People using safely managed sanitation services (% of population)",
    "value": 48.3,
    "year": 2022,
    "dateRange": "2015:2024"
  }
}
```

**Supported Indicator Codes:**

| Code | Description |
|---|---|
| `SH.STA.SMSS.ZS` | Safely managed sanitation (% of population) |
| `SH.STA.BASS.ZS` | Basic sanitation services (% of population) |
| `SH.H2O.SMDW.ZS` | Safely managed drinking water (% of population) |
| `SH.H2O.BASW.ZS` | Basic drinking water services (% of population) |
| `SH.STA.SMSS.RU.ZS` | Safely managed sanitation — rural (%) |
| `SH.STA.SMSS.UR.ZS` | Safely managed sanitation — urban (%) |

**Error Responses:**

| Code | Message |
|---|---|
| 400 | Validation error |
| 404 | Indicator data not found |
| 500 | Server error |

---

## Global Error Handling

All endpoints return errors in a consistent format.

**Error Response Structure:**
```json
{
  "success": false,
  "message": "Description of the error",
  "stack": "Stack trace (development environment only)"
}
```

**Standard HTTP Status Codes:**

| Code | Meaning |
|---|---|
| 200 | OK — Request succeeded |
| 201 | Created — Resource created successfully |
| 400 | Bad Request — Validation error or missing required fields |
| 401 | Unauthorized — Missing or invalid token |
| 403 | Forbidden — Insufficient role/permissions |
| 404 | Not Found — Resource does not exist |
| 409 | Conflict — Duplicate resource (e.g., duplicate email/name) |
| 500 | Internal Server Error — Unexpected server-side error |

---

## CORS Configuration

| Property | Value |
|---|---|
| Allowed Origins | Configured via `CORS_ORIGIN` environment variable (default: `http://localhost:3000`) |
| Credentials | Enabled (`true`) |
