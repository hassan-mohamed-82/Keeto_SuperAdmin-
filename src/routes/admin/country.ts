import { Router } from "express";
import { catchAsync } from "../../utils/catchAsync";
import {
  createCountry,
  getAllCountries,
  getCountryById,
  updateCountry,
  deleteCountry,
} from "../../controllers/admin/country";
import { validate } from "../../middlewares/validation";
import { createCountrySchema, updateCountrySchema } from "../../validation/admin/country";
const router = Router();

router.post("/", validate(createCountrySchema), catchAsync(createCountry));
router.get("/", catchAsync(getAllCountries));
router.get("/:id", catchAsync(getCountryById));
router.put("/:id", validate(updateCountrySchema), catchAsync(updateCountry));
router.delete("/:id", catchAsync(deleteCountry));

export default router;
