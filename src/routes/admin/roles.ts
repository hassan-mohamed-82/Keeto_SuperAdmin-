import { Router } from "express";
import { createRole, deleteRole, getAllRoles, getRoleById, updateRole } from "../../controllers/admin/roles";
import { catchAsync } from "../../utils/catchAsync";
import { validate } from "../../middlewares/validation";
import { createRoleSchema, updateRoleSchema } from "../../validation/admin/roles";
const router = Router();

router.post("/", validate(createRoleSchema), catchAsync(createRole));
router.get("/", catchAsync(getAllRoles));
router.get("/:id", catchAsync(getRoleById));
router.put("/:id", validate(updateRoleSchema), catchAsync(updateRole));
router.delete("/:id", catchAsync(deleteRole));

export default router;