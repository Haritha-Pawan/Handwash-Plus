# Handwash Plus

A comprehensive handwash monitoring system with separate frontend and backend.

## Project Structure

```
handwash-plus/
├── backend/                 # Node.js backend API
│   ├── src/
│   │   ├── @core/           # Core utilities and constants
│   │   ├── modules/         # Feature modules (auth, dispensers, etc.)
│   │   ├── bootstrap/       # Application bootstrap files
│   │   ├── config/          # Configuration files
│   │   ├── integrations/    # External integrations
│   │   ├── jobs/            # Background jobs
│   │   └── shared/          # Shared utilities
│   ├── tests/               # Backend tests
│   ├── package.json
│   └── ecosystem.config.js
├── frontend/                # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
├── docs/                    # Documentation
├── infrastructure/          # Deployment configurations
├── package.json             # Root package.json for monorepo
└── README.md
```

## Setup

1. Install dependencies for all workspaces:
   ```
   npm run install:all
   ```

2. Start the backend:
   ```
   npm run start:backend
   ```

3. Start the frontend:
   ```
   npm run start:frontend
   ```

## Backend

The backend is built with Node.js, Express, and MongoDB. It provides REST APIs and WebSocket support for real-time monitoring.

## Frontend

The frontend is built with React and provides a user interface for the handwash monitoring system.
│   │   │   ├── strategies/
│   │   │   │   ├── jwt.strategy.js
│   │   │   │   └── local.strategy.js
│   │   │   └── __tests__/
│   │   │       └── auth.test.js
│   │   │
│   │   ├── users/
│   │   │   ├── user.module.js
│   │   │   ├── user.controller.js
│   │   │   ├── user.service.js
│   │   │   ├── user.repository.js
│   │   │   ├── user.validation.js
│   │   │   ├── user.routes.js
│   │   │   ├── user.model.js
│   │   │   ├── dto/
│   │   │   │   ├── create-user.dto.js
│   │   │   │   ├── update-user.dto.js
│   │   │   │   └── user-response.dto.js
│   │   │   └── __tests__/
│   │   │       └── user.test.js
│   │   │
│   │   ├── schools/
│   │   │   ├── school.module.js
│   │   │   ├── school.controller.js
│   │   │   ├── school.service.js
│   │   │   ├── school.repository.js
│   │   │   ├── school.validation.js
│   │   │   ├── school.routes.js
│   │   │   ├── school.model.js
│   │   │   ├── dto/
│   │   │   │   ├── create-school.dto.js
│   │   │   │   └── school-response.dto.js
│   │   │   └── __tests__/
│   │   │       └── school.test.js
│   │   │
│   │   ├── inventory/
│   │   │   ├── inventory.module.js
│   │   │   ├── inventory.controller.js
│   │   │   ├── inventory.service.js
│   │   │   ├── inventory.repository.js
│   │   │   ├── inventory.validation.js
│   │   │   ├── inventory.routes.js
│   │   │   ├── inventory.model.js
│   │   │   ├── enums/
│   │   │   │   ├── product-type.enum.js
│   │   │   │   └── stock-status.enum.js
│   │   │   └── __tests__/
│   │   │       └── inventory.test.js
│   │   │
│   │   ├── dispensers/
│   │   │   ├── dispenser.module.js
│   │   │   ├── dispenser.controller.js
│   │   │   ├── dispenser.service.js
│   │   │   ├── dispenser.repository.js
│   │   │   ├── dispenser.validation.js
│   │   │   ├── dispenser.routes.js
│   │   │   ├── dispenser.model.js
│   │   │   ├── iot/
│   │   │   │   ├── iot-listener.js
│   │   │   │   ├── data-processor.js
│   │   │   │   └── commands/
│   │   │   │       └── dispenser-commands.js
│   │   │   └── __tests__/
│   │   │       └── dispenser.test.js
│   │   │
│   │   ├── monitoring/
│   │   │   ├── monitoring.module.js
│   │   │   ├── monitoring.controller.js
│   │   │   ├── monitoring.service.js
│   │   │   ├── monitoring.repository.js
│   │   │   ├── monitoring.routes.js
│   │   │   ├── usage.model.js
│   │   │   ├── alert.model.js
│   │   │   ├── websocket/
│   │   │   │   ├── socket-handler.js
│   │   │   │   └── events.js
│   │   │   └── __tests__/
│   │   │       └── monitoring.test.js
│   │   │
│   │   ├── reports/
│   │   │   ├── report.module.js
│   │   │   ├── report.controller.js
│   │   │   ├── report.service.js
│   │   │   ├── report.repository.js
│   │   │   ├── report.routes.js
│   │   │   ├── generators/
│   │   │   │   ├── pdf-generator.js
│   │   │   │   ├── excel-generator.js
│   │   │   │   └── chart-generator.js
│   │   │   └── __tests__/
│   │   │       └── report.test.js
│   │   │
│   │   └── notifications/
│   │       ├── notification.module.js
│   │       ├── notification.controller.js
│   │       ├── notification.service.js
│   │       ├── notification.repository.js
│   │       ├── notification.routes.js
│   │       ├── channels/
│   │       │   ├── email.channel.js
│   │       │   ├── sms.channel.js
│   │       │   ├── push.channel.js
│   │       │   └── in-app.channel.js
│   │       ├── templates/
│   │       │   ├── email/
│   │       │   │   ├── low-stock.hbs
│   │       │   │   └── alert.hbs
│   │       │   └── sms/
│   │       │       └── templates.js
│   │       └── __tests__/
│   │           └── notification.test.js
│   │
│   ├── shared/
│   │   ├── interfaces/
│   │   │   ├── controller.interface.js
│   │   │   ├── service.interface.js
│   │   │   └── repository.interface.js
│   │   │
│   │   ├── types/
│   │   │   ├── common.types.js
│   │   │   └── api.types.js
│   │   │
│   │   └── decorators/
│   │       ├── log.decorator.js
│   │       ├── cache.decorator.js
│   │       └── validate.decorator.js
│   │
│   ├── config/
│   │   ├── index.js
│   │   ├── environment.config.js
│   │   ├── database.config.js
│   │   ├── redis.config.js
│   │   ├── queue.config.js
│   │   ├── swagger.config.js
│   │   └── socket.config.js
│   │
│   ├── bootstrap/
│   │   ├── server.js
│   │   ├── database.js
│   │   ├── redis.js
│   │   ├── queue.js
│   │   └── socket.js
│   │
│   ├── jobs/
│   │   ├── processors/
│   │   │   ├── inventory.processor.js
│   │   │   ├── report.processor.js
│   │   │   └── notification.processor.js
│   │   ├── schedules/
│   │   │   ├── daily-report.job.js
│   │   │   └── inventory-check.job.js
│   │   └── index.js
│   │
│   ├── integrations/
│   │   ├── iot/
│   │   │   ├── client.js
│   │   │   ├── parser.js
│   │   │   └── validator.js
│   │   ├── payment/
│   │   │   ├── gateway.js
│   │   │   └── webhook.js
│   │   └── sms/
│   │       └── provider.js
│   │
│   └── app.js
│
├── infrastructure/
│   ├── docker/
│   │   ├── Dockerfile
│   │   ├── docker-compose.yml
│   │   └── nginx/
│   │       └── default.conf
│   ├── kubernetes/
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   │   └── configmap.yaml
│   └── scripts/
│       ├── deploy.sh
│       ├── seed.js
│       └── migrate.js
│
├── tests/
│   ├── unit/
│   │   ├── modules/
│   │   └── shared/
│   ├── integration/
│   │   ├── api/
│   │   └── database/
│   ├── e2e/
│   │   └── flows/
│   └── fixtures/
│       ├── users.fixture.js
│       └── schools.fixture.js
│
├── docs/
│   ├── api/
│   │   └── swagger.yaml
│   ├── architecture/
│   │   └── README.md
│   └── deployment/
│       └── guide.md
│
├── logs/
│   ├── error.log
│   ├── combined.log
│   └── exceptions.log
│
├── .env
├── .env.example
├── .gitignore
├── .eslintrc.js
├── .prettierrc
├── .dockerignore
├── package.json
├── ecosystem.config.js  # PM2 config
└── README.md