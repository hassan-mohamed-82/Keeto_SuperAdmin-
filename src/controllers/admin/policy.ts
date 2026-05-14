import { Request, Response } from "express";
import { db } from "../../models/connection";
import { policy } from "../../models/schema";
import { eq } from "drizzle-orm";
import { SuccessResponse } from "../../utils/response";
import { BadRequest } from "../../Errors";
import { saveBase64Image } from "../../utils/handleImages";

export const createPolicy = async (req: Request, res: Response) => {
    const { title ,description,type } = req.body;
    if(!title || !description || !type ){
        throw new BadRequest("Missing required fields");
    }
    const [polic] = await db.insert(policy).values({
        title:title,
        desctription:description,  
        type:type || "Keto",
    })
    return SuccessResponse(res, { data: polic });
};

export const updatePolicy = async (req: Request, res: Response) => {
    const { id, title, description, type } = req.body;
    if (!title || !description || !type) {
        throw new BadRequest("Missing required fields");
    }
    const [polic] = await db.update(policy).set({
        title: title,
        desctription: description,
        type: type,
    }).where(eq(policy.id, id));
    return SuccessResponse(res, { data: polic });
};

export const deletePolicy = async (req: Request, res: Response) => {
    const { id } = req.body;
    if (!id) {
        throw new BadRequest("Missing required fields");
    }
    const [polic] = await db.delete(policy).where(eq(policy.id, id));
    return SuccessResponse(res, { data: polic });
};

export const getPolicy = async (req: Request, res: Response) => {
    const { id } = req.params;
    const [polic] = await db.select().from(policy).where(eq(policy.id, id));
    return SuccessResponse(res, { data: polic });
};

export const getPolicies = async (req: Request, res: Response) => {
    const policies = await db.select().from(policy);
    return SuccessResponse(res, { data: policies });
};

