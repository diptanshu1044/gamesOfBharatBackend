import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    //Checks if the file actually exists
    if (!localFilePath) return null

    //uploads to the cloud
    const res = await cloudinary.uploader.upload(
      localFilePath,
      { resource_type: "auto" }
    )
    
    fs.unlinkSync(localFilePath)
    return res

  } catch (err) {
    //removes the file from the server
    fs.unlinkSync(localFilePath)
    console.log(`Cloudinary file upload error: ${err}`);
    return null
  }
}

export { uploadOnCloudinary };