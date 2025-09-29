import { User } from '../models/User.js';
import { logInSchema, signUpSchema } from '../schemas/user.js';
import { generateToken } from '../utils/generateToken.js';
import { sendEmail } from '../utils/nodemailer.js';
import { jwtVerify } from 'jose';
import { JWT_SECRET } from '../utils/getJWTSECRET.js';
import asyncHandler from 'express-async-handler';

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

  const htmlTemplate = sendEmail(
    { email, name },
    'welcome.ejs',
    "You're in! Thanks for joining Homiq"
  );

  res.status(201).json({
    htmlTemplate,
    accessToken,
    user: {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
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
  console.log(user);

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
    },
  });
});
