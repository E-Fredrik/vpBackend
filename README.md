# VP Backend - Complete REST API

## 📁 Project Structure

```
vpBackend/
├── src/
│   ├── controllers/          # HTTP request handlers
│   │   ├── user-controller.ts
│   │   ├── food-log-controller.ts
│   │   ├── activity-log-controller.ts
│   │   ├── place-controller.ts
│   │   ├── friend-controller.ts
│   │   ├── visit-log-controller.ts
│   │   ├── ema-log-controller.ts
│   │   └── daily-summary-controller.ts
│   ├── services/             # Business logic layer
│   │   ├── user-service.ts
│   │   ├── food-log-service.ts
│   │   ├── activity-log-service.ts
│   │   ├── place-service.ts
│   │   ├── friend-service.ts
│   │   ├── visit-log-service.ts
│   │   ├── ema-log-service.ts
│   │   └── daily-summary-service.ts
│   ├── models/               # TypeScript interfaces
│   │   ├── userModel.ts
│   │   ├── foodLogModel.ts
│   │   ├── activityRecord.ts
│   │   ├── placeOfInterest.ts
│   │   ├── friendModel.ts
│   │   ├── visitLogModel.ts
│   │   ├── emaLogModel.ts
│   │   └── dailySummaryModel.ts
│   ├── validations/          # Zod schemas
│   │   ├── user-validation.ts
│   │   ├── food-log-validation.ts
│   │   ├── activity-log-validation.ts
│   │   ├── place-validation.ts
│   │   ├── friend-validation.ts
│   │   ├── visit-log-validation.ts
│   │   ├── ema-log-validation.ts
│   │   └── daily-summary-validation.ts
│   ├── routes/
│   │   └── public-router.ts # All API routes
│   ├── middlewares/
│   │   └── error-middleware.ts
│   ├── error/
│   │   └── response-error.ts
│   ├── utils/
│   │   ├── database-util.ts
│   │   └── env-util.ts
│   └── main.ts              # Application entry point
├── prisma/
│   └── schema.prisma
├── .env
└── package.json
```

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Update `.env` with your PostgreSQL connection:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/vpbackend?schema=public"
PORT=3000
NODE_ENV=development
```

### 3. Run Migrations
```bash
npx prisma migrate dev
```

### 4. Generate Prisma Client
```bash
npx prisma generate
```

### 5. Start Server
```bash
npm run dev
```

## 📡 API Endpoints

Base URL: `http://localhost:3000/api`

### Users
- `POST /users` - Create user
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Food Logs
- `POST /food-logs` - Create food log
- `GET /food-logs` - Get all food logs
- `GET /food-logs/:id` - Get food log by ID
- `GET /food-logs/user/:userId` - Get user's food logs
- `PATCH /food-logs/:id` - Update food log
- `DELETE /food-logs/:id` - Delete food log

### Activity Logs
- `POST /activity-logs` - Create activity log
- `GET /activity-logs` - Get all activity logs
- `GET /activity-logs/:id` - Get activity log by ID
- `GET /activity-logs/user/:userId` - Get user's activity logs
- `PATCH /activity-logs/:id` - Update activity log
- `DELETE /activity-logs/:id` - Delete activity log

### Places
- `POST /places` - Create place
- `GET /places` - Get all places
- `GET /places/:id` - Get place by ID
- `GET /places/category/:category` - Get places by category
- `PATCH /places/:id` - Update place
- `DELETE /places/:id` - Delete place

### Friends
- `POST /friends` - Create friend request
- `GET /friends` - Get all friend relationships
- `GET /friends/:id` - Get friend by ID
- `GET /friends/user/:userId` - Get user's friends
- `PATCH /friends/:id/status` - Update friend status
- `DELETE /friends/:id` - Delete friend

### Visit Logs
- `POST /visit-logs` - Create visit log
- `GET /visit-logs` - Get all visit logs
- `GET /visit-logs/:id` - Get visit log by ID
- `GET /visit-logs/user/:userId` - Get user's visit logs
- `GET /visit-logs/place/:placeId` - Get place's visit logs
- `PATCH /visit-logs/:id` - Update visit log
- `DELETE /visit-logs/:id` - Delete visit log

### EMA Logs
- `POST /ema-logs` - Create EMA log
- `GET /ema-logs` - Get all EMA logs
- `GET /ema-logs/:id` - Get EMA log by ID
- `GET /ema-logs/user/:userId` - Get user's EMA logs
- `PATCH /ema-logs/:id` - Update EMA log
- `DELETE /ema-logs/:id` - Delete EMA log

### Daily Summaries
- `POST /daily-summaries` - Create daily summary
- `GET /daily-summaries` - Get all daily summaries
- `GET /daily-summaries/:id` - Get daily summary by ID
- `GET /daily-summaries/user/:userId` - Get user's daily summaries
- `PATCH /daily-summaries/:id` - Update daily summary
- `DELETE /daily-summaries/:id` - Delete daily summary

## 📝 Request/Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "errors": "Error message"
}
```

### Validation Error Response
```json
{
  "success": false,
  "errors": [
    {
      "path": "field.name",
      "message": "Validation error message"
    }
  ]
}
```

## 🛡️ Error Handling

The API handles the following error types:
- **Validation Errors (400)** - Zod schema validation failures
- **Unauthorized (401)** - Authentication failures
- **Forbidden (403)** - Authorization failures
- **Not Found (404)** - Resource not found
- **Conflict (409)** - Duplicate records (e.g., unique constraint)
- **Internal Server Error (500)** - Unexpected errors

## 🔧 Architecture

### Layered Architecture
1. **Controllers** - Handle HTTP requests/responses
2. **Services** - Business logic and data operations
3. **Models** - TypeScript interfaces and types
4. **Validations** - Zod schemas for input validation
5. **Middleware** - Error handling, logging, etc.

### Key Features
- ✅ Type-safe with TypeScript
- ✅ Input validation with Zod
- ✅ Prisma ORM with PostgreSQL
- ✅ Connection pooling with @prisma/adapter-pg
- ✅ Comprehensive error handling
- ✅ RESTful API design
- ✅ Clean architecture (separation of concerns)
- ✅ Future-proof and extensible

## 📦 Dependencies

- **express** - Web framework
- **@prisma/client** - Database ORM
- **@prisma/adapter-pg** - PostgreSQL adapter
- **pg** - PostgreSQL client
- **zod** - Schema validation
- **typescript** - Type safety
- **dotenv** - Environment variables

## 🧪 Testing

Test endpoints with curl, Postman, or any HTTP client:

```bash
# Create a user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "gender": "MALE"
  }'

# Get all users
curl http://localhost:3000/api/users
```

## 🎯 Next Steps

1. Add authentication/authorization (JWT)
2. Add rate limiting
3. Add logging middleware
4. Add CORS configuration
5. Add API documentation (Swagger/OpenAPI)
6. Add unit and integration tests
7. Add Docker support
8. Add CI/CD pipeline
