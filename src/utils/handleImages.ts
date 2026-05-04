import path from "path";
import fs from "fs/promises";
import { Request } from "express";
import { v4 as uuidv4 } from "uuid"; // لتوليد أسماء فريدة
import { BadRequest } from "../Errors";
import { BASE64_IMAGE_REGEX } from "../types/constant";

export async function saveBase64Image(
  req: Request,
  base64: string,
  folder: string
): Promise<{ url: string; relativePath: string }> {
  const matches = base64.match(/^data:(.+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error("Invalid base64 format");
  }

  const mimeType = matches[1];
  const ext = mimeType.split("/")[1] || "png";
  const buffer = Buffer.from(matches[2], "base64");

  // استخدام UUID لتجنب تكرار الأسماء
  const fileName = `${uuidv4()}.${ext}`;
  const uploadsDir = path.join(__dirname, "../..", "uploads", folder);

  await fs.mkdir(uploadsDir, { recursive: true });

  const filePath = path.join(uploadsDir, fileName);
  await fs.writeFile(filePath, buffer);

  // إرجاع المسار النسبي والـ URL
  const relativePath = `uploads/${folder}/${fileName}`;
  const imageUrl = `${req.protocol}://${req.get("host")}/${relativePath}`;

  return { url: imageUrl, relativePath };
}


export const validateAndSaveLogo = async (req: Request, logo: string, folder: string): Promise<string> => {
  if (!logo.match(BASE64_IMAGE_REGEX)) {
    throw new BadRequest("Invalid logo format. Must be a base64 encoded image (JPEG, PNG, GIF, or WebP)");
  }
  try {
    const savedUrl = await saveBase64Image(req, logo, folder);
    return savedUrl.url;
  } catch (error: any) {
    throw new BadRequest(`Failed to save logo: ${error.message}`);
  }
};

export const deleteImage = async (image: string) => {
  if (image.includes("data:image") || image.length > 2000) {
    console.warn("Skipping deletion of likely base64 data in image field");
    return;
  }

  const rootDir = path.resolve(__dirname, "../../");
  let relativePath = image;
  if (image.includes("/uploads/")) {
    relativePath = "uploads/" + image.split("/uploads/")[1];
  }

  const imagePath = path.join(rootDir, relativePath);
  try {
    await fs.unlink(imagePath);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      console.warn(`Image file not found for deletion: ${imagePath}`);
      return;
    }
    console.error(`Failed to delete image: ${error.message}`);
  }
};



export const handleImageUpdate = async (req: Request, oldImage: string | null | undefined, newImage: string | undefined, folder: string) => {
  if (!newImage || newImage.startsWith("http")) {
    return newImage || oldImage;
  }

  const savedUrl = await validateAndSaveLogo(req, newImage, folder);

  if (oldImage) {
    await deleteImage(oldImage);
  }

  return savedUrl;
};
