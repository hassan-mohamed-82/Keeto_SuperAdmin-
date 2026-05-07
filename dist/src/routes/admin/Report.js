"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const catchAsync_1 = require("../../utils/catchAsync");
const Report_1 = require("../../controllers/admin/Report");
const router = (0, express_1.Router)();
router.get("/", (0, catchAsync_1.catchAsync)(Report_1.getFinancialReport));
exports.default = router;
