import z from 'zod';

export const propertySchema = z.object({
  _id: z.string().optional(),
  name: z
    .string({ error: 'Property name is required ' })
    .nonempty({ error: 'Property name is required' })
    .regex(/^[a-zA-Z\s]+$/, { error: 'Field must only be letters' })
    .trim()
    .min(4, { error: 'Property Name is too short (min 4 characters)' })
    .max(50),
  price: z.coerce
    .number({ error: 'Price must be a number' })
    .positive({ error: 'Price must be positive' }),
  location: z
    .string({ error: 'Loaction is required' })
    .trim()
    .nonempty({ error: 'Location is required' }),
  type: z
    .string({ error: 'Typs is required' })
    .trim()
    .nonempty({ error: 'Type is required' }),
  description: z
    .string({ error: 'Description is required' })
    .nonempty({ error: 'Description is required' })
    .trim()
    .min(4, { error: 'Characters should be at least 4' }),
  area: z.coerce.number({ error: 'Area must be a number' }),
  beds: z.coerce
    .number({ error: 'Beds must be a number' })
    .min(1, { error: 'Beds must be at least 1' })
    .max(10, { error: 'Beds cannot exceed 10' }),
  floors: z.coerce
    .number({ error: 'Floors must be a number' })
    .min(1, { error: 'Floors must be at least 1' })
    .max(5, { error: 'Floors cannot exceed 5' }),
  Bathrooms: z.coerce
    .number({ error: 'Bathrooms must be a number' })
    .min(1, { error: 'Bathrooms must be at least 1' })
    .max(10, { error: 'Bathrooms cannot exceed 10' }),

  parking: z.coerce
    .number({ error: 'Garage must be number' })
    .min(1, { error: 'Garage must be at least 1' })
    .max(6, { error: 'Garage cannot exceed  6' }),
});
