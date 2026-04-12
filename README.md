# Handwash Plus

Handwash Plus is a hand hygiene management system built for schools. It helps track sanitizer supplies across classrooms, keeps students engaged through hygiene quizzes, and gives teachers easy tools to manage their assignments — all while pulling in real-world sanitation data from the World Bank. When sanitizer runs critically low, the system automatically fires off an SMS alert so nothing slips through the cracks.

---

## What's it built with?

The frontend runs on **Next.js 16** and **React 19**, styled with Tailwind CSS, with React Query handling data fetching and Leaflet powering any map views. The backend is a **Node.js + Express 5** API backed by **MongoDB Atlas**. Auth is handled with JWT (short-lived access tokens + refresh tokens), images upload to ImageKit, and SMS alerts go out via Twilio. API docs are auto-generated with Swagger UI.

---

## Getting it running

### You'll need

- Node.js v18 or higher
- npm v9 or higher
- A MongoDB Atlas account (or a local MongoDB instance)
- Git

---

### Step 1 — Clone the repo

```bash
git clone https://github.com/Haritha-Pawan/Handwash-Plus.git
cd handwash-plus
```

### Step 2 — Set up the backend

```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend/` folder (see [Environment Variables](#environment-variables) below), then seed the initial super admin account:

```bash
npm run create:super-admin
```

Now start the dev server:

```bash
npm run dev
```

The API will be live at `http://localhost:5000`, and you can explore the interactive docs at `http://localhost:5000/api-docs`.

Other useful backend commands:

```bash
npm start                   # Run in production mode
npm test                    # Run all tests
npm run test:unit           # Unit tests only
npm run test:integration    # Integration tests only
npm run test:coverage       # See test coverage
npm run test:watch          # Watch mode for development
```

### Step 3 — Set up the frontend

```bash
cd Frontend/my-app
npm install
```

Create a `.env.local` file with:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Then start it up:

```bash
npm run dev
```

The app will be at `http://localhost:3000`.

---

### Where everything lives

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000/api |
| Swagger (interactive docs) | http://localhost:5000/api-docs |
| Main API spec | http://localhost:5000/swagger.yaml |
| Grades API spec | http://localhost:5000/swagger-grades.yaml |

---

## Environment Variables

### Backend (`Backend/.env`)

```bash
NODE_ENV=development
PORT=5000



MONGODB_URI=mongodb+srv://crowdflow_db:crowdflow123+@cluster0.idairv9.mongodb.net/handwashPlus


JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_RESET_SECRET=your-super-secret-reset-key-change-this-in-production
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d


CORS_ORIGIN=http://localhost:3000,http://localhost:5000

TWILIO_ACCOUNT_SID=ACa4b2770d6796f9b470466cbe4829bdff
TWILIO_AUTH_TOKEN=14ed9efadfcbfca21c6695943f440dbf
TWILIO_PHONE_NUMBER=+14179893463
ADMIN_PHONE_NUMBER=+94776049950

IMAGEKIT_PUBLIC_KEY='public_C5RoxZ4WvYlyXLkB96vpIlxuOjU='
IMAGEKIT_PRIVATE_KEY='private_4jEYkYE7lLJiSOqUdaDMGd7A1Co=' 
IMAGEKIT_URL_ENDPOINT='https://ik.imagekit.io/j57lutycub'

# World Bank API
WORLD_BANK_API_URL=https://api.worldbank.org/v2
WORLD_BANK_FORMAT=json
WORLD_BANK_PER_PAGE=100
WORLD_BANK_CACHE_TTL=3600
SRI_LANKA_COUNTRY_CODE=LKA
DEFAULT_WASH_INDICATOR=SH.STA.SMSS.ZS
```

### Frontend (`Frontend/my-app/.env.local`)

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## API Overview

**Base URL:** `http://localhost:5000/api`

Protected endpoints need a Bearer token in the `Authorization` header:

```
Authorization: Bearer <access_token>
```

Access tokens last **15 minutes**; refresh tokens last **7 days**. The JWT payload carries the user's ID, email, role, and school info.

Roles from highest to lowest: `superAdmin` → `admin` → `teacher` → `student`

---

### Auth

**`POST /auth/register`** — Register a new user (no auth required).

**`POST /auth/login`** — Log in and get your access + refresh tokens back.

---

### Users

**`GET /users`** — List all users (paginated). Requires `admin` or `superAdmin`.

**`GET /users/:id`** — Get a single user's profile.

**`PUT /users/:id`** — Update a user. Users can edit their own profile; admins can edit anyone's.

**`DELETE /users/:id`** — Delete a user. `superAdmin` only.

---

### Schools

**`GET /schools`** — List all schools. Public — no auth needed.

**`GET /schools/:id`** — Get a specific school.

**`GET /schools/city/:city`** — Filter schools by city.

**`GET /schools/district/:district`** — Filter schools by district.

**`POST /schools`** — Create a school. `superAdmin` only.

**`PUT /schools/:id`** — Update a school. `superAdmin` only.

**`DELETE /schools/:id`** — Delete a school. `superAdmin` only.

---

### Classrooms

**`GET /classrooms`** — List all classrooms.

**`GET /classrooms/my`** — Get the classrooms assigned to the logged-in teacher.

**`GET /classrooms/:id`** — Get a specific classroom.

**`POST /classrooms`** — Create a new classroom.

**`PUT /classrooms/:id`** — Update a classroom.

---

### Students

**`GET /students`** — List students visible to the logged-in teacher.

**`GET /students/:id`** — Get a specific student. Includes their auto-generated 4-digit PIN.

**`GET /students/by-classroom/:classroomId`** — List all students in a classroom.

**`POST /students`** — Add a new student. A unique PIN is generated automatically.

**`POST /students/active`** — Get the active quiz for a classroom (used during student login).

**`PUT /students/:id`** — Update a student's details.

**`DELETE /students/:id`** — Remove a student. Teacher must own that classroom.

---

### Grades

**`GET /grades`** — Get all grades for your school, including sanitizer status.

Sanitizer statuses explained:
- `adequate` — you're good
- `low` — getting there, worth keeping an eye on
- `critical` — below threshold, an SMS alert fires automatically
- `empty` — completely out

**`GET /grades/:gradeId`** — Get a specific grade.

**`POST /grades`** — Create multiple grades at once with sanitizer tracking.

**`POST /grades/individual`** — Create a single grade.

**`POST /grades/:gradeId/distribute-bottles`** — Distribute sanitizer bottles evenly across a grade's classrooms.

**`GET /grades/sanitizer-check`** — Check levels across all grades. Automatically sends an SMS if anything is critical.

**`PATCH /grades/:gradeId`** — Update a grade's sanitizer quantity, threshold, or student count.

**`PATCH /grades/:gradeId/deactivate`** — Soft-delete a grade.

---

### Classroom Bottles

**`GET /classroomsBottles/:classroomId`** — See bottle usage history for a classroom.

**`PUT /classroomsBottles/update`** — Record how many bottles were used that month.

---

### Quiz

**`GET /quiz/classroom/:classroomId`** — Get all quizzes for a classroom.

**`GET /quiz/:id`** — Get a specific quiz. Public, no auth needed.

**`POST /quiz`** — Create a quiz. Supports three question types: `mcq`, `truefalse`, and `rating`.

**`PUT /quiz/:id`** — Update a quiz.

**`DELETE /quiz/:id`** — Delete a quiz.

---

### Posts

**`GET /posts`** — Browse the public post feed. No auth needed.

**`GET /posts/my-posts`** — See only your own posts.

**`POST /posts/create`** — Create a post. Accepts an optional image upload via `multipart/form-data`.

**`PUT /posts/:id`** — Edit your post.

**`DELETE /posts/:id`** — Delete your post.

---

### World Bank WASH Data

**`GET /world-bank/indicators/:indicatorCode`** — Pull Sri Lanka's WASH indicator data straight from the World Bank API. Available indicators:

| Code | What it tracks |
|---|---|
| `SH.STA.SMSS.ZS` | Safely managed sanitation (% of population) |
| `SH.STA.BASS.ZS` | Basic sanitation services |
| `SH.H2O.SMDW.ZS` | Safely managed drinking water |
| `SH.H2O.BASW.ZS` | Basic drinking water services |
| `SH.STA.SMSS.RU.ZS` | Safely managed sanitation — rural |
| `SH.STA.SMSS.UR.ZS` | Safely managed sanitation — urban |

---

## Error responses

Every error comes back in the same shape:

```json
{
  "success": false,
  "message": "What went wrong",
  "errors": ["More detail if relevant"]
}
```

Standard status codes: `200` OK, `201` Created, `400` Bad Request, `401` Unauthorized, `403` Forbidden, `404` Not Found, `409` Conflict, `500` Server Error.

---

## Project structure

```
handwash-plus/
├── Backend/
│   ├── src/
│   │   ├── @core/         # Middleware, utilities, constants
│   │   ├── bootstrap/     # Server and DB setup
│   │   ├── modules/       # Feature modules (auth, users, schools, etc.)
│   │   ├── config/        # App config
│   │   ├── jobs/          # Background jobs
│   │   └── app.js
│   ├── tests/             # Unit and integration tests
│   ├── cypress/           # End-to-end tests
│   ├── infrastructure/    # Docker, Kubernetes, seed scripts
│   └── docs/              # Architecture docs
├── Frontend/
│   └── my-app/
│       ├── app/           # Next.js App Router pages
│       └── public/        # Static assets
└── README.md
```
