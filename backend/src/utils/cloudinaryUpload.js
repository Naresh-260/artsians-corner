import cloudinary from "../config/cloudinary.js";

const uploadToCloudinary = async (fileBuffer) => {
  try {
    return await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "products" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      stream.end(fileBuffer);
    });

  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    throw error;
  }
};

export default uploadToCloudinary;