# Testing Instruction Report — Handwash Plus

---

## i. How to Run Unit Tests

Unit tests validate individual modules in isolation using **Jest** with mocked dependencies. They live inside each module's `__tests__/` folder (e.g., `src/modules/auth/__tests__/auth.controller.test.js`).

### Prerequisites

```bash
cd Backend
npm install
```

### Commands

| Command | Description |
|---|---|
| `npm run test:unit` | Run all unit tests under `src/modules/` |
| `npm test` | Run all tests matching `__tests__` pattern |
| `npm run test:watch` | Run tests in watch mode (re-runs on file changes) |
| `npm run test:coverage` | Run all tests and generate a coverage report |

### Example

```bash
cd Backend
npm run test:unit
```

**Expected output** — Jest prints each `describe` / `it` block with pass/fail status. Coverage is written to `Backend/coverage/`.

### What is tested

| Module | Test File |
|---|---|
| Auth Controller | `src/modules/auth/__tests__/auth.controller.test.js` |
| User Controller | `src/modules/users/__tests__/user.controller.test.js` |
| School Controller | `src/modules/schools/__tests__/school.controller.test.js` |
| Grade Service | `src/modules/grades/__tests__/grade.service.test.js` |
| Quiz (unit) | `src/modules/quiz/_tests_/unit/quiz.unit.test.js` |
| Classroom Bottles (unit) | `src/modules/classroomBottles/_tests_/unit/classroomBottles.unit.test.js` |

### How unit tests are structured

Each unit test:

1. Mocks all external dependencies (database models, services, JWT utils) using `jest.unstable_mockModule`.
2. Imports the controller/service under test after mocking.
3. Creates mock `req` / `res` objects and asserts on response status and body.

```js
// Example — auth.controller.test.js
jest.unstable_mockModule('../auth.service.js', () => ({
  AuthService: jest.fn().mockImplementation(() => ({ login: loginSpy })),
}));
```

---

## ii. Integration Testing Setup and Execution

Integration tests spin up a **real Express application** connected to an **in-memory MongoDB** instance (`mongodb-memory-server`). They test full HTTP request/response cycles using **Supertest**.

### Prerequisites

```bash
cd Backend
npm install
```

All required packages (`jest`, `supertest`, `mongodb-memory-server`) are included in `devDependencies`.

### Environment Variables

Integration tests set required environment variables directly inside the test file — no `.env` file is needed:

```js
process.env.JWT_SECRET = 'integration_test_secret';
process.env.JWT_REFRESH_SECRET = 'integration_test_refresh_secret';
process.env.NODE_ENV = 'test';
```

### Command

```bash
cd Backend
npm run test:integration
```

This targets `tests/integration/**/*.test.js`.

### Test Files

| File | Coverage |
|---|---|
| `tests/integration/school.integration.test.js` | All CRUD endpoints for `/api/schools`, auth/role enforcement, validation, duplicate handling |
| `tests/integration/quiz.integration.test.js` | Quiz creation, retrieval, and classroom-scoped queries |

### Test Lifecycle

```
beforeAll  → Start MongoMemoryServer → Connect Mongoose → Import app
beforeEach → Clear target collection (isolation between tests)
afterAll   → Disconnect Mongoose → Stop MongoMemoryServer
```

### How authentication is handled

A helper signs a short-lived JWT for each role:

```js
const superAdminToken = jwt.sign(
  { userId: '...', email: 'superadmin@test.com', role: 'superAdmin' },
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);
```

Tests then attach it via the `Authorization: Bearer <token>` header.

### Example scenarios tested

```
POST /api/schools  (superAdmin)  → 201 Created
POST /api/schools  (teacher)     → 403 Forbidden
POST /api/schools  (no token)    → 401 Unauthorized
POST /api/schools  (duplicate)   → 409 Conflict
POST /api/schools  (bad coords)  → 400 Bad Request
```

---

## iii. Performance Testing Setup and Execution

Performance / End-to-End tests use **Cypress**, which drives the Backend API directly and can be extended to test the Frontend UI.

### Prerequisites

