require('dotenv').config();

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0'; // Listen on all interfaces for Railway
const JWT_SECRET = process.env.JWT_SECRET;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

const bcrypt = require('bcryptjs');
const saltRounds = 12;
const jwt = require('jsonwebtoken');

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { connectDB } = require('./config/db');
const { User } = require('./models/User');
const { Location } = require('./models/Location');
const requireAuth = require('./middleware/auth');
const { validateRegister, validateLogin, validateLocation } = require('./middleware/validation');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

let db;
let usercollection;
let locationcollection;

// Helper functions
async function hashPassword(password) {
    try{
        const hashed = await bcrypt.hash(password, saltRounds);
        console.log('password hashed successfully');
        return hashed;
    } catch(err){
        console.log('error hashing', err);
        throw err;
    }
}

async function comparePass(password, hashed) {
    try {
        const isMatch = await bcrypt.compare(password, hashed);
        console.log(isMatch ? 'Passwords matched' : 'Passwords unmatched');
        return isMatch;
    } catch (err) {
        console.error('Error comparing passwords:', err);
        throw err;
    }
}

// Generate JWT token
function generateToken(userId) {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// ==================== AUTH ROUTES (Public) ====================

// Register
app.post('/api/auth/register', validateRegister, async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!re.test(email)){
            return res.status(400).json({ error: 'incorrect email form' });
        }

        const existing = await usercollection.findOne({ email });
        if (existing) return res.status(409).json({ error: 'Email exists' });

        const hashed = await hashPassword(password);
        const newUser = new User({ name, email, password: hashed });
        const saved = await newUser.save();

        const token = generateToken(saved._id);
        
        res.status(201).json({ 
            message: 'User registered successfully',
            token,
            user: { id: saved._id, name: saved.name, email: saved.email }
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Login
app.post('/api/auth/login', validateLogin, async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user || !(await comparePass(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = generateToken(user._id);
        
        res.json({ 
            message: 'Logged in',
            token,
            user: { id: user._id, name: user.name, email } 
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ==================== USER ROUTES (Private) ====================

// Get profile
app.get('/api/users/profile', requireAuth, async (req, res) => {
    try{
        const user = await User.findById(req.userId).select('-password');
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch(err){
        res.status(400).json({ error: err.message });
    }
});

// Update profile
app.put('/api/users/profile', requireAuth, async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userId = req.userId;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        if (name) user.name = name;
        if (email) user.email = email;
        if (password) {
            user.password = await hashPassword(password);
        }

        await user.save();
        res.json({
            message: 'Profile updated successfully',
            user: { id: user._id, name: user.name, email: user.email }
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ==================== LOCATION ROUTES (Private) ====================

// Create location
app.post('/api/locations', requireAuth, validateLocation, async (req, res) => {
    try {
        const { city, country, latitude, longitude, nickname, isFavorite } = req.body;
        const userId = req.userId;

        const location = new Location({
            userId,
            city,
            country,
            latitude,
            longitude,
            nickname,
            isFavorite
        });

        const saved = await location.save();
        res.status(201).json({
            message: 'Location added successfully',
            location: saved
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all locations
app.get('/api/locations', requireAuth, async (req, res) => {
    try {
        const userId = req.userId;
        const locations = await Location.find({ userId }).sort({ createdAt: -1 });
        res.json({
            count: locations.length,
            locations
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get single location
app.get('/api/locations/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const location = await Location.findOne({ _id: id, userId });
        if (!location) return res.status(404).json({ error: 'Location not found' });

        res.json(location);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update location
app.put('/api/locations/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        const updates = req.body;

        const location = await Location.findOneAndUpdate(
            { _id: id, userId },
            updates,
            { new: true, runValidators: true }
        );

        if (!location) return res.status(404).json({ error: 'Location not found' });

        res.json({
            message: 'Location updated successfully',
            location
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete location
app.delete('/api/locations/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const location = await Location.findOneAndDelete({ _id: id, userId });
        if (!location) return res.status(404).json({ error: 'Location not found' });

        res.json({ message: 'Location deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ==================== WEATHER ROUTES (Private) ====================

// Get current weather
app.get('/api/weather/current', requireAuth, async (req, res) => {
    try {
        const { city } = req.query;
        if (!city) return res.status(400).json({ error: 'City parameter is required' });

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`;
        const response = await axios.get(url);
        const data = response.data;

        res.json({
            city: data.name,
            country: data.sys.country,
            temperature: data.main.temp,
            feels_like: data.main.feels_like,
            humidity: data.main.humidity,
            pressure: data.main.pressure,
            description: data.weather[0].description,
            icon: data.weather[0].icon,
            wind_speed: data.wind.speed,
            coordinates: {
                latitude: data.coord.lat,
                longitude: data.coord.lon
            }
        });
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return res.status(404).json({ error: 'City not found' });
        }
        res.status(400).json({ error: error.message });
    }
});

// Get 5-day forecast
app.get('/api/weather/forecast', requireAuth, async (req, res) => {
    try {
        const { city } = req.query;
        if (!city) return res.status(400).json({ error: 'City parameter is required' });

        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${WEATHER_API_KEY}&units=metric`;
        const response = await axios.get(url);
        const data = response.data;

        const forecast = data.list.map((item) => ({
            date: item.dt_txt,
            temperature: item.main.temp,
            description: item.weather[0].description,
            icon: item.weather[0].icon,
            humidity: item.main.humidity,
            wind_speed: item.wind.speed
        }));

        res.json({
            city: data.city.name,
            country: data.city.country,
            forecast
        });
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return res.status(404).json({ error: 'City not found' });
        }
        res.status(400).json({ error: error.message });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Weather Forecast API is running' });
});

// Global error handler (must be last)
app.use(errorHandler);

// Start server
async function run() {
    try{
        db = await connectDB();
        usercollection = db.collection('users');
        locationcollection = db.collection('locations');
        
        // Listen on 0.0.0.0 for Railway (not just localhost)
        app.listen(PORT, HOST, () =>{
            console.log(`✅ Server is running on ${HOST}:${PORT}`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🚀 Ready to accept connections!`);
        });
    }catch(err){
        console.error('❌ Failed to start server:', err);
        process.exit(1);
    }
}

run();