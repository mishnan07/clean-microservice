# Clean Architecture Microservices with Node.js

This project implements a microservices architecture using Clean Architecture principles with Node.js, Express.js, MongoDB, and RabbitMQ.

## Architecture Overview

### Services
- **User Service** (Port 3001): Handles user authentication, profile management, and bank details CRUD
- **Admin Service** (Port 3002): Handles admin authentication and product management

### Technology Stack
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (separate databases for each service)
- **Message Queue**: RabbitMQ
- **Authentication**: JWT (separate secrets for each service)

## Directory Structure

```
├── user-service/
│   ├── src/
│   │   ├── controllers/     # HTTP request handlers
│   │   ├── usecases/        # Business logic
│   │   ├── repositories/    # Data access layer
│   │   ├── entities/        # Database models
│   │   ├── middleware/      # Authentication middleware
│   │   ├── config/          # Database configuration
│   │   ├── routes/          # API routes
│   │   └── seeders/         # Database seeders
│   ├── .env
│   └── package.json
├── admin-service/
│   ├── src/
│   │   ├── controllers/     # HTTP request handlers
│   │   ├── usecases/        # Business logic
│   │   ├── repositories/    # Data access layer
│   │   ├── entities/        # Database models
│   │   ├── middleware/      # Authentication middleware
│   │   ├── config/          # Database configuration
│   │   ├── routes/          # API routes
│   │   └── seeders/         # Database seeders
│   ├── .env
│   └── package.json
└── shared/
    ├── rabbitmq/            # RabbitMQ utilities
    └── utils/               # Shared utilities
```

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- MongoDB
- RabbitMQ

### Installation

1. Install dependencies for each service:
```bash
cd user-service && npm install
cd ../admin-service && npm install
cd ../shared && npm install
```

2. Start MongoDB and RabbitMQ services

3. Seed the admin user:
```bash
cd admin-service && npm run seed
```

4. Start the services:
```bash
# Terminal 1 - User Service
cd user-service && npm run dev

# Terminal 2 - Admin Service
cd admin-service && npm run dev
```

## API Endpoints

### User Service (http://localhost:3001/api)

#### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login

#### User Profile (Protected)
- `GET /profile` - Get user profile
- `POST /bank-details` - Add bank details
- `PUT /bank-details/:id` - Update bank details
- `DELETE /bank-details/:id` - Delete bank details
- `GET /products` - Request products from admin service

### Admin Service (http://localhost:3002/api)

#### Authentication
- `POST /auth/register` - Register new admin
- `POST /auth/login` - Admin login

#### Product Management (Protected)
- `POST /products` - Create product
- `GET /products` - List all products
- `GET /products/:id` - Get product by ID
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product

#### Public
- `GET /public/products` - Public product listing for users

## Authentication

Each service uses separate JWT tokens with different secrets:
- User Service: Uses `JWT_SECRET` from user-service/.env
- Admin Service: Uses `JWT_SECRET` from admin-service/.env

Include the token in requests:
```
Authorization: Bearer <token>
```

## RabbitMQ Integration

Services communicate via RabbitMQ queues:
- `product_request` - User service requests products
- `product_response` - Admin service responds with products
- `product_created` - Admin service notifies about new products
- `product_updated` - Admin service notifies about product updates
- `product_deleted` - Admin service notifies about product deletions

## Example End-to-End Flow

1. **Admin creates a product**:
   - Admin logs in to get JWT token
   - Admin creates product via `POST /api/products`
   - Product is saved to admin database
   - RabbitMQ message sent to `product_created` queue

2. **User requests products**:
   - User logs in to get JWT token
   - User requests products via `GET /api/products`
   - User service sends message to `product_request` queue
   - Admin service responds via `product_response` queue

## Environment Variables

### User Service (.env)
```
PORT=3001
MONGODB_URI=mongodb://localhost:27017/user_service
JWT_SECRET=user_service_jwt_secret_key_2024
RABBITMQ_URL=amqp://localhost
```

### Admin Service (.env)
```
PORT=3002
MONGODB_URI=mongodb://localhost:27017/admin_service
JWT_SECRET=admin_service_jwt_secret_key_2024
RABBITMQ_URL=amqp://localhost
```

## Default Admin Credentials
- Email: admin@example.com
- Password: admin123