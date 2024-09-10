import { getUploadSignature } from "@/api/business";
import type {
  CloudinaryUploadResponse,
  UploadSignature,
} from "@/types/business";
import { CloudinaryConfig } from "@/config";
import axios from "axios";

/**
 * Uploads a business image to Cloudinary
 * @param image - The image to upload (base64 format)
 * @returns
 */

interface UploadBusinessImageToCloudinaryProps {
  image: string;
  folderPath: string;
}
export const uploadBusinessImageToCloudinary = async (
  props: UploadBusinessImageToCloudinaryProps
) => {
  const { image, folderPath } = props;
  let cloudinaryResponseData: CloudinaryUploadResponse;
  const signature: UploadSignature = (await getUploadSignature(folderPath))
    .data;
  const formData = new FormData();
  formData.append("file", image);
  formData.append("folder", folderPath);
  formData.append("signature", signature.data.signature);
  formData.append("timestamp", signature.data.timestamp.toString());
  formData.append("api_key", CloudinaryConfig.apiKey);

  const cloudinaryResponse = await axios.post(
    `https://api.cloudinary.com/v1_1/${CloudinaryConfig.cloudName}/auto/upload`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );

  cloudinaryResponseData = cloudinaryResponse.data;
  return cloudinaryResponseData;
};

/**
 * Constructs a Cloudinary URL
 * @param publicId - The public ID of the image
 * @returns
 */
export const constructCloudinaryUrl = (publicId: string) => {
  return `https://res.cloudinary.com/${CloudinaryConfig.cloudName}/image/upload/${publicId}`;
};
