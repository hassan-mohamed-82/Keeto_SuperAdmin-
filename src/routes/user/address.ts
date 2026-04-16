import {Router} from "express";
import {
    addUserAddress,deleteUserAddress,getUserAddresses,
    updateUserAddress,getzone
} from "../../controllers/user/address";
import { catchAsync } from "../../utils/catchAsync";
const router = Router();

router.get("/zone", catchAsync(getzone));
router.post("/", catchAsync(addUserAddress));
router.get("/", catchAsync(getUserAddresses));
router.delete("/:addressId", catchAsync(deleteUserAddress));
router.put("/:addressId", catchAsync(updateUserAddress));

export default router;