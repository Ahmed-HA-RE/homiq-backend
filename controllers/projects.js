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
//@route        GET /api/projects/:id
//@description  Get single project
//@access       Public
export const getProject = async (req, res, next) => {
  try {
    const id = req.params.id.toString();

    const project = await Project.findById(id);

    if (!project) {
      const err = new Error('No project been found');
      err.status = 404;
      throw err;
    }

    res.status(200).json(project);
  } catch (err) {
    next(err);
  }
};
