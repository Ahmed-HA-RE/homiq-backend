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

//@route        GET /api/projects/latest
//@description  Get all the latest projects
//@access       Public
export async function getLatestProjects(req, res, next) {
  try {
    const latestProjects = await Project.find()
      .sort({ createdAt: -1 })
      .limit(3);
    if (!latestProjects) {
      const err = new Error('No Projects Been Found');
      err.status = 404;
      throw err;
    }

    res.status(200).json(latestProjects);
  } catch (error) {
    next(error);
  }
}

//@route        GET /api/projects/paginated?limit=&page=
//@description  Get limit project
//@access       Public
export async function getPaginatedProjects(req, res, next) {
  try {
    const page = +req.query.page;
    const limit = +req.query.limit;

    if (!page || !limit) {
      const err = new Error('page and limit fileds are required');
      err.status = 403;
      throw err;
    }

    const skip = (page - 1) * limit;
    const total = await Project.countDocuments();
    const projects = await Project.find().skip(skip).limit(limit);

    res.status(200).json({
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      projects: projects.length > 0 ? projects : [],
    });
  } catch (error) {
    next(error);
  }
}

//@route        GET /api/projects/:id
//@description  Get single project
//@access       Public
export const getProject = async (req, res, next) => {
  try {
    const id = req.params.id;

    const project = await Project.findOne({ _id: id });

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
