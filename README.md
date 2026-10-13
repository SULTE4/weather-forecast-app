<div align="center">

# Weather Forecast App

**Sign up. Type a city. Get the weather now and for the next 5 days, and save the places you check every day.**

A full-stack weather site built with Node.js, Express, MongoDB and the OpenWeatherMap API,<br>
with JWT login, saved locations and a vanilla JavaScript frontend.

![Node.js](https://img.shields.io/badge/Node.js-14%2B-339933?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/auth-JWT-000000?logo=jsonwebtokens&logoColor=white)
![OpenWeatherMap](https://img.shields.io/badge/data-OpenWeatherMap-EB6E4B)
![Railway](https://img.shields.io/badge/deploy-Railway-0B0D0E?logo=railway&logoColor=white)

</div>

---

## Why

A final project for a web development course that covers the whole stack in one small app: a REST API with authentication and validation, a database with per-user data, an external API integration, a static frontend, and a one-click deploy.

## How it works

```
 browser (public/index.html, app.js)
        │  Authorization: Bearer <JWT>
        ▼
 ┌────────────────────────────────────┐
 │ Express (server.js)                │
 │  Joi validation ──► requireAuth    │
 └──────┬──────────────────┬──────────┘
        │                  │
        ▼                  ▼
   MongoDB             OpenWeatherMap
   users, locations    /data/2.5/weather   (current, metric)
                       /data/2.5/forecast  (5 days, every 3 h)
```

```bash
$ curl "localhost:5000/api/weather/current?city=Astana" -H "Authorization: Bearer $TOKEN"
{"city":"Astana","country":"KZ","temperature":-3.2,"feels_like":-8.1,"humidity":74,
 "pressure":1021,"description":"light snow","icon":"13d","wind_speed":5.0,
 "coordinates":{"latitude":51.1801,"longitude":71.446}}
```

## Features

- **Accounts.** Register and log in. Passwords are hashed with bcrypt (12 rounds), and JWTs are valid for 7 days.
- **Current weather.** Temperature, feels-like, humidity, pressure, wind and an icon for any city.
- **5-day forecast.** 40 entries, one every 3 hours.
- **Saved locations.** Full CRUD with a nickname and a favorite flag, and one click from a saved place to its weather or forecast. Each user sees only their own.
- **Validation.** Joi schemas on register, login and locations, with clear 400 / 401 / 404 / 409 errors.
- **Deploy-ready.** Listens on `0.0.0.0` and ships a `Procfile` and `railway.json` for Railway.

## Quick start

**1. You need:** Node.js 14+, MongoDB (local or [Atlas](https://www.mongodb.com/atlas)) and a free [OpenWeatherMap API key](https://openweathermap.org/api).

**2. Install**

```bash
git clone https://github.com/SULTE4/weather-forecast-app.git
cd weather-forecast-app
npm install
cp .env.example .env
```

**3. Fill in `.env`**

| Variable | Example | Meaning |
|---|---|---|
| `PORT` | `5000` | HTTP port |
| `MONGO_URI` | `mongodb://localhost:27017/weatherDB` | MongoDB connection string |
| `JWT_SECRET` | a long random string | Signs the login tokens |
| `WEATHER_API_KEY` | `abc123...` | OpenWeatherMap key |
| `NODE_ENV` | `development` | Environment name |

**4. Run**

```bash
npm run dev    # with nodemon
npm start      # plain node
```

Open <http://localhost:5000>.

## API

All routes except auth and health need `Authorization: Bearer <token>`. Errors look like `{"error": "..."}`.

| Method | Path | Does |
|---|---|---|
| `POST` | `/api/auth/register` | `{name, email, password}` returns a token and user (409 if the email exists) |
| `POST` | `/api/auth/login` | `{email, password}` returns a token and user |
| `GET` | `/api/users/profile` | Your profile, without the password |
| `PUT` | `/api/users/profile` | Update any of `name`, `email`, `password` |
| `POST` | `/api/locations` | `{city, country?, latitude?, longitude?, nickname?, isFavorite?}` |
| `GET` | `/api/locations` | `{count, locations}`, newest first |
| `GET` `PUT` `DELETE` | `/api/locations/:id` | One of your locations |
| `GET` | `/api/weather/current?city=` | Current weather (404 for unknown cities) |
| `GET` | `/api/weather/forecast?city=` | `{city, country, forecast: [{date, temperature, description, icon, humidity, wind_speed}]}` |
| `GET` | `/api/health` | `{"status":"OK"}` |

```bash
TOKEN=$(curl -s -X POST localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}' | node -pe 'JSON.parse(require("fs").readFileSync(0)).token')

curl -X POST localhost:5000/api/locations \
  -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"city":"London","country":"GB","nickname":"Work"}'
```

### Validation rules

| Request | Rules |
|---|---|
| Register | name 3-50 chars, valid email, password 6+ chars |
| Login | valid email, password required |
| Location | `city` required, other fields optional |

## Deploy to Railway

The repo includes `railway.json` (Nixpacks, `npm start`, restart on failure) and a `Procfile`. Create a Railway project from the repo, add the variables from `.env.example`, and use a MongoDB Atlas connection string for `MONGO_URI`.

## Development

```
weather-forecast-app/
├── server.js            # Express app: all routes, auth helpers, startup
├── config/db.js         # MongoDB connection
├── models/              # User, Location (Mongoose)
├── middleware/          # auth (JWT), validation (Joi), errorHandler
├── controllers/, routes/  # the same endpoints split into modules (not mounted yet)
├── public/              # index.html, style.css, app.js
├── Procfile, railway.json
└── .env.example
```

## Roadmap

- [ ] Mount `routes/` and `controllers/` and slim `server.js` down to setup
- [ ] Weather for your current location (browser geolocation)
- [ ] API tests

## Author

[@SULTE4](https://github.com/SULTE4)

## License

MIT, as declared in `package.json`.
