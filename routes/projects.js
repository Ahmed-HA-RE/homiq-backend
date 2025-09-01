import express from 'express';
import {
  getProjects,
  getProject,
  getPaginatedProjects,
  getLatestProjects,
} from '../controllers/projects.js';

const router = express.Router();

//@route        GET /api/projects
//@description  Get all the projects
//@access       Public
router.get('/', getProjects);

//@route        GET /api/projects/paginated?limit=&page=
//@description  Get limit project
//@access       Public
router.get('/paginate', getPaginatedProjects);

//@route        GET /api/projects/latest
//@description  Get all the latest projects
//@access       Public
router.get('/latest', getLatestProjects);

//@route        GET /api/projects/:id
//@description  Get single project
//@access       Public
router.get('/:id', getProject);

export default router;
