# Handwash Plus

Handwash Plus is a school hand hygiene management system. It tracks sanitizer levels across grades and classrooms, engages students with hygiene quizzes, and gives teachers tools to manage their assignments — all while surfacing real-world sanitation data from the World Bank API. When sanitizer drops critically low, the system automatically fires an SMS alert via Twilio so nothing gets missed.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Setup Instructions](#setup-instructions)
3. [Environment Variables](#environment-variables)
4. [API Endpoint Documentation](#api-endpoint-documentation)
5. [Deployment Report](#deployment-report)
6. [Testing Instructions](#testing-instructions)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, React 19, Tailwind CSS 4, React Query, Axios, Leaflet |
| Backend | Node.js, Express 5, MongoDB Atlas, Mongoose 9 |
| Auth | JWT (access tokens 15m, refresh tokens 7d), bcrypt |
| Uploads | ImageKit |
| SMS Alerts | Twilio |
| API Docs | Swagger UI |
| Testing | Jest, Supertest, Cypress, mongodb-memory-server |

---

## Setup Instructions

### Prerequisites

- Node.js v18 or higher
- npm v9 or higher
- MongoDB Atlas account (or local MongoDB)
- Git

---

### Step 1 — Clone the repository

```bash
git clone https://github.com/Haritha-Pawan/Handwash-Plus.git
cd handwash-plus
```

---

### Step 2 — Configure and start the backend

```bash
cd Backend
npm install
```

Create a `Backend/.env` file with the variables listed in [Environment Variables](#environment-variables).

Seed the initial super admin account:

```bash
npm run create:super-admin
```

Start the development server:

```bash
npm run dev
```

The API will be available at `http://localhost:5000`.  
Interactive Swagger docs: `http://localhost:5000/api-docs`.

---

### Step 3 — Configure and start the frontend

```bash
cd Frontend/my-app
npm install
```

Create `Frontend/my-app/.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

---

### Local service URLs

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000/api |
| Swagger UI | http://localhost:5000/api-docs |
| Grades API spec | http://localhost:5000/swagger-grades.yaml |

---

## Project Structure

```
handwash-plus/
├── Backend/
│   ├── src/
│   │   ├── @core/             # Middleware, JWT utils, constants
│   │   │   ├── middleware/    # auth.middleware.js, role.middleware.js
│   │   │   ├── utils/         # jwt.utils.js, response formatters
│   │   │   └── database/      # MongoDB connection, base repository
│   │   ├── bootstrap/         # Server start-up, DB connection
│   │   ├── modules/           # Feature modules (each has controller, service, routes, model)
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── schools/
│   │   │   ├── classrooms/
│   │   │   ├── students/
│   │   │   ├── grades/
│   │   │   ├── classroomBottles/
│   │   │   ├── quiz/
│   │   │   ├── post/
│   │   │   ├── reports/
│   │   │   ├── students_progress/
│   │   │   └── world-bank/
│   │   ├── config/            # JWT, DB, app config
│   │   ├── jobs/              # Background jobs and schedules
│   │   └── app.js
│   ├── tests/                 # Integration tests
│   ├── cypress/               # End-to-end tests
│   ├── docs/                  # Architecture and deployment docs
│   └── infrastructure/        # Docker, Kubernetes, seed scripts
└── Frontend/
    └── my-app/
        ├── app/               # Next.js App Router pages and components
        │   ├── api/           # Axios client (api.js)
        │   ├── services/      # Per-module API service functions
        │   ├── hooks/         # React Query custom hooks
        │   └── components/    # Reusable UI components
        └── public/            # Static assets
```

---

## Environment Variables

**Never commit real secrets.** Use the templates below and fill in your own values.

### Backend — `Backend/.env`

```bash
# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/handwashPlus

# JWT — generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=<your-access-token-secret>
JWT_REFRESH_SECRET=<your-refresh-token-secret>
JWT_RESET_SECRET=<your-reset-token-secret>
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# CORS — comma-separated list of allowed frontend origins
CORS_ORIGIN=http://localhost:3000

# Twilio — SMS alerts when sanitizer is critically low
TWILIO_ACCOUNT_SID=<your-twilio-account-sid>
TWILIO_AUTH_TOKEN=<your-twilio-auth-token>
TWILIO_PHONE_NUMBER=<your-twilio-number>       # e.g. +14155552671
ADMIN_PHONE_NUMBER=<recipient-number>           # e.g. +94771234567

# ImageKit — community post image uploads
IMAGEKIT_PUBLIC_KEY=<your-imagekit-public-key>
IMAGEKIT_PRIVATE_KEY=<your-imagekit-private-key>
IMAGEKIT_URL_ENDPOINT=<your-imagekit-url-endpoint>
```

### Frontend (development) — `Frontend/my-app/.env.local`

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Frontend (production) — `Frontend/my-app/.env.production`

```bash
NEXT_PUBLIC_API_URL=https://handwash-plus-backend.onrender.com/api
```

---

## API Endpoint Documentation

**Base URL:** `http://localhost:5000/api` (dev) / `https://handwash-plus-backend.onrender.com/api` (prod)

### Authentication

Protected endpoints require:

```
Authorization: Bearer <access_token>
```

Tokens are returned by `/auth/login`. Access tokens expire in **15 minutes**; refresh tokens in **7 days**.  
JWT payload: `{ id, email, role, school }`.

**Roles (highest to lowest):** `superAdmin` → `admin` → `teacher` → `student`

---

### Auth Module — `/api/auth`

#### `POST /api/auth/register`

Register a new user account. No authentication required.

**Request body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@school.lk",
  "password": "securePassword123",
  "role": "teacher",
  "school": "64abc123def456"
}
```

**Success response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "64abc789xyz",
    "name": "Jane Smith",
    "email": "jane@school.lk",
    "role": "teacher"
  }
}
```

**Error response (409 — email already exists):**
```json
{
  "success": false,
  "message": "Email already in use"
}
```

---

#### `POST /api/auth/login`

Log in and receive JWT tokens.

**Request body:**
```json
{
  "email": "jane@school.lk",
  "password": "securePassword123"
}
```

**Success response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "64abc789xyz",
      "name": "Jane Smith",
      "email": "jane@school.lk",
      "role": "teacher"
    }
  }
}
```

**Error response (401):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

### Users Module — `/api/users`

| Method | Endpoint | Auth Required | Role |
|---|---|---|---|
| GET | `/users` | Yes | admin, superAdmin |
| GET | `/users/:id` | Yes | any |
| PUT | `/users/:id` | Yes | any (own) / admin+ |
| DELETE | `/users/:id` | Yes | superAdmin |

#### `GET /api/users`

List all users (paginated).

**Headers:** `Authorization: Bearer <token>`

**Success response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64abc789xyz",
      "name": "Jane Smith",
      "email": "jane@school.lk",
      "role": "teacher",
      "school": "64abc123def456",
      "isActive": true
    }
  ]
}
```

#### `PUT /api/users/:id`

Update a user profile.

**Request body (all fields optional):**
```json
{
  "name": "Jane Updated",
  "email": "jane.updated@school.lk"
}
```

**Success response (200):**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": { "_id": "64abc789xyz", "name": "Jane Updated" }
}
```

---

### Schools Module — `/api/schools`

| Method | Endpoint | Auth Required | Role |
|---|---|---|---|
| GET | `/schools` | No | public |
| GET | `/schools/:id` | No | public |
| GET | `/schools/city/:city` | No | public |
| GET | `/schools/district/:district` | No | public |
| POST | `/schools` | Yes | superAdmin |
| PUT | `/schools/:id` | Yes | superAdmin |
| DELETE | `/schools/:id` | Yes | superAdmin |

#### `POST /api/schools`

Create a new school.

**Headers:** `Authorization: Bearer <token>`

**Request body:**
```json
{
  "name": "Royal College",
  "city": "Colombo",
  "district": "Colombo",
  "location": "Colombo 07"
}
```

**Success response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "64def456abc",
    "name": "Royal College",
    "city": "Colombo",
    "district": "Colombo"
  }
}
```

#### `GET /api/schools/city/:city`

Filter schools by city.

**Example:** `GET /api/schools/city/Colombo`

**Success response (200):**
```json
{
  "success": true,
  "data": [
    { "_id": "64def456abc", "name": "Royal College", "city": "Colombo" }
  ]
}
```

---

### Classrooms Module — `/api/classrooms`

| Method | Endpoint | Auth Required | Role |
|---|---|---|---|
| GET | `/classrooms` | Yes | any |
| GET | `/classrooms/my` | Yes | teacher |
| GET | `/classrooms/:id` | Yes | any |
| POST | `/classrooms` | Yes | teacher, admin |
| PUT | `/classrooms/:id` | Yes | teacher, admin |

#### `POST /api/classrooms`

Create a classroom.

**Request body:**
```json
{
  "name": "Grade 5A",
  "grade": "64grade123",
  "teacher": "64teacher456",
  "school": "64school789"
}
```

**Success response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "64class001",
    "name": "Grade 5A",
    "grade": "64grade123",
    "teacher": "64teacher456"
  }
}
```

#### `GET /api/classrooms/my`

Get all classrooms assigned to the logged-in teacher.

**Success response (200):**
```json
{
  "success": true,
  "data": [
    { "_id": "64class001", "name": "Grade 5A", "school": "64school789" }
  ]
}
```

---

### Students Module — `/api/students`

| Method | Endpoint | Auth Required | Role |
|---|---|---|---|
| GET | `/students` | Yes | teacher, admin |
| GET | `/students/:id` | Yes | teacher |
| GET | `/students/by-classroom/:classroomId` | Yes | teacher |
| POST | `/students` | Yes | teacher |
| POST | `/students/active` | No | public |
| PUT | `/students/:id` | Yes | teacher |
| DELETE | `/students/:id` | Yes | teacher |

#### `POST /api/students`

Add a student. A unique 4-digit PIN is auto-generated.

**Request body:**
```json
{
  "name": "Amal Perera",
  "email": "amal@example.com",
  "classroom": "64class001",
  "school": "64school789"
}
```

**Success response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "64stu001",
    "name": "Amal Perera",
    "pin": "4821",
    "classroom": "64class001"
  }
}
```

