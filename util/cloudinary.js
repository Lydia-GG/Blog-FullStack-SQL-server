import cloudinary from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploader = async (path) => {
  const result = await cloudinary.v2.uploader.upload(path, {
    folder: 'blogSQL',
    use_filename: true,
  });

  return result.secure_url;
};

export default cloudinary;
