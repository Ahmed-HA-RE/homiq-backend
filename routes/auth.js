import express from 'express';
import {
  recoverPassword,
  loginUser,
  logoutUser,
  refreshToken,
  registerUser,
  resetPassword,
  updateUserContact,
  updatedUserAvatar,
} from '../controllers/auth.js';
import { protect } from '../middleware/auth.js';
import { getMe } from '../controllers/auth.js';
import upload from '../config/multerConfig.js';

const router = express.Router();

//@route        POST /api/auth/register
//@description  Register new user
//@access       Public
router.post('/register', registerUser);

//@route        POST /api/auth/login
//@description  Authenicate user
//@access       Public
router.post('/login', loginUser);

//@route        POST /api/auth/logout
//@description  Logout user and clear the cookie
//@access       Private
router.post('/logout', logoutUser);

//@route        POST /api/auth/refresh
//@description  Generate new token by the browser
//@access       Private
router.post('/refresh', refreshToken);

//@route        POST /api/auth/recover-password
//@description  Generate token and send is by email
//@access       Private
router.post('/recover-password', recoverPassword);

//@route        PUT /api/auth/reset-password/:resetToken
//@description  Validate the reset token and reset password
//@access       Private
router.put('/reset-password/:resetToken', resetPassword);

//@route        PUT /api/auth/update-contact
//@description  Update user data
//@access       Private
router.put('/update-contact', protect, updateUserContact);

//@route        PUT /api/auth/update-avatar
//@description  Update user's avatar
//@access       Private
router.put(
  '/update-avatar',
  protect,
  upload.single('avatar'),
  updatedUserAvatar
);

//@route        GET /api/auth/me
//@description  Get user data
//@access       Private
router.get('/me', protect, getMe);

export default router;
