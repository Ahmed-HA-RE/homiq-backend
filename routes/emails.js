import express from 'express';
import { contactForm } from '../controllers/contact-us.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

//@route          POST  /email/contact-us
//@decription     To send form contact data
//@access         Public
router.post('/contact', protect, contactForm);

export default router;
