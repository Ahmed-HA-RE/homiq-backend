import { jwtVerify } from 'jose';
import dotenv from 'dotenv';
import { User } from '../models/User.js';
import { JWT_SECRET } from '../utils/getJWTSECRET.js';
import asyncHandler from 'express-async-handler';
dotenv.config();

export const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.includes('Bearer')) {
    const err = new Error('Not Authorized, no token provided');
    err.status = 401;
    throw err;
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    const err = new Error('Not Authorized, no token provided');
    err.status = 401;
    throw err;
  }

  const { payload } = await jwtVerify(token, JWT_SECRET);

  const user = await User.findOne({ _id: payload.userId }).select(
    '_id name email userType slug'
  );

  if (!user) {
    const err = new Error('Not Authorized');
    err.status = 401;
    throw err;
  }

  req.user = user;
  next();
});
