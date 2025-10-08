import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import slugify from 'slugify';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    password: { type: String, required: true, minLength: 6 },
    role: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      enum: {
        values: ['user', 'admin'],
        message: 'The selected user type is not allowed',
      },
      required: true,
      default: 'user',
    },
    avatar: {
      type: String,
      default:
        'https://res.cloudinary.com/ahmed--dev/image/upload/v1755243182/default_avatar_7541d4c434.webp',
    },
    resetPassToken: String,
    resetPassExpires: Date,
  },
  { timestamps: true }
);

// Hash passwords before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//Check if the password match
userSchema.methods.matchedPassword = async function (existedPassword) {
  return await bcrypt.compare(existedPassword, this.password);
};

// Generate a secure reset password token, hash it, and store it in the database
userSchema.methods.generatePassToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');

  this.resetPassToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.resetPassExpires = Date.now() + 10 * 60 * 1000; //10 minutes expiry
  return resetToken;
};

export const User = mongoose.model('User', userSchema);
