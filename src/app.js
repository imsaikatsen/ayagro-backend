const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./routes/auth.routes');
const categoryRoutes = require('./routes/category.routes');

const app = express();

// Use necessary middlewares
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Auth routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).send('Ayagro Backend is Healthy!');
});

module.exports = app;
