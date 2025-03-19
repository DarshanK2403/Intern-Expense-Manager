const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadFiletoCloudinary = async (fileBuffer, fileName) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        folder: "expenses",
        public_id: fileName.split(".")[0], // ✅ Set Original File Name (Without Extension)
        overwrite: true, // ✅ Avoid Duplicate Files
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    // ✅ Convert Buffer to Stream and push to Cloudinary
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

module.exports = { uploadFiletoCloudinary };
