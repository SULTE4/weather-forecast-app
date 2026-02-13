# 🌦️ Weather Forecast Application

A full-stack weather forecast web application built with Node.js, Express, MongoDB, and OpenWeatherMap API. Users can register, login with JWT authentication, search for weather information, and save their favorite locations.

## 📋 Project Overview

This project is a complete weather forecast website that allows users to:
- Register and login with secure JWT token authentication
- Search current weather conditions for any city worldwide
- View detailed weather information (temperature, humidity, wind speed, pressure)
- View 5-day weather forecasts
- Save favorite locations for quick access
- Manage saved locations (view, update, delete)

## 🛠️ Technologies Used

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **bcryptjs** - Password hashing (saltRounds: 12)
- **jsonwebtoken** - JWT authentication
- **Joi** - Data validation
- **axios** - HTTP client for API requests
- **cors** - Cross-origin resource sharing

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling with gradient design
- **Vanilla JavaScript** - Dynamic functionality

### External API
- **OpenWeatherMap API** - Real-time weather data and forecasts

## 📁 Project Structure

```
weather-forecast-app/
├── config/
│   └── db.js                 # Database configuration
├── middleware/
│   ├── auth.js              # JWT authentication middleware
│   ├── validation.js        # Joi validation middleware
│   └── errorHandler.js      # Global error handler
├── models/
│   ├── User.js              # User schema
│   └── Location.js          # Location schema
├── public/
│   ├── index.html           # Frontend HTML
│   ├── style.css            # Frontend styles
│   └── app.js               # Frontend JavaScript
├── .env.example             # Environment variables template
├── .gitignore               # Git ignore rules
├── package.json             # Project dependencies
├── server.js                # Main server file with all routes
└── README.md                # Project documentation
```

## 🚀 Setup and Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance like MongoDB Atlas)
- OpenWeatherMap API key (free tier available)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/SULTE4/weather-forecast-app.git
   cd weather-forecast-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/weatherDB
   JWT_SECRET=your_secure_jwt_secret_key_here_make_it_long_and_random
   WEATHER_API_KEY=your_openweathermap_api_key
   NODE_ENV=development
   ```

4. **Get OpenWeatherMap API Key**
   - Sign up at [OpenWeatherMap](https://openweathermap.org/api)
   - Get your free API key from the dashboard
   - Add it to your `.env` file as `WEATHER_API_KEY`

5. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   # Or use MongoDB Atlas cloud connection string
   ```

6. **Run the application**
   ```bash
   # Production mode
   npm start
   
   # Development mode (with nodemon auto-reload)
   npm run dev
   ```

7. **Access the application**
   
   Open your browser and navigate to:
   ```
   http://localhost:5000
   ```

## 📚 API Documentation

### Authentication Routes (Public)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register a new user (hashed password) | Public |
| POST | `/api/auth/login` | Authenticate user | Public |

#### Register User
**POST** `/api/auth/register`

```json
// Request Body
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

// Response (201 Created)
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d5ec49f1b2c72b8c8e4f1a",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Login User
**POST** `/api/auth/login`

```json
// Request Body
{
  "email": "john@example.com",
  "password": "password123"
}

