import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import intoStream from 'into-stream';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = (bufferImage, fileName) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
        folder: 'real-estate',
        public_id: fileName,
        overwrite: true,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    intoStream(bufferImage).pipe(stream);
  });
};

export default uploadToCloudinary;
