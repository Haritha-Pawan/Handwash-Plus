# Deployment Report — Handwash Plus

---

## 1. System Overview

Handwash Plus is a two-tier web application:

| Tier | Technology | Purpose |
|---|---|---|
| Frontend | Next.js 15 + React 19 (Tailwind CSS, React Query, Leaflet) | Teacher/admin UI |
| Backend | Node.js + Express 5 (ES Modules) | REST API, business logic |
| Database | MongoDB Atlas | Persistent cloud data store |
| Image Storage | ImageKit CDN | Profile and post image uploads |
| SMS Alerts | Twilio | Critical sanitizer-level notifications |
| API Docs | Swagger UI | Live interactive documentation |

---

## 2. Prerequisites

| Requirement | Minimum Version |
|---|---|
| Node.js | v18.x or higher |
| npm | v9.x or higher |
| Git | Any recent version |
| MongoDB Atlas account | — (or a local MongoDB v6+ instance) |
| Twilio account | — (for SMS alerts) |
| ImageKit account | — (for image uploads) |

---

## 3. Environment Variables

### Backend — `Backend/.env`

Create this file before starting the backend. All keys are required unless marked optional.

```bash
# ── Server ────────────────────────────────────────────────
NODE_ENV=development          # development | production | test
PORT=5000

# ── Database ─────────────────────────────────────────────
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/handwashPlus

# ── JWT ──────────────────────────────────────────────────
JWT_SECRET=<long-random-secret>
JWT_REFRESH_SECRET=<long-random-refresh-secret>
JWT_RESET_SECRET=<long-random-reset-secret>
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# ── CORS ─────────────────────────────────────────────────
ALLOWED_ORIGINS=http://localhost:3000     # comma-separated in production

# ── Twilio (SMS alerts) ───────────────────────────────────
TWILIO_ACCOUNT_SID=<your-account-sid>
TWILIO_AUTH_TOKEN=<your-auth-token>
TWILIO_PHONE_NUMBER=<your-twilio-number>
ADMIN_PHONE_NUMBER=<number-that-receives-alerts>

# ── ImageKit (image uploads) ──────────────────────────────
IMAGEKIT_PUBLIC_KEY=<your-public-key>
IMAGEKIT_PRIVATE_KEY=<your-private-key>
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/<your-id>

# ── World Bank API (optional — defaults built in) ─────────
WORLD_BANK_API_URL=https://api.worldbank.org/v2
WORLD_BANK_FORMAT=json
WORLD_BANK_PER_PAGE=100
WORLD_BANK_CACHE_TTL=3600
SRI_LANKA_COUNTRY_CODE=LKA
DEFAULT_WASH_INDICATOR=SH.STA.SMSS.ZS
```

### Frontend — `Frontend/my-app/.env.local`

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

> In production replace `http://localhost:5000` with your hosted backend URL.

---

## 4. Local Development Deployment

### Step 1 — Clone the repository

```bash
git clone https://github.com/Haritha-Pawan/Handwash-Plus.git
cd handwash-plus
```

### Step 2 — Backend setup

```bash
cd Backend
npm install
```

Create `Backend/.env` using the template in Section 3, then seed the initial Super Admin account:

```bash
npm run create:super-admin
```

Start the development server (auto-restarts on file changes via nodemon):

```bash
npm run dev
```

The backend will be available at:

| Endpoint | URL |
|---|---|
| API root | `http://localhost:5000` |
| REST API base | `http://localhost:5000/api` |
| Swagger UI | `http://localhost:5000/api-docs` |
| Main API spec | `http://localhost:5000/swagger.yaml` |
| Grades API spec | `http://localhost:5000/swagger-grades.yaml` |

### Step 3 — Frontend setup

Open a separate terminal:

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

The frontend will be available at `http://localhost:3000`.

---

## 5. Production Deployment

### Backend

**Step 1 — Install production dependencies**

```bash
cd Backend
npm install --omit=dev
```

**Step 2 — Set environment variables**

Set `NODE_ENV=production` and update `ALLOWED_ORIGINS` to your production frontend domain (e.g., `https://app.handwashplus.com`).

**Step 3 — Seed the database** *(first deployment only)*

```bash
npm run create:super-admin
```

> Change the default Super Admin password immediately after first login.

**Step 4 — Start the server**

```bash
npm start          # node src/bootstrap/server.js
```

The server binds to `0.0.0.0:PORT`, making it reachable on all network interfaces.

### Frontend

**Step 1 — Set the production API URL**

```bash
NEXT_PUBLIC_API_URL=https://api.handwashplus.com/api
```

**Step 2 — Build the production bundle**

```bash
cd Frontend/my-app
npm install
npm run build
```

**Step 3 — Start the Next.js production server**

```bash
npm start          # next start — runs on port 3000 by default
```

---

## 6. Infrastructure Layout

