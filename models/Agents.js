import mongoose from 'mongoose';

const agentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, trim: true },
    description: { type: String },
    role: { type: String, default: 'Real Estate Agent' },
    image: { type: String, required: true },
    links: [
      {
        platform: { type: String, lowercase: true, trim: true },
        url: { type: String, lowercase: true, trim: true },
      },
    ],
    location: { type: String, required: true },
  },
  { timestamps: true }
);

const Agent = mongoose.model('Agent', agentSchema);

export default Agent;
