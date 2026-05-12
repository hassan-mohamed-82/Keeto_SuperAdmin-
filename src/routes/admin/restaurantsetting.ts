import { Router } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { updateSettings, getSettingsByRestaurantId } from "../../controllers/admin/restaurantsetting";
import { validate } from "../../middlewares/validation";
import { updateRestaurantSettingsSchema } from "../../validation/admin/restaurantsetting";
const router = Router();
router.get("/:restaurantId", catchAsync(getSettingsByRestaurantId));
router.put("/:restaurantId", validate(updateRestaurantSettingsSchema), catchAsync(updateSettings));

export default router;
