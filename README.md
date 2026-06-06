# Express JS CRUD API

REST API built with Express 5, TypeScript, and PostgreSQL. The project includes CRUD modules for users, products, and orders, DTO validation, database migrations, seed scripts, unit/smoke tests, CRUD integration tests, and GitHub Actions CI.

## Requirements

- Node.js 24
- npm
- PostgreSQL 16 or a compatible version

## Installation

```bash
npm install
```

## Environment

Copy the example environment file:

```bash
cp .env.example .env
```

PowerShell:

```powershell
Copy-Item .env.example .env
```

Fill in `.env`:

```env
DB_HOST=localhost
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=
PORT=
```

Create the development database:

```bash
createdb express_crud
```

## Database

Run migrations:

```bash
npm run migrate:up
```

Rollback the latest migration:

```bash
npm run migrate:down
```

Seed the database:

```bash
npm run seed
```

## Run

Development mode:

```bash
npm run dev
```

Production build:

```bash
npm run build
npm start
```

By default, the server is available at:

```text
http://localhost:8080
```

Health route:

```http
GET /
```

API prefix:

```text
/api/v1
```

## API Routes

Users:

```http
GET    /api/v1/users
POST   /api/v1/users
GET    /api/v1/users/:id
PUT    /api/v1/users/:id
PATCH  /api/v1/users/:id
DELETE /api/v1/users/:id
GET    /api/v1/users/:userId/orders
```

Products:

```http
GET    /api/v1/products
POST   /api/v1/products
GET    /api/v1/products/:id
PUT    /api/v1/products/:id
PATCH  /api/v1/products/:id
DELETE /api/v1/products/:id
```

Orders:

```http
GET    /api/v1/orders
POST   /api/v1/orders
GET    /api/v1/orders/:id
PUT    /api/v1/orders/:id
PATCH  /api/v1/orders/:id
DELETE /api/v1/orders/:id
```

## Request Examples

Create user:

```bash
curl -X POST http://localhost:8080/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Ada Lovelace","email":"ada@example.com","password":"password123"}'
```

Create product:

```bash
curl -X POST http://localhost:8080/api/v1/products \
  -H "Content-Type: application/json" \
  -d '{"title":"Keyboard","description":"Mechanical keyboard","price":120.5,"stock":7}'
```

Create order:

```bash
curl -X POST http://localhost:8080/api/v1/orders \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"totalPrice":120.5}'
```

Patch order status:

```bash
curl -X PATCH http://localhost:8080/api/v1/orders/1 \
  -H "Content-Type: application/json" \
  -d '{"status":"paid"}'
```

Allowed order statuses:

```text
new, paid, shipped, cancelled
```

## Scripts

```bash
npm run dev               # run the server in development mode
npm run build             # compile TypeScript to dist
npm start                 # run the compiled server
npm run lint              # run oxlint
npm run lint:fix          # run oxlint with auto-fix
npm run format            # format files with Prettier
npm run format:check      # check formatting
npm test                  # build and run unit/smoke tests
npm run test:integration  # build and run CRUD integration tests
```

## Tests

Run regular tests:

```bash
npm test
```

Integration tests require a separate PostgreSQL test database because they reset tables before running.

Create the test database:

```bash
createdb express_crud_test
```

Run integration tests in bash:

```bash
TEST_DATABASE_URL=postgres://express:1234@localhost:5432/express_crud_test npm run test:integration
```

Run integration tests in PowerShell:

```powershell
$env:TEST_DATABASE_URL="postgres://express:1234@localhost:5432/express_crud_test"
npm run test:integration
```

Safety rule: integration tests only reset a database when `TEST_DATABASE_URL` contains `test`, or when `ALLOW_INTEGRATION_DB_RESET=true` is explicitly set.

## CI/CD

GitHub Actions workflow is located here:

```text
.github/workflows/ci.yml
```

It runs:

- dependency installation with `npm ci`
- lint
- build
- regular tests
- CRUD integration tests with a PostgreSQL service container

The workflow runs on pull requests and on pushes to `main` or `master`.

## Project Structure

```text
common/              shared middleware and errors
config/              database connection
database/migrations/ PostgreSQL migrations
database/seeds/      seed scripts
modules/users/       users module
modules/products/    products module
modules/orders/      orders module
routes/              API router
tests/               smoke, unit and integration tests
app.ts               Express app
server.ts            server entrypoint
```
