# PIMC Backend

This is the backend service for the Pakistan International Medical City (PIMC) membership management system, built with NestJS and PostgreSQL.

## Features

- User registration and authentication with JWT
- Secure password handling with bcrypt
- Refresh token mechanism
- Membership form management
- Plot reservations

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL

## Installation

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install
```

## Configuration

Create a `.env` file in the root directory with the following variables:

```
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=pimc_db

# JWT
JWT_SECRET=pimc_supersecret_jwt_key_change_in_production
JWT_ACCESS_EXPIRATION=7d
JWT_REFRESH_EXPIRATION=14d
```

Adjust the values according to your environment.

## Database Setup

Make sure you have PostgreSQL installed and running. Then create a database named `pimc_db` (or the name you specified in your `.env` file).

```bash
# Using psql
psql -U postgres
CREATE DATABASE pimc_db;
```

## Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The API will be available at http://localhost:3000 (or the port specified in your `.env` file).

## API Endpoints

### Authentication

- `POST /auth/signup` - Register a new user
- `POST /auth/login` - User login (returns JWT tokens)
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout (invalidates refresh token)
- `GET /auth/profile` - Get current user profile

### Users

- `GET /users/profile` - Get current user profile
- `GET /users/:id` - Get user by ID

### Reservations

- `POST /reservations` - Create a new reservation
- `GET /reservations` - Get all reservations for current user
- `GET /reservations/:id` - Get reservation by ID
- `PATCH /reservations/:id/status/:status` - Update reservation status
- `DELETE /reservations/:id` - Delete a reservation

## API Testing with Postman

A Postman collection is included in the root of the project (`PIMC-Backend-API.postman_collection.json`). 

To use it:
1. Import the collection in Postman
2. Set the `baseUrl` variable to your API endpoint (default: http://localhost:3000)
3. Use the Authentication endpoints to get access and refresh tokens
4. The collection will automatically store tokens from login responses for use in other requests

### Testing flow:
1. Use the **Signup** endpoint to create a new user
2. Use the **Login** endpoint to get access and refresh tokens
3. Test the authenticated endpoints using the stored tokens
4. Use the **Refresh Token** endpoint when the access token expires

## License

This project is licensed under the MIT License.
