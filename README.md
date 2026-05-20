# Mental Health Check-in System

A privacy-first web application built for students and young adults who want a safe place to monitor their mental well-being. Users can log daily moods, view trends over time and connect with others through anonymous community posts. The app also provides quick access to crisis hotlines and with clear disclaimers that it is not a substitute for professional or emergency care.

## Prerequisites
- Node.js 18+
- npm
- MongoDB ([Atlas](https://www.mongodb.com/cloud/atlas) or local)

## Setup
```bash
git clone https://github.com/maxten244/Health-App.git
cd Health-App
npm install
npm install --prefix server
npm install --prefix client
```

Create `server/.env`:
```env
NODE_ENV=development
PORT=5001
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/mental-health-checkin?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
COOKIE_DOMAIN=localhost
```

## Run
```bash
npm run dev
```

