import { Router } from "express";
import { catchAsync } from "../../utils/catchAsync";
import {
  createCuisine,
  getAllCuisines,
  getCuisineById,
  updateCuisine,
  deleteCuisine,
} from "../../controllers/admin/Cuisine ";
import { validate } from "../../middlewares/validation";
import { createCuisineSchema, updateCuisineSchema } from "../../validation/admin/Cuisine ";
const router = Router();

router.post("/", validate(createCuisineSchema), catchAsync(createCuisine));
router.get("/", catchAsync(getAllCuisines));
router.get("/:id", catchAsync(getCuisineById));
router.put("/:id", validate(updateCuisineSchema), catchAsync(updateCuisine));
router.delete("/:id", catchAsync(deleteCuisine));

export default router;
