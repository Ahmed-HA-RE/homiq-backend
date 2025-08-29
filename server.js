import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import errorHandler from './middleware/errorHandler.js';
import logger from './middleware/logger.js';

dotenv.config();
const PORT = process.env.PORT || 8000;

const app = express();

// Middleware
app.use(cors(['http://localhost:3000']));
app.use(express.json());

app.use(logger);

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
