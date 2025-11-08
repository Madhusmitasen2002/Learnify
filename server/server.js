// src/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const paymentRoutes = require('./src/controller/routes/payment');

const authRoutes = require('./src/controller/routes/authRoutes');
const courseRoutes = require('./src/controller/routes/courseRoutes');
const lessonRoutes = require('./src/controller/routes/lessonRoutes');
const enrollmentRoutes = require('./src/controller/routes/enrollmentRoutes');

const app = express();
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'] // <-- add this
}));

app.use(express.json({ limit: '5mb' }));
const path = require('path');

// Serve uploaded videos or static media files
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:5173');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Range, Content-Type, Authorization');
    res.setHeader('Accept-Ranges', 'bytes');
  }
}));

app.use('/auth', authRoutes);
app.use('/courses', courseRoutes);
app.use('/lessons', lessonRoutes);
app.use('/enroll', enrollmentRoutes);
app.use('/payment', paymentRoutes);
app.get('/', (req, res) => res.json({ message: 'API running' }));

const PORT = process.env.PORT || 5000;
console.log("CORS allowing origin:", process.env.FRONTEND_URL);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
