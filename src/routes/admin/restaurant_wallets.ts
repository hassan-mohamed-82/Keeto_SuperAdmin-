import { Router } from "express";
import { getAllWallets,getRestaurantWallet,approveWithdrawal,collectCashFromRestaurant,getWalletTransactions } from "../../controllers/admin/restaurant_wallets";
import { catchAsync } from "../../utils/catchAsync";
import { validate } from "../../middlewares/validation";
import { createRestaurantWalletSchema,updateRestaurantWalletSchema,updateWalletTransactionSchema } from "../../validation/admin/restaurant_wallets"; 
const router = Router();

router.get("/", catchAsync(getAllWallets));
router.get("/restaurant/:id", catchAsync(getRestaurantWallet));
router.get("/transactions/:restaurantId", catchAsync(getWalletTransactions));
router.put("/approve/:id", validate(updateWalletTransactionSchema), catchAsync(approveWithdrawal));
router.put("/collect/:id", catchAsync(collectCashFromRestaurant));
export default router;