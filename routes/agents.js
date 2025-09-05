import express from 'express';
import { getAgents, getLimitAgents } from '../controllers/agents.js';
const router = express.Router();

//@route        GET  /api/agents
//@description  Get all the agents
//access        Public
router.get('/', getAgents);

//@route        GET  /api/agents?limit=3
//@description  Get limit agents
//access        Public
router.get('/limit', getLimitAgents);

export default router;
