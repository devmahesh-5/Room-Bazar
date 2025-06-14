import {v2 as cloudinary} from "cloudinary";
import fs from "fs";
import { ApiError } from "./ApiError.js";

    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    });
    
    // Upload file
    const uploadOnCloudinary = async (localFilePath) => {
        if (!localFilePath) return null;
        try {
            // Upload to Cloudinary
            const uploadResult = await cloudinary.uploader.upload(localFilePath, {
                resource_type: 'auto',
            });
    
            return uploadResult;
        } catch (error) {
            throw new ApiError(500, error.message);
        } finally {
            // Always delete the local file, even if upload fails
            try {
                fs.unlinkSync(localFilePath);
            } catch (err) {
                throw new ApiError(500, err.message);
            }
        }
    };
    

 export const deleteImageFromCloudinary = async (publicId)=>{
    try {
        if (!publicId) return null;
        // Upload to Cloudinary
        const deleteResult = await cloudinary.uploader
        .destroy(publicId,{
            resource_type:'image',
        })
        return deleteResult;

    } catch (error) {
        console.log("Cloudinary file deletion error::",error);
        return null;
    }
 }
 export const uploadMultipleFilesOnCloudinary = async (...args) => {
     const result = await Promise.all(args.map(async (arg) => await uploadOnCloudinary(arg)));
     return result.map((result) => result.secure_url || result.url);
 }

 export default uploadOnCloudinary;