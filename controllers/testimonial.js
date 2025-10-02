import { sendEmail } from '../utils/nodemailer.js';
import Testimonial from '../models/Testimonials.js';
import asyncHandler from 'express-async-handler';

//@route        GET /api/testimonials
//@description  Get all the testimonials
//@access       Public
export const getTestimonials = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

//@route          POST  /api/testimonials
//@decription     Create new testimonial
//@access         Public
export const sendTestimonialsForm = asyncHandler(async (req, res, next) => {
  const { feedback } = req.body || {};

  if (!feedback) {
    const err = new Error('Feedback field is required!');
    err.status = 400;
    throw err;
  }

  await sendEmail({
    email: req.user.email,
    path: 'reviews.ejs',
    subject: 'Thank you for sharing your review',
    data: { email: req.user.email, name: req.user.name, feedback },
  });

  const testimonial = await Testimonial.create({
    feedback,
    user: req.user._id,
  });

  res.status(201).json({
    message: 'Form Submitted Successfully',
    testimonial,
  });
});

//@route          DELETE /api/testimonials/:id
//@decription     Delete testimonial
//@access         Private
export const deleteTestimonial = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const testimonial = await Testimonial.findById(id);

  if (!testimonial) {
    const err = new Error('No testimonial found');
    err.status = 404;
    throw err;
  }

  await testimonial.deleteOne();

  res.status(200).json({
    message: 'Deleted Successfully',
  });
});
