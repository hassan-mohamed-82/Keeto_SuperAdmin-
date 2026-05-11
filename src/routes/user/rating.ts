import { Router } from "express";
import { rateRestaurant, getMyRating } from "../../controllers/user/rating";
import { catchAsync } from "../../utils/catchAsync";

const router = Router();

router.post("/", catchAsync(rateRestaurant));
router.get("/:restaurantId", catchAsync(getMyRating));

export default router;