// Response (200 OK)
{
  "message": "Logged in",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d5ec49f1b2c72b8c8e4f1a",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### User Routes (Private)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/users/profile` | Get logged-in user profile | Private |
| PUT | `/api/users/profile` | Update user profile | Private |

**Note:** All private endpoints require `Authorization: Bearer <token>` header

#### Get User Profile
**GET** `/api/users/profile`

```bash
# Headers
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

```json
// Response (200 OK)
{
  "_id": "60d5ec49f1b2c72b8c8e4f1a",
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2024-02-08T10:30:00.000Z",
  "updatedAt": "2024-02-08T10:30:00.000Z"
}
```

#### Update User Profile
**PUT** `/api/users/profile`

```json
// Request Body (all fields optional)
{
  "name": "John Smith",
  "email": "johnsmith@example.com",
  "password": "newpassword123"
}

// Response (200 OK)
{
  "message": "Profile updated successfully",
  "user": {
    "id": "60d5ec49f1b2c72b8c8e4f1a",
    "name": "John Smith",
    "email": "johnsmith@example.com"
  }
}
```

### Location Routes (Private - Second Resource)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/locations` | Create a new resource | Private |
| GET | `/api/locations` | Get all user resources | Private |
| GET | `/api/locations/:id` | Get a specific resource | Private |
| PUT | `/api/locations/:id` | Update a resource | Private |
| DELETE | `/api/locations/:id` | Delete a resource | Private |

#### Create Location
**POST** `/api/locations`

```json
// Request Body
{
  "city": "London",
  "country": "GB",
  "latitude": 51.5074,
  "longitude": -0.1278,
  "nickname": "Home",
  "isFavorite": true
}

// Response (201 Created)
{
  "message": "Location added successfully",
  "location": {
    "_id": "60d5ec49f1b2c72b8c8e4f1b",
    "userId": "60d5ec49f1b2c72b8c8e4f1a",
    "city": "London",
    "country": "GB",
    "latitude": 51.5074,
    "longitude": -0.1278,
    "nickname": "Home",
    "isFavorite": true,
    "createdAt": "2024-02-08T10:30:00.000Z",
    "updatedAt": "2024-02-08T10:30:00.000Z"
  }
}
```

#### Get All Locations
**GET** `/api/locations`

```json
// Response (200 OK)
{
  "count": 2,
  "locations": [
    {
      "_id": "60d5ec49f1b2c72b8c8e4f1b",
      "userId": "60d5ec49f1b2c72b8c8e4f1a",
      "city": "London",
      "country": "GB",
      "latitude": 51.5074,
      "longitude": -0.1278,
      "nickname": "Home",
      "isFavorite": true,
      "createdAt": "2024-02-08T10:30:00.000Z",
      "updatedAt": "2024-02-08T10:30:00.000Z"
    }
  ]
}
```

### Weather Routes (Private - External API Integration)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/weather/current?city=CityName` | Get current weather | Private |
| GET | `/api/weather/forecast?city=CityName` | Get 5-day forecast | Private |

#### Get Current Weather
**GET** `/api/weather/current?city=London`

```json
// Response (200 OK)
{
  "city": "London",
  "country": "GB",
  "temperature": 15.5,
  "feels_like": 14.2,
  "humidity": 72,
  "pressure": 1013,
  "description": "partly cloudy",
  "icon": "02d",
  "wind_speed": 5.2,
  "coordinates": {
    "latitude": 51.5074,
    "longitude": -0.1278
  }
}
```

#### Get Weather Forecast
**GET** `/api/weather/forecast?city=London`

```json
// Response (200 OK)
{
  "city": "London",
  "country": "GB",
  "forecast": [
    {
      "date": "2024-02-08 12:00:00",
      "temperature": 15.5,
      "description": "clear sky",
      "icon": "01d",
      "humidity": 65,
      "wind_speed": 4.5
    }
    // ... more forecast items (40 entries for 5 days)
  ]
}
```

### Error Responses

All endpoints return appropriate HTTP status codes:

- **400 Bad Request** - Invalid input data / validation failed
- **401 Unauthorized** - Not authenticated / invalid token
- **404 Not Found** - Resource not found
- **409 Conflict** - Duplicate resource (e.g., email already exists)
- **500 Internal Server Error** - Server error

```json
// Error Response Format
{
  "error": "Error message description"
}
```

## 🔐 Authentication & Security

- **JWT Tokens**: Secure user authentication with 7-day expiration
- **Password Hashing**: bcryptjs with salt rounds of 12
- **Protected Routes**: JWT middleware verifies tokens on all private endpoints
- **Email Validation**: Regex pattern validation + Joi validation
- **Input Validation**: Joi library for all user inputs
- **Error Handling**: Global error handler middleware

## ✅ Validation & Error Handling

### Input Validation (Joi)
- **Registration**: name (3-50 chars), valid email, password (min 6 chars)
- **Login**: valid email, password required
- **Location**: city required, optional fields validated

### Error Handling
- Meaningful error messages (400 for bad requests, 401 for unauthorized)
- Global error-handling middleware
- Mongoose validation errors
- JWT token errors
- Duplicate key errors (409)

## 🧪 Testing the API

### Using cURL:

```bash
# Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'

# Login and save token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Get weather (replace YOUR_TOKEN with actual token)
curl -X GET "http://localhost:5000/api/weather/current?city=London" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Save location
curl -X POST http://localhost:5000/api/locations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"city":"London","country":"GB"}'
```

### Using Postman:
1. Import the endpoints
2. Set Authorization type to "Bearer Token"
3. Add token from login response
4. Test all endpoints

## 👨‍💻 Author
[@SULTE4](https://github.com/SULTE4)

## 📄 License

This project is licensed under the MIT License.
