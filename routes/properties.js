import express from 'express';
import {
  getLatestProperties,
  getPaginatedProperties,
  getProperties,
  getProperty,
  createProperty,
  deleteProperty,
  updateProperty,
} from '../controllers/properties.js';
import { protect } from '../middleware/auth.js';
import path from 'path';
import cloudinary from '../config/cloudinary.js';
import upload from '../config/multerConfig.js';

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);
console.log(__dirname);

// router setups
const router = express.Router();

//@route        GET /api/properties
//@description  Get all the properties
//@access       Public
router.get('/', getProperties);

//@route        GET /api/properties/paginated?limit=&page=
//@description  Get limit project
//@access       Public
router.get('/paginate', getPaginatedProperties);

//@route        GET /api/properties/latest
//@description  Get all the latest properties
//@access       Public
router.get('/latest', getLatestProperties);

//@route        GET /api/properties/:id
//@description  Get single project
//@access       Public
router.get('/:id', getProperty);

//@route        POST /api/properties
//@description  Create new property
//@access       Private
router.post(
  '/',
  protect,
  upload.fields([
    { name: 'interior', maxCount: 2 },
    { name: 'exterior', maxCount: 1 },
  ]),
  createProperty
);

//@route        PUT /api/properties/:id
//@description  Update property
//@access       Private
router.put(
  '/:id',
  protect,
  upload.fields([
    { name: 'interior', maxCount: 2 },
    { name: 'exterior', maxCount: 1 },
  ]),
  updateProperty
);

//@route        DELETE /api/properties/:id
//@description  Delete property
//@access       Private
router.delete('/:id', protect, deleteProperty);

export default router;
