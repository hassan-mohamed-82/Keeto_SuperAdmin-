import { Router } from "express";
import { getRestaurantRatingStats, getRestaurantRatings, deleteRating } from "../../controllers/admin/rating";
import { catchAsync } from "../../utils/catchAsync";

const router = Router();

router.get("/:restaurantId/stats", catchAsync(getRestaurantRatingStats));
router.get("/:restaurantId", catchAsync(getRestaurantRatings));
router.delete("/:id", catchAsync(deleteRating));

export default router;
