import express from 'express';
import {
  getProperties,
  getProperty,
  createProperty,
  deleteProperty,
  updateProperty,
} from '../controllers/properties.js';
import { protect } from '../middleware/auth.js';
import upload from '../config/multerConfig.js';
import advancedResults from '../middleware/advancedResults.js';
import Property from '../models/Property.js';

// router setups
const router = express.Router();

router
  .route('/')
  .get(advancedResults(Property), getProperties) // GET /api/properties
  .post(
    upload.fields([
      { name: 'interior', maxCount: 2 },
      { name: 'exterior', maxCount: 1 },
    ]),
    createProperty
  ); // POST /api/properties;

//@route        GET /api/properties/:id
//@description  Get single project
//@access       Public
router
  .route('/:id')
  .get(getProperty) // GET /api/properties/:id
  .put(
    protect,
    upload.fields([
      { name: 'interior', maxCount: 2 },
      { name: 'exterior', maxCount: 1 },
    ]),
    updateProperty
  ) // PUT /api/properties/:id
  .delete(protect, deleteProperty); // DELETE /api/properties/:id

export default router;
