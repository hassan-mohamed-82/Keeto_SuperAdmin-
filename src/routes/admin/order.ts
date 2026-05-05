import { Router } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { getOrdersByRestaurant, getOrderDetails } from "../../controllers/admin/order";
const router = Router();
router.get("/:restaurantId", catchAsync(getOrdersByRestaurant));
router.get("/:restaurantId/:orderId", catchAsync(getOrderDetails));
export default router;