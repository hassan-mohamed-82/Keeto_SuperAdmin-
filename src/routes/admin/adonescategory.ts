import { Router } from "express";
import { createAdone, getAllAdones, getAdoneById, updateAdone, deleteAdone, toggleAdoneStatus } from "../../controllers/admin/adonescategory";
import { validate } from "../../middlewares/validation";
import { createAdonesCategorySchema,updateAdonesCategorySchema } from "../../validation/admin/adonescategory";
import { catchAsync } from "../../utils/catchAsync";
const router = Router();

router.post("/", validate(createAdonesCategorySchema), catchAsync(createAdone));
router.get("/", catchAsync(getAllAdones));
router.get("/:id", catchAsync(getAdoneById));
router.put("/:id", validate(updateAdonesCategorySchema), catchAsync(updateAdone));
router.delete("/:id", catchAsync(deleteAdone));
router.patch("/:id/status", catchAsync(toggleAdoneStatus));

export default router;