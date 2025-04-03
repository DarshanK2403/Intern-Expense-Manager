const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const path = require("path");
const crypto = require("crypto"); // Import crypto for unique name

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a file to Cloudinary
 * @param {Buffer} fileBuffer - The file buffer to upload
 * @param {string} originalFileName - The original file name (with extension)
 * @returns {Promise<Object>} - Cloudinary upload result with metadata
 */
const uploadFileToCloudinary = async (fileBuffer, originalFileName) => {
  return new Promise((resolve, reject) => {
    const fileExtension = path.extname(originalFileName); // Extract file extension
    const uniqueName = `expenses/${crypto.randomUUID()}${fileExtension}`; // ✅ Unique Name with Extension

    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        public_id: uniqueName,
        folder: "expenses",
        overwrite: false,
        use_filename: false,
        unique_filename: true,
      },
      (error, result) => {
        if (error) {
          reject(new Error(`Cloudinary Upload Failed: ${error.message}`));
        } else {
          resolve({
            cloudinaryUrl: result.secure_url, 
            originalName: originalFileName, 
            uniqueName: result.public_id, 
            fileType: result.format,
          });
        }
      }
    );

    // Convert buffer to stream and push to Cloudinary
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

module.exports = { uploadFileToCloudinary };
