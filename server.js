import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const PORT = process.env.PORT || 8000;

const app = express();

// Middleware
app.use(cors(['http://localhost:3000']));
app.use(express.json());

app.listen(PORT, (req, res, next) => {
  console.log(`Server is running on port: ${PORT}`);
});
