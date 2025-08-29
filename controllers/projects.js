import Project from '../models/Projects.js';

//@route        GET /api/projects
//@description  Get all the projects
//@access       Public
export const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find();

    if (projects.length === 0) {
      const err = new Error('No projects been found');
      err.status = 404;
      throw err;
    }

    res.status(200).json(projects);
  } catch (err) {
    next(err);
  }
};
