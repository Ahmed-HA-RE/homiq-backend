import express from 'express';
import {
  getLatestProperties,
  getPaginatedProperties,
  getProperties,
  getProperty,
  createProperty,
} from '../controllers/properties.js';
import multer from 'multer';
import path from 'path';

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);
console.log(__dirname);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isInterior = file.fieldname === 'interior';
    console.log(file);
    cb(
      null,
      path.join(
        __dirname,
        `${
          isInterior ? '../public/images/interior' : '../public/images/exterior'
        }`
      )
    );
  },

  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

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
//@description  Create new  property
//@access       Private
router.post(
  '/',
  upload.fields([
    { name: 'interior', maxCount: 2 },
    { name: 'exterior', maxCount: 1 },
  ]),
  createProperty
);

export default router;
