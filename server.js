import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import errorHandler from './middleware/errorHandler.js';
import logger from './middleware/logger.js';
import propertiesRoute from './routes/properties.js';
import testimonialsRoute from './routes/testimonials.js';
import agentsRoute from './routes/agents.js';
import emailRoutes from './routes/emails.js';
import connectDB from './config/database.js';
import path from 'path';

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

dotenv.config();
const PORT = process.env.PORT || 8000;

const app = express();
connectDB();

app.set('view engine', 'ejs');

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(logger);

// Routes
app.use('/api/properties', propertiesRoute);
app.use('/api/agents', agentsRoute);
app.use('/api/testimonials', testimonialsRoute);
app.use('/emails', emailRoutes);

// Static files
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));
app.use(express.static(path.join(__dirname, 'public')));

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