```bash
cd Backend
npm install        # Cypress is listed under dependencies
```

### Configuration — `Backend/cypress.config.js`

```js
export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5000',   // Backend must be running
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: false,
  },
});
```

### Running Cypress Tests

**Step 1 — Start the backend server in a separate terminal:**

```bash
cd Backend
npm run dev        # starts on http://localhost:5000
```

**Step 2 — Run Cypress:**

```bash
# Interactive (opens Cypress GUI)
npx cypress open

# Headless (CI-friendly)
npx cypress run
```

### Existing E2E Spec

| File | Description |
|---|---|
| `cypress/e2e/loginStub.cy.js` | Intercepts `POST /api/users/login` with a stubbed response and asserts status 200, login message, and user role |

### Adding Performance Benchmarks

To measure API response times within a Cypress test:

```js
it('should respond within acceptable time', () => {
  const start = Date.now();
  cy.request('GET', '/api/schools').then((response) => {
    expect(Date.now() - start).to.be.lessThan(500); // 500ms threshold
    expect(response.status).to.eq(200);
  });
});
```

Place new specs in `Backend/cypress/e2e/` — Cypress will pick them up automatically.

---

## iv. Testing Environment Configuration Details

### Backend Technology Stack

| Tool | Version | Purpose |
|---|---|---|
| Jest | ^29.7.0 | Unit and integration test runner |
| Supertest | ^7.0.0 | HTTP assertion library for integration tests |
| mongodb-memory-server | ^10.1.4 | In-memory MongoDB for isolated DB tests |
| Cypress | ^15.11.0 | E2E and API performance testing |
| @jest/globals | ^29.7.0 | Explicit Jest API for ESM compatibility |
| cross-env | ^7.0.3 | Cross-platform environment variable injection |

### Jest Configuration — `Backend/jest.config.js`

```js
export default {
  testEnvironment: 'node',
  testMatch: [
    '**/src/modules/**/__tests__/**/*.test.js',  // unit tests
    '**/tests/unit/**/*.test.js',                // additional unit tests
    '**/tests/integration/**/*.test.js',         // integration tests
  ],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/modules/**/*.js',
    '!src/modules/**/__tests__/**',
    '!src/modules/**/dto/**',
  ],
  testTimeout: 30000,   // 30-second timeout per test
  verbose: true,
};
```

> **Note:** The project uses ES Modules (`"type": "module"` in `package.json`). Jest is invoked via `node --experimental-vm-modules` to support ESM.

### Database Setup Helper — `Backend/setupTests.js`

Provides three reusable helpers for managing the in-memory database:

```js
connectDB()  // Create MongoMemoryServer and connect Mongoose
clearDB()    // Wipe all collections between tests
closeDB()    // Disconnect and stop the server after all tests
```

### Environment Variables Reference

| Variable | Required For | Example Value |
|---|---|---|
| `NODE_ENV` | All tests | `test` |
| `JWT_SECRET` | Unit + Integration | `integration_test_secret` |
| `JWT_REFRESH_SECRET` | Integration | `integration_test_refresh_secret` |
| `PORT` | E2E (Cypress) | `5000` |
| `MONGODB_URI` | Development/Production only | MongoDB Atlas URI |

> Integration and unit tests **do not** require `MONGODB_URI` — they use the in-memory server. Only E2E/Cypress tests require the backend to be running with a real (or `.env`-configured) database.

### Frontend

The Frontend (`Frontend/my-app`) is built with **Next.js 15** and does not currently have a configured test framework. Jest or Vitest can be added following the Next.js testing guide.

### Ports Summary

| Service | Port |
|---|---|
| Backend API | `5000` |
| Frontend (Next.js dev) | `3000` |
| MongoDB (in-memory, tests) | Assigned automatically |

### CI/CD Considerations

- All unit and integration tests are **headless** and require no running server.
- Cypress E2E tests require the backend to be up (`npm run dev` or `npm start`).
- Use `npm run test:coverage` in CI pipelines to generate coverage artefacts under `Backend/coverage/`.
- `cross-env` ensures environment variable syntax works across Windows and Unix runners.
