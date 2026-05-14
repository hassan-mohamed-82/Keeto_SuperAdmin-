import { Router } from "express";
import { createPolicy, deletePolicy, getPolicies, getPolicy, updatePolicy } from "../../controllers/admin/policy";
import { catchAsync } from "../../utils/catchAsync";
import { hasPermission } from "../../middlewares";
const router = Router();

router.post("/", hasPermission("policy", "Add"), catchAsync(createPolicy));
router.put("/", hasPermission("policy", "Edit"), catchAsync(updatePolicy));
router.delete("/", hasPermission("policy", "Delete"), catchAsync(deletePolicy));
router.get("/:id", hasPermission("policy", "View"), catchAsync(getPolicy));
router.get("/", hasPermission("policy", "View"), catchAsync(getPolicies));

export default router;