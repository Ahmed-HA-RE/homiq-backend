import { sendEmail } from '../utils/nodemailer.js';
import Testimonial from '../models/Testimonials.js';

//@route        GET /api/testimonials
//@description  Get all the testimonials
//@access       Public
export const getTestimonials = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.find();

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

//@route          POST  /api/testimonials
//@decription     Create new testimonial
//@access         Public
export const sendTestimonialsForm = async (req, res, next) => {
  try {
    const { role, feedback } = req.body || {};

    if (!role) {
      const err = new Error('Role field is required!');
      err.status = 400;
      throw err;
    }

    if (!feedback) {
      const err = new Error('Feedback field is required!');
      err.status = 400;
      throw err;
    }

    sendEmail(
      { email: req.user.email, name: req.user.name, role, feedback },
      'reviews.ejs',
      'Thank you for sharing your review'
    );

    const testimonial = await Testimonial.create({
      name: req.user.name,
      role,
      feedback,
      user: req.user._id,
    });

    res.status(201).json({
      message: 'Form Submitted Successfully',
      testimonial,
    });
  } catch (error) {
    next(error);
  }
};
