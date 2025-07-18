# 🎉 Event Management System

A comprehensive **backend system** for managing events with user authentication, role-based access control, and complete CRUD operations. Built with **Node.js**, **Express.js**, and **MongoDB**.



## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Environment Setup](#-environment-setup)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Security Features](#-security-features)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🔐 Authentication & Authorization
- **User Registration** with input validation
- **JWT-based Authentication** with secure token management
- **Role-based Access Control** (User/Admin)
- **Password Hashing** using bcryptjs
- **Profile Management** for users

### 📅 Event Management
- **Create Events** with comprehensive details
- **Update/Delete Events** by organizers or admins
- **Event Approval System** for administrators
- **Advanced Filtering** by date, location, category, price
- **Search Functionality** across title, description, and tags
- **Capacity Management** with real-time validation

### 🎟️ Registration System
- **Event Registration** with capacity validation
- **Registration Cancellation** with automatic capacity updates
- **View User Registrations** with filtering options
- **Event Registration Management** for organizers
- **Transaction-safe Operations** using MongoDB sessions

### 👨‍💼 Admin Features
- **Event Approval/Rejection** workflow
- **User Management** and role assignment
- **Dashboard Statistics** with key metrics
- **User Deactivation** capabilities
- **Pending Events Overview**

### 🛡️ Security & Performance
- **Rate Limiting** to prevent API abuse
- **Input Validation** using express-validator
- **CORS Protection** with configurable origins
- **Helmet Security Headers**
- **Database Indexing** for optimal performance
- **Error Handling** with detailed logging

## 🛠️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

### Authentication & Security
- **JWT (jsonwebtoken)** - Token-based authentication
- **bcryptjs** - Password hashing
- **Helmet** - Security headers
- **express-rate-limit** - API rate limiting
- **CORS** - Cross-origin resource sharing

### Validation & Utilities
- **express-validator** - Input validation
- **Joi** - Schema validation
- **dotenv** - Environment variable management

### Development Tools
- **Nodemon** - Development server
- **Jest** - Testing framework
- **Supertest** - HTTP assertion library

## 📁 Project Structure

```
event-management-system/
├── 📄 package.json
├── 📄 .env
├── 📄 .gitignore
├── 📄 server.js
├── 📄 README.md
├── 📂 config/
│   └── 📄 database.js
├── 📂 models/
│   ├── 📄 User.js
│   ├── 📄 Event.js
│   └── 📄 Registration.js
├── 📂 middleware/
│   ├── 📄 auth.js
│   └── 📄 validation.js
├── 📂 routes/
│   ├── 📄 auth.js
│   ├── 📄 events.js
│   ├── 📄 registrations.js
│   └── 📄 admin.js
├── 📂 controllers/
│   ├── 📄 authController.js
│   ├── 📄 eventController.js
│   ├── 📄 registrationController.js
│   └── 📄 adminController.js
└── 📂 utils/
    ├── 📄 helpers.js
    └── 📄 constants.js
```

## 🚀 Installation

### Prerequisites
- **Node.js** (v14 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn**

### Clone Repository
```bash
git clone https://github.com/yourusername/event-management-system.git
cd event-management-system
```

### Install Dependencies
```bash
npm install
```

### Install Dev Dependencies
```bash
npm install --save-dev nodemon jest supertest
```

## ⚙️ Environment Setup

Create a `.env` file in the root directory:

```env
# Server Configuration
NODE_ENV=development
PORT=3000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/eventmanagement

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# Security Configuration
BCRYPT_SALT_ROUNDS=12

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS Configuration
FRONTEND_URL=http://localhost:3000



### Start MongoDB
```bash
# macOS (using Homebrew)
brew services start mongodb/brew/mongodb-community

# Ubuntu/Debian
sudo systemctl start mongod

# Windows
net start MongoDB
```

### Run Application
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3000`

## 📖 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "Password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password123"
}
```

#### Get User Profile
```http
GET /api/auth/profile
Authorization: Bearer <your-jwt-token>
```

#### Update User Profile
```http
PUT /api/auth/profile
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "firstName": "John Updated",
  "lastName": "Doe Updated",
  "phone": "+1234567890"
}
```

### Event Endpoints

#### Get All Events
```http
GET /api/events
```

#### Get Events with Filtering
```http
GET /api/events?category=conference&location=Downtown&startDate=2025-08-01&endDate=2025-12-31
```

#### Search Events
```http
GET /api/events?search=javascript&page=1&limit=10
```

#### Get Single Event
```http
GET /api/events/:id
```

#### Create Event
```http
POST /api/events
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "title": "Tech Conference 2025",
  "description": "Annual technology conference",
  "date": "2025-08-15",
  "time": "09:00",
  "location": "Convention Center",
  "capacity": 100,
  "category": "conference",
  "price": 50,
  "tags": ["technology", "networking"],
  "isVirtual": false
}
```

#### Update Event
```http
PUT /api/events/:id
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "title": "Updated Event Title",
  "capacity": 150
}
```

#### Delete Event
```http
DELETE /api/events/:id
Authorization: Bearer <your-jwt-token>
```

#### Get My Events
```http
GET /api/events/my/events
Authorization: Bearer <your-jwt-token>
```

### Registration Endpoints

#### Register for Event
```http
POST /api/registrations/events/:id/register
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "notes": "Looking forward to this event!"
}
```

#### Cancel Registration
```http
PUT /api/registrations/:registrationId/cancel
Authorization: Bearer <your-jwt-token>
```

#### Get My Registrations
```http
GET /api/registrations/my?status=active&page=1&limit=10
Authorization: Bearer <your-jwt-token>
```

#### Get Event Registrations (Organizers Only)
```http
GET /api/registrations/events/:id
Authorization: Bearer <your-jwt-token>
```

### Admin Endpoints

#### Get Dashboard Statistics
```http
GET /api/admin/dashboard
Authorization: Bearer <admin-jwt-token>
```

#### Get Pending Events
```http
GET /api/admin/events/pending
Authorization: Bearer <admin-jwt-token>
```

#### Approve Event
```http
PUT /api/admin/events/:id/approve
Authorization: Bearer <admin-jwt-token>
```

#### Reject Event
```http
PUT /api/admin/events/:id/reject
Authorization: Bearer <admin-jwt-token>
Content-Type: application/json

