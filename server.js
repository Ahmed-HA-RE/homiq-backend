import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import errorHandler from './middleware/errorHandler.js';
import logger from './middleware/logger.js';
import projectsRoute from './routes/projects.js';
import testimonialsRoute from './routes/testimonials.js';
import agentsRoute from './routes/agents.js';
import connectDB from './config/database.js';
import path from 'path';

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);
console.log(__dirname);

dotenv.config();
const PORT = process.env.PORT || 8000;

const app = express();
connectDB();

// Middleware
app.use(cors(['http://localhost:3000']));
app.use(express.json());

app.use(logger);

// Routes
app.use('/api/projects', projectsRoute);
app.use('/api/agents', agentsRoute);
app.use('/api/testimonials', testimonialsRoute);

app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

// Error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(errorHandler);

app.listen(PORT, (req, res, next) => {
  console.log(`Server is running on port: ${PORT}`);
});
