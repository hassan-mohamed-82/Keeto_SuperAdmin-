import { Router } from "express";
import { createBusinessPlan,
      updateBusinessPlan,
       deleteBusinessPlan,
       getBusinessPlanById,
       getBusinessPlansByRestaurant
     } from "../../controllers/admin/BusinessPlans";
     import { catchAsync } from "../../utils/catchAsync";
     import { validate } from "../../middlewares/validation";
     import { createBusinessPlanSchema, updateBusinessPlanSchema } from "../../validation/admin/BusinessPlans";
const router = Router();

router.post("/", validate(createBusinessPlanSchema), catchAsync(createBusinessPlan));
router.get("/restaurant/:restaurantId", catchAsync(getBusinessPlansByRestaurant));
router.get("/:id", catchAsync(getBusinessPlanById));
router.put("/:id", validate(updateBusinessPlanSchema), catchAsync(updateBusinessPlan));
router.delete("/:id", catchAsync(deleteBusinessPlan));


export default router;