import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage }); // memory storage for multer
//upload = middleware

async function handleImageUpload(buffer, mimetype) {
  const base64 = buffer.toString("base64");
  //   "data:image/png;base64....."
  const dataUrl = `data:${mimetype};base64,${base64}`;

  const result = await cloudinary.uploader.upload(dataUrl, {
    resource_type: "auto", // video / img
  });

  return result;
}

export { upload, handleImageUpload };
