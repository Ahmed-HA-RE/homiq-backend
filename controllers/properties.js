import Property from '../models/Property.js';
import { propertySchema, updatePropertySchema } from '../schemas/properties.js';
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
  const property = await Property.findById(id);

  if (!req.body) {
    const err = new Error('Please provide the fields you want to update');
    err.status = 400;
    throw err;
  }

  if (
    property.user.toString() !== req.user._id.toString() &&
    req.user.userType !== 'admin'
  ) {
    const err = new Error('Not authorized');
    err.status = 403;
    throw err;
  }

  const validatedData = updatePropertySchema.parse(req.body);

  await Property.findByIdAndUpdate(id, validatedData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ message: 'Updated successfully' });
});

//@route        DELETE /api/properties/:id
//@description  Delete property
//@access       Private
export const deleteProperty = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const property = await Property.findOne({ _id: id });

  if (!property) {
    const err = new Error('Property not found');
    err.status = 404;
    throw err;
  }

  if (
    property.user.toString() !== req.user._id.toString() &&
    req.user.userType !== 'admin'
  ) {
    const err = new Error('Not authorized');
    err.status = 403;
    throw err;
  }

  await Property.findByIdAndDelete(property._id);

  res.json({ message: 'Deleted successfully' });
});

//@route        PUT /api/properties/:id/update-images
//@description  Update property images
//@access       Private
export const updatePropertyImages = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const property = await Property.findById(id);

  if (!property) {
    const err = new Error('Property not found');
    err.status = 404;
    throw err;
  }
  if (
    property.user.toString() !== req.user._id.toString() &&
    req.user.userType !== 'admin'
  ) {
    const err = new Error('Not authorized');
    err.status = 403;
    throw err;
  }

  if (!req.files || !req.files.interior || !req.files.exterior) {
    const err = new Error('Please add interior and exterior images');
    err.status = 400;
    throw err;
  }

  // Check if the file is an image or not
  const isInteriorImages = req.files.interior.every((file) =>
    file.mimetype.startsWith('image')
  );

  if (!isInteriorImages) {
    const err = new Error(
      'Please provide only images with their related extensions like jpg, png, etc...'
    );
    err.status = 400;
    throw err;
  }

  // Check if the file is an image or not
  const isExteriorImages = req.files.exterior.every((file) =>
    file.mimetype.startsWith('image')
  );

  if (!isExteriorImages) {
    const err = new Error(
      'Please provide only images with their related extensions like jpg, png, etc...'
    );
    err.status = 400;
    throw err;
  }

  // Upload to cloudinary
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

  property.images.interior = interiorImgsURL.map((file) => file.secure_url);
  property.images.exterior = exteriorImgsURL.map((file) => file.secure_url);

  property.save();

  res.status(200).json({ message: 'Uploaded Successfully' });
});
