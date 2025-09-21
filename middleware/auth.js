import { jwtVerify } from 'jose';
import dotenv from 'dotenv';
import { User } from '../models/User.js';
import { JWT_SECRET } from '../utils/getJWTSECRET.js';
dotenv.config();

export async function protect(req, res, next) {
  try {
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
      '_id name email'
    );

    if (!user) {
      const err = new Error('Not Authorized');
      err.status = 401;
      throw err;
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.code === 'ERR_JWT_EXPIRED') {
      const err = new Error('Your session has expired. Please log in again.');
      err.status = 401;
      next(err);
    }

    if (error.code === 'ERR_JWT_INVALID') {
      const err = new Error('Invalid session. Please log in again.');
      err.status = 401;
      next(err);
    }
  }
}