```
handwash-plus/
├── Backend/
│   ├── src/
│   │   ├── @core/          # Middleware, JWT utils, error handling
│   │   ├── bootstrap/      # Server entry point, DB connection
│   │   ├── modules/        # Feature modules (auth, users, schools, grades, quiz…)
│   │   ├── config/         # App, database, CORS config
│   │   └── app.js          # Express app (routes, Swagger, CORS, Helmet)
│   ├── infrastructure/
│   │   ├── docker/         # Dockerfile, docker-compose.yml, Nginx config
│   │   ├── kubernetes/     # deployment.yaml, service.yaml, configmap.yaml
│   │   └── scripts/
│   │       ├── seed.js     # Super admin seeding
│   │       └── migrate.js  # Database migrations
│   ├── tests/              # Integration and e2e test suites
│   └── cypress/            # E2E / API tests
├── Frontend/
│   └── my-app/
│       ├── app/            # Next.js App Router pages and components
│       └── public/         # Static assets
└── README.md
```

---

## 7. API Routes Summary

**Base URL:** `{BACKEND_URL}/api`

All protected routes require:
```
Authorization: Bearer <access_token>
```

| Module | Route | Auth Required |
|---|---|---|
| Auth | `POST /auth/register` | No |
| Auth | `POST /auth/login` | No |
| Users | `GET /users` | admin / superAdmin |
| Users | `GET /users/:id` | Authenticated |
| Users | `PUT /users/:id` | Owner or admin |
| Users | `DELETE /users/:id` | superAdmin |
| Schools | `GET /schools` | No |
| Schools | `POST /schools` | superAdmin |
| Schools | `PUT /schools/:id` | superAdmin |
| Schools | `DELETE /schools/:id` | superAdmin |
| Classrooms | `GET /classrooms` | Authenticated |
| Students | `POST /students` | Teacher |
| Grades | `GET /grades` | Authenticated |
| Grades | `GET /grades/sanitizer-check` | Authenticated (triggers SMS if critical) |
| Quiz | `GET /quiz/:id` | No |
| Quiz | `POST /quiz` | Teacher |
| Posts | `GET /posts` | No |
| Posts | `POST /posts/create` | Authenticated |
| World Bank | `GET /world-bank/indicators/:code` | No |

**JWT token lifetimes:**

| Token | Lifetime |
|---|---|
| Access token | 15 minutes |
| Refresh token | 7 days |

---

## 8. Database

**Provider:** MongoDB Atlas (cloud-hosted)

**Connection:** Managed in `Backend/src/bootstrap/database.js` — connects via Mongoose on server start and exits the process if the connection fails.

**Seeding — Super Admin**

The seed script creates the initial `superAdmin` account needed to manage schools and users.

```bash
cd Backend
npm run create:super-admin               # create default super admin
node infrastructure/scripts/seed.js list    # list existing super admins
node infrastructure/scripts/seed.js custom "Name" "email@x.com" "password"
```

Default credentials created by the seed script:

| Field | Value |
|---|---|
| Email | `superadmin@gmail.com` |
| Password | `pawan123` |
| Role | `superAdmin` |

> **Change the password immediately after first login in any non-local environment.**

---

## 9. Third-Party Services

### Twilio (SMS Alerts)

Used to send automatic SMS alerts when sanitizer levels drop to `critical` or `empty`.

- Triggered by: `GET /api/grades/sanitizer-check`
- Required env vars: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`, `ADMIN_PHONE_NUMBER`

### ImageKit (Image Uploads)

Used for profile pictures and post images. Images are served via ImageKit's CDN.

- Required env vars: `IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`, `IMAGEKIT_URL_ENDPOINT`
- The Next.js config whitelists the ImageKit domain for `<Image>` optimisation:
  ```js
  images: { domains: ['ik.imagekit.io'] }
  ```

### World Bank API

Pulls live WASH (Water, Sanitation & Hygiene) indicator data for Sri Lanka. No API key required — data is publicly accessible.

- Base URL: `https://api.worldbank.org/v2`
- Cached server-side (TTL controlled by `WORLD_BANK_CACHE_TTL`)

---

## 10. Security Configuration

| Mechanism | Implementation |
|---|---|
| HTTP security headers | `helmet` middleware on all routes |
| CORS | Whitelist-based via `ALLOWED_ORIGINS` env var; credentials allowed |
| Authentication | JWT (access + refresh token pattern) |
| Password hashing | `bcryptjs` |
| Input validation | `joi` schema validation on all write endpoints |
| Rate limiting | `rate-limit.middleware.js` (configurable) |
| Error detail hiding | Stack traces only shown when `NODE_ENV=development` |
| Test isolation | `mockAuth` middleware active only when `NODE_ENV=test` |

---

## 11. Port Reference

| Service | Default Port |
|---|---|
| Backend API | `5000` |
| Frontend (Next.js) | `3000` |
| MongoDB (local) | `27017` |
| MongoDB (in-memory, tests) | Auto-assigned |

---

## 12. Useful Commands Reference

### Backend

```bash
npm run dev               # Start with nodemon (development)
npm start                 # Start without nodemon (production)
npm run create:super-admin # Seed the super admin account
npm test                  # Run all tests
npm run test:unit         # Unit tests only
npm run test:integration  # Integration tests only
npm run test:coverage     # Generate coverage report → Backend/coverage/
npx cypress open          # Open Cypress GUI (E2E tests — requires server running)
npx cypress run           # Run Cypress headlessly (CI)
```

### Frontend

```bash
npm run dev               # Start Next.js dev server
npm run build             # Build production bundle
npm start                 # Serve production bundle
```
