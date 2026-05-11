import { Router } from "express";
import { getRestaurantRatingStats, getRestaurantRatings } from "../../controllers/admin/rating";
import { catchAsync } from "../../utils/catchAsync";

const router = Router();

router.get("/:restaurantId/stats", catchAsync(getRestaurantRatingStats));
router.get("/:restaurantId", catchAsync(getRestaurantRatings));

export default router;
