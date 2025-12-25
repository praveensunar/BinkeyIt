import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadImageCloudinary = async (image) => {
  if (!image || !image.buffer) {
    throw new Error("Image buffer not found");
  }

  const uploadImage = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: "binkeyit" },
      (error, result) => {
        if (error) return reject(error); 
        resolve(result);
      }
    ).end(image.buffer);
  });

  return uploadImage;
};

export default uploadImageCloudinary;
