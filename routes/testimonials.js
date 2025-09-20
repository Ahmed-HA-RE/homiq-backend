import express from 'express';
import {
  getTestimonials,
  sendTestimonialsForm,
} from '../controllers/testimonial.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

//@route        GET /api/testimonials
//@description  Get all the testimonials
//@access       Public
router.get('/', getTestimonials);

//@route          POST  /api/testimonials
//@decription     Create new testimonial
//@access         Public
router.post('/', protect, sendTestimonialsForm);

export default router;