#### `POST /api/students/active`

Get the active quiz for a student's classroom (used during student PIN login). No auth required.

**Request body:**
```json
{
  "pin": "4821",
  "classroomId": "64class001"
}
```

**Success response (200):**
```json
{
  "success": true,
  "data": {
    "quizId": "64quiz001",
    "title": "Hand Hygiene Quiz",
    "questions": []
  }
}
```

---

### Grades Module — `/api/grades`

Grades represent year levels (e.g. Grade 5, Grade 6) and track sanitizer inventory across their classrooms.

**Sanitizer statuses:**

| Status | Meaning |
|---|---|
| `adequate` | Sufficient supply |
| `low` | Getting low, monitor soon |
| `critical` | Below threshold — SMS alert fires automatically |
| `empty` | Completely out |

| Method | Endpoint | Auth Required | Role |
|---|---|---|---|
| GET | `/grades` | Yes | any |
| GET | `/grades/:gradeId` | Yes | any |
| GET | `/grades/sanitizer-check` | Yes | admin+ |
| POST | `/grades` | Yes | admin+ |
| POST | `/grades/individual` | Yes | admin+ |
| POST | `/grades/:gradeId/distribute-bottles` | Yes | admin+ |
| PATCH | `/grades/:gradeId` | Yes | admin+ |
| PATCH | `/grades/:gradeId/deactivate` | Yes | admin+ |

