import Agent from '../models/Agents.js';

//@route        GET  /api/agents
//@description  Get all the agents
//access        Public
export async function getAgents(req, res, next) {
  try {
    const agents = await Agent.find();

    if (!agents) {
      const err = new Error('No Agents Been Found');
      err.status = 404;
      throw err;
    }

    res.status(200).json(agents);
  } catch (error) {
    next(error);
  }
}

//@route        GET  /api/agents?limit=3
//@description  Get limit agents
//access        Public
export async function getLimitAgents(req, res, next) {
  try {
    // get the query
    const limit = +req.query.limit;

    // check for query if valid
    if (!limit || isNaN(limit)) {
      const err = new Error('Query is invalid');
      err.status = 400;
      throw err;
    }

    const agents = await Agent.find().limit(limit);

    if (!agents) {
      const err = new Error('No Agents Been Found');
      err.status = 404;
      throw err;
    }

    res.status(200).json({ agents });
  } catch (error) {
    next(error);
  }
}
