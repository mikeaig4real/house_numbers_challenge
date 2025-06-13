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

---

## API Documentation

### POST /auth/signup

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

### POST /auth/login

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

### POST /auth/logout

Logs out the user by clearing the auth cookie.

**Response:**

- `204 No Content` and cookie cleared

---

### POST /snippets

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

### GET /snippets

Get all snippets for the authenticated user.

**Response:**

```json
[
  { "id": "...", "text": "...", "summary": "..." },
  ...
]
```

### GET /snippets/:id

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

- TBD

_Trade-offs made:_

- TBD
