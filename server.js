import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import errorHandler from './middleware/errorHandler.js';
import logger from './middleware/logger.js';
import propertiesRoute from './routes/properties.js';
import testimonialsRoute from './routes/testimonials.js';
import agentsRoute from './routes/agents.js';
import emailRoutes from './routes/emails.js';
import authRoutes from './routes/auth.js';
import connectDB from './config/database.js';

dotenv.config();
const PORT = process.env.PORT || 8000;

const app = express();
connectDB();

app.set('view engine', 'ejs');
app.set('query parser', 'extended');

// Middleware
app.use(
  cors({
    origin: ['http://localhost:3000', 'https://homiq.ahmedrehandev.net'],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(logger);

// Routes
app.use('/api/properties', propertiesRoute);
app.use('/api/agents', agentsRoute);
app.use('/api/testimonials', testimonialsRoute);
app.use('/api/auth', authRoutes);
app.use('/api/email', emailRoutes);

// 404 handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use(errorHandler);

// Start server
app.listen(PORT, console.log(`Server is running on port: ${PORT}`));
