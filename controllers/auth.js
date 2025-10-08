import { User } from '../models/User.js';
import {
  logInSchema,
  resetPasswordSchema,
  signUpSchema,
  userContactInfoSchema,
} from '../schemas/user.js';
import { generateToken } from '../utils/generateToken.js';
import { sendEmail } from '../utils/nodemailer.js';
import { jwtVerify } from 'jose';
import { JWT_SECRET } from '../utils/getJWTSECRET.js';
import asyncHandler from 'express-async-handler';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

//@route        POST /api/auth/register
//@description  Register new user
//@access       Public
export const registerUser = asyncHandler(async (req, res, next) => {
  if (!req.body) {
    const err = new Error('Signup requires name, email, password, and role.');
    err.status = 400;
    throw err;
  }

  const registerData = signUpSchema.parse(req.body);

  const { name, email, password, role } = registerData;

  const existedUser = await User.findOne({ email });

  if (existedUser) {
    const err = new Error('User already exists');
    err.status = 400;
    throw err;
  }

  const newUser = await User.create({ name, email, password, role });

  // Create Tokens
  const payload = { userId: newUser._id.toString() };
  const accessToken = await generateToken(payload, '1m');
  const refreshToken = await generateToken(payload, '30d');

  // Set refresh token in HTTP-ONLY Cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  await sendEmail({
    email,
    subject: 'Welcome to homiq',
    data: { name },
    path: 'welcome.ejs',
  });

  res.status(201).json({
    accessToken,
    user: {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      userType: newUser.userType,
    },
  });
});

//@route        POST /api/auth/login
//@description  Authenicate user
//@access       Private
export const loginUser = asyncHandler(async (req, res, next) => {
  if (!req.body) {
    const err = new Error('Please insert the email and password');
    err.status = 400;
    throw err;
  }

  const loginData = logInSchema.parse(req.body);

  const { email, password } = loginData;

  const user = await User.findOne({ email });

  if (!user) {
    const err = new Error('Invalid Credentials');
    err.status = 401;
    throw err;
  }

  const isMatchPass = await user.matchedPassword(password);

  if (!isMatchPass) {
    const err = new Error('Invalid Credentials');
    err.status = 401;
    throw err;
  }

  // Create Tokens
  const payload = { userId: user._id.toString() };
  const accessToken = await generateToken(payload, '1m');
  const refreshToken = await generateToken(payload, '30d');

  // Set refresh token in HTTP-ONLY Cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    accessToken,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      userType: user.userType,
    },
  });
});

//@route        POST /api/auth/logout
//@description  Logout user and clear the cookie
//@access       Private
export const logoutUser = (req, res, next) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({ message: 'Logged out successfully' });
};

//@route        POST /api/auth/refresh
//@description  Generate new token by the browser
//@access       Public
export const refreshToken = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.refreshToken;
  if (!token) {
    const err = new Error('No refresh token');
    err.status = 401;
    throw err;
  }

  const { payload } = await jwtVerify(token, JWT_SECRET);

  const user = await User.findOne({ _id: payload.userId });
  if (!user) {
    const err = new Error('Invalid Credentials');
    err.status = 401;
    throw err;
  }

  const newAccessToken = await generateToken(
    { userId: user._id.toString() },
    '1m'
  );

  res.status(200).json({
    accessToken: newAccessToken,
    user: {
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      userType: user.userType,
    },
  });
});

//@route        POST /api/auth/recover-password
//@description  Generate token and send is by email
//@access       Private
export const recoverPassword = asyncHandler(async (req, res, next) => {
  if (!req.body || !req.body.email) {
    const err = new Error(
      'Please provide your email that is linked to this account in order to reset your password'
    );
    err.status = 400;
    throw err;
  }

  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    const err = new Error(`No account found with this email`);
    err.status = 404;
    throw err;
  }

  // Generate a reset token
  const resetToken = await user.generatePassToken();

  const resetURL = `${process.env.RESET_PASSWORD_URL}/${resetToken}`;

  await sendEmail({
    path: 'resetpassword.ejs',
    email,
    subject: 'Reset password',
    data: { resetURL },
  });

  user.save();

  res
    .status(201)
    .json({ message: 'Sent successfully. Please check your email.' });
});

//@route        PUT /api/auth/reset-password/:resetToken
//@description  Validate the reset token and reset password
//@access       Private
export const resetPassword = asyncHandler(async (req, res, next) => {
  const { resetToken } = req.params;

  if (!req.body || !req.body.password || !req.body.confirmPassword) {
    const err = new Error(
      'Please provide the new password you’d like to use, and confirm it by entering it again to make sure both match.'
    );
    err.status = 400;
    throw err;
  }

  if (req.body.password !== req.body.confirmPassword) {
    const err = new Error(
      'The passwords do not match. Please make sure both fields are identical.'
    );
    err.status = 400;
    throw err;
  }

  const validatedPassword = resetPasswordSchema.parse(req.body);

  const resetPassToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  const user = await User.findOne({
    resetPassToken,
    resetPassExpires: { $gt: Date.now() },
  });

  if (!user) {
    const err = new Error('Linked has expired. Request a new pasword reset.');
    err.status = 401;
    throw err;
  }

  const payload = { userId: user._id.toString() };

  const accessToken = await generateToken(payload, '1m');
  const refreshToken = await generateToken(payload, '30d');

  // Set refresh token in HTTP-ONLY Cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  user.password = validatedPassword.password;
  user.resetPassToken = undefined;
  user.resetPassExpires = undefined;

  await user.save();

  res.status(200).json({
    accessToken,
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    userType: user.userType,
  });
});

//@route        GET /api/auth/me
//@description  Get user data
//@access       Private
export const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).select(
    'name email avatar userType role'
  );

  if (!user) {
    const err = new Error('No user found');
    err.status = 404;
    throw err;
  }
  res.status(200).json(user);
});

//@route        PUT /api/auth/update-contact
//@description  Update user data
//@access       Private
export const updateUserContact = asyncHandler(async (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    const err = new Error('Please provide the fields you want to update');
    err.status = 400;
    throw err;
  }

  const { email, name, role } = req.body;

  const validatedData = userContactInfoSchema.parse({ email, name, role });

  const user = await User.findByIdAndUpdate(req.user._id, validatedData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    userType: user.userType,
  });
});
