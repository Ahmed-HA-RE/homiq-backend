import Testimonials from '../models/Testimonials.js';

//@route        GET /api/testimonials
//@description  Get all the testimonials
//@access       Public
export const getTestimonials = async (req, res, next) => {
  try {
    const testimonial = await Testimonials.find();

    if (testimonial.length === 0) {
      const err = new Error('No testimonial been found');
      err.status = 404;
      throw err;
    }

    res.status(200).json(testimonial);
  } catch (err) {
    next(err);
  }
};
