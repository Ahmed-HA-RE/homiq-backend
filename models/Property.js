import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true },
    area: { type: Number },
    floors: { type: Number, min: 1, max: 5 },
    Bathrooms: { type: Number, min: 1, max: 10 },
    amenities: { type: [String] },
    parking: { type: Number, min: 1 },
    beds: { type: Number, min: 1 },
    images: {
      interior: [String],
      exterior: [String],
    },
  },
  { timestamps: true }
);

const Property = mongoose.model('Property', propertySchema);
export default Property;
