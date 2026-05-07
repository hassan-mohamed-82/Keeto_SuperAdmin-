import { Router } from "express";
import { createReason, getAllReasons, getReasonById, updateReason, deleteReason } from "../../controllers/admin/selectReasons";
import { catchAsync } from "../../utils/catchAsync";

const router = Router();

router.post("/", catchAsync(createReason));
router.get("/", catchAsync(getAllReasons));
router.get("/:id", catchAsync(getReasonById));
router.put("/:id", catchAsync(updateReason));
router.delete("/:id", catchAsync(deleteReason));

export default router;