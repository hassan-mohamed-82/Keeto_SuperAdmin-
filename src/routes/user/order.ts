import { Router } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { checkout, getOrderDetails, getActiveOrders,getOrderHistory } from "../../controllers/user/order";
const router = Router();

router.get("/active/:userId", catchAsync(getActiveOrders));
router.get("/history/:userId", catchAsync(getOrderHistory));
router.get("/:orderId", catchAsync(getOrderDetails));
router.post("/checkout", catchAsync(checkout));
export default router;