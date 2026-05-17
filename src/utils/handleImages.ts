import path from "path";
import fs from "fs/promises";
import { Request } from "express";
import { v4 as uuidv4 } from "uuid";
import { BadRequest } from "../Errors";

export async function saveBase64Image(
  req: Request,
  base64: any,
  folder: string
): Promise<{ url: string; relativePath: string }> {
  
  if (typeof base64 !== "string") {
    throw new BadRequest("Invalid image data. Expected a base64 string, received an object.");
  }

  let ext = "png"; // الصيغة الافتراضية
  let base64Data = base64;

  // 1. فحص هل النص بيحتوي على المقدمة (data:image...)؟
  const matches = base64.match(/^data:(.+);base64,(.+)$/);

  if (matches && matches.length === 3) {
    // لو مبعوتة بالمقدمة، نفصلها وناخد الكود الصافي
    const mimeType = matches[1];
    ext = mimeType.split("/")[1] || "png";
    base64Data = matches[2];
  } else {
    // 2. لو مبعوتة كود صافي (زي الداتا بتاعتك دلوقتي)
    // هنستنتج نوع الصورة من أول حروف الكود
    if (base64.startsWith("/9j/")) ext = "jpeg";
    else if (base64.startsWith("iVBORw0K")) ext = "png";
    else if (base64.startsWith("R0lGOD")) ext = "gif";
    else if (base64.startsWith("UklGR")) ext = "webp";
  }

  try {
    // تحويل الكود لملف فعلي
    const buffer = Buffer.from(base64Data, "base64");

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
  } catch (error) {
    throw new BadRequest("Failed to process base64 image data.");
  }
}

export const validateAndSaveLogo = async (req: Request, logo: any, folder: string): Promise<string> => {
  if (typeof logo !== "string") {
    throw new BadRequest("Invalid logo data. Expected a base64 string.");
  }

  // شلنا فحص الـ Regex المعقد من هنا عشان دالة saveBase64Image بقت بتعالج كل الحالات
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

export const handleImageUpdate = async (req: Request, oldImage: string | null | undefined, newImage: any, folder: string) => {
  if (!newImage || (typeof newImage === 'string' && newImage.startsWith("http"))) {
    return newImage || oldImage;
  }

  const savedUrl = await validateAndSaveLogo(req, newImage, folder);

  if (oldImage) {
    await deleteImage(oldImage);
  }

  return savedUrl;
};