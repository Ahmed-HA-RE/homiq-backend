import express from 'express';
import {
  loginUser,
  logoutUser,
  refreshToken,
  registerUser,
} from '../controllers/auth.js';

const router = express.Router();

//@route        POST /api/auth/register
//@description  Register new user
//@access       Public
router.post('/register', registerUser);

//@route        POST /api/auth/login
//@description  Authenicate user
//@access       Private
router.post('/login', loginUser);

//@route        POST /api/auth/logout
//@description  Logout user and clear the cookie
//@access       Private
router.post('/logout', logoutUser);

//@route        POST /api/auth/refresh
//@description  Generate new token by the browser
//@access       Public
router.post('/refresh', refreshToken);

export default router;
