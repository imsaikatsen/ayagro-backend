const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');

const serveWithCORS = require('./utils/serveStaticWithCORS');

const authRoutes = require('./routes/auth.routes');
const categoryRoutes = require('./routes/category.routes');
const serviceRoutes = require('./routes/service.routes');
const productRoutes = require('./routes/product.route');
const orderRoutes = require('./routes/order.route');
const orderItemsRoutes = require('./routes/order-items.route');
const cartRoutes = require('./routes/cart.route');
const checkoutRoutes = require('./routes/checkout.route');
const profileRoutes = require('./routes/profile.route');
const faqRoutes = require('./routes/faq.route');

const app = express();

// Use necessary middlewares
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://test.asole.xyz',
      'https://ayagro.netlify.app',
    ],
    credentials: true,
  })
);
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

serveWithCORS(
  app,
  path.join(__dirname, 'uploads/products'),
  '/uploads/products'
);
serveWithCORS(
  app,
  path.join(__dirname, 'uploads/categories'),
  '/uploads/categories'
);

serveWithCORS(
  app,
  path.join(__dirname, 'uploads/services'),
  '/uploads/services'
);

serveWithCORS(app, path.join(__dirname, 'uploads/proofs'), '/uploads/proofs');

// routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/order-items', orderItemsRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/faqs', faqRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).send('Ayagro Backend is Healthy!');
});

module.exports = app;
