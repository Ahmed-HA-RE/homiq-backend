import { User } from '../models/User.js';
import { signUpSchema } from '../schemas/user.js';
import { generateToken } from '../utils/generateToken.js';

export async function registerUser(req, res, next) {
  try {
    const parsed = signUpSchema.parse(req.body);

    const { name, email, password } = parsed;

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

    res.status(201).json({
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
