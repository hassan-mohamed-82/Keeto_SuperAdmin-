"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const catchAsync_1 = require("../../utils/catchAsync");
const order_1 = require("../../controllers/admin/order");
const router = (0, express_1.Router)();
router.get("/:restaurantId", (0, catchAsync_1.catchAsync)(order_1.getOrdersByRestaurant));
exports.default = router;
