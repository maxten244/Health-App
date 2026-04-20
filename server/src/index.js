import 'dotenv/config';
import mongoose from 'mongoose';
import http from 'http';
import app from './app.js';
import { initSocket } from './socket.js';

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mental-health-checkin';

const httpServer = http.createServer(app);
initSocket(httpServer);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    httpServer.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
