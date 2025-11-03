# Smart Personal Finance Manager (MERN)

## Overview
A simple Personal Finance Manager built with MERN stack. Users can register/login, add income/expenses, view category-wise charts, and export a simple PDF report.

## What is included
- backend/ (Express + Mongoose)
- frontend/ (React)
- .env.example files for both backend and frontend

## Setup (local) - steps to run
1. Clone or extract the ZIP.
2. Create a MongoDB Atlas cluster (free) and get the connection string.
   - Use your email: sakshamg328@gmail.com when registering for Atlas.
   - Whitelist your IP or set network access to allow your IP (or 0.0.0.0/0 for quick testing).
3. In `backend/.env` set `MONGO_URI` and `JWT_SECRET`.
4. In `frontend/.env` (optional) set `REACT_APP_API_URL` if backend not running on default.

## Run Backend
```bash
cd backend
npm install
# create .env from .env.example and fill values
npm run dev
```

## Run Frontend
```bash
cd frontend
npm install
npm start
```

## Notes
- Replace MONGO_URI with your MongoDB Atlas URI.
- JWT_SECRET must be set in backend/.env for login/register to work.
- If you want, I can also deploy the backend to Render and frontend to Netlify and give you live URLs.
