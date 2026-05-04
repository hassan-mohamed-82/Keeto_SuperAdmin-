"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleImageUpdate = exports.deleteImage = exports.validateAndSaveLogo = void 0;
exports.saveBase64Image = saveBase64Image;
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const uuid_1 = require("uuid"); // لتوليد أسماء فريدة
const Errors_1 = require("../Errors");
const constant_1 = require("../types/constant");
async function saveBase64Image(req, base64, folder) {
    const matches = base64.match(/^data:(.+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
        throw new Error("Invalid base64 format");
    }
    const mimeType = matches[1];
    const ext = mimeType.split("/")[1] || "png";
    const buffer = Buffer.from(matches[2], "base64");
    // استخدام UUID لتجنب تكرار الأسماء
    const fileName = `${(0, uuid_1.v4)()}.${ext}`;
    const uploadsDir = path_1.default.join(__dirname, "../..", "uploads", folder);
    await promises_1.default.mkdir(uploadsDir, { recursive: true });
    const filePath = path_1.default.join(uploadsDir, fileName);
    await promises_1.default.writeFile(filePath, buffer);
    // إرجاع المسار النسبي والـ URL
    const relativePath = `uploads/${folder}/${fileName}`;
    const imageUrl = `${req.protocol}://${req.get("host")}/${relativePath}`;
    return { url: imageUrl, relativePath };
}
const validateAndSaveLogo = async (req, logo, folder) => {
    if (!logo.match(constant_1.BASE64_IMAGE_REGEX)) {
        throw new Errors_1.BadRequest("Invalid logo format. Must be a base64 encoded image (JPEG, PNG, GIF, or WebP)");
    }
    try {
        const savedUrl = await saveBase64Image(req, logo, folder);
        return savedUrl.url;
    }
    catch (error) {
        throw new Errors_1.BadRequest(`Failed to save logo: ${error.message}`);
    }
};
exports.validateAndSaveLogo = validateAndSaveLogo;
const deleteImage = async (image) => {
    if (image.includes("data:image") || image.length > 2000) {
        console.warn("Skipping deletion of likely base64 data in image field");
        return;
    }
    const rootDir = path_1.default.resolve(__dirname, "../../");
    let relativePath = image;
    if (image.includes("/uploads/")) {
        relativePath = "uploads/" + image.split("/uploads/")[1];
    }
    const imagePath = path_1.default.join(rootDir, relativePath);
    try {
        await promises_1.default.unlink(imagePath);
    }
    catch (error) {
        if (error.code === 'ENOENT') {
            console.warn(`Image file not found for deletion: ${imagePath}`);
            return;
        }
        console.error(`Failed to delete image: ${error.message}`);
    }
};
exports.deleteImage = deleteImage;
const handleImageUpdate = async (req, oldImage, newImage, folder) => {
    if (!newImage || newImage.startsWith("http")) {
        return newImage || oldImage;
    }
    const savedUrl = await (0, exports.validateAndSaveLogo)(req, newImage, folder);
    if (oldImage) {
        await (0, exports.deleteImage)(oldImage);
    }
    return savedUrl;
};
exports.handleImageUpdate = handleImageUpdate;