{
  "reason": "Event does not meet guidelines"
}
```

#### Get All Users
```http
GET /api/admin/users?role=user&isActive=true
Authorization: Bearer <admin-jwt-token>
```

#### Update User Role
```http
PUT /api/admin/users/:userId/role
Authorization: Bearer <admin-jwt-token>
Content-Type: application/json

{
  "role": "admin"
}
```

#### Deactivate User
```http
PUT /api/admin/users/:userId/deactivate
Authorization: Bearer <admin-jwt-token>
```

### Response Format

#### Success Response
```json
{
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

#### Error Response
```json
{
  "error": "Error message",
  "details": [
    // Validation error details
  ]
}
```

## 🧪 Testing

### API Testing with cURL

#### Health Check
```bash
curl -X GET http://localhost:3000/api/health
```

#### Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "TestPass123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

#### Create Event
```bash
curl -X POST http://localhost:3000/api/events \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Event",
    "description": "Test event description",
    "date": "2025-08-01",
    "time": "15:00",
    "location": "Test Location",
    "capacity": 50,
    "category": "workshop",
    "price": 25
  }'
```

### Automated Testing Script

Create `test_api.sh`:
```bash
#!/bin/bash
BASE_URL="http://localhost:3000/api"

echo "🚀 Starting API Tests..."

# Health Check
echo "1. Health Check"
curl -s "$BASE_URL/health"

# Register User
echo "2. User Registration"
RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "autotest",
    "email": "auto@test.com",
    "password": "AutoTest123",
    "firstName": "Auto",
    "lastName": "Test"
  }')

# Extract token
TOKEN=$(echo $RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

# Create Event
echo "3. Create Event"
curl -s -X POST "$BASE_URL/events" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Automated Test Event",
    "description": "Event created by automated test",
    "date": "2025-09-01",
    "time": "14:00",
    "location": "Automated Test Location",
    "capacity": 100,
    "category": "seminar",
    "price": 0
  }'

echo "✅ Tests completed!"
```

Run tests:
```bash
chmod +x test_api.sh
./test_api.sh
```

## 🛡️ Security Features

### Authentication Security
- **JWT Tokens** with configurable expiration
- **Password Hashing** using bcrypt with salt rounds
- **Token Validation** on protected routes
- **Role-based Authorization** for admin functions

### API Security
- **Rate Limiting** (100 requests per 15 minutes)
- **CORS Protection** with origin validation
- **Helmet Security Headers** (XSS, CSRF protection)
- **Input Validation** using express-validator
- **SQL Injection Prevention** through Mongoose ORM

### Data Security
- **Environment Variables** for sensitive data
- **Password Complexity** requirements
- **Data Sanitization** on all inputs
- **Error Message Sanitization** (no sensitive data exposure)

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=80
MONGODB_URI=mongodb://your-production-db-url
JWT_SECRET=your-production-secret-key
FRONTEND_URL=https://your-frontend-domain.com
```

### PM2 Deployment
```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start server.js --name "event-management"

# Save PM2 configuration
pm2 save
pm2 startup
```

### Docker Deployment
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 📊 Database Schema

### User Model
```javascript
{
  username: String (unique, required),
  email: String (unique, required),
  password: String (hashed, required),
  firstName: String (required),
  lastName: String (required),
  role: String (enum: ['user', 'admin']),
  isActive: Boolean (default: true),
  phone: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

### Event Model
```javascript
{
  title: String (required),
  description: String (required),
  date: Date (required, future),
  time: String (required),
  location: String (required),
  capacity: Number (required, positive),
  currentRegistrations: Number (default: 0),
  organizer: ObjectId (ref: User),
  status: String (enum: ['pending', 'approved', 'rejected']),
  category: String (enum: categories),
  price: Number (default: 0),
  tags: [String],
  isVirtual: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Registration Model
```javascript
{
  user: ObjectId (ref: User),
  event: ObjectId (ref: Event),
  registrationDate: Date,
  status: String (enum: ['active', 'cancelled']),
  paymentStatus: String (enum: payment statuses),
  notes: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Use **ESLint** for code linting
- Follow **JavaScript Standard Style**
- Add **JSDoc comments** for functions
- Write **unit tests** for new features

### Commit Convention
```
feat: add new feature
fix: bug fix
docs: documentation update
style: formatting changes
refactor: code refactoring
test: adding tests
chore: maintenance tasks
```

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@kalyan021004](https://github.com/kalyan021004)
- Email: kalyan021004@gmail.com
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/kalyan021004)

## 🙏 Acknowledgments

- **Express.js** community for the excellent framework
- **MongoDB** for the flexible database solution
- **JWT** for secure authentication
- **Open Source Community** for amazing packages



**⭐ Star this repository if it helped you!**

Built with ❤️ using Node.js and Express.js
