import { Router } from "express";
import { createBasiccampaign, getAllBasiccampaigns,
     getBasiccampaignById, updateBasiccampaign, 
     deleteBasiccampaign, updateBasiccampaignStatus 
     } from "../../controllers/admin/Basiccampaign";
import { catchAsync } from "../../utils/catchAsync";
import { validate } from "../../middlewares/validation";
import { createBasicCampaignSchema, updateBasicCampaignSchema } from "../../validation/admin/Basiccampaign";
const router = Router();
router.post("/", validate(createBasicCampaignSchema), catchAsync(createBasiccampaign));
router.get("/", catchAsync(getAllBasiccampaigns));
router.get("/:id", catchAsync(getBasiccampaignById));
router.put("/:id", validate(updateBasicCampaignSchema), catchAsync(updateBasiccampaign));
router.delete("/:id", catchAsync(deleteBasiccampaign));
router.put("/:id/status", catchAsync(updateBasiccampaignStatus));

export default router;