import express from 'express';
import {
  getTestimonials,
  sendTestimonialsForm,
} from '../controllers/testimonial.js';
import { protect } from '../middleware/auth.js';
import advancedResults from '../middleware/advancedResults.js';
import Testimonial from '../models/Testimonials.js';

const router = express.Router();

//@route        GET /api/testimonials
//@description  Get all the testimonials
//@access       Public
router
  .route('/')
  .get(
    advancedResults(Testimonial, {
      path: 'user',
      select: 'name role',
    }),
    getTestimonials
  )
  .post(protect, sendTestimonialsForm); // POST  /api/testimonials

export default router;
