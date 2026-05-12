import { Router } from "express";
import { catchAsync } from "../../utils/catchAsync";
import {
  createZone,
  getAllZones,
  getZoneById,
  updateZone,
  deleteZone,
  getallcities
} from "../../controllers/admin/zone";

import { validate } from "../../middlewares/validation";
import { createZoneSchema, updateZoneSchema } from "../../validation/admin/zone";
const router = Router();

router.post("/", validate(createZoneSchema), catchAsync(createZone));
router.get("/", catchAsync(getAllZones));
router.get("/:id", catchAsync(getZoneById));
router.put("/:id", validate(updateZoneSchema), catchAsync(updateZone));
router.delete("/:id", catchAsync(deleteZone));
router.get("/cities/active", catchAsync(getallcities));

export default router;
