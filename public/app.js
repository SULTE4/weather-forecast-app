// API Base URL
const API_URL = window.location.origin;

// State Management
let authToken = localStorage.getItem('authToken');
let currentWeatherData = null;
let currentUser = null;

// DOM Elements
const authSection = document.getElementById('authSection');
const appSection = document.getElementById('appSection');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const logoutBtn = document.getElementById('logoutBtn');
const profileBtn = document.getElementById('profileBtn');
const tabBtns = document.querySelectorAll('.tab-btn');
const userName = document.getElementById('userName');
const navUserName = document.getElementById('navUserName');
const citySearch = document.getElementById('citySearch');
const searchBtn = document.getElementById('searchBtn');
const currentWeather = document.getElementById('currentWeather');
const saveLocationBtn = document.getElementById('saveLocationBtn');
const refreshLocationsBtn = document.getElementById('refreshLocationsBtn');
const locationsList = document.getElementById('locationsList');

// Profile Modal Elements
const profileModal = document.getElementById('profileModal');
const closeModal = document.querySelector('.close');
const profileName = document.getElementById('profileName');
const profileEmail = document.getElementById('profileEmail');
const profileCreated = document.getElementById('profileCreated');
const editProfileBtn = document.getElementById('editProfileBtn');
const editProfileForm = document.getElementById('editProfileForm');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const statLocations = document.getElementById('statLocations');

// Initialize App
function init() {
    if (authToken) {
        loadUserProfile();
        showApp();
        loadLocations();
    } else {
        showAuth();
    }
}

// Show/Hide Sections
function showAuth() {
    authSection.style.display = 'flex';
    appSection.style.display = 'none';
    logoutBtn.style.display = 'none';
    profileBtn.style.display = 'none';
}

function showApp() {
    authSection.style.display = 'none';
    appSection.style.display = 'block';
    logoutBtn.style.display = 'block';
    profileBtn.style.display = 'block';
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
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            authToken = data.token;
            localStorage.setItem('authToken', authToken);
            registerForm.reset();
            errorDiv.textContent = '';
            await loadUserProfile();
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
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            authToken = data.token;
            localStorage.setItem('authToken', authToken);
            loginForm.reset();
            errorDiv.textContent = '';
            await loadUserProfile();
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
logoutBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to logout?')) {
        authToken = null;
        currentUser = null;
        localStorage.removeItem('authToken');
        currentWeather.style.display = 'none';
        showAuth();
    }
});

