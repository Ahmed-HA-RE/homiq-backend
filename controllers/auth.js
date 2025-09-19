import { User } from '../models/User.js';
import { signUpSchema } from '../schemas/user.js';

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

    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    });
  } catch (error) {
    next(error);
  }
}
