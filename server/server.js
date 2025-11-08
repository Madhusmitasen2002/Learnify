// Load environment variables
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

// Import route files
const paymentRoutes = require('./src/controller/routes/payment');
const authRoutes = require('./src/controller/routes/authRoutes');
const courseRoutes = require('./src/controller/routes/courseRoutes');
const lessonRoutes = require('./src/controller/routes/lessonRoutes');
const enrollmentRoutes = require('./src/controller/routes/enrollmentRoutes');

const app = express();

// Security middleware
app.use(helmet());

// Configure CORS (important for frontend <-> backend connection)
const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '5mb' }));

// Serve uploaded/static files
app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'), {
    setHeaders: (res) => {
      res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
      res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
      res.setHeader(
        'Access-Control-Allow-Headers',
        'Range, Content-Type, Authorization'
      );
      res.setHeader('Accept-Ranges', 'bytes');
    },
  })
);

// API routes
app.use('/auth', authRoutes);
app.use('/courses', courseRoutes);
app.use('/lessons', lessonRoutes);
app.use('/enroll', enrollmentRoutes);
app.use('/payment', paymentRoutes);

// Default route
app.get('/', (req, res) => res.json({ message: 'API running successfully' }));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on port ${PORT}\nCORS allowing: ${allowedOrigin}`)
);
