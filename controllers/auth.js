import { User } from '../models/User.js';
import { logInSchema, signUpSchema } from '../schemas/user.js';
import { generateToken } from '../utils/generateToken.js';
import { sendEmail } from '../utils/nodemailer.js';

//@route        POST /api/auth/register
//@description  Register new user
//@access       Public
export async function registerUser(req, res, next) {
  try {
    const registerData = signUpSchema.parse(req.body);

    const { name, email, password } = registerData;

    const existedUser = await User.findOne({ email });

    if (existedUser) {
      const err = new Error('User already exists');
      err.status = 400;
      throw err;
    }

    const newUser = await User.create({ name, email, password });

    // Create Tokens
    const payload = { userId: newUser._id.toString() };
    const accessToken = await generateToken(payload, '1m');
    const refreshToken = await generateToken(payload, '30d');

    // Set refresh token in HTTP-ONLY Cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      maxAge: 30 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === 'production',
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
      },
    });
  } catch (error) {
    next(error);
  }
}

//@route        POST /api/auth/login
//@description  Authenicate user
//@access       Private
export async function loginUser(req, res, next) {
  try {
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
      sameSite: 'none',
      maxAge: 30 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === 'production',
    });

    res.status(201).json({
      accessToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
}

//@route        POST /api/auth/logout
//@description  Logout user and clear the cookie
//@access       Private
export async function logoutUser(req, res, next) {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    sameSite: 'none',
    maxAge: 30 * 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === 'production',
  });

  res.status(200).json({ message: 'Logged out successfully' });
}
