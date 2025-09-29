import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

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
    password: { type: String, required: true, minLength: 6, maxLength: 20 },
    role: {
      type: String,
      required: true,
    },
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

export const User = mongoose.model('User', userSchema);
