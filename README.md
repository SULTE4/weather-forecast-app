# 🌦️ Weather Forecast Application

A full-stack weather forecast web application built with Node.js, Express, MongoDB, and OpenWeatherMap API. Users can register, login, search for weather information, and save their favorite locations.

## 📋 Project Overview

This project is a complete weather forecast website that allows users to:
- Register and login with secure session-based authentication
- Search current weather conditions for any city worldwide
- View detailed weather information (temperature, humidity, wind speed, etc.)
- Save favorite locations for quick access
- Manage saved locations (view, update, delete)
- Access 5-day weather forecasts

## 🛠️ Technologies Used

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **bcryptjs** - Password hashing
- **express-session** - Session management
- **axios** - HTTP client for API requests

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling with gradient design
- **Vanilla JavaScript** - Dynamic functionality

### External API
- **OpenWeatherMap API** - Real-time weather data

## 📁 Project Structure

```
weather-forecast-app/
├── config/
│   └── db.js                 # Database configuration
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
├── server.js                # Main server file
└── README.md                # Project documentation
```

## 🚀 Setup and Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- OpenWeatherMap API key

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
   SESSION_SECRET=your_secure_session_secret_key
   WEATHER_API_KEY=your_openweathermap_api_key
   NODE_ENV=development
   ```

4. **Get OpenWeatherMap API Key**
   - Sign up at [OpenWeatherMap](https://openweathermap.org/api)
   - Get your free API key from the dashboard
   - Add it to your `.env` file

5. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

6. **Run the application**
   ```bash
   # Production mode
   npm start
   
   # Development mode (with nodemon)
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
| POST | `/api/auth/register` | Register a new user | Public |
| POST | `/api/auth/login` | Authenticate user | Public |
| POST | `/api/auth/logout` | Logout current user | Public |

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

#### Get User Profile
**GET** `/api/users/profile`

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

### Location Routes (Private)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/locations` | Create a new location | Private |
| GET | `/api/locations` | Get all user locations | Private |
| GET | `/api/locations/:id` | Get a specific location | Private |
| PUT | `/api/locations/:id` | Update a location | Private |
| DELETE | `/api/locations/:id` | Delete a location | Private |

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

### Weather Routes (Private)

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
    // ... more forecast items
  ]
}
```

### Error Responses

All endpoints return appropriate HTTP status codes:

- **400 Bad Request** - Invalid input data
- **401 Unauthorized** - Not authenticated
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

- **Password Hashing**: bcryptjs with salt rounds of 12
- **Session Management**: express-session with httpOnly cookies
- **Email Validation**: Regex pattern validation
- **Protected Routes**: Session-based authentication middleware

## 🌐 Deployment

The application can be deployed to platforms like:

### Render
1. Create a new Web Service
2. Connect your GitHub repository
3. Add environment variables
4. Deploy

### Railway
1. Create a new project
2. Connect your GitHub repository
3. Add environment variables
4. Deploy automatically

### Environment Variables for Deployment
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
SESSION_SECRET=your_secure_secret
WEATHER_API_KEY=your_api_key
NODE_ENV=production
```

## 📝 Features

✅ User registration and authentication
✅ Session-based security
✅ Password hashing with bcryptjs
✅ Real-time weather data from OpenWeatherMap API
✅ Save and manage favorite locations
✅ Responsive design
✅ Error handling and validation
✅ RESTful API architecture
✅ MongoDB database integration
✅ Clean and modular code structure

## 🎯 Project Requirements Met

| Requirement | Points | Status |
|-------------|--------|--------|
| Project Setup | 10 | ✅ Complete |
| Database & Models | 10 | ✅ Complete |
| API Endpoints & Routing | 20 | ✅ Complete |
| Authentication & Security | 10 | ✅ Complete |
| Validation & Error Handling | 5 | ✅ Complete |
| Deployment | 10 | 🔄 Ready |
| Defence | 35 | 📝 Pending |

**Total**: 65/100 points (implementation complete)

## 🧪 Testing the API

You can test the API using tools like Postman or curl:

```bash
# Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}' \
  -c cookies.txt

# Get weather (with session)
curl -X GET "http://localhost:5000/api/weather/current?city=London" \
  -b cookies.txt
```

## 👨‍💻 Author

**Sultanbek**
- GitHub: [@SULTE4](https://github.com/SULTE4)
- Location: Astana, Kazakhstan

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- OpenWeatherMap for providing the weather API
- MongoDB for the database
- Express.js community for excellent documentation

---

**Note**: This project was created as a final project for a Node.js and Express.js course. It demonstrates proficiency in full-stack development, API integration, authentication, and database management.