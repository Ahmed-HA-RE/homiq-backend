import express from 'express';
import { getProjects, getProject } from '../controllers/projects.js';

const router = express.Router();

//@route        GET /api/projects
//@description  Get all the projects
//@access       Public
router.get('/', getProjects);

//@route        GET /api/projects/:id
//@description  Get single project
//@access       Public
router.get('/:id', getProject);

export default router;