#### `POST /api/grades`

Create multiple grades at once.

**Request body:**
```json
{
  "school": "64school789",
  "grades": [
    { "name": "Grade 5", "studentCount": 120, "threshold": 10 },
    { "name": "Grade 6", "studentCount": 98, "threshold": 10 }
  ]
}
```

**Success response (201):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64grade001",
      "name": "Grade 5",
      "sanitizerQty": 0,
      "status": "empty",
      "studentCount": 120
    }
  ]
}
```

#### `PATCH /api/grades/:gradeId`

Update sanitizer quantity, threshold, or student count.

**Request body (any field optional):**
```json
{
  "sanitizerQty": 25,
  "threshold": 10,
  "studentCount": 120
}
```

**Success response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64grade001",
    "sanitizerQty": 25,
    "status": "adequate",
    "threshold": 10
  }
}
```

#### `POST /api/grades/:gradeId/distribute-bottles`

Distribute sanitizer bottles evenly across a grade's classrooms.

**Request body:**
```json
{
  "totalBottles": 30
}
```

**Success response (200):**
```json
{
  "success": true,
  "message": "Bottles distributed successfully",
  "data": {
    "bottlesPerClassroom": 6,
    "classroomsUpdated": 5
  }
}
```

#### `GET /api/grades/sanitizer-check`

Run a system-wide sanitizer level check. Automatically sends an SMS alert for any grade in `critical` status.