// Load User Profile
async function loadUserProfile() {
    try {
        const response = await fetch(`${API_URL}/api/users/profile`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        if (response.ok) {
            currentUser = await response.json();
            userName.textContent = currentUser.name;
            navUserName.textContent = currentUser.name;
            updateProfileModal();
        } else {
            // Token invalid, logout
            authToken = null;
            localStorage.removeItem('authToken');
            showAuth();
        }
    } catch (error) {
        console.error('Failed to load profile:', error);
    }
}

// Profile Modal Functions
profileBtn.addEventListener('click', () => {
    profileModal.classList.add('active');
    editProfileForm.style.display = 'none';
    editProfileBtn.style.display = 'block';
});

closeModal.addEventListener('click', () => {
    profileModal.classList.remove('active');
});

window.addEventListener('click', (e) => {
    if (e.target === profileModal) {
        profileModal.classList.remove('active');
    }
});

function updateProfileModal() {
    if (!currentUser) return;
    
    profileName.textContent = currentUser.name;
    profileEmail.textContent = currentUser.email;
    profileCreated.textContent = new Date(currentUser.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Edit Profile
editProfileBtn.addEventListener('click', () => {
    editProfileForm.style.display = 'block';
    editProfileBtn.style.display = 'none';
    document.getElementById('editName').value = currentUser.name;
    document.getElementById('editEmail').value = currentUser.email;
    document.getElementById('editPassword').value = '';
});

cancelEditBtn.addEventListener('click', () => {
    editProfileForm.style.display = 'none';
    editProfileBtn.style.display = 'block';
    document.getElementById('editError').textContent = '';
    document.getElementById('editSuccess').textContent = '';
});

editProfileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('editName').value;
    const email = document.getElementById('editEmail').value;
    const password = document.getElementById('editPassword').value;
    const errorDiv = document.getElementById('editError');
    const successDiv = document.getElementById('editSuccess');

    const updateData = {};
    if (name !== currentUser.name) updateData.name = name;
    if (email !== currentUser.email) updateData.email = email;
    if (password) updateData.password = password;

    if (Object.keys(updateData).length === 0) {
        errorDiv.textContent = 'No changes to save';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/api/users/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(updateData)
        });

        const data = await response.json();

        if (response.ok) {
            successDiv.textContent = 'Profile updated successfully!';
            errorDiv.textContent = '';
            await loadUserProfile();
            setTimeout(() => {
                editProfileForm.style.display = 'none';
                editProfileBtn.style.display = 'block';
                successDiv.textContent = '';
            }, 2000);
        } else {
            errorDiv.textContent = data.error || 'Update failed';
            successDiv.textContent = '';
        }
    } catch (error) {
        errorDiv.textContent = 'Network error. Please try again.';
        successDiv.textContent = '';
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
            headers: { 'Authorization': `Bearer ${authToken}` }
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
    document.getElementById('weatherIcon').src = `https://openweathermap.org/img/wn/${data.icon}@4x.png`;
    document.getElementById('weatherTemp').textContent = `${Math.round(data.temperature)}°C`;
    document.getElementById('weatherDesc').textContent = data.description;
    document.getElementById('weatherFeels').textContent = `${Math.round(data.feels_like)}°C`;
    document.getElementById('weatherHumidity').textContent = `${data.humidity}%`;
    document.getElementById('weatherWind').textContent = `${data.wind_speed} m/s`;
    document.getElementById('weatherPressure').textContent = `${data.pressure} hPa`;
    currentWeather.style.display = 'block';
    
    // Scroll to weather display
    currentWeather.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Save Location
saveLocationBtn.addEventListener('click', async () => {
    if (!currentWeatherData) return;

    try {
        const response = await fetch(`${API_URL}/api/locations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                city: currentWeatherData.city,
                country: currentWeatherData.country,
                latitude: currentWeatherData.coordinates.latitude,
                longitude: currentWeatherData.coordinates.longitude
            })
        });

        const data = await response.json();

        if (response.ok) {
            showNotification('Location saved successfully! ✅', 'success');
            loadLocations();
        } else {
            showNotification(data.error || 'Failed to save location', 'error');
        }
    } catch (error) {
        showNotification('Network error. Please try again.', 'error');
    }
});

// Load Locations
refreshLocationsBtn.addEventListener('click', loadLocations);

async function loadLocations() {
    try {
        const response = await fetch(`${API_URL}/api/locations`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        const data = await response.json();

        if (response.ok) {
            displayLocations(data.locations);
            statLocations.textContent = data.count;
        }
    } catch (error) {
        console.error('Failed to load locations:', error);
    }
}

// Display Locations
function displayLocations(locations) {
    if (locations.length === 0) {
        locationsList.innerHTML = '<p style="text-align: center; color: #999; padding: 2rem;">No saved locations yet. Search for a city and save it! 🌍</p>';
        return;
    }

    locationsList.innerHTML = locations.map(location => `
        <div class="location-card">
            <h4>📍 ${location.city}${location.country ? ', ' + location.country : ''}</h4>
            <p><small>📅 Added: ${new Date(location.createdAt).toLocaleDateString()}</small></p>
            ${location.nickname ? `<p><strong>🏷️ ${location.nickname}</strong></p>` : ''}
            ${location.latitude && location.longitude ? `<p><small>🌐 ${location.latitude.toFixed(2)}, ${location.longitude.toFixed(2)}</small></p>` : ''}
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
};

// Delete Location
window.deleteLocation = async (id) => {
    if (!confirm('Are you sure you want to delete this location?')) return;

    try {
        const response = await fetch(`${API_URL}/api/locations/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        if (response.ok) {
            showNotification('Location deleted successfully!', 'success');
            loadLocations();
        } else {
            showNotification('Failed to delete location', 'error');
        }
    } catch (error) {
        showNotification('Network error. Please try again.', 'error');
    }
};

// Notification Helper
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
        color: white;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s;
        font-weight: 600;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize app on page load
init();