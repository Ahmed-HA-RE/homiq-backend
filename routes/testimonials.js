import express from 'express';
import { getTestimonials } from '../controllers/testimonial.js';

const router = express.Router();

//@route        GET /api/projects
//@description  Get all the projects
//@access       Public
router.get('/', getTestimonials);

export default router;
