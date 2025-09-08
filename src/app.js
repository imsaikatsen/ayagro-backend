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
const headercardRoutes = require('./routes/headerCard.routes');
const blogRoutes = require('./routes/blog.routes');
const workRoutes = require('./routes/work.routes');
const moduleRoutes = require('./routes/module.routes');

const app = express();

// Use necessary middlewares
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'https://test.asole.xyz',
      'https://ayagro.asia',
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

serveWithCORS(
  app,
  path.join(__dirname, 'uploads/header-cards'),
  '/uploads/header-cards'
);

serveWithCORS(app, path.join(__dirname, 'uploads/proofs'), '/uploads/proofs');

serveWithCORS(app, path.join(__dirname, 'uploads/blogs'), '/uploads/blogs');

serveWithCORS(app, path.join(__dirname, 'uploads/works'), '/uploads/works');

// routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/services', serviceRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/order-items', orderItemsRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/checkout', checkoutRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/faqs', faqRoutes);
app.use('/api/v1/header-cards', headercardRoutes);
app.use('/api/v1/blogs', blogRoutes);
app.use('/api/v1/works', workRoutes);
app.use('/api/v1/modules', moduleRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).send('Ayagro Backend is Healthy!');
});

module.exports = app;
