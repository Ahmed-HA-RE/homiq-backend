import Property from '../models/Property.js';
import { propertySchema } from '../schemas/properties.js';
import mongoose from 'mongoose';
import uploadToCloudinary from '../config/cloudinary.js';
import asyncHandler from 'express-async-handler';

//@route        GET /api/properties
//@description  Get all the properties
//@access       Public
export const getProperties = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

//@route        GET /api/properties/:id
//@description  Get single property
//@access       Public
export const getProperty = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('No property been found');
    err.status = 404;
    throw err;
  }

  const property = await Property.findOne({ _id: id });

  if (!property) {
    const err = new Error('No property been found');
    err.status = 404;
    throw err;
  }

  res.status(200).json(property);
});

//@route        POST /api/properties
//@description  Create new property
//@access       Private
export const createProperty = asyncHandler(async (req, res, next) => {
  if (!req.files || !req.files.interior || !req.files.exterior) {
    const err = new Error(
      'Please provide interior and exterior images with correct field names'
    );
    err.status = 400;
    throw err;
  }

  const parsed = propertySchema.parse(req.body);
  const {
    name,
    type,
    description,
    price,
    area,
    floors,
    Bathrooms,
    beds,
    parking,
    location,
  } = parsed;

  const interiorImgsURL = await Promise.all(
    req.files.interior.map((file) =>
      uploadToCloudinary(file.buffer, file.originalname)
    )
  );
  const exteriorImgsURL = await Promise.all(
    req.files.exterior.map((file) =>
      uploadToCloudinary(file.buffer, file.originalname)
    )
  );

  const newProperty = {
    name,
    type,
    description,
    price: Number(price),
    area: Number(area),
    floors: Number(floors),
    Bathrooms: Number(Bathrooms),
    beds: Number(beds),
    parking: Number(parking),
    location,
    images: {
      interior: interiorImgsURL.map((file) => file.url),
      exterior: exteriorImgsURL.map((file) => file.url),
    },
    user: req.user.id,
  };

  await Property.create(newProperty);

  res.status(201).json({ message: 'Created Succssffully' });
});

//@route        PUT /api/properties/:id
//@description  Update property
//@access       Private
export const updateProperty = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('No property been found');
    err.status = 404;
    throw err;
  }

  const parsed = propertySchema.parse(req.body);
  const {
    name,
    type,
    description,
    price,
    area,
    floors,
    Bathrooms,
    beds,
    parking,
    location,
  } = parsed;

  const interior = req.files.interior;
  const exterior = req.files.exterior;

  if (interior.length === 0 || exterior.length === 0) {
    const err = new Error(
      'Must include atleast 1 interior and 1 exterior image'
    );
    err.status = 400;
    throw err;
  }

  const updatedProperty = {
    name,
    type,
    description,
    price: Number(price),
    area: +area,
    floors: +floors,
    Bathrooms: +Bathrooms,
    beds: +beds,
    parking: +parking,
    location,
    images: {
      interior: req.files.interior.map((file) => file.originalname),
      exterior: req.files.exterior.map((file) => file.originalname),
    },
  };

  const property = await Property.findOne({ _id: id });

  if (!property.user.equals(req.user._id)) {
    const err = new Error('Not authorized to update the property');
    err.status = 403;
    throw err;
  }

  await Property.findByIdAndUpdate(id, updatedProperty);

  res.status(200).json({ message: 'Updated successfully' });
});

//@route        DELETE /api/properties/:id
//@description  Delete property
//@access       Private
export const deleteProperty = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('No property been found');
    err.status = 404;
    throw err;
  }

  const property = await Property.findOne({ _id: id });

  if (!property) {
    const err = new Error('Property not found');
    err.status = 404;
    throw err;
  }

  if (!property.user.equals(req.user._id)) {
    const err = new Error('Not authorized to delete this property');
    err.status = 403;
    throw err;
  }

  await Property.findByIdAndDelete(property._id);

  res.json({ message: 'Deleted successfully' });
});
