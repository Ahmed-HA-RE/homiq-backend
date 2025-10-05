import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true },
    area: { type: Number },
    floors: { type: Number, min: 1, max: 5 },
    Bathrooms: { type: Number, min: 1, max: 10 },
    parking: { type: Number, min: 1 },
    beds: { type: Number, min: 1 },
    images: {
      interior: {
        type: [String],
        default: [
          'https://res.cloudinary.com/ahmed--dev/image/upload/v1759509145/no-image_o1mqcp.jpg',
          'https://res.cloudinary.com/ahmed--dev/image/upload/v1759509145/no-image_o1mqcp.jpg',
        ],
      },
      exterior: {
        type: [String],
        default: [
          'https://res.cloudinary.com/ahmed--dev/image/upload/v1759509145/no-image_o1mqcp.jpg',
        ],
      },
    },
  },
  { timestamps: true }
);

const Property = mongoose.model('Property', propertySchema);
export default Property;
