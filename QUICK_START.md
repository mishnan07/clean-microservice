# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Option 1: Automated Setup (Recommended)
```bash
# Run the automated setup script
start-services.bat
```

### Option 2: Manual Setup

1. **Start Infrastructure**
```bash
docker-compose up -d
```

2. **Install Dependencies**
```bash
npm run install-all
```

3. **Seed Admin User**
```bash
npm run seed-admin
```

4. **Start Services**
```bash
# Terminal 1
npm run dev-user

# Terminal 2  
npm run dev-admin
```

5. **Test the Setup**
```bash
npm run test-flow
```

## 🔗 Service URLs
- **User Service**: http://localhost:3001
- **Admin Service**: http://localhost:3002
- **RabbitMQ Management**: http://localhost:15672 (admin/password)

## 🔑 Default Credentials
- **Admin**: admin@example.com / admin123

## 📝 Example Flow

1. **Admin creates product**:
```bash
curl -X POST http://localhost:3002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

# Use the token from above
curl -X POST http://localhost:3002/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name":"iPhone","description":"Latest iPhone","price":999,"category":"Electronics"}'
```

2. **User registers and gets products**:
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"user123","name":"Test User"}'

curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"user123"}'

# Use the user token
curl -X GET http://localhost:3001/api/products \
  -H "Authorization: Bearer USER_TOKEN"
```

## 🏗️ Architecture Highlights

- **Clean Architecture**: Controllers → Use Cases → Repositories → Entities
- **Microservices**: Independent services with separate databases
- **JWT Authentication**: Separate auth for each service
- **RabbitMQ**: Inter-service communication
- **MongoDB**: Separate databases per service

## 🧪 Testing

Use the provided `example-requests.http` file with REST Client extension in VS Code, or run:
```bash
npm run test-flow
```