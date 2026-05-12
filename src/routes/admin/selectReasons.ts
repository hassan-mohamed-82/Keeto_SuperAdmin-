import { Router } from "express";
import { createReason, getAllReasons, getReasonById, updateReason, deleteReason } from "../../controllers/admin/selectReasons";
import { catchAsync } from "../../utils/catchAsync";
import { validate } from "../../middlewares/validation";
import { createSelectReasonSchema,updateSelectReasonSchema } from "../../validation/admin/selectReasons";

const router = Router();

router.post("/", validate(createSelectReasonSchema), catchAsync(createReason));
router.get("/", catchAsync(getAllReasons));
router.get("/:id", catchAsync(getReasonById));
router.put("/:id", validate(updateSelectReasonSchema), catchAsync(updateReason));
router.delete("/:id", catchAsync(deleteReason));

export default router;