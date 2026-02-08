// API Base URL
const API_URL = window.location.origin;

// State Management
let isLoggedIn = false;
let currentWeatherData = null;

// DOM Elements
const authSection = document.getElementById('authSection');
const appSection = document.getElementById('appSection');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const logoutBtn = document.getElementById('logoutBtn');
const tabBtns = document.querySelectorAll('.tab-btn');
const userName = document.getElementById('userName');
const citySearch = document.getElementById('citySearch');
const searchBtn = document.getElementById('searchBtn');
const currentWeather = document.getElementById('currentWeather');
const saveLocationBtn = document.getElementById('saveLocationBtn');
const refreshLocationsBtn = document.getElementById('refreshLocationsBtn');
const locationsList = document.getElementById('locationsList');

// Initialize App
function init() {
    checkAuth();
}

// Check if user is authenticated
async function checkAuth() {
    try {
        const response = await fetch(`${API_URL}/api/users/profile`, {
            credentials: 'include'
        });

        if (response.ok) {
            const user = await response.json();
            userName.textContent = user.name;
            isLoggedIn = true;
            showApp();
            loadLocations();
        } else {
            showAuth();
        }
    } catch (error) {
        showAuth();
    }
}

// Show/Hide Sections
function showAuth() {
    authSection.style.display = 'flex';
    appSection.style.display = 'none';
    logoutBtn.style.display = 'none';
}

function showApp() {
    authSection.style.display = 'none';
    appSection.style.display = 'block';
    logoutBtn.style.display = 'block';
}

// Tab Switching
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        document.querySelectorAll('.auth-form').forEach(form => {
            form.classList.remove('active');
        });
        
        if (tab === 'login') {
            loginForm.classList.add('active');
        } else {
            registerForm.classList.add('active');
        }
    });
});

// Register
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const errorDiv = document.getElementById('registerError');

    try {
        const response = await fetch(`${API_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            isLoggedIn = true;
            userName.textContent = data.user.name;
            registerForm.reset();
            errorDiv.textContent = '';
            showApp();
            loadLocations();
        } else {
            errorDiv.textContent = data.error || 'Registration failed';
        }
    } catch (error) {
        errorDiv.textContent = 'Network error. Please try again.';
    }
});

// Login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errorDiv = document.getElementById('loginError');

    try {
        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            isLoggedIn = true;
            userName.textContent = data.user.name;
            loginForm.reset();
            errorDiv.textContent = '';
            showApp();
            loadLocations();
        } else {
            errorDiv.textContent = data.error || 'Login failed';
        }
    } catch (error) {
        errorDiv.textContent = 'Network error. Please try again.';
    }
});

// Logout
logoutBtn.addEventListener('click', async () => {
    try {
        await fetch(`${API_URL}/api/auth/logout`, {
            method: 'POST',
            credentials: 'include'
        });
        isLoggedIn = false;
        currentWeather.style.display = 'none';
        showAuth();
    } catch (error) {
        console.error('Logout error:', error);
    }
});

// Search Weather
searchBtn.addEventListener('click', searchWeather);
citySearch.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchWeather();
});

async function searchWeather() {
    const city = citySearch.value.trim();
    const errorDiv = document.getElementById('searchError');

    if (!city) {
        errorDiv.textContent = 'Please enter a city name';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/api/weather/current?city=${encodeURIComponent(city)}`, {
            credentials: 'include'
        });

        const data = await response.json();

        if (response.ok) {
            currentWeatherData = data;
            displayWeather(data);
            errorDiv.textContent = '';
        } else {
            errorDiv.textContent = data.error || 'Failed to fetch weather';
            currentWeather.style.display = 'none';
        }
    } catch (error) {
        errorDiv.textContent = 'Network error. Please try again.';
        currentWeather.style.display = 'none';
    }
}

// Display Weather
function displayWeather(data) {
    document.getElementById('weatherCity').textContent = `${data.city}, ${data.country}`;
    document.getElementById('weatherIcon').src = `https://openweathermap.org/img/wn/${data.icon}@2x.png`;
    document.getElementById('weatherTemp').textContent = `${Math.round(data.temperature)}°C`;
    document.getElementById('weatherDesc').textContent = data.description;
    document.getElementById('weatherFeels').textContent = `${Math.round(data.feels_like)}°C`;
    document.getElementById('weatherHumidity').textContent = `${data.humidity}%`;
    document.getElementById('weatherWind').textContent = `${data.wind_speed} m/s`;
    document.getElementById('weatherPressure').textContent = `${data.pressure} hPa`;
    currentWeather.style.display = 'block';
}

// Save Location
saveLocationBtn.addEventListener('click', async () => {
    if (!currentWeatherData) return;

    try {
        const response = await fetch(`${API_URL}/api/locations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                city: currentWeatherData.city,
                country: currentWeatherData.country,
                latitude: currentWeatherData.coordinates.latitude,
                longitude: currentWeatherData.coordinates.longitude
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Location saved successfully!');
            loadLocations();
        } else {
            alert(data.error || 'Failed to save location');
        }
    } catch (error) {
        alert('Network error. Please try again.');
    }
});

// Load Locations
refreshLocationsBtn.addEventListener('click', loadLocations);

async function loadLocations() {
    try {
        const response = await fetch(`${API_URL}/api/locations`, {
            credentials: 'include'
        });

        const data = await response.json();

        if (response.ok) {
            displayLocations(data.locations);
        }
    } catch (error) {
        console.error('Failed to load locations:', error);
    }
}

// Display Locations
function displayLocations(locations) {
    if (locations.length === 0) {
        locationsList.innerHTML = '<p>No saved locations yet. Search for a city and save it!</p>';
        return;
    }

    locationsList.innerHTML = locations.map(location => `
        <div class="location-card">
            <h4>${location.city}${location.country ? ', ' + location.country : ''}</h4>
            <p><small>Added: ${new Date(location.createdAt).toLocaleDateString()}</small></p>
            ${location.nickname ? `<p><strong>${location.nickname}</strong></p>` : ''}
            <div class="location-actions">
                <button class="btn btn-primary" onclick="viewLocationWeather('${location.city}')">View Weather</button>
                <button class="btn btn-danger" onclick="deleteLocation('${location._id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

// View Location Weather
window.viewLocationWeather = async (city) => {
    citySearch.value = city;
    await searchWeather();
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Delete Location
window.deleteLocation = async (id) => {
    if (!confirm('Are you sure you want to delete this location?')) return;

    try {
        const response = await fetch(`${API_URL}/api/locations/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (response.ok) {
            loadLocations();
        } else {
            alert('Failed to delete location');
        }
    } catch (error) {
        alert('Network error. Please try again.');
    }
};

// Initialize app on page load
init();