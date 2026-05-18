import { Request, Response } from "express";
import { db } from "../../models/connection";
import { images } from "../../models/schema";
import { eq } from "drizzle-orm";
import { SuccessResponse } from "../../utils/response";
import { NotFound } from "../../Errors/NotFound";
import { BadRequest } from "../../Errors/BadRequest";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { saveBase64Image, handleImageUpdate } from "../../utils/handleImages";

export const createImage = async (req: Request, res: Response) => {
    const { img } = req.body;
    
    const result = await saveBase64Image(req, img, "images");
    await db.insert(images).values({
        id: uuidv4(),
        img: result.url,
    })
    return SuccessResponse(res, {
        message: "Image created successfully",
    }, 201);
};

export const getAllImages = async (req: Request, res: Response) => {
    const image = await db.select().from(images);
    return SuccessResponse(res, {
        message: "Images fetched successfully",
        data: image,
    }, 200);
};

export const deleteImage = async (req: Request, res: Response) => {
    const { id } = req.params;
    await db.delete(images).where(eq(images.id, id));
    return SuccessResponse(res, {
        message: "Image deleted successfully",
    }, 200);
};


export const getImageById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const image = await db.select().from(images).where(eq(images.id, id));
    return SuccessResponse(res, {
        message: "Image fetched successfully",
        data: image[0],
    }, 200);
};

export const updateImage = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { img } = req.body;
    const image = await db.select().from(images).where(eq(images.id, id));
    if (!image[0]) {
        throw new NotFound("Image not found");
    }
    const result = await handleImageUpdate(req, img, "images", image[0].img);
    await db.update(images).set({
        img: result.url,
    }).where(eq(images.id, id));
    return SuccessResponse(res, {
        message: "Image updated successfully",
        data: result.url,
    }, 200);
};

