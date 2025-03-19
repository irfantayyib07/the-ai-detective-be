const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const uploadToCloudinary = async fileBuffer => {
 return new Promise((resolve, reject) => {
  const stream = cloudinary.uploader.upload_stream({ resource_type: "auto" }, (error, result) => {
   if (error) {
    reject(error);
   } else {
    resolve(result.secure_url);
   }
  });

  streamifier.createReadStream(fileBuffer).pipe(stream);
 });
};

const uploadSingleFile = async fileBuffer => {
 try {
  return await uploadToCloudinary(fileBuffer);
 } catch (error) {
  console.error("Error uploading file:", error.message);
  throw new Error("Failed to upload file");
 }
};

const uploadMultipleFiles = async fileBuffers => {
 try {
  const uploadPromises = fileBuffers.map(fileBuffer => uploadToCloudinary(fileBuffer));
  return Promise.all(uploadPromises);
 } catch (error) {
  console.error("Error uploading files:", error.message);
  throw new Error("Failed to upload files");
 }
};

module.exports = {
 uploadSingleFile,
 uploadMultipleFiles,
 uploadToCloudinary,
};
