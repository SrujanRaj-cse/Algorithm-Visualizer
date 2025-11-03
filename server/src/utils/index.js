require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 8080;

const mongoose= require('mongoose');
const apiRoutes = require('../routes');
// auth route
const authRoute = require('../routes/auth');

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
 // Cross Origin Resource Sharing
app.use(express.json());

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || process.env.DB || '';
if(!MONGO_URI) {
  console.error('Error: MONGO_URI is not set. Please add it to .env');
  process.exit(1);
}

// MongoDB connection with proper error handling
async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB is Connected...');
    
    // Connection event handlers
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
}

// mount existing api routes
app.use('/api', apiRoutes); // existing routes
// mount auth routes
app.use('/api/auth', authRoute);
// mount submission routes
const submissionRoute = require('../routes/submissions');
app.use('/api/submissions', submissionRoute);

// Start server after database connection
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is Running on "+PORT);
  });
}).catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
