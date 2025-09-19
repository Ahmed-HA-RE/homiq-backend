import express from 'express';
import { registerUser } from '../controllers/auth.js';

const router = express.Router();

//@route        POST /api/auth/register
//@description  Register new user
//@access       Public

router.post('/register', registerUser);

export default router;
