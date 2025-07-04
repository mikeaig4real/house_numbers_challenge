# Snipify

AI-powered snippet summarization service.

## Project Structure

- `api/` — Express + TypeScript backend
- `ui/` — Remix + TypeScript frontend
- `docker-compose.yml` — Orchestrates backend, frontend, and MongoDB

## Setup (Local)

1. Copy `.env.example` to `.env` and fill in required values.
2. Install dependencies in both `api/` and `ui/`:

   ```bash
   cd api && npm install
   cd ../ui && npm install
   ```

3. Start MongoDB locally/with Atlas or use Docker Compose.

## MongoDB Configuration

Set the `MONGO_URI` environment variable in your `.env` files:

- **For MongoDB Atlas (cloud):**

  ```env
  MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/snipify?retryWrites=true&w=majority
  ```

- **For local MongoDB:**

  ```env
  MONGO_URI=mongodb://localhost:27017/snipify
  ```

## Docker Compose

```bash
docker compose up --build
```

- API: <http://localhost:3000>
- UI: <http://localhost:3030>

## Running Tests

```bash
cd api && npm test
```

## Available Commands
  
### Root

- `npm run dev` — Start all services with Docker Compose (API, UI, MongoDB)
- `npm run start:manual` — Start API and UI dev servers manually (without Docker)

### API (`api`)

- `npm run start` — Build and run the API (production)
- `npm run dev` — Start API in development mode with hot reload
- `npm run test` — Run backend tests
- `npm run lint` — Lint code (currently a placeholder)
- `npm run format` — Format code with Prettier
- `npm run build` — Compile TypeScript

### UI (`ui`)

- `npm run build` — Build the Remix app
- `npm run dev` — Start Remix dev server
- `npm run lint` — Lint frontend code with ESLint
- `npm run start` — Start the built Remix app (production)
- `npm run typecheck` — Type-check with TypeScript
- `npm run format` — Format code with Prettier
- `npm run test` — Run frontend tests

---

## Authentication (Session-based, JWT, HttpOnly Cookie)

Snipify uses secure, session-based authentication:

- **JWTs** are signed with a secret and stored in an HttpOnly cookie.
- **Password hashing** is done with bcryptjs.
- **Cookies** are managed with cookie-parser.
- **All endpoints** are testable and do not rely on third-party auth providers.

### Backend (Express)

- JWTs are signed and verified using `jsonwebtoken`.
- JWT is set as an HttpOnly cookie on login/signup.
- On each request, the JWT is parsed and verified from the cookie.
- Passwords are hashed with `bcryptjs`.
- **All snippet endpoints require authentication and are user-specific.**
- **Custom middleware**: JWT authentication (`middleware/jwtAuth.ts`) and route protection (`middleware/requireAuth.ts`) are used for secure access.

### Frontend (Remix)

- Auth forms POST to `/api/auth/signup` and `/api/auth/login`.
- On success, the API sets the HttpOnly cookie.
- **Snippets are displayed as cards in a responsive grid.**
- **Copy-to-clipboard**: The summary in the snippet modal has a copy icon (top right of the left panel) using `react-icons`.

### Some Libraries Used

- `jsonwebtoken`
- `cookie-parser`
- `bcryptjs`
- `react-icons` (UI)
- `framer.motion` (UI)

### Example Endpoints

- **POST `/api/auth/signup`** — Register a new user (sets cookie)
- **POST `/api/auth/login`** — Login (sets cookie)
- **POST `/api/auth/logout`** — Logout (clears cookie)

---

## API Documentation

### POST /api/auth/signup

Register a new user. Sets a JWT as an HttpOnly cookie.

**Request:**

```json
{
  "email": "user@example.com",
  "password": "yourPassword123"
}
```

**Response:**

- `201 Created` with user info and cookie set
- `400 Bad Request` if email already registered or missing fields

### POST /api/auth/login

Login an existing user. Sets a JWT as an HttpOnly cookie.

**Request:**

```json
{
  "email": "user@example.com",
  "password": "yourPassword123"
}
```

**Response:**

- `200 OK` with user info and cookie set
- `400 Bad Request` if credentials are invalid

### POST /api/auth/logout

Logs out the user by clearing the auth cookie.

**Response:**

- `204 No Content` and cookie cleared

---

### POST /api/snippets

Create a new snippet and get its summary. **Requires authentication. Snippet is always associated with the current user.**

**Request:**

```json
{
  "text": "Your raw content here."
}
```

**Response:**

- `201 Created` (new snippet)
- `200 OK` (if snippet already exists for this user)

```json
{
  "id": "<snippet_id>",
  "text": "...",
  "summary": "..."
}
```

**Errors:**

- `400 Bad Request` — Invalid or empty text, text < 5 words, or summary exceeds word limit.
- `401 Unauthorized` — If not authenticated.
- `500 Internal Server Error` — On server/AI failure.

### GET /api/snippets

Get all snippets for the authenticated user.

**Response:**

```json
[
  { "id": "...", "text": "...", "summary": "..." },
  ...
]
```

### GET /api/snippets/:id

Get a specific snippet by ID (must belong to the authenticated user).

**Response:**

- `200 OK` — Snippet found
- `404 Not Found` — Snippet not found

```json
{
  "id": "...",
  "text": "...",
  "summary": "..."
}
```

## API Usage Examples

### Create Snippet

```bash
curl -X POST http://localhost:3000/api/snippets -H "Content-Type: application/json" --cookie "snipify_token=..." -d '{"text": "Your raw content here."}'
```

### Get All Snippets

```bash
curl http://localhost:3000/api/snippets --cookie "snipify_token=..."
```

### Get Snippet by ID

```bash
curl http://localhost:3000/api/snippets/<id> --cookie "snipify_token=..."
```

## AI Key Management

- Place your Gemini API key in the `.env` file of `/api` as `GEMINI_API_KEY`.

## Reflection

_What I’d improve with more time:_

- Add more client-side tests
- Use libraries like Zod to implement schema validation for API requests at Request level with middlewares, maybe implement a custom validation logic with an iterative pattern within controllers.

_Trade-offs made:_

- Focused on a backend-first approach, Remix offers both server and client capabilities, would have maybe reduced round trips of client-server requests.
- Sacrificed code quality for speed and breadth of implementation.
