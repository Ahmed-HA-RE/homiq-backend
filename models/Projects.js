import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true },
    area: { type: String },
    floor: { type: Number, min: 1, max: 6 },
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

const Project = mongoose.model('Project', projectSchema);
export default Project;
