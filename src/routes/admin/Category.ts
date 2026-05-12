import { Router } from "express";
import { catchAsync } from "../../utils/catchAsync";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../../controllers/admin/Category";
import { validate } from "../../middlewares/validation";
import { createCategorySchema, updateCategorySchema } from "../../validation/admin/Category";
const router = Router();

router.post("/", validate(createCategorySchema), catchAsync(createCategory));
router.get("/", catchAsync(getAllCategories));
router.get("/:id", catchAsync(getCategoryById));
router.put("/:id", validate(updateCategorySchema), catchAsync(updateCategory));
router.delete("/:id", catchAsync(deleteCategory));

export default router;
