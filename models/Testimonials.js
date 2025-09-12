import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    role: {
      type: String,
      required: true,
    },
    feedback: { type: String, required: true, trim: true },
    status: { type: String, default: 'pending' },
  },
  { timestamps: true }
);

const Testimonial = mongoose.model('Testimonial', testimonialSchema);
export default Testimonial;
