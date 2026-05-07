import { Router } from "express";
import { catchAsync } from "../../utils/catchAsync";
import {getFinancialReport}from "../../controllers/admin/Report"

const router =Router();

router.get("/",catchAsync(getFinancialReport))

export default router;