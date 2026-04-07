import { Router } from "express";
import AdmiRouter from "./admin";
import authRouter from "./auth";
import RolesRouter from "./roles";
import CountryRouter from "./country";
import CityRouter from "./city";
import { authenticated } from "../../middlewares/authenticated";
import { authorizeRoles } from "../../middlewares/authorized";
const router = Router();

router.use("/auth", authRouter);
router.use(authenticated, authorizeRoles("superadmin", "admin"));

router.use("/admin", AdmiRouter);
router.use("/roles", RolesRouter);
router.use("/countries", CountryRouter);
router.use("/cities", CityRouter);

export default router;    