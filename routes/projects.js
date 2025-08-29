import express from 'express';
import { getProjects } from '../controllers/projects.js';

const router = express.Router();

//@route        GET /api/projects
//@description  Get all the projects
//@access       Public
router.get('/', getProjects);

export default router;
