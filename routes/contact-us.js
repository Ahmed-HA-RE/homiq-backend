import express from 'express';
import { contactForm } from '../controllers/contact-us.js';

const router = express.Router();

//@route          POST   /api/contact-us
//@decription     To send form contact data
//@access         Public
router.post('/', contactForm);

export default router;