**Success response (200):**
```json
{
  "success": true,
  "data": {
    "critical": ["Grade 3", "Grade 4"],
    "smsSent": true
  }
}
```

---

### Classroom Bottles Module — `/api/classroomsBottles`

| Method | Endpoint | Auth Required | Role |
|---|---|---|---|
| GET | `/classroomsBottles/:classroomId` | Yes | teacher |
| PUT | `/classroomsBottles/update` | Yes | teacher |

#### `PUT /api/classroomsBottles/update`

Record monthly bottle usage for a classroom.

**Request body:**
```json
{
  "classroomId": "64class001",
  "bottlesUsed": 4,
  "month": "2025-03"
}
```

**Success response (200):**
```json
{
  "success": true,
  "message": "Bottle usage recorded"
}
```

---

### Quiz Module — `/api/quiz`

Supports three question types: `mcq`, `truefalse`, and `rating`.

| Method | Endpoint | Auth Required | Role |
|---|---|---|---|
| GET | `/quiz/classroom/:classroomId` | Yes | teacher, admin |
| GET | `/quiz/:id` | No | public |
| POST | `/quiz` | Yes | teacher |
| PUT | `/quiz/:id` | Yes | teacher |
| DELETE | `/quiz/:id` | Yes | teacher |

#### `POST /api/quiz`

Create a quiz for a classroom.

**Request body:**
```json
{
  "title": "Hand Hygiene Quiz",
  "classroom": "64class001",
  "questions": [
    {
      "type": "mcq",
      "question": "When should you wash your hands?",
      "options": ["Before eating", "After using the toilet", "After sneezing", "All of the above"],
      "correct": 3
    },
    {
      "type": "truefalse",
      "question": "20 seconds is enough time to wash hands properly.",
      "correct": true
    },
    {
      "type": "rating",
      "question": "How often do you wash your hands daily?",
      "scale": 5
    }
  ]
}
```

**Success response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "64quiz001",
    "title": "Hand Hygiene Quiz",
    "classroom": "64class001",
    "isActive": true
  }
}
```

---

### Posts Module — `/api/posts`

| Method | Endpoint | Auth Required | Role |
|---|---|---|---|
| GET | `/posts` | No | public |
| GET | `/posts/my-posts` | Yes | any |
| POST | `/posts/create` | Yes | any |
| PUT | `/posts/:id` | Yes | any (own post) |
| DELETE | `/posts/:id` | Yes | any (own post) |

#### `POST /api/posts/create`

Create a community post with an optional image. Use `multipart/form-data`.

**Request (multipart/form-data):**

| Field | Type | Required |
|---|---|---|
| title | string | Yes |
| content | string | Yes |
| image | file (jpg/png) | No |

**Success response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "64post001",
    "title": "Handwashing Awareness",
    "content": "Let's remind students every day...",
    "imageUrl": "https://ik.imagekit.io/xxx/post.jpg",
    "author": "64abc789xyz"
  }
}
```

---

### World Bank WASH Data — `/api/world-bank`

Public endpoint — no authentication required.

| Method | Endpoint | Auth Required |
|---|---|---|
| GET | `/world-bank/indicators/:indicatorCode` | No |

#### `GET /api/world-bank/indicators/:indicatorCode`

Fetch Sri Lanka's WASH indicator data from the World Bank API. Responses are cached for 1 hour.

**Available indicator codes:**

| Code | Description |
|---|---|
| `SH.STA.SMSS.ZS` | Safely managed sanitation (% of population) |
| `SH.STA.BASS.ZS` | Basic sanitation services |
| `SH.H2O.SMDW.ZS` | Safely managed drinking water |
| `SH.H2O.BASW.ZS` | Basic drinking water services |
| `SH.STA.SMSS.RU.ZS` | Safely managed sanitation — rural |
| `SH.STA.SMSS.UR.ZS` | Safely managed sanitation — urban |

**Example:** `GET /api/world-bank/indicators/SH.STA.SMSS.ZS`

**Success response (200):**
```json
{
  "success": true,
  "data": {
    "indicator": "SH.STA.SMSS.ZS",
    "country": "Sri Lanka",
    "values": [
      { "year": "2022", "value": 50.2 },
      { "year": "2021", "value": 48.7 }
    ]
  }
}
```

---

### Standard Error Response Format

All errors return:

```json
{
  "success": false,
  "message": "A human-readable description of what went wrong",
  "errors": ["Optional array of field-level validation errors"]
}
```

| Status Code | Meaning |
|---|---|
| 200 | OK |
| 201 | Resource created |
| 400 | Bad request / validation error |
| 401 | Missing or invalid token |
| 403 | Insufficient role/permissions |
| 404 | Resource not found |
| 409 | Conflict (e.g. duplicate email) |
| 500 | Internal server error |

---

## Deployment Report

### Architecture Overview

The system is split into two independently deployed services:

- **Backend API** — Node.js/Express, deployed on [Render](https://render.com)
- **Frontend App** — Next.js 15, deployed on [Vercel](https://vercel.com)
- **Database** — MongoDB Atlas (cloud-hosted, no self-managed infrastructure)

---

### Backend Deployment — Render

**Platform:** [Render](https://render.com) (Web Service, free tier)

**Deployed backend API URL:** `https://handwash-plus-backend.onrender.com`

**Deployment steps:**

1. Push your code to GitHub (the repo Render will watch).
2. Go to [render.com](https://render.com) → **New** → **Web Service**.
3. Connect your GitHub repository and select the `Backend/` folder as the root directory.
4. Configure the service:

| Setting | Value |
|---|---|
| Environment | Node |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Node version | 18 or higher |

5. Under **Environment Variables**, add all keys from [Backend .env](#backend--backendenv). Do **not** use the `.env` file on Render — enter each variable in the dashboard.
6. Click **Deploy**. Render pulls the latest commit and starts the server.
7. Verify the deployment by visiting `https://handwash-plus-backend.onrender.com/api-docs`.

**Important Render notes:**
- The free tier spins down after 15 minutes of inactivity. The first request after spin-down may take 30–60 seconds.
- Set `NODE_ENV=production` in environment variables.
- Update `CORS_ORIGIN` to include the deployed Vercel frontend URL.

---

### Frontend Deployment — Vercel

**Platform:** [Vercel](https://vercel.com) (Hobby plan)

**Deployed frontend URL:** `https://handwash-plus-ea8v.vercel.app`

**Deployment steps:**

1. Push your code to GitHub.
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → Import your repository.
3. Set the **Root Directory** to `Frontend/my-app`.
4. Vercel auto-detects Next.js — no build command changes needed.
5. Under **Environment Variables**, add:

| Key | Value |
|---|---|
| `NEXT_PUBLIC_API_URL` | `https://handwash-plus-backend.onrender.com/api` |

6. Click **Deploy**. Vercel runs `npm run build` and deploys automatically.
7. Every push to `main` triggers a new production deployment automatically.

---

### Environment Variables Reference (Production)

The table below lists every variable used in production with a description. **No real values are shown here.**

#### Backend (set in Render dashboard)

| Variable | Description |
|---|---|
| `NODE_ENV` | Set to `production` |
| `PORT` | Port the Express server listens on (Render sets this automatically) |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret for signing access tokens (min 64 random hex chars) |
| `JWT_REFRESH_SECRET` | Secret for signing refresh tokens |
| `JWT_RESET_SECRET` | Secret for password reset tokens |
| `JWT_ACCESS_EXPIRATION` | Access token lifetime (e.g. `15m`) |
| `JWT_REFRESH_EXPIRATION` | Refresh token lifetime (e.g. `7d`) |
| `CORS_ORIGIN` | Comma-separated list of allowed frontend origins |
| `TWILIO_ACCOUNT_SID` | Twilio account SID |
| `TWILIO_AUTH_TOKEN` | Twilio auth token |
| `TWILIO_PHONE_NUMBER` | Twilio outgoing phone number |
| `ADMIN_PHONE_NUMBER` | Number that receives critical sanitizer SMS alerts |
| `IMAGEKIT_PUBLIC_KEY` | ImageKit public key |
| `IMAGEKIT_PRIVATE_KEY` | ImageKit private key |
| `IMAGEKIT_URL_ENDPOINT` | ImageKit URL endpoint |

#### Frontend (set in Vercel dashboard)

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Full base URL of the deployed backend API |

---

### Live URLs

| Service | URL |
|---|---|
| Deployed Frontend | https://handwash-plus-ea8v.vercel.app |
| Deployed Backend API | https://handwash-plus-backend.onrender.com/api |
| Swagger API Docs (production) | https://handwash-plus-backend.onrender.com/api-docs |
| GitHub Repository | https://github.com/Haritha-Pawan/handwash-plus |

---

## Testing Instructions

### Testing Environment Configuration

All tests run against an **in-memory MongoDB instance** (via `mongodb-memory-server`) so no real database connection is required. Each test suite spins up a fresh database and tears it down after.

**Test framework:** Jest  
**HTTP integration testing:** Supertest  
**End-to-end testing:** Cypress  
**Config file:** `Backend/jest.config.js`

Install dependencies before running any tests:

```bash
cd Backend
npm install
```

---

### Unit Tests

Unit tests isolate individual service and controller functions using mocked dependencies. They are located inside `__tests__` or `_tests_` directories within each module folder.

**Covered modules:**
- `auth` — registration, login, token generation
- `users` — CRUD operations
- `schools` — school management
- `grades` — sanitizer calculations and status transitions
- `quiz` — question creation and validation
- `post` — post creation and access control
- `classroomBottles` — bottle usage recording

**Run unit tests:**

```bash
cd Backend
npm run test:unit
```

This runs all test files matching the `src/modules/**` pattern.

**Watch mode (re-runs on file save):**

```bash
npm run test:watch
```

**Coverage report:**

```bash
npm run test:coverage
```

Coverage output is written to `Backend/coverage/`. Open `coverage/lcov-report/index.html` in a browser for a full breakdown.

**Example — running a single module's tests:**

```bash
cd Backend
npx jest src/modules/grades --coverage
```

---

### Integration Tests

Integration tests send real HTTP requests to a live Express app backed by the in-memory MongoDB. They verify that controllers, services, middleware, and the database all work together correctly.

Test files are in `Backend/tests/integration/` and in `_tests_/integration/` within individual modules (e.g. `classroomBottles/_tests_/integration/classroomBottle.test.js`).

**Run integration tests:**

```bash
cd Backend
npm run test:integration
```

**Run all tests (unit + integration):**

```bash
npm test
```

**Example integration test flow (auth):**

1. A test HTTP server is spun up on an in-memory Express app.
2. `POST /api/auth/register` is called with valid data — asserts 201 response and returned user object.
3. `POST /api/auth/login` is called — asserts 200 response and that both `accessToken` and `refreshToken` are present.
4. A protected endpoint is called without a token — asserts 401.
5. The same endpoint is called with the token — asserts the expected resource is returned.
6. In-memory database is wiped between test suites.

---

### End-to-End (E2E) Tests

E2E tests use **Cypress** to simulate full user journeys in a real browser against a running development server.

**Setup:**

1. Start the backend dev server:

```bash
cd Backend
npm run dev
```

2. In a second terminal, start the frontend dev server:

```bash
cd Frontend/my-app
npm run dev
```

3. In a third terminal, open Cypress:

```bash
cd Backend
npx cypress open
```

This opens the Cypress Test Runner. Select a spec file to run it interactively, or run headlessly:

```bash
npx cypress run
```

Cypress configuration is in `Backend/cypress.config.js`. Test specs are in `Backend/cypress/e2e/`.

---

### Performance Testing

Performance testing verifies the API handles concurrent load without degradation. Use [k6](https://k6.io/) (free and open-source) against the development or staging environment.

**Install k6:**

```bash
# Windows (via Chocolatey)
choco install k6

# macOS
brew install k6
```

**Example load test script — save as `load-test.js`:**

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 50,           // 50 virtual users
  duration: '30s',   // for 30 seconds
};

export default function () {
  const res = http.get('http://localhost:5000/api/schools');
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(1);
}
```

**Run the test:**

```bash
k6 run load-test.js
```

k6 outputs requests per second, response time percentiles (p50, p90, p95), and error rate. Run performance tests against a local or staging server, never against the production Render instance on the free tier.

---

### Testing Environment Configuration Summary

| Setting | Value |
|---|---|
| Test database | In-memory MongoDB via `mongodb-memory-server` |
| Test runner | Jest (ES modules mode, `--experimental-vm-modules`) |
| HTTP assertions | Supertest |
| E2E runner | Cypress |
| Coverage tool | Jest `--coverage` (Istanbul) |
| Performance tool | k6 |
| Backend test port | Ephemeral (supertest binds automatically) |
| Frontend test URL | `http://localhost:3000` (for Cypress) |
| Backend dev URL | `http://localhost:5000` (for Cypress) |
