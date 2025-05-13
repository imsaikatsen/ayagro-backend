const app = require('./app'); // Import app from app.js
const connectDB = require('./config/db'); // Import the database connection function

require('dotenv').config();

// Error Handling Middleware
const errorMiddleware = require('./middlewares/error.middleware');
app.use(errorMiddleware.handleErrors);

// Connect to DB and start the server
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });
