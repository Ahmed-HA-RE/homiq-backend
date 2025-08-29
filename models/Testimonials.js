import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  image: { type: String, required: true },
  alt: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  text: { type: String, required: true },
});

const Testimonial = mongoose.model('Testimonial', testimonialSchema);
export default Testimonial;
