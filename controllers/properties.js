import Property from '../models/Property.js';
import { propertySchema } from '../schemas/properties.js';

//@route        GET /api/properties
//@description  Get all the properties
//@access       Public
export const getProperties = async (req, res, next) => {
  try {
    const properties = await Property.find();

    if (properties.length === 0) {
      const err = new Error('No properties been found');
      err.status = 404;
      throw err;
    }

    res.status(200).json(properties);
  } catch (err) {
    next(err);
  }
};

//@route        GET /api/properties/latest
//@description  Get all the latest properties
//@access       Public
export async function getLatestProperties(req, res, next) {
  try {
    const latestProperties = await Property.find()
      .sort({ createdAt: -1 })
      .limit(3);
    if (!latestProperties) {
      const err = new Error('No Properties Been Found');
      err.status = 404;
      throw err;
    }

    res.status(200).json(latestProperties);
  } catch (error) {
    next(error);
  }
}

//@route        GET /api/properties/paginated?limit=&page=
//@description  Get limit project
//@access       Public
export async function getPaginatedProperties(req, res, next) {
  try {
    const page = +req.query.page;
    const limit = +req.query.limit;

    if (!page || !limit) {
      const err = new Error('page and limit fileds are required');
      err.status = 403;
      throw err;
    }

    const skip = (page - 1) * limit;
    const total = await Property.countDocuments();
    const properties = await Property.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      properties: properties.length > 0 ? properties : [],
    });
  } catch (error) {
    next(error);
  }
}

//@route        GET /api/properties/:id
//@description  Get single project
//@access       Public
export const getProperty = async (req, res, next) => {
  try {
    const id = req.params.id;

    const property = await Property.findOne({ _id: id });

    if (!property) {
      const err = new Error('No property been found');
      err.status = 404;
      throw err;
    }

    res.status(200).json(property);
  } catch (err) {
    next(err);
  }
};

//@route        POST /api/properties
//@description  Create new  property
//@access       Private
export const createProperty = async (req, res, next) => {
  try {
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
      amenities,
    } = parsed;

    const interior = req.files.interior;
    const exterior = req.files.exterior;

    if (!interior || !exterior) {
      const err = new Error(
        'Must include atleast 1 interior and 1 exterior image'
      );
      err.status = 400;
      throw err;
    }

    const newProperty = {
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
      amenities,
      images: {
        interior: req.files.interior.map((file) => file.originalname),
        exterior: req.files.exterior.map((file) => file.originalname),
      },
    };

    const data = await Property.create(newProperty);

    res.status(200).json({ message: 'Created Succssffully', data });
  } catch (error) {
    next(error);
  }
};
