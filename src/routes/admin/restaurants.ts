import { Router } from "express";
import { catchAsync } from "../../utils/catchAsync";
import {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  getallcousinesandzones,
} from "../../controllers/admin/restaurants";
import { validate } from "../../middlewares/validation";
import { createRestaurantSchema, updateRestaurantSchema } from "../../validation/admin/restaurants";
const router = Router();
router.get("/select", catchAsync(getallcousinesandzones));
router.post("/", validate(createRestaurantSchema), catchAsync(createRestaurant));
router.get("/", catchAsync(getAllRestaurants));
router.get("/:id", catchAsync(getRestaurantById));
router.put("/:id", validate(updateRestaurantSchema), catchAsync(updateRestaurant));
router.delete("/:id", catchAsync(deleteRestaurant));

export default router;
