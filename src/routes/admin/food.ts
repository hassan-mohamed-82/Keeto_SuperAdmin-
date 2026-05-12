import { Router } from "express";
import { catchAsync } from "../../utils/catchAsync";
import {
    createFood,
    getAllFoods,
    getFoodById,
    updateFood,
    deleteFood,
    getFoodSelectData,
    getFoodsByRestaurantId,
    toggleVariationStatus,
    toggleOptionStatus,
} from "../../controllers/admin/food";
import { validate } from "../../middlewares/validation";
import { createFoodSchema, updateFoodSchema } from "../../validation/admin/food";
const router = Router();

router.get("/select", catchAsync(getFoodSelectData));
router.get("/restaurant/:id", catchAsync(getFoodsByRestaurantId));
router.post("/", validate(createFoodSchema), catchAsync(createFood));
router.get("/", catchAsync(getAllFoods));
router.get("/:id", catchAsync(getFoodById));
router.put("/:id", validate(updateFoodSchema), catchAsync(updateFood));
router.delete("/:id", catchAsync(deleteFood));

// Toggle Endpoints
router.put("/variation/:id/status", catchAsync(toggleVariationStatus));
router.put("/option/:id/status", catchAsync(toggleOptionStatus));

export default router;
